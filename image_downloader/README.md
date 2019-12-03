# Image Downloader

This software is a collection of functions used for downloading images, retrieving their relevant data, and adding that data to a database.

## Usage

To use the software, you must first set up a [virtual environment](https://docs.python-guide.org/dev/virtualenvs/) in the project directory:
```
pip install virtualenv
```
```
virtualenv env
```
```
source env/bin/activate
```
```
pip install -r requirements.txt
```
Make sure that ```config.py``` has all necessary keys and directories set up before using the software.

Uncomment the function you wish to use in ```cli.py```, then run the following command:
```
python cli.py
```

Descriptive explainations of the different functions can be found in the code comments.
