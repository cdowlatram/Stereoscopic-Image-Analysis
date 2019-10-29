import numpy as np
import os, sys
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
import keras
sys.stderr = stderr
from keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img, array_to_img
from keras.models import load_model

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def _load_custom_model():
  return load_model('../python/focal_length_model.h5')

def predict_focal_length(image_path):
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
  focal_lengths = [50, 55, 60, 70, 75, 80, 85, 90, 100, 105, 120]
  focal_length = focal_lengths[prediction.argmax()]
  return focal_length

try:
	value = predict_focal_length(sys.argv[1])
	print(value)
	sys.stdout.flush()
except Exception as e:
	sys.stderr.write("Error encountered")
	print(e)
	sys.stderr.flush()

