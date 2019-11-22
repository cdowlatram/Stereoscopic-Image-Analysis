// Import configs
const config = require('./config');

// Import packages
const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const path = require('path');
const {exec} = require('child_process');
const fs = require('fs');
const app = express();

app.use(cors())
app.use(express.json());
app.use(fileUpload({
	limits: {
		fileSize: 10000000
	}
}));

// Resolves root path
const root_path = path.resolve(__dirname + '/sources');

// Serve images
app.get('/images/:file', (req, res) => {
	res.sendFile(root_path + '/images/' + req.params['file']);
});

// Focal length estimation endpoint
app.post('/focal_length', (req, res) => {
	let image = req.files.image;
	if(image.mimetype.localeCompare('image/png') === 0 || image.mimetype.localeCompare('image/jpeg') === 0) {
		image.mv(root_path + '/images/temp/' + image.name, function(err) {
			if(err) {
				console.log(err);
				res.status(400).send('Server error');
			} else {
				console.log("success");
				exec('python3 ' + root_path + '/python/focal_predictor.py ' + root_path + '/images/temp/' + image.name, (err, stdout, stderr) => {
					if(err || stderr) {
						if(err) console.log(err);
						if(stderr) console.log(stderr);
						res.status(400).send('Error predicting focal length');
					} else {
						res.status(200).send(stdout);
					}
					// fs.unlinkSync(root_path + '/images/temp/' + image.name);
				});
			}
		});
	} else {
		res.status(400).send('Bad file type, must be .jpg or .png');
	}
});

// Get valid input points
app.post('/valid_points', (req, res) => {
	// TODO: granulate error messages
	let image_left = req.files.image_left;
	let image_right = req.files.image_right;
	let focal_length = Number(req.body.focal_length);
	let sensor_width = Number(req.body.sensor_width);
	let min_disparity = Number(req.body.min_disparity);
	let num_disparity = Number(req.body.num_disparity);
	let window_size = Number(req.body.window_size);
	if((image_left.mimetype.localeCompare('image/png') === 0 || image_left.mimetype.localeCompare('image/jpeg') === 0) && (image_right.mimetype.localeCompare('image/png') === 0 || image_right.mimetype.localeCompare('image/jpeg') === 0)) {
		if((typeof(focal_length) === "number" && focal_length > 0 && focal_length <= 300) && ((typeof(sensor_width) === "number" && sensor_width > 0 && sensor_width <= 300))) {
			
			let image_left_name = root_path + '/images/temp/' + image_left.name;
			let image_right_name = root_path + '/images/temp/' + image_right.name;

			image_left.mv(image_left_name, function(err) {
				if(err) {
					console.log(err);
					res.status(400).send('Server error');
				} else {
					image_right.mv(image_right_name, function(err) {
						if(err) {
							console.log(err);
							res.status(400).send('Server error');
							fs.unlinkSync(root_path + '/images/temp/' + image_left.name);
						} else {
							let py_command = 'python3 ' + root_path + '/python/valid_points.py ' + image_left_name.replace(/ /g,"\\ ") + ' ' + image_right_name.replace(/ /g,"\\ ") + ' ' + focal_length.toString() + ' ' + sensor_width.toString() + ' ' + min_disparity.toString() + ' ' + num_disparity.toString() + ' ' + window_size.toString()
							console.log(py_command)
							exec(py_command, {maxBuffer: 1024 * 10000}, (err, stdout, stderr) => {
								if(err || stderr) {
									if(err) console.log(err);
									if(stderr) console.log(stderr);
									res.status(400).send('Error determining valid points');
								} else {
									res.status(200).send(JSON.parse(stdout));
								}
								// fs.unlinkSync(root_path + '/images/temp/' + image_left.name);
								// fs.unlinkSync(root_path + '/images/temp/' + image_right.name);
							});
						}
					});
					
				}
			});
		} else {
			res.status(400).send('Focal length or sensor width has an invalid value');
		}
	} else {
		res.status(400).send('Bad file type, must be .jpg or .png');
	}
});

// Estimate distance
app.post('/estimate_distance', (req, res) => {
	// TODO: granulate error messages
	let image_left = req.files.image_left;
	let image_right = req.files.image_right;
	let focal_length = Number(req.body.focal_length);
	let sensor_width = Number(req.body.sensor_width);
	let reference_points = pointParser(req.body.reference_points);
	let reference_length = Number(req.body.reference_length);
	let measurement_points = pointParser(req.body.measurement_points);
	let min_disparity = Number(req.body.min_disparity);
	let num_disparity = Number(req.body.num_disparity);
	let window_size = Number(req.body.window_size);
	if((image_left.mimetype.localeCompare('image/png') === 0 || image_left.mimetype.localeCompare('image/jpeg') === 0) && (image_right.mimetype.localeCompare('image/png') === 0 || image_right.mimetype.localeCompare('image/jpeg') === 0)) {
		if((typeof(focal_length) === "number" && focal_length > 0 && focal_length <= 300) && ((typeof(sensor_width) === "number" && sensor_width > 0 && sensor_width <= 300))) {
			// TODO: add more value validation checks
			image_left.mv(root_path + '/images/temp/' + image_left.name, function(err) {
				if(err) {
					console.log(err);
					res.status(400).send('Server error');
				} else {
					image_right.mv(root_path + '/images/temp/' + image_right.name, function(err) {
						if(err) {
							console.log(err);
							res.status(400).send('Server error');
							fs.unlinkSync(root_path + '/images/temp/' + image_left.name);
						} else {
							exec('python3 ' + root_path + '/python/predict_length.py ' + root_path + '/images/temp/' + image_left.name + ' ' + root_path + '/images/temp/' + image_right.name + ' ' + focal_length.toString() + ' ' + sensor_width.toString() + ' ' + reference_points[0][0].toString() + ' ' + reference_points[0][1].toString() + ' ' + reference_points[1][0].toString() + ' ' + reference_points[1][1].toString() + ' ' + reference_length.toString() + ' ' + measurement_points[0][0].toString() + ' ' + measurement_points[0][1].toString() + ' ' + measurement_points[1][0].toString() + ' ' + measurement_points[1][1].toString() + ' ' + min_disparity.toString() + ' ' + num_disparity.toString() + ' ' + window_size.toString(), (err, stdout, stderr) => {
								if(err || stderr) {
									if(err) console.log(err);
									if(stderr) console.log(stderr);
									res.status(400).send('Error estimating distance');
								} else {
									res.status(200).send(JSON.parse(stdout));
								}
								fs.unlinkSync(root_path + '/images/temp/' + image_left.name);
								fs.unlinkSync(root_path + '/images/temp/' + image_right.name);
							});
						}
					});
					
				}
			});
		} else {
			res.status(400).send('Focal length or sensor width has an invalid value');
		}
	} else {
		res.status(400).send('Bad file type, must be .jpg or .png');
	}
});

function pointParser(input_string) {
	let array = input_string.split(',');
	return [[Number(array[0]),Number(array[1])],[Number(array[2]),Number(array[3])]];
}

// Initializes server
app.listen(config.port, () => {
	console.log('Server is listening on port ' + config.port.toString())
})