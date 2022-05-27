/* 
index.js

This script contains necessary code to handle routes to /api

Copyright Leo Wong 2022
*/

// express is an npm library package which links client requests to server responses
const express = require('express');

// import modular router for /notes
const notesRouter = require('./notes');

// assign variable for readability
const app = express();

// implement mounted middleware for handling /notes
app.use('/notes', notesRouter);

module.exports = app;
