function getFocalLength() {
	let image = imageLeft.files[0];
	
	// Do local data validation
	
	let form = new FormData();
	form.append('file', image);
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200) {
				errorLog.innerHTML = '';
				focal_length_field.value = Number(this.responseText);
			} else {
				errorLog.innerHTML = this.responseText;
			}
		}
	};
	request.open("POST", "http://localhost:8080/focal_length");
	request.send(form);
}

const focal_length_field = document.getElementById('focalLength');
const predict_button = document.getElementById('focalLengthPredict');
predict_button.addEventListener("click", function(event) {
	getFocalLength();
});