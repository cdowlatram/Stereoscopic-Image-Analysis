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
	stereo.calculate_set_scale(sys.argv[5],sys.argv[6],sys.argv[7],sys.argv[8],sys.argv[9])
	m_x1, m_y1, m_x2, m_y2 = args["points_to_measure"]
	print(stereo.calculate_distance(sys.argv[10], sys.argv[11], sys.argv[12], sys.argv[13]))
	sys.stdout.flush()
except Exception as e:
	sys.stderr.write("Error encountered")
	print(e)
	sys.stderr.flush()