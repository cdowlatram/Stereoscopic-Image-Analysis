let model = null;

async function loadModel(){
	model = await tf.loadLayersModel('http://localhost:8080/download/model.json');
}

loadModel();