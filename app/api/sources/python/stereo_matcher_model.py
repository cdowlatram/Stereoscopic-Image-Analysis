from __future__ import print_function

import numpy as np
import argparse
import json
import cv2 as cv
import math

ply_header ='''ply
format ascii 1.0
element vertex %(vert_num)d
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
end_header
'''

class Stereograph:
    def __init__(self, left_image, right_image, focal_length_mm, sensor_width_mm):
        self.imgL = left_image
        self.imgR = right_image
        self.focal_length_mm = float(focal_length_mm)
        self.sensor_width_mm = float(sensor_width_mm)

        # SBGM Settings
        self.window_size = 9
        self.num_of_image_channels = 3
        self.min_disp = 0 # normally 0, rectification shifts images so may need to be adjusted accordingly
        self.num_disp = (16*5) - self.min_disp # max - min disparity, > 0 and divisible by 16
        self.blockSize = self.window_size # matched block size, odd number >= 1, usually 3..11
        self.P1 = 8 * self.num_of_image_channels * self.window_size ** 2  # P1 controls disparity smoothness
        self.P2 = 32 * self.num_of_image_channels * self.window_size ** 2  # P2 controls disparity smoothness
        self.disp12MaxDiff = 4  # max allowed diff in left-right disparity check. neg to disable check.
        self.uniquenessRatio = 10  # margin in % of winning cost value, 5-15 is good enough
        self.speckleRange = 1   # Normally, 1 or 2 is good enough
        self.speckleWindowSize = 100  # max size of smooth disparity to consider noise and invalidate. 0 disable, 50-200

        self.disparity = None
        self.image_map = None
        self.image_map_points = {}
        self.scale = 1

        self.points = np.empty(0)
        self.colors = np.empty(0)

        # Calculates Disparity
        self.update_settings(self.min_disp, self.num_disp, self.window_size, self.uniquenessRatio, self.speckleWindowSize, self.speckleRange, self.disp12MaxDiff)

    def update_settings(self, min_disp, num_disp, window_size=9, uniquenessRatio=10, speckleWindowSize=100, speckleRange=1, disp12MaxDiff=4):
        self.min_disp = min_disp
        self.num_disp = num_disp
        self.window_size = window_size
        self.blockSize = window_size
        self.uniquenessRatio = uniquenessRatio
        self.speckleWindowSize = speckleWindowSize
        self.speckleRange = speckleRange
        self.disp12MaxDiff = disp12MaxDiff

        self.stereo = cv.StereoSGBM_create(
            minDisparity=self.min_disp,
            numDisparities=self.num_disp,
            blockSize=self.blockSize,
            P1=self.P1,
            P2=self.P2,
            disp12MaxDiff=self.disp12MaxDiff,
            uniquenessRatio=self.uniquenessRatio,
            speckleWindowSize=self.speckleWindowSize,
            speckleRange=self.speckleRange
        )

        self.disparity = self.stereo.compute(self.imgL, self.imgR).astype(np.float32) / 16.0

    def get_disparity(self):
        return (self.disparity - self.min_disp) / self.num_disp

    def set_3d_points(self):
        h, w = self.imgL.shape[:2]

        f = 0.8 * w  # guess for focal length

        # If you know the sensor's physical width in mm, then the focal in pixels is:
        # focal_pixel = (focal_mm / sensor_width_mm) * image_width_in_pixels
        f = (self.focal_length_mm / self.sensor_width_mm) * w

        # If you know the horizontal field of view, say in degrees,
        # focal_pixel = (image_width_in_pixels * 0.5) / tan(FOV * 0.5 * PI/180)

        Q = np.float32([[1, 0, 0, -0.5 * w],
                        [0, -1, 0, 0.5 * h],  # turn points 180 deg around x-axis,
                        [0, 0, 0, -f],  # so that y-axis looks up
                        [0, 0, 1, 0]])
        self.points = cv.reprojectImageTo3D(self.disparity, Q)
        self.colors = cv.cvtColor(self.imgL, cv.COLOR_BGR2RGB)

    def generate_2d_3d_map(self):
        if self.points.size is 0:
            self.set_3d_points()

        h, w = self.imgL.shape[:2]

        verts = self.points
        ixs = np.tile(np.arange(w), (h,1))
        iys = np.tile(np.arange(h), (w,1)).transpose()

        # Getting only valid points
        mask = self.disparity > self.disparity.min()
        verts = verts[mask]
        ixs = ixs[mask]
        iys = iys[mask]

        verts = verts.reshape(-1, 3)
        ixs = ixs.reshape(-1, 1)
        iys = iys.reshape(-1, 1)

        verts = np.hstack([verts, ixs, iys])

        for i, point in enumerate(verts):
            x = point[0]
            y = point[1]
            z = point[2]

            if not math.isfinite(x) or not math.isfinite(y) or not math.isfinite(z):
                # Not finite value, skip
                continue

            Ix = int(point[3])
            Iy = int(point[4])

            values = {
                "x": x,
                "y": y,
                "z": z,
            }

            if Ix not in self.image_map_points:
                self.image_map_points[Ix] = {Iy: values}
            elif Iy not in self.image_map_points[Ix]:
                self.image_map_points[Ix][Iy] = values
            else:
                del self.image_map_points[Ix][Iy]
                self.image_map_points[Ix][Iy] = values

    # Determines and returns valid points on left image to select for measurement
    def get_valid_points(self):
        if self.points.size is 0:
            self.set_3d_points()

        h, w = self.imgL.shape[:2]

        valid_points = {}
        verts = self.points

        # Get image coordinates
        ixs = np.tile(np.arange(w), (h,1))
        iys = np.tile(np.arange(h), (w,1)).transpose()

        # Initialize image map
        # self.image_map = np.zeros([h,w,3],dtype=np.uint8)
        # self.image_map.fill(255)  # white image

        # Determine if there a more dead pixels or live pixels
        # Getting only valid points
        valid_disp_mask = self.disparity > self.disparity.min()
        live_verts = self.points[valid_disp_mask]

        if self.points.size/2 >= live_verts.size:
            # Send back live points
            ixs = ixs[valid_disp_mask]
            iys = iys[valid_disp_mask]
            verts = live_verts

            valid_points["is_valid"] = True
        else:
            # Send back dead points
            invalid_disp_mask = self.disparity <= self.disparity.min()
            dead_verts = self.points[invalid_disp_mask]
            ixs = ixs[invalid_disp_mask]
            iys = iys[invalid_disp_mask]
            verts = dead_verts

            valid_points["is_valid"] = False

        valid_points["points"] = list()

        verts = verts.reshape(-1, 3)
        ixs = ixs.reshape(-1, 1)
        iys = iys.reshape(-1, 1)

        verts = np.hstack([verts, ixs, iys])

        for i, point in enumerate(verts):
            x = point[0]
            y = point[1]
            z = point[2]

            if valid_points["is_valid"] and (not math.isfinite(x) or not math.isfinite(y) or not math.isfinite(z)):
                # Not finite value, skip
                continue

            Ix = int(point[3])
            Iy = int(point[4])

            valid_points["points"].append((Ix, Iy))

        return valid_points

    def write_ply(self, filename):
        if self.points.size is 0:
            self.set_3d_points()

        # Getting only valid disparity points
        mask = self.disparity > self.disparity.min()
        verts = self.points[mask]
        colors = self.colors[mask]

        # Remove NaN and Inf values
        mask = np.isfinite(verts)
        verts = verts[mask]
        colors = colors[mask]

        verts = verts.reshape(-1, 3)
        colors = colors.reshape(-1, 3)
        verts2 = np.hstack([verts, colors])

        with open(filename, 'wb') as f:
            f.write((ply_header % dict(vert_num=len(verts2))).encode('utf-8'))
            np.savetxt(f, verts2, fmt='%f %f %f %d %d %d ')

    def calculate_distance(self, ix1, iy1, ix2, iy2):
        if not self.image_map_points:
            self.generate_2d_3d_map()

        pt1 = self.image_map_points[ix1][iy1]
        pt2 = self.image_map_points[ix2][iy2]
        distance = math.sqrt((pt1["x"]-pt2["x"])**2 + (pt1["y"]-pt2["y"])**2 + (pt1["z"]-pt2["z"])**2)
        return distance * self.scale

    def calculate_set_scale(self, ix1, iy1, ix2, iy2, actual_distance):
        distance = self.calculate_distance(ix1, iy1, ix2, iy2)
        self.scale = actual_distance/distance

    def __str__(self):
        return 'Stereograph'

def resize_image(image, target_size):
    scale = target_size/image.shape[1]  # scale of original size, target_size/current_size
    width = int(image.shape[1] * scale)
    height = int(image.shape[0] * scale)
    dim = (width, height)

    return cv.resize(image, dim, interpolation=cv.INTER_AREA)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Calculate and return json stereograph 3d reconstruction map.")
    ap.add_argument("image_left_path", help="path for image left")
    ap.add_argument("image_right_path", help="path for image right")
    ap.add_argument("focal_length_mm", help="focal length of stereograph in mm")
    ap.add_argument("sensor_width_mm", help="sensor width of stereograph in mm")
    args = vars(ap.parse_args())

    imgL = cv.imread(args["image_left_path"])
    imgR = cv.imread(args["image_right_path"])
    imgL = resize_image(imgL, 640)
    imgR = resize_image(imgR, 640)

    stereo = Stereograph(imgL, imgR, args["focal_length_mm"], args["sensor_width_mm"])

    cv.imshow("Disparity", stereo.get_disparity())
    cv.waitKey(0)
