// Get needed elements
const imageLeft = document.getElementById('imageLeft');
const imageRight = document.getElementById('imageRight');
const canvasLeft = document.getElementById('imageLeftCanvas');
const canvasRight = document.getElementById('imageRightCanvas');
const errorLog = document.getElementById('error_message');
const selectModeToggle = document.getElementById('selectMode');
const selectModeIndicator = document.getElementById('selectModeIndicator');
const resizeWidth = 640;

// Get canvas contexts
const contextLeft = canvasLeft.getContext('2d');
const contextRight = canvasRight.getContext('2d');

// Set up state variables
let selectMode = false;
let pointIndexKnown = false;
let pointIndexGuess = false;
let savedPointsKnown = [[-1, -1], [-1,-1]];
let savedPointsGuess = [[-1, -1], [-1,-1]];
let imageDataLeft = null;
let imageDataRight = null;
let validPointsRecieved = false;
let validPointsArray = null;
let imageRatio = null;
let imageHeight = 0;

// Add event listeners to image inputs to display them
imageLeft.addEventListener('change', function(event) {
	displayImage(event, 0);
});
imageRight.addEventListener('change', function(event) {
	displayImage(event, 1);
});

// Add event listener to toggle selection mode
selectModeToggle.addEventListener('change', function(event) {
	toggleMode();
});

function toggleMode() {
	selectMode = !selectMode;
	selectModeIndicator.innerHTML = selectMode ? "Estimation" : "Reference";
}

// Add event listener to canvas to add points
canvasLeft.addEventListener('click', function(event) {
	if(validPointsRecieved) {
		let coord = canvasLeft.getBoundingClientRect();
		let x = Math.round(event.clientX - coord.left);
		let y = Math.round(event.clientY - coord.top);
		if(validPointsArray[x][y]) setPoints(x, y);
	}
});

// Sets the selected points
function setPoints(x, y) {
	if(selectMode) {
		savedPointsGuess[pointIndexGuess ? 1 : 0] = [x, y];
		pointIndexGuess = !pointIndexGuess;
	} else {
		savedPointsKnown[pointIndexKnown ? 1 : 0] = [x, y];
		pointIndexKnown = !pointIndexKnown;
	}
	renderPoints();
}

// Renders the point(s) on canvas
function renderPoints() {
	
	let context = contextLeft;
	renderImage(0);
	context.beginPath();
	
	if(savedPointsKnown[0][0] !== -1) {
		context.arc(savedPointsKnown[0][0], savedPointsKnown[0][1], 5, 0, 2*Math.PI);
	}
	
	if(savedPointsKnown[1][0] !== -1) {
		context.arc(savedPointsKnown[1][0], savedPointsKnown[1][1], 5, 0, 2*Math.PI);
	}
	
	context.fillStyle = "blue";
	context.fill();
	
	context.beginPath();
	
	if(savedPointsGuess[0][0] !== -1) {
		context.arc(savedPointsGuess[0][0], savedPointsGuess[0][1], 5, 0, 2*Math.PI);
	}
	
	if(savedPointsGuess[1][0] !== -1) {
		context.arc(savedPointsGuess[1][0], savedPointsGuess[1][1], 5, 0, 2*Math.PI);
	}
	
	context.fillStyle = "red";
	context.fill();
}

// Initializes a valid point array
function initArray(width, height, value) {
	let i, j;
	let array = [];
	for(i=0; i<width; i++) {
		array[i] = [];
		for(j=0; j<height; j++) {
			array[i][j] = value;
		}
	}
	return array;
}

// Calculates which points are valid based on script result
function calculateValidPoints(mode, points) {
	let i, j;
	validPointsArray = initArray(resizeWidth, imageHeight, !mode);
	for(i=0; i < points.length; i++) {
		try {
			validPointsArray[points[i][0]][points[i][1]] = mode;
		}
		catch(err) {
			console.log("Value of i = ");
			console.log(i);
		}
		// Points dont have to be mapped here since image is resized to width 640 during point extraction, if that changes this code will need to change
		
	}
	validPointsRecieved = true;
	renderValidPoints();
}

// Renders the points that can be selected for estimation
function renderValidPoints() {
	let i, j;
	let context = contextLeft;
	context.fillStyle = "black";
	for(i=0; i<resizeWidth; i++) {
		for(j=0; j<imageHeight; j++) {
			try {
				if(!validPointsArray[i][j]) context.fillRect(i, j, 1, 1);
			}
			catch(err) {
				console.log("i = ", i);
				console.log("j = ", j);
			}
		}
	}
	context.fill();
	let img = new Image();
	img.onload = function() {
		imageDataLeft = img;
	}
	img.src = canvasLeft.toDataURL((imageDataLeft.src[11] === 'j') ? 'image/jpeg' : 'image/png');
}

// Renders an image on given canvas
function renderImage(side) {
	let canvas = side ? canvasRight : canvasLeft;
	let context = side ? contextRight : contextLeft;
	let imageData = side ? imageDataRight : imageDataLeft;
	imageRatio = resizeWidth / imageData.width;
	canvas.width = imageData.width * imageRatio;
	canvas.height = imageData.height * imageRatio;
	imageHeight = canvas.height;
	context.drawImage(imageData, 0, 0, canvas.width, canvas.height);
}

// Displays an image on its canvas
function displayImage(e, side) {
	
	let reader = new FileReader();
	reader.onload = function(event) {
		let img = new Image();
		img.onload = function() {
			if(side === 0){
				imageDataLeft = img;
			} else {
				imageDataRight = img;
			}
			validPointsRecieved = false;
			pointIndexKnown = false;
			pointIndexGuess = false;
			savedPointsKnown = [[-1, -1], [-1,-1]];
			savedPointsGuess = [[-1, -1], [-1,-1]];
			renderImage(side);
		}
		img.src = event.target.result;
	}
	reader.readAsDataURL(e.target.files[0]);
}