from __future__ import print_function

import stereo_matcher_model as smm
import json
import sys
import os
import cv2 as cv
import numpy as np

directory = os.path.dirname(os.path.realpath(__file__)) 
directory = directory + "/../images/"

try:
    imgL = cv.imread(sys.argv[1])
    imgR = cv.imread(sys.argv[2])
    imgL = smm.resize_image(imgL, 640)
    imgR = smm.resize_image(imgR, 640)
    stereo = smm.Stereograph(imgL, imgR, sys.argv[3], sys.argv[4])
    session = str(sys.argv[5])
    
    response = []
    for i in range(1,3):
        for j in range(1,7):
            if i != j:
                stereo.update_settings(i*16, j*16)
                filename = session + "_" + str(i*16) + "_" + str(j*16) + ".jpg"
                disparity_map = (stereo.get_disparity() * 255).round().astype(np.uint8)
                cv.imwrite(directory + filename, disparity_map)
                response.append({'min_disparity': i*16, 'num_disparity': j*16, 'image_name': filename})

    print(json.dumps(response))
    sys.stdout.flush()
except Exception as e:
    sys.stderr.write("Error encountered\n")
    sys.stderr.write(repr(e))
    sys.stderr.flush()
