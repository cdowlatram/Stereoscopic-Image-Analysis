import cv2
import time

class IVcam:

	def __init__(self, device_id):
	
		# Captures the stream from a given hardware ID
		self.device_id = device_id
		self.stream = cv2.VideoCapture(device_id)
		ret, frame = self.stream.read()

		print("Camera connected successfully!")
	
	# Releases the camera stream
	def release(self):
	
		self.stream.release()