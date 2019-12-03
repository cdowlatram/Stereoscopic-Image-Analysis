# Stereoscopic Measurement Scripts
These scripts are used to analyze stereoscopic images.

### Dependencies
To run these scripts, you will need to install the following python libraries:
- CV2
- NumPy

### valid_points.py
This script is used to determine which points within the stereoscopic image have sufficient discrepency to use for making measurements.

### stereo_matcher_model.py
This script is used to generate the 3D reconstruction of the scene withing the stereoscopic image.

## Usage
### valid_points.py
This script should be provided the path to the left side of the stereoscopic image, the path to the right side of the stereoscopic image, the focal length in millimeters, and the sensor width in millimeters.
```
python valid_points.py [left_image_path] [right_image_path] [focal_length_mm] [sensor_width_mm]
```
```
python valid_points.py sample_images/sample1L.jpg sample_images/sample1R.jpg 100 80
```
The script will output a 2D JSON array with the following data:

```isValid```: True/False, determines if the returned points are the valid or invalid points within the image (this is done to minimize the size of data transferred).

```points```: Array, set of points that are either valid or invalid.

### stereo_matcher_model.py
This script should be provided the path to the left side of the stereoscopic image, the path to the right side of the stereoscopic image, the focal length in millimeters, and the sensor width in millimeters.
```
python stereo_matcher_model.py [left_image_path] [right_image_path] [focal_length_mm] [sensor_width_mm]
```
```
python stereo_matcher_model.py sample_images/sample1L.jpg sample_images/sample1R.jpg 100 80
```

The script will display the generated disparity map to the user.
