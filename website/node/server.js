// Import configs
const config = require('./config');

// Import packages
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const {exec} = require('child_process');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(fileUpload({
	limits: {
		fileSize: 10000000
	}
}));

// Resolves root path
const root_path = path.resolve(__dirname + '/../');

// Route for index
app.get('/', (req, res) => {
	res.sendFile(root_path + '/html/index.html');
});

// Serve JS
app.get('/js/:file', (req, res) => {
	res.sendFile(root_path + '/js/' + req.params['file']);
});

// Serve CSS
app.get('/css/:file', (req, res) => {
	res.sendFile(root_path + '/css/' + req.params['file']);
});

// Focal length estimation endpoint
app.post('/focal_length', (req, res) => {
	let image = req.files.file;
	if(image.mimetype.localeCompare('image/png') === 0 || image.mimetype.localeCompare('image/jpeg') === 0) {
		image.mv(root_path + '/temp/' + image.name, function(err) {
			if(err) {
				console.log(err);
				res.status(400).send('Server error');
			} else {
				exec(root_path + '/python/focal_predictor.py ' + root_path + '/temp/' + image.name, (err, stdout, stderr) => {
					if(err || stderr) {
						if(stderr) console.log(stderr);
						res.status(400).send('Error predicting focal length');
					} else {
						res.status(200).send(stdout);
					}
				});
			}
			// fs.unlinkSync(root_path + '/temp/' + image.name);
		});
	} else {
		res.status(400).send('Bad file type, must be .jpg or .png');
	}
});

// Get valid input points
app.post('/valid_points', (req, res) => {
	let image = req.files.file;
	let focal_length = req.body.focal_length;
	if(image.mimetype.localeCompare('image/png') === 0 || image.mimetype.localeCompare('image/jpeg') === 0) {
		if(typeof(focal_length) === "number" && focal_length > 0 && focal_length <= 300) {
			image.mv(root_path + '/temp/' + image.name, function(err) {
				if(err) {
					console.log(err);
					res.status(400).send('Server error');
				} else {
					exec(root_path + '/python/valid_points.py ' + root_path + '/temp/' + image.name, (err, stdout, stderr) => {
						if(err || stderr) {
							res.status(400).send('Error determining valid points');
						} else {
							res.status(200).send(stdout);
						}
					});
				}
				fs.unlinkSync(root_path + '/temp/' + image.name);
			});
		} else {
			res.status(400).send('Focal length has an invalid value');
		}
	} else {
		res.status(400).send('Bad file type, must be .jpg or .png');
	}
});

// Estimate distance
app.post('/estimate_distance', (req, res) => {
	
});

// Initializes server
app.listen(config.port, () => {
	console.log('Server is listening on port ' + config.port.toString())
})