import csv

import config


class SensorDatabase():

	def __init__(self):
	
		self.data = {}
		# self.not_found = []
		
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
		
		# if not model in self.not_found:
			# self.not_found.append(model)
			
		return False