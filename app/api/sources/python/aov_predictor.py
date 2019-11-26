import numpy as np
import os, sys
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
import keras
sys.stderr = stderr
from keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img, array_to_img
from keras.models import load_model
import json
import math

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def _load_custom_model():
  dir_path = os.path.dirname(os.path.realpath(__file__))
  return load_model(dir_path + '/aov_model.h5')

def predict_aov(image_path):
  model = _load_custom_model()
  img = load_img(image_path)
  width = img.width
  height = img.height
  crop = min(width, height)
  img = img_to_array(img)
  img = img[(height//2)-(crop//2):(height//2)+(crop//2), (width//2)-(crop//2):(width//2)+(crop//2)]
  img = array_to_img(img)
  img = img.resize(size=(299, 299))
  img = img_to_array(img)
  test_data = np.array([img]).astype('float32')
  test_data = test_data/255
  prediction = model.predict(test_data)
  aovs = [7, 19, 25, 27, 38, 40, 53, 67, 74, 100]
  aov = aovs[prediction.argmax()]
  return aov

  

def convert_aov_to_focal_length(aov):
  '''
  Angle of view (in degrees) = 2 ArcTan( sensor width / (2 X focal length)) * (180/π)
  focal_length = sensor width / Tan(AOV/2) / 2

  Sensor Width will be set to 35mm
  '''
  aov_rads = aov * (math.pi/180)
  sensor_width = 88
  focal_length = sensor_width / math.tan( aov_rads / 2 ) / 2
  focal_length = round(focal_length)
  results = {
    "aov": aov, 
    "sensor_width": str(sensor_width), 
    "focal_length": str(focal_length)
  }

  return results

try:
    aov = predict_aov(sys.argv[1])
    focal_length_and_sensor_width = convert_aov_to_focal_length(aov)
    print(json.dumps(focal_length_and_sensor_width))
    sys.stdout.flush()
except Exception as e:
    sys.stderr.write("Error encountered")
    print(e)
    sys.stderr.flush()

