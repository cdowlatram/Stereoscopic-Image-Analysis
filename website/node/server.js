// Import configs
const config = require('./config');

// Import packages
const express = require('express');
const path = require('path');
const app = express();

// Resolves root path
const root_path = path.resolve(__dirname + '/../');

// Route for index
app.get('/', (req, res) => {
	res.sendFile(root_path + '/html/index.html');
});

// Serve JS
app.get('/js/:file', (req, res) => {
	res.sendFile(root_path + '/js/' + req.params['file']);
});

// Serve model data
app.get('/download/:file', (req, res) => {
	res.sendFile(root_path + '/tfjs/' + req.params['file']);
});

// app.get('', (req, res) => {
	
// });

// Initializes server
app.listen(config.port, () => {
	console.log('Server is listening on port ' + config.port.toString())
})