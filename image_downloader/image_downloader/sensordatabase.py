import csv

import config


class SensorDatabase():

	def __init__(self):
	
		self.data = {}
	
	# Parse old sensor database
	def import_db(self, path):
	
		try:
			with open(path, 'r', newline='') as f:
				reader = csv.reader(f)
				next(reader)
				for row in reader:
					model = row[1].upper()
					self.data[model] = row[2]
			
			return True
			
		except Exception as e:
			print(e)
			return False

	# Parse new sensor database
	def import_db_detailed(self, path):
	
		try:
			with open(path, 'r', newline='') as f:
				reader = csv.reader(f)
				next(reader)
				for row in reader:
					make = row[0].upper()
					model = row[1].upper()
					if make not in self.data:
						self.data[make] = {}
					self.data[make][model] = row[3], row[4]
			
			return True
			
		except Exception as e:
			print(e)
			return False
	
	# Look up sensor width, optimized for old database
	def get_sensor_width(self, camera_make, camera_model):
	
		camera_make = camera_make.split(' ')[0].strip().upper()
		camera_model = camera_model.strip().upper()
		try:
			if camera_make in camera_model:
				model = camera_model
			else:
				model = camera_make + ' ' + camera_model
		except TypeError:
			return False
	
		if model in self.data:
			return round(float(self.data[model]), 1)
		
		if camera_make == 'SONY':
			model = camera_make + ' CYBERSHOT ' + camera_model
		elif camera_make == 'PANASONIC':
			model = camera_make + ' LUMIX ' + camera_model
			
		if model in self.data:
			return round(float(self.data[model]), 1)
			
		return False

	# Look up sensor data, optimized for new database
	def get_sensor_data(self, exif_data):
	
		camera = exif_data['photo']['camera'].upper().split(' ', 1)
		make = camera[0]
		model = camera[1]
		
		try:
			width, height = self.data[make][model]
			return round(float(width), 1), round(float(height), 1)
		except KeyError:
			return False, False
		except Exception as e:
			print(e)
			return False, False