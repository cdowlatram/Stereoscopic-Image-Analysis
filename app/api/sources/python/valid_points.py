from __future__ import print_function

import stereo_matcher_model as smm
import json
import sys
import cv2 as cv

try:
	imgL = cv.imread(sys.argv[1])
	imgR = cv.imread(sys.argv[2])
	imgL = smm.resize_image(imgL, 640)
	imgR = smm.resize_image(imgR, 640)
	stereo = smm.Stereograph(imgL, imgR, sys.argv[3], sys.argv[4])
	stereo.update_settings(int(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7]))
	print(json.dumps(stereo.get_valid_points()))
	sys.stdout.flush()
except Exception as e:
	sys.stderr.write("Error encountered\n")
	sys.stderr.write(repr(e))
	sys.stderr.flush()
