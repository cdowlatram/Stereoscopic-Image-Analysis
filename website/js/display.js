// Get needed elements
const imageLeft = document.getElementById('imageLeft');
const imageRight = document.getElementById('imageRight');
const canvasLeft = document.getElementById('imageLeftCanvas');
const canvasRight = document.getElementById('imageRightCanvas');


console.log(canvasLeft.height);
console.log(canvasLeft.width);

// Get canvas contexts
const contextLeft = canvasLeft.getContext('2d');
const contextRight = canvasRight.getContext('2d');

// Set up state variables
let activeSide = 0;
let pointIndex = false;
let savedPoints = [[-1, -1], [-1,-1]];
let imageDataLeft = null;
let imageDataRight = null;

// Add event listeners to image inputs to display them
imageLeft.addEventListener('change', function(event){
	displayImage(event, 0);
});
imageRight.addEventListener('change', function(event){
	displayImage(event, 1);
});

// Add event listeners to canvases to add points
canvasLeft.addEventListener('click', function(event){
	let coord = canvasLeft.getBoundingClientRect();
	setPoints(event.clientX - coord.left, event.clientY - coord.top, 0);
});
canvasRight.addEventListener('click', function(event){
	let coord = canvasRight.getBoundingClientRect();
	setPoints(event.clientX - coord.left, event.clientY - coord.top, 1);
});

// Sets the selected points
function setPoints(x, y, side){
	if(side !== activeSide){
		savedPoints = [[-1, -1], [-1,-1]];
		renderImage(activeSide);
		activeSide = side;
		pointIndex = false;
	}
	savedPoints[pointIndex ? 1 : 0] = [x, y];
	pointIndex = !pointIndex;
	renderPoints();
}

// Renders the point(s) on canvas
function renderPoints(){
	
	let context = activeSide ? contextRight : contextLeft;
	renderImage(activeSide);
	context.beginPath();
	
	if(savedPoints[0][0] !== -1) {
		context.arc(savedPoints[0][0], savedPoints[0][1], 3, 0, 2*Math.PI);
	}
	
	if(savedPoints[1][0] !== -1) {
		context.arc(savedPoints[1][0], savedPoints[1][1], 3, 0, 2*Math.PI);
	}
	
	context.fillStyle = "red";
	context.fill();
}

// Renders an image on given canvas
function renderImage(side){
	let canvas = side ? canvasRight : canvasLeft;
	let context = side ? contextRight : contextLeft;
	let imageData = side ? imageDataRight : imageDataLeft;
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	//console.log(canvas);
	context.drawImage(imageData,0,0, canvas.width, canvas.height);
}

// Displays an image on its canvas
function displayImage(e, side){
	
	let reader = new FileReader();
	reader.onload = function(event){
		let img = new Image();
		img.onload = function(){
			if(side === 0){
				imageDataLeft = img;
			} else {
				imageDataRight = img;
			}
			renderImage(side);
		}
		img.src = event.target.result;
	}
	reader.readAsDataURL(e.target.files[0]);
}