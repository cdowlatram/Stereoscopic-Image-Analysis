import sys

import cv2
import numpy

import config
from stereo_camera_controller.ivcam import IVcam
from stereo_camera_controller import utils


# device_id_index = utils.get_device_index()
# if device_id_index < 0:
	# print("iVCam has not been properly installed. Please ensure that the iVCam driver has been installed twice.")
	# sys.exit(1)

# print('index: ' + str(device_id_index))
# print("Please connect the left camera.")
# camera_1 = IVcam(device_id_index - 1)
# import pdb; pdb.set_trace()
# print("Please connect the right camera.")
# camera_2 = IVcam(device_id_index + 1)

camera_1 = cv2.VideoCapture(0)
# camera_2 = cv2.VideoCapture(1)
	
camera_1.set(cv2.CAP_PROP_FRAME_WIDTH, config.camera_width)
camera_1.set(cv2.CAP_PROP_FRAME_HEIGHT, config.camera_height)

# camera_2.set(cv2.CAP_PROP_FRAME_WIDTH, config.camera_width)
# camera_2.set(cv2.CAP_PROP_FRAME_HEIGHT, config.camera_height)

last_frame = None

count = 0

while True:
	
	ret, frame1 = camera_1.read()
	# ret, frame2 = camera_2.read()
	frame2 = frame1
	cropped_frame1 = frame1[64:1920, 0:1080]
	cropped_frame2 = frame2[64:1920, 0:1080]
	image = numpy.concatenate((cropped_frame1, cropped_frame2), axis=1)
	cv2.imshow("frame", image)
	key = cv2.waitKey(round(1000/config.framerate))
	# Space bar
	if key == 32:
		cv2.imwrite("image_%d.jpg" % count, image)
		count += 1
	# E key
	elif key == 101:
		last_frame = frame1
		break

camera_1.release()
# camera_2.release()
cv2.destroyAllWindows()
