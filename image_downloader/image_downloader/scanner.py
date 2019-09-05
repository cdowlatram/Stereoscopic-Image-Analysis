import csv
import exifread
import config

class Scanner():

	def __init__(self, sensor_database):
	
		self.sensor_database = sensor_database

	def get_exif_data(self, image_path):
	
		# Open image and extract EXIF data
		try:
			with open(image_path, 'rb') as file:
				exif_data = exifread.process_file(file, details=False)
		except Exception as e:
			print(e)
			return False
			
		return exif_data
		
	def get_focal_length(self, exif_data):
		
		# Try to retrieve focal length
		try:
			focal_length = exif_data['EXIF FocalLength']
		except KeyError:
			return False
		
		# Check for missing values
		if not focal_length.values[0].num or not focal_length.values[0].den:
			return False
			
		# Convert from ratio to decimal value
		focal_length = round(focal_length.values[0].num / focal_length.values[0].den, 1)
		
		return focal_length
		
	def get_sensor_width(self, exif_data):
	
		# Try to retrive camera make and model
		try:
			camera_make = exif_data['Image Make'].values
			camera_model = exif_data['Image Model'].values
		except KeyError:
			return False
	
		# Look up camera in database
		return self.sensor_database.get_sensor_width(camera_make, camera_model)
		