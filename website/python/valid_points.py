from __future__ import print_function

import stereo_matcher_model as smm
import argparse
import json
import cv2 as cv

ap = argparse.ArgumentParser(description="Calculate and return valid/invalid points on left image in json.")
ap.add_argument("image_left_path", help="path for image left")
ap.add_argument("image_right_path", help="path for image right")
ap.add_argument("focal_length_mm", help="focal length of stereograph in mm")
ap.add_argument("sensor_width_mm", help="sensor width of stereograph in mm")
ap.add_argument("--settings", default='', help="enter sbgm settings separated by commas 'min_disp,num_disp,window_size,uniquenessRatio,speckleWindowSize,speckleRange,disp12MaxDiff'")
args = vars(ap.parse_args())

imgL = cv.imread(args["image_left_path"])
imgR = cv.imread(args["image_right_path"])
imgL = smm.resize_image(imgL, 640)
imgR = smm.resize_image(imgR, 640)

stereo = smm.Stereograph(imgL, imgR, args["focal_length_mm"], args["sensor_width_mm"])

settings = args["settings"].replace(" ", "")
settings = settings.split(',')


if len(settings) == 7:
    settings = [int(i) for i in settings]
    stereo.update_settings(settings[0],settings[1],settings[2],settings[3],settings[4],settings[5],settings[6])

print(json.dumps(stereo.get_valid_points()))