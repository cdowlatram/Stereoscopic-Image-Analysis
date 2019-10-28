function getFocalLength() {
	let image = imageLeft.files[0];
	
	// TODO: Do local data validation
	
	loading_fl.hidden = false;
	
	let form = new FormData();
	form.append('image', image);
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200) {
				errorLog.innerHTML = '';
				focal_length_field.value = Number(this.responseText);
			} else {
				errorLog.innerHTML = this.responseText;
			}
			loading_fl.hidden = true;
		}
	};
	request.open("POST", "http://localhost:8080/focal_length");
	request.send(form);
}

const loading_fl = document.getElementById('loading_fl');
const focal_length_field = document.getElementById('focalLength');
const predict_button = document.getElementById('focalLengthPredict');
predict_button.addEventListener("click", function(event) {
	getFocalLength();
});