function getValidPoints() {
	let image_left = imageLeft.files[0];
	let image_right = imageRight.files[0];
	let focal_length = focal_length_field.value;
	let sensor_width = sensor_width_field.value;
	let min_disparity = min_disparity_field.value;
	let num_disparity = num_disparity_field.value;
	let window_size = window_size_field.value;

	// TODO: Do local data validation
	
	loading_vp.hidden = false;
	
	let form = new FormData();
	form.append('image_left', image_left);
	form.append('image_right', image_right);
	form.append('focal_length', focal_length);
	form.append('sensor_width', sensor_width);
	form.append('min_disparity', min_disparity);
	form.append('num_disparity', num_disparity);
	form.append('window_size', window_size);
	
	let request = new XMLHttpRequest();
	request.responseType = 'json';
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200) {
				errorLog.innerHTML = '';
				calculateValidPoints(this.response["is_valid"], this.response["points"]);
			} else {
				errorLog.innerHTML = this.responseText;
			}
			loading_vp.hidden = true;
		}
	};
	request.open("POST", "http://localhost:8080/valid_points");
	request.send(form);
}

function estimateDistance() {
	let image_left = imageLeft.files[0];
	let image_right = imageRight.files[0];
	let focal_length = focal_length_field.value;
	let sensor_width = sensor_width_field.value;
	let reference_points = savedPointsKnown;
	let reference_length = reference_length_field.value;
	let measurement_points = savedPointsGuess;
	let min_disparity = min_disparity_field.value;
	let num_disparity = num_disparity_field.value;
	let window_size = window_size_field.value;
	
	// TODO: Do local data validation
	
	loading_ed.hidden = false;
	
	let form = new FormData();
	form.append('image_left', image_left);
	form.append('image_right', image_right);
	form.append('focal_length', focal_length);
	form.append('sensor_width', sensor_width);
	form.append('reference_points', reference_points);
	form.append('reference_length', reference_length);
	form.append('measurement_points', measurement_points);
	form.append('min_disparity', min_disparity);
	form.append('num_disparity', num_disparity);
	form.append('window_size', window_size);
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4) { 
			if(this.status == 200) {
				errorLog.innerHTML = '';
				output_field.innerHTML = Math.round(JSON.parse(this.responseText)["distance"]).toString() + ' mm';
			} else {
				errorLog.innerHTML = this.responseText;
			}
			loading_ed.hidden = true;
		}
	};
	request.open("POST", "http://localhost:8080/estimate_distance");
	request.send(form);
}

const sensor_width_field = document.getElementById('sensorWidth');
const reference_length_field = document.getElementById('referenceLength');
const min_disparity_field = document.getElementById('minDisparity');
const num_disparity_field = document.getElementById('numDisparity');
const window_size_field = document.getElementById('windowSize');
const output_field = document.getElementById('output');
const loading_vp = document.getElementById('loading_vp');
const loading_ed = document.getElementById('loading_ed');

const valid_button = document.getElementById('getPoints');
valid_button.addEventListener("click", function(event) {
	getValidPoints();
});

const estimate_button = document.getElementById('distanceEstimate');
estimate_button.addEventListener("click", function(event) {
	estimateDistance();
});