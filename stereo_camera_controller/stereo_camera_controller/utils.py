import cv2

def get_device_index():

	index = 0
	camera_active = True
	while camera_active == True:
		camera_test = cv2.VideoCapture(index)
		camera_active, frame = camera_test.read()
		cv2.imwrite(str(index) + '.jpg', frame)
		index += 1
	
	return index - 2