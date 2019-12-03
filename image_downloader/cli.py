import glob
import ntpath
import os
import progressbar
import sys

import config
from image_downloader.database import Database
from image_downloader.scanner import Scanner
from image_downloader.sensordatabase import SensorDatabase
from image_downloader.flickr import Flickr

sensor_database = SensorDatabase()
if not sensor_database.import_db(config.sensor_db_path):
	sys.exit(1)
scanner = Scanner(sensor_database)
database = Database()
flickr = Flickr()

# Uses Flickr API to get focal length of Flickr image, adds to database
# Designed for use with the DEEPFOCAL dataset
def flickr_scraper():

	count = 0
	last_file = ''
	files = list(glob.iglob(config.files_path + '/*.jpg', recursive=True))
	progress = progressbar.ProgressBar(maxval=len(files), widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.SimpleProgress(), ' ', progressbar.Percentage(), ' ', progressbar.AdaptiveETA()])
	
	if os.path.isfile('index.txt'):
		with open('index.txt', 'r') as file:
			index = files.index(file.readline())
			count = index
			files = files[index:]
			
	progress.start()
	
	try:
		for file in files:
		
			last_file = file
			file_id = file.split('.')[0].split('\\')[-1]
			
			try:
				focal_length = flickr.get_focal_length(file_id)
				if focal_length:
					image_id = database.add_image(ntpath.basename(file))
					if not image_id:
						print('Error adding ' + file + ' to database')
						count += 1
						progress.update(count)
						continue
					if not database.add_focal_length(image_id, focal_length):
						print('Error adding data for ' + file + ' to database')
			except Exception:
				count += 1
				progress.update(count)
				continue
			
			count += 1
			progress.update(count)
			
	except KeyboardInterrupt:
		with open('index.txt', 'w') as file:
			file.write(last_file)
			
		return True
	
	progress.finish()

# Extracts parameter data from EXIF data for local images, adds to database
def add_new_images():

	count = 0
	success = 0
	fl_values = []
	sw_values = []
	files = list(glob.iglob(config.files_path + '/*.jpg', recursive=True))
	
	progress = progressbar.ProgressBar(maxval=len(files), widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.Percentage()])
	progress.start()
	
	for file in files:
	
		count += 1
		progress.update(count)
		
		exif_data = scanner.get_exif_data(file)
		if not exif_data:
			continue
			
		focal_length = scanner.get_focal_length(exif_data)
		sensor_width = scanner.get_sensor_width(exif_data)
		
		if not (focal_length or sensor_width):
			continue
		
		image_id = database.add_image(ntpath.basename(file))
		if not image_id:
			print('Failed adding ' + file + ' to database.')
			return False
		success += 1
		
		if focal_length:
			if not database.add_focal_length(image_id, focal_length):
				print('Failed adding focal length for ' + file + ' to database.')
				return False
			
			if focal_length not in fl_values:
				fl_values.append(focal_length)
		
		if sensor_width:
			if not database.add_sensor_width(image_id, sensor_width):
				print('Failed adding sensor width for ' + file + ' to database.')
				return False
			
			if sensor_width not in sw_values:
				sw_values.append(sensor_width)
	
	progress.finish()
	fl_values.sort()
	sw_values.sort()
	
	print('(' + str(success) + '/' + str(count) + ') ' + str(round(success/count, 2)*100) + '% of images added to database.')
	print(str(len(fl_values)) + ' distinct focal lengths found.')
	print('Max: ' + str(fl_values[-1]) + ' Min: ' + str(fl_values[0]))
	print(str(len(sw_values)) + ' distinct sensor widths found.')
	print('Max: ' + str(sw_values[-1]) + ' Min: ' + str(sw_values[0]))
	
	return True

# Adds sensor data to database for images from Flickr
def add_sensor_info():

	count = 0
	last_id = config.db_start_id
	if os.path.isfile('index.txt'):
		with open('index.txt', 'r') as file:
			index = int(file.readline())
			count = index - config.db_start_id
			last_id = index
	files = database.get_images(last_id)
	progress = progressbar.ProgressBar(maxval=len(files), widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.SimpleProgress(), ' ', progressbar.Percentage(), ' ', progressbar.AdaptiveETA()])
	progress.start()
	
	try:
		for file in files:
		
			last_id = file['image_id']
			file_id = file['image_id']
			image_id = file['image_left']
			
			try:
				exif_data = flickr.api.photos.getExif(photo_id=image_id)
				sensor_width, sensor_height = sensor_database.get_sensor_data(exif_data)
				
				if sensor_width:
					database.add_sensor_width(file_id, sensor_width)
					
				if sensor_height:
					database.add_sensor_height(file_id, sensor_height)

			except Exception:
				count += 1
				progress.update(count)
				continue
			
			count += 1
			progress.update(count)
			
	except KeyboardInterrupt:
		with open('index.txt', 'w') as file:
			file.write(str(last_id))
			
		return True
	
	progress.finish()

# Uncomment one of the functions here to use it

# add_new_images()
# flickr_scraper()
# add_sensor_info()

database.connection.close()
sys.exit(0)
