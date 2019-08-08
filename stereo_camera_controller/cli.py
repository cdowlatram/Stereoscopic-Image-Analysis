import os
import sys
import time

import cv2
import numpy

import config
from stereo_camera_controller.ivcam import IVcam
from stereo_camera_controller import utils


if not os.path.isdir(config.image_directory):
	os.mkdir(config.image_directory)

# device_id_index = utils.get_device_index()
# if device_id_index < 0:
	# print('iVCam has not been properly installed. Please ensure that the iVCam driver has been installed twice.')
	# sys.exit(1)

# print('index: ' + str(device_id_index))
# print('Please connect the left camera.')
# camera_1 = IVcam(device_id_index - 1)
# print('Please connect the right camera.')
# camera_2 = IVcam(device_id_index + 1)

camera_1 = cv2.VideoCapture(0)
camera_2 = cv2.VideoCapture(1)
	
camera_1.set(cv2.CAP_PROP_FRAME_WIDTH, config.camera_width)
camera_1.set(cv2.CAP_PROP_FRAME_HEIGHT, config.camera_height)

camera_2.set(cv2.CAP_PROP_FRAME_WIDTH, config.camera_width)
camera_2.set(cv2.CAP_PROP_FRAME_HEIGHT, config.camera_height)

while True:
	
	ret, frame1 = camera_1.read()
	ret, frame2 = camera_2.read()
	cropped_frame1 = frame1[config.crop_height:config.camera_width, 0:config.camera_height]
	cropped_frame2 = frame2[config.crop_height:config.camera_width, 0:config.camera_height]
	image = numpy.concatenate((cropped_frame1, cropped_frame2), axis=1)
	cv2.imshow('frame', image)
	key = cv2.waitKey(round(1000/config.framerate))
	if key == config.take_image_key:
		current_time = round(time.time())
		cv2.imwrite(config.image_directory + '%d_l.jpg' % current_time, cropped_frame1)
		cv2.imwrite(config.image_directory + '%d_r.jpg' % current_time, cropped_frame2)
	elif key == config.exit_key:
		break

camera_1.release()
camera_2.release()
cv2.destroyAllWindows()
