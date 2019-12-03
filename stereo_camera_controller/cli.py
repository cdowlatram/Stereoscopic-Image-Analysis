import os
import sys
import time

import cv2
import numpy

import config
from stereo_camera_controller.ivcam import IVcam
from stereo_camera_controller import utils


# Initializes image directory
if not os.path.isdir(config.image_directory):
	os.mkdir(config.image_directory)

# Initializes streams
camera_1 = IVcam(1).stream
camera_2 = IVcam(2).stream

# Sets stream parameters
camera_1.set(cv2.CAP_PROP_FRAME_WIDTH, config.camera_width)
camera_1.set(cv2.CAP_PROP_FRAME_HEIGHT, config.camera_height)
camera_2.set(cv2.CAP_PROP_FRAME_WIDTH, config.camera_width)
camera_2.set(cv2.CAP_PROP_FRAME_HEIGHT, config.camera_height)

while True:
	# Gets frames from streams
	ret, frame1 = camera_1.read()
	ret, frame2 = camera_2.read()

	# Crops out watermark
	cropped_frame1 = frame1[config.crop_height:config.camera_width, 0:config.camera_height]
	cropped_frame2 = frame2[config.crop_height:config.camera_width, 0:config.camera_height]

	# Rotates frame (necessary if using IVcam default settings)
	cropped_frame1 = numpy.rot90(cropped_frame1)
	cropped_frame2 = numpy.rot90(cropped_frame2)

	# Combines and displays frames
	image = numpy.concatenate((cropped_frame1, cropped_frame2), axis=1)
	cv2.imshow('frame', image)

	# Listens for keypress
	key = cv2.waitKey(round(1000/config.framerate))
	if key == config.take_image_key:
		# Saves frames as images
		current_time = round(time.time())
		cv2.imwrite(config.image_directory + '%d_l.jpg' % current_time, cropped_frame1)
		cv2.imwrite(config.image_directory + '%d_r.jpg' % current_time, cropped_frame2)
	elif key == config.exit_key:
		# Exits program
		break

# Clean up
camera_1.release()
camera_2.release()
cv2.destroyAllWindows()
