import glob
import sys

import config
from image_downloader.database import Database
from image_downloader.scanner import Scanner


if len(sys.argv) < 3:
	print('You must designate one of the following commands as an arguement:')
	print('focal_length (path)')

scanner = Scanner()
# database = Database()

def add_new_images():

	files = glob.iglob(config.files_path + '/*.jpg', recursive=True)
	count = 0
	success = 0
	values = []
	for file in files:
		count += 1
		value = scanner.get_focal_length(file)
		if value:
			success += 1
			if value not in values:
				values.append(value)
				
	values.sort()
	print('(' + str(success) + '/' + str(count) + ') ' + str(round(success/count, 2)*100) + '% of images added to database.')
	print(str(len(values)) + ' distinct focal lengths found.')
	print('Max: ' + str(values[-1]) + ' Min: ' + str(values[0]))

# add_new_images()

# database.connection.close()
