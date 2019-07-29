import cv2
import time

class IVcam:

	def __init__(self, device_id):
	
		self.device_id = device_id
		self.stream = cv2.VideoCapture(device_id)
		ret, frame = self.stream.read()
		count = 0
		# import pdb; pdb.set_trace()
		while (frame[0][0] == [0,0,0]).all() or (frame[0][0] == [255,255,255]).all():
			cv2.imwrite("frame_" + str(count) + '.jpg', frame)
			count += 1
			ret, frame = self.stream.read()
			time.sleep(1)
		print("Camera connected successfully!")
		
	def release(self):
	
		self.stream.release()