# Stereoscopic Camera Controller

This software is designed to interface with two smartphones running the iVCam app and use them as a stereoscopic camera.

## Setup
### Software
The [iVCam](https://www.e2esoft.com/ivcam/) app should be installed on two iPhone or Android smartphone devices. These smartphones should ideally be of the same model, to ensure that the camera parameters are the same for both sides of the stereoscopic image.

The iVCam software should also be installed on a Windows machine that acts as the controller. You will have to install the iVCam driver a [second time](https://www.e2esoft.com/ivcam-multi-instance/) so that two instances of the iVCam software can be run simultaneously.

When using the software, you must first open one instance of the iVCam software on the control computer. Open the iVCam app on one of the smartphones and connect it to the computer. Then, open another instance of the iVCam software and repeat the process with the other smartphone. Once both phones are connected, navigate to the camera controller directory and activate the software with the following command:
```
python cli.py
```
Please note that the hardware IDs for the camera's are currently hardcoded. If the control computer has a built in webcam, this *may* interfere. You may either use the experimental hardware ID search function located in the ```stereo_camera_controller/utils.py``` file, or you may alter the hardware IDs in the ```cli.py``` file.

Also, ensure that the stream settings in the iVCam app are the same for both cameras, and that they match the settings in ```config.py```.

### Hardware

Both smartphones should be mounted on the custom stereoscopic phone mount/tripod. They should be mounted in parallel, level to each other, and with the two camera lenses at equal height above the ground. Although iVCam supports streaming the camera over an internet connection, it is **strongly** recommended to use a USB connection since it can be used in areas where there is no wifi, it keeps the smartphones charged, and it provides a faster and more reliable connection. Be mindful of the USB connection, if it is at all loose it can cause disruptions in the iVCam connection.

## Usage

Once the software is running, press the 'spacebar' key to save a stereoscopic image. Press the 'e' key to exit the program. Images are saved to the directory specified in ```config.py```, which by default is ```images/```. These keybindings and image directory can be altered in the config file.
