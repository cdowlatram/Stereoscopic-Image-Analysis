import numpy as np
import argparse
import json
import cv2 as cv
import math


class Stereograph:
    def __init__(self, left_image_path, right_image_path):
        self.imgL = cv.imread(left_image_path, 0)
        self.imgR = cv.imread(right_image_path, 0)

        # resize for faster computation
        scale_percent = 800/self.imgL.shape[1] * 100  # percent of original size, target_size/current_size
        width = int(self.imgL.shape[1] * scale_percent / 100)
        height = int(self.imgL.shape[0] * scale_percent / 100)
        dim = (width, height)
        self.imgL = cv.resize(self.imgL, dim, interpolation=cv.INTER_AREA)
        self.imgR = cv.resize(self.imgR, dim, interpolation=cv.INTER_AREA)

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

        self.disparity = None
        self.image_map_points = None
        self.scale = 1

        # Calculates Disparity
        self.update_settings(self.window_size, self.uniquenessRatio, self.speckleWindowSize, self.speckleRange, self.disp12MaxDiff)

    def update_settings(self, window_size, uniquenessRatio, speckleWindowSize, speckleRange, disp12MaxDiff):
        self.window_size = window_size
        self.blockSize = window_size
        self.stereo.setBlockSize(window_size)

        self.uniquenessRatio = uniquenessRatio
        self.stereo.setUniquenessRatio(uniquenessRatio)

        self.speckleWindowSize = speckleWindowSize
        self.stereo.setSpeckleWindowSize(speckleWindowSize)

        self.speckleRange = speckleRange
        self.stereo.setSpeckleRange(speckleRange)

        self.disp12MaxDiff = disp12MaxDiff
        self.stereo.setDisp12MaxDiff(disp12MaxDiff)

        self.disparity = self.stereo.compute(self.imgL, self.imgR).astype(np.float32) / 16.0

    def show_disparity(self):
        cv.imshow('disparity result', (self.disparity - self.min_disp) / self.num_disp)

    def generate_3d_points(self):
        h, w = self.imgL.shape[:2]
        f = 0.8 * w  # guess for focal length
        Q = np.float32([[1, 0, 0, -0.5 * w],
                        [0, -1, 0, 0.5 * h],  # turn points 180 deg around x-axis,
                        [0, 0, 0, -f],  # so that y-axis looks up
                        [0, 0, 1, 0]])
        points = cv.reprojectImageTo3D(self.disparity, Q)
        colors = cv.cvtColor(self.imgL, cv.COLOR_BGR2RGB)
        mask = self.disparity > self.disparity.min()
        out_points = points[mask]
        out_colors = colors[mask]

        # Get image coordinates
        ixs = np.tile(np.arange(w), (h,1))
        iys = np.tile(np.arange(h), (w,1)).transpose()
        out_ixs = ixs[mask]
        out_iys = iys[mask]

        # Initialize image map points array
        self.image_map_points = [[dict() for y in range(h)] for x in range(w)]
        self.generate_mapping(out_points, out_colors, out_ixs, out_iys)

    def generate_mapping(self, verts, colors, ixs, iys):
        verts = verts.reshape(-1, 3)
        colors = colors.reshape(-1, 3)
        ixs = ixs.reshape(-1, 1)
        iys = iys.reshape(-1, 1)

        verts = np.hstack([verts, colors, ixs, iys])

        for i, point in enumerate(verts):
            x = point[0]
            y = point[1]
            z = point[2]
            r = int(point[3])
            g = int(point[4])
            b = int(point[5])
            Ix = int(point[6])
            Iy = int(point[7])

            self.image_map_points[Ix][Iy] = {
                "x": x,
                "y": y,
                "z": z,
                "r": r,
                "g": g,
                "b": b
            }

    def calculate_distance(self, ix1, iy1, ix2, iy2):
        pt1 = self.image_map[ix1][iy1]
        pt2 = self.image_map[ix2][iy2]
        distance = math.sqrt((pt1.x-pt2.x)**2 + (pt1.y-pt2.y)**2 + (pt1.z-pt2.z)**2)
        return distance

    def calculate_scale(self, ix1, iy1, ix2, iy2, actual_distance):
        distance = self.calculate_distance(ix1, iy1, ix2, iy2)
        self.scale = actual_distance/distance

    def __str__(self):
        return 'Stereograph'


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Calculate and return json stereograph 3d reconstruction map.")
    ap.add_argument("image_left_path", help="path for image left")
    ap.add_argument("image_right_path", help="path for image right")
    args = vars(ap.parse_args())

    stereo = Stereograph(args["image_left_path"], args["image_right_path"])

    stereo.generate_3d_points()
    print(json.dumps(stereo.image_map_points))
