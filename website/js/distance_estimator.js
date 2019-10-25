function getValidPoints() {
	let image = imageLeft.files[0];
	let focal_length = focal_length_field.value;
	
	// Do local data validation
	
	let form = new FormData();
	form.append('file', image);
	form.append('focal_length', focal_length);
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200) {
				// Display new image, set up points check
				console.log(this.responseText);
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
				output_field.innerHTML = this.responseText;
			} else {
				errorLog.innerHTML = this.responseText;
			}
		}
	};
	request.open("POST", "http://localhost:8080/estimate_distance");
	request.send(form);
}

const output_field = document.getElementById('output');

const valid_button = document.getElementById('getPoints');
valid_button.addEventListener("click", function(event) {
	getValidPoints();
});

const estimate_button = document.getElementById('distanceEstimate');
estimate_button.addEventListener("click", function(event) {
	estimateDistance();
});