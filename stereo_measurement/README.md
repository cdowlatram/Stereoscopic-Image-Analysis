# Usage example

Input: left_image_path, right_image_path
Output: 2D JSON Array
            - first index = Image x point
            - second index = Image y point
            - entry = x, y, z (in unscaled world space), and r, g, b

```
python3 stereo_matcher_model.py [imgLeft_path] [imgRight_path]
python3 stereo_matcher_model.py sample_images/sample1L.jpg sample_images/sample1R.jpg
```
