import sys

import pymysql

import config


class Database():

	def __init__(self):

		# Initializes databast connection
		try:
			self.connection = pymysql.connect(
				host=config.database_host,
				user=config.database_user,
				password=config.database_password,
				db=config.database_db,
				charset=config.database_charset,
				cursorclass=pymysql.cursors.DictCursor
			)
		except pymysql.MySQLError as error:
			print('There was an error connecting to the database:')
			print(error)
			sys.exit(1)

		print('Database connection successful!')

	def add_image(self, image_name):

		image_id = None

		try:
			with self.connection.cursor() as cursor:

				query = 'INSERT INTO Images (image_left) VALUES (%s);'
				cursor.execute(query, (image_name))
				image_id = cursor.lastrowid

			self.connection.commit()

		except Exception as e:
			print(e)
			return False

		return image_id

	def add_focal_length(self, image_id, focal_length):

		try:
			with self.connection.cursor() as cursor:
			
				query = 'INSERT INTO Focal_Lengths (image_id, value) VALUES (%s, %s);'
				cursor.execute(query, (image_id, focal_length))

			self.connection.commit()

		except Exception as e:
			print(e)
			return False

		return True
		
	def add_sensor_width(self, image_id, sensor_width):
	
		try:
			with self.connection.cursor() as cursor:
			
				query = 'INSERT INTO Sensor_Widths (image_id, value) VALUES (%s, %s);'
				cursor.execute(query, (image_id, sensor_width))

			self.connection.commit()

		except Exception as e:
			print(e)
			return False

		return True