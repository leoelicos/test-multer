/* 
notes.js

This script contains necessary code to handle routes to /api/notes:

	It handles GET  	requests to /api/notes
	It handles POST 	requests to /api/notes
	It handles DELETE requests to /api/notes/:node_id

Copyright Leo Wong 2022
*/

// HTTP response status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const OK = 200;
const CREATED = 201;
const NOTFOUND = 404;
const BADREQUEST = 400;

// modularize route logic. This utility is exported at the end of this file.
const notes = require('express').Router();

// destructure imported object into utility functions from helper file fsUtils.js
// readFromFile will be used to read database with a promise
// readAndAppend will be used to read database, append data to it, then rewrite the database
// writeToFile will be used to rewrite the database
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// call utility library from NPM that is used to generate a unique id
// uuid stands for "universally unique identifier". It is an NPM library utility function and generated ids using random numbers
const { v4 } = require('uuid');

// implement route handler for GET request to /api/notes/
notes.get('/', (req, res) => {
	//
	// read from the notes database
	readFromFile('db/db.json')
		//
		// return the data as a JSON
		// also respond to the GET request with status(OK)
		.then((data) => {
			res.status(OK).json(JSON.parse(data));
		});
});

// implement route handler for POST request to /api/notes/
notes.post('/', (req, res) => {
	//
	// check if request has a body, and a title property and a text property inside the body
	if (req.body && req.body.title && req.body.text) {
		//
		// destructure title and text from the body
		const { title, text } = req.body;

		// create a new object with destructured title and text, and generate note_id using npm library utility function
		const newNote = {
			title,
			text,
			note_id: v4(),
		};

		// parse the database, push newNote to it, rewrite the database
		readAndAppend(newNote, 'db/db.json');

		// respond to the POST request with status(CREATED)
		res.status(CREATED).json(`Note added successfully 🚀`);
		//
	} else {
		//
		// respond to the POST request with status(BADREQUEST)
		res.status(BADREQUEST).error('Request body but at least contain title and text');
	}
});

// implement route handler for DELETE request to /api/notes/:note_id
notes.delete('/:note_id', (req, res) => {
	//
	// check if request has a body, and a note_id property inside the body
	if (req.body && req.params.note_id) {
		//
		// destructure note_id from the database;
		const { note_id } = req.params;

		// utility function to read from the database
		readFromFile('db/db.json')
			//
			// parse the read data into an array
			.then((data) => JSON.parse(data))

			// iterate through the array
			.then((json) => {
				//
				// check that note_id in DELETE request actually exists in the database
				const idExists = json.find((note) => note.note_id === note_id);

				// if note_id doesn't exist in the database
				if (idExists === undefined) {
					// respond to the DELETE request with status(404)
					res.status(NOTFOUND).json('Note ${note_id} not found in database');
					//
				} else {
					//
					// filter out the note that has been found
					const result = json.filter((note) => note.note_id !== note_id);

					// utility function to rewrite database with new array of filtered notes
					writeToFile('db/db.json', result);

					// if note_id existed in the database and has been deleted
					// respond to the DELETE request with status(OK)
					res.status(OK).json(`Note ${note_id} has been deleted from database`);
				}
			});
		//
	} else {
		// respond to the DELETE request with status(BADREQUEST)
		res.status(BADREQUEST).json('Request body must at least contain a note_id');
	}
});

module.exports = notes;
