# Usage example

## valid_points.py
Input: left_image_path, right_image_path, focal_length_mm, sensor_width_mm
Output: 2D JSON Array
            - isValid = True/False, if true points returned are valid else returned points invalid
            - points = array of x,y points that are valid/invalid

```
python3 valid_points.py [left_image_path] [right_image_path] [focal_length_mm] [sensor_width_mm]
python3 valid_points.py sample_images/sample1L.jpg sample_images/sample1R.jpg 100, 80
```
