/* 
server.js

This script contains necessary code to run the server of Note Taker

Copyright Leo Wong 2022
*/

// express is an npm library package which links client requests to server responses
const express = require('express');

// express middleware to support uploading of files
const multer = require('multer');

const fileFilter = (req, file, cb) => {
	// The function should call `cb` with a boolean
	// to indicate if the file should be accepted
	// console.log(req);
	console.log(file);
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
		// req.filename += '.jpg';
		cb(null, true);
	} else {
		alert('Invalid file format - use JPG/JPEG only');
		cb(null, false);
	}
};

var storage = multer.diskStorage({
	destination: './public/data/uploads/',
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
	}
});

const upload = multer({ storage, fileFilter });

// path is a Node standard library package which provides utilities for working with file and directory paths
const path = require('path');

// clog is a custom unmounted middleware which logs all requests to the server
const { clog } = require('./middleware/clog');

// import modular router for /api
const api = require('./routes/index');

// process.env.PORT is a requirement for Heroku deployment: https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error
const PORT = process.env.PORT || 3001;

// assign variable for readability
const app = express();

// function to start application
function init() {
	// implement middleware for logging all requests to the server
	app.use(clog);

	// implement middleware for parsing JSON
	app.use(express.json());

	// implement middleware for parsing urlencoded form data
	app.use(express.urlencoded({ extended: true }));

	// implement middleware for handling /api routes
	app.use('/api', api);

	// implement mounted middleware for handling / routes
	app.use(express.static('public'));

	// implement GET Route for notes page
	app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/assets/pages/notes.html')));

	// implement wildcard route to direct users to index.html
	app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

	app.post('/uploads', upload.single('upload'), function (req, res) {
		console.log(req.file);
		const src = path.join(__dirname, req.file.path);
		const html = `<html><body>Success!<img src="${src}" alt="user-upload"></body></html>`;
		console.log('The file path is' + src);
		// res.status(200).sendFile(src);

		res.status(200).json({ path: src });
	});

	// implement server
	app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`));
}

// call function to start application
init();
