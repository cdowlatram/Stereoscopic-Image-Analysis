import numpy as np
import argparse
import json
import cv2 as cv
import math


class Stereograph:
    def __init__(self, left_image_path, right_image_path):
        self.imgL = cv.imread(left_image_path, 0)
        self.imgR = cv.imread(right_image_path, 0)

        self.imgL = cv.pyrDown(self.imgL)
        self.imgR = cv.pyrDown(self.imgR)

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
        self.image_map = None
        self.scale = 1

        # Calculates Disparity
        self.update_settings(self.window_size, self.uniquenessRatio, self.speckleWindowSize, self.speckleRange, self.disp12MaxDiff)

    def update_settings(self, window_size, uniquenessRatio, speckleWindowSize, speckleRange, disp12MaxDiff):
        # minDisparity = self.min_disp,
        # numDisparities = self.num_disp,

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

        # print("computing disparity...")
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
        self.generate_mapping(out_points, out_colors)

    def generate_mapping(self, verts, colors):
        verts = verts.reshape(-1, 3)
        colors = colors.reshape(-1, 3)

        mins = np.amin(verts, axis=0)  # get minimum of x, y, z
        verts = verts + abs(mins)  # shift points to positive grid
        maxs = np.amax(verts, axis=0)  # get maximum of x, y, z

        width_factor = 600 / maxs[0]  # target image width / max value of x
        verts = verts * width_factor  # scale points to fit in width
        maxs = np.amax(verts, axis=0)  # new maximum values

        width = int(np.ceil(maxs[0])) + 1  # image map width equals max x value + 1
        height = int(np.ceil(maxs[1])) + 1  # image map height equals max y value + 1

        verts = np.hstack([verts, colors])
        self.image_map = np.zeros((height, width, 3), np.uint8)

        for i, point in enumerate(verts):
            original_values = {'x': point[0], 'y': point[1], 'z': point[2]}
            x = point[0]
            y = abs(point[1] - (height - 1))  # y's flipped for image
            Ix = max(0, min(width - 1, int(x)))
            Iy = max(0, min(height - 1, int(y)))

            r = point[3]
            g = point[4]
            b = point[5]
            self.image_map[Iy, Ix] = (b, g, r)

            if Ix not in self.image_map_points:
                self.image_map_points[Ix] = {Iy: original_values}
            elif Iy not in self.image_map_points[Ix]:
                self.image_map_points[Ix][Iy] = original_values
            else:
                del self.image_map_points[Ix][Iy]
                self.image_map_points[Ix][Iy] = original_values

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
    ap = argparse.ArgumentParser(description="Calculate stereograph measurements.")
    ap.add_argument("image_left_path", help="path for image left")
    ap.add_argument("image_right_path", help="path for image right")
    ap.add_argument("ref_length", help="reference length")
    ap.add_argument("ref_length_point1", help="first point of reference length 'x,y'")
    ap.add_argument("ref_length_point2", help="second point of reference length 'x,y'")
    ap.add_argument("measure_point1", help="first point of measurement 'x,y'")
    ap.add_argument("measure_point2", help="second point of measurement 'x,y'")
    args = vars(ap.parse_args())

    stereo = Stereograph(args["image_left_path"], args["image_right_path"])

    print(json.dumps({"from": args["measure_point1"],
                      "to": args["measure_point2"],
                      "distance": 15.234  # placeholder
                      }))