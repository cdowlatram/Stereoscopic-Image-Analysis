# Stereoscopic Image Analysis

## Directories

### app/
This folder contains the website files for the front and back end, as well as the scripts for paramater and distance estimation.

### image_downloader/
This folder contains the software used to extract image information and add it to a database.

### stereo_camera_controller/
This folder contains the software used to control the custom stereoscopic camera.

### stereo_measurement/
This folder contains standalone copies of the scripts used to analyze the stereoscopic images and calculate distances within them.

## Files

### images_db.sql
This file contains the schema and data for the images database we used to train our model. It can be imported into a MySQL database to recreate the database we had. From the command line, the database can be imported as follows:
```
mysql -u username -p images < /path/to/images_db.sql
```
Alternatively, if you are using a program such as MySQL Workbench, you can use the import tool.

### AOV_Model_Transfer_Learning.ipynb
This is the Jupyter notebook file we used to develop the angle of view model. If you want to see exactly how the model was developed, you could open and look through it. If you want to run the notebook itself, you can open it in a [Google Colab](https://colab.research.google.com/) instance, set the runtime to GPU, then run all the cells.
