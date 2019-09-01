import exifread

import config

class Scanner():

	def _get_exif_data(self, image_path):
	
		# Open image and extract EXIF data
		try:
			with open(image_path, 'rb') as file:
				exif_data = exifread.process_file(file, details=False)
		except Exception as e:
			print(e)
			return False
			
		return exif_data
		
	def get_focal_length(self, image_path):
	
		# Get image EXIF data
		exif_data = self._get_exif_data(image_path)
		if not exif_data:
			return False
		
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
