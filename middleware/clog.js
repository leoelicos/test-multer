/* 
clog.js

This script is modified from BCS Resources

It contains necessary code to prettify console log messages

I added a case for DELETE, and changed the icon for default.

Copyright Leo Wong 2022
*/

// Custom middleware that logs out the type and path of each request to the server
// This callback function will be exported
const clog = (req, res, next) => {
	// variable for req.method
	const method = req.method;

	// variable for req.path;
	const path = req.path;

	// color of the console.log text
	const fgCyan = '\x1b[36m';

	// array of expected request methods
	const reqmethods = ['GET', 'POST', 'DELETE'];

	// array of corresponding glyphs
	const glyphs = ['📗', '📘', '📙'];

	// default glyph for other request methods
	const glyphDefault = '📒';

	// assign glyph variable to corresponding glyph, if method is found, or the default glyph
	const glyph = reqmethods.includes(method) ? glyphs[reqmethods.indexOf(method)] : glyphDefault;

	// print console.log message
	console.info(`${glyph} ${fgCyan}${method} request to ${path}`);

	// Express requirement for middleware. This will execute the next middleware.
	next();
};

exports.clog = clog;
