import cv2


# Searches for active cameras
def get_device_index(index=0):

	camera_active = False
	while not camera_active:
		camera_test = cv2.VideoCapture(index)
		camera_active, frame = camera_test.read()
		index += 1
	
	return index