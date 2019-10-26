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
ap.add_argument('ref_len_points', type=int, nargs=4,
                    help='Reference length points to set scale to 3d reconstruction. Input order: x1 y1 x2 y2')
ap.add_argument("reference_length", type=float, help="Reference length of the reference points")
ap.add_argument("points_to_measure", nargs=4, type=int, help="Measures from on point to next. Input order: x1 y1 x2 y2")
ap.add_argument("--settings", default='', help="enter sbgm settings separated by commas 'min_disp,num_disp,window_size,uniquenessRatio,speckleWindowSize,speckleRange,disp12MaxDiff'")
args = vars(ap.parse_args())

imgL = cv.imread(args["image_left_path"])
imgR = cv.imread(args["image_right_path"])
imgL = smm.resize_image(imgL, 640)
imgR = smm.resize_image(imgR, 640)

stereo = smm.Stereograph(imgL, imgR, args["focal_length_mm"], args["sensor_width_mm"])

# Update SBGM settings if set
settings = args["settings"].replace(" ", "")
settings = settings.split(',')

if len(settings) == 7:
    settings = [int(i) for i in settings]
    stereo.update_settings(settings[0],settings[1],settings[2],settings[3],settings[4],settings[5],settings[6])

# Set scale using reference points and length
x1, y1, x2, y2 = args["ref_len_points"]
stereo.calculate_set_scale(x1,y1,x2,y2,args["reference_length"])

# Get measurement of points
m_x1, m_y1, m_x2, m_y2 = args["points_to_measure"]

print(json.dumps({
    "predicted_length": stereo.calculate_distance(m_x1, m_y1, m_x2, m_y2)
    }))
