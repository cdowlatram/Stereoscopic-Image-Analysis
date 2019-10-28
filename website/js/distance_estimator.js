function getValidPoints() {
	let image_left = imageLeft.files[0];
	let image_right = imageRight.files[0];
	let focal_length = focal_length_field.value;
	let sensor_width = sensor_width_field.value;
	
	// TODO: Do local data validation
	
	loading_vp.hidden = false;
	
	let form = new FormData();
	form.append('image_left', image_left);
	form.append('image_right', image_right);
	form.append('focal_length', focal_length);
	form.append('sensor_width', sensor_width);
	
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
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4) { 
			if(this.status == 200) {
				errorLog.innerHTML = '';
				output_field.innerHTML = this.responseText;
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