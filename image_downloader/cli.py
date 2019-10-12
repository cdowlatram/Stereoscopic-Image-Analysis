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

def flickr_scraper():

	count = 0
	last_file = ''
	files = list(glob.iglob(config.files_path + '/*.jpg', recursive=True))
	if os.path.isfile('index.txt'):
		with open('index.txt', 'r') as file:
			index = file.readline()
			files = files[files.index(index):]
			
	progress = progressbar.ProgressBar(maxval=len(files), widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.Percentage()])
	progress.start()
	
	try:
		for file in files:
		
			last_file = file
			file_id = file.split('.')[0].split('\\')[-1]
			
			focal_length = flickr.get_focal_length(file_id)
			if focal_length:
				image_id = database.add_image(ntpath.basename(file))
				database.add_focal_length(image_id, focal_length)
			
			count += 1
			progress.update(count)
			
	except (Exception, KeyboardInterrupt):
		with open('index.txt', 'w') as file:
			file.write(last_file)
	
	progress.finish()

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

# add_new_images()
flickr_scraper()

# count = 0
# files = list(glob.iglob(config.files_path + '/*.jpg', recursive=True))
# for file in files:
	# data = scanner.get_exif_data(file)
	# if scanner.get_sensor_width(data):
		# count += 1

# sensor_database.not_found.sort()
# for item in sensor_database.not_found:
	# print(item)
# print(str(count) + '/' + str(len(files)))

database.connection.close()
sys.exit(0)
