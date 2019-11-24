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

// Upload image 
app.post('/upload', (req, res) => {
	let image = req.files.image;
	let session_id = req.body.session_id;
	let image_name = session_id + '_' + image.name;

	if(image.mimetype.localeCompare('image/png') === 0 || image.mimetype.localeCompare('image/jpeg') === 0) {
		image.mv(root_path + '/images/temp/' + image_name, function(err) {
			if(err) {
				console.log(err);
				res.status(400).send('Server error');
			} else {
				console.log("success");
				res.status(200).send({name: image_name});
			}
		});
	} else {
		res.status(400).send('Bad file type, must be .jpg or .png');
	}
});

// Focal length estimation endpoint
app.post('/focal_length', (req, res) => {
	let image_name = req.files.image_name;

	exec('python3 ' + root_path + '/python/focal_predictor.py ' 
		+ root_path + '/images/temp/' + image_name, 
		(err, stdout, stderr) => {
			if(err || stderr) {
				if(err) console.log(err);
				if(stderr) console.log(stderr);
				res.status(400).send('Error predicting focal length');
			} else {
				res.status(200).send(stdout);
			}
		});
});

// Get valid input points
app.post('/valid_points', (req, res) => {
	// TODO: granulate error messages
	let image_left_name = req.files.image_left_name;
	let image_right_name = req.files.image_right_name;
	let focal_length = Number(req.body.focal_length);
	let sensor_width = Number(req.body.sensor_width);
	let min_disparity = Number(req.body.min_disparity);
	let num_disparity = Number(req.body.num_disparity);
	let window_size = Number(req.body.window_size);

	if((typeof(focal_length) === "number" && focal_length > 0 && focal_length <= 300) 
	&& ((typeof(sensor_width) === "number" && sensor_width > 0 && sensor_width <= 300))) {
		let py_command = 'python3 ' + root_path + '/python/valid_points.py ' + image_left_name.replace(/ /g,"\\ ") + ' ' + image_right_name.replace(/ /g,"\\ ") + ' ' + focal_length.toString() + ' ' + sensor_width.toString() + ' ' + min_disparity.toString() + ' ' + num_disparity.toString() + ' ' + window_size.toString();

		exec(py_command, {maxBuffer: 1024 * 10000}, (err, stdout, stderr) => {
			if(err || stderr) {
				if(err) console.log(err);
				if(stderr) console.log(stderr);
				res.status(400).send('Error determining valid points');
			} else {
				res.status(200).send(JSON.parse(stdout));
			}
		});
	} else {
		res.status(400).send('Focal length or sensor width has an invalid value');
	}
});

// Estimate distance
app.post('/estimate_distance', (req, res) => {
	// TODO: granulate error messages
	let image_left_name = req.files.image_left_name;
	let image_right_name = req.files.image_right_name;
	let focal_length = Number(req.body.focal_length);
	let sensor_width = Number(req.body.sensor_width);
	let reference_points = pointParser(req.body.reference_points);
	let reference_length = Number(req.body.reference_length);
	let measurement_points = pointParser(req.body.measurement_points);
	let min_disparity = Number(req.body.min_disparity);
	let num_disparity = Number(req.body.num_disparity);
	let window_size = Number(req.body.window_size);

	if((typeof(focal_length) === "number" && focal_length > 0 && focal_length <= 300) 
	&& ((typeof(sensor_width) === "number" && sensor_width > 0 && sensor_width <= 300))) {
		// TODO: add more value validation checks
		exec('python3 ' + root_path + '/python/predict_length.py ' 
		+ root_path + '/images/temp/' + image_left_name + ' '
		+ root_path + '/images/temp/' + image_right_name + ' ' 
		+ focal_length.toString() + ' ' + sensor_width.toString() + ' ' 
		+ reference_points[0][0].toString() + ' ' + reference_points[0][1].toString() + ' ' 
		+ reference_points[1][0].toString() + ' ' + reference_points[1][1].toString() + ' ' 
		+ reference_length.toString() + ' ' + measurement_points[0][0].toString() + ' ' 
		+ measurement_points[0][1].toString() + ' ' + measurement_points[1][0].toString() + ' ' 
		+ measurement_points[1][1].toString() + ' ' + min_disparity.toString() + ' ' 
		+ num_disparity.toString() + ' ' + window_size.toString(), (err, stdout, stderr) => {
			if(err || stderr) {
				if(err) console.log(err);
				if(stderr) console.log(stderr);
				res.status(400).send('Error estimating distance');
			} else {
				res.status(200).send(JSON.parse(stdout));
			}
		});
	} else {
		res.status(400).send('Focal length or sensor width has an invalid value');
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