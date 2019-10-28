function getValidPoints() {
	let image_left = imageLeft.files[0];
	let image_right = imageRight.files[0];
	let focal_length = focal_length_field.value;
	let sensor_width = sensor_width_field.value;
	
	// Do local data validation
	
	let form = new FormData();
	form.append('file_left', image_left);
	form.append('file_right', image_right);
	form.append('focal_length', focal_length);
	form.append('sensor_width', sensor_width);
	
	let request = new XMLHttpRequest();
	request.responseType = 'json';
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200) {
				errorLog.innerHTML = '';
				renderValidPoints(this.response["is_valid"], this.response["points"]);
			} else {
				errorLog.innerHTML = this.responseText;
			}
		}
	};
	request.open("POST", "http://localhost:8080/valid_points");
	request.send(form);
}

function estimateDistance() {
	let image_left = imageLeft.files[0];
	let image_right = imageRight.files[0];
	let focal_length = focal_length_field.value;
	let point_one = savedPoints[0];
	let point_two = savedPoints[1];
	
	// Do local data validation
	
	let form = new FormData();
	form.append('image_left', image_left);
	form.append('image_right', image_right);
	form.append('focal_length', focal_length);
	form.append('point_one', point_one);
	form.append('point_two', point_two);
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4) { 
			if(this.status == 200) {
				errorLog.innerHTML = '';
				output_field.innerHTML = this.responseText;
			} else {
				errorLog.innerHTML = this.responseText;
			}
		}
	};
	request.open("POST", "http://localhost:8080/estimate_distance");
	request.send(form);
}

const sensor_width_field = document.getElementById('sensorWidth');
const output_field = document.getElementById('output');

const valid_button = document.getElementById('getPoints');
valid_button.addEventListener("click", function(event) {
	getValidPoints();
});

const estimate_button = document.getElementById('distanceEstimate');
estimate_button.addEventListener("click", function(event) {
	estimateDistance();
});