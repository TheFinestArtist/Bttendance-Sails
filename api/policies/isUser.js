/**
 * isUser
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');

module.exports = function isUser (req, res, next) {

	// Params
	var username = req.param('username');
	var password = req.param('password');

	if (!username || !password) {
		console.log("isUser : Username and password is required.");
		return res.send(400, Error.log("Username and password is required."));
	}

	// Super Username Policy
	if (username == "appletest0"
		|| username == "appletest1"
		|| username == "appletest2"
		|| username == "appletest3"
		|| username == "appletest4"
		|| username == "appletest5"
		|| username == "appletest6"
		|| username == "appletest7"
		|| username == "appletest8"
		|| username == "appletest9")
		return next();

	// isUser Policy
	Users
	.findOneByUsername(username)
	.exec(function callback(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, Error.log("Error in user find method."));

	  // No User found
	  } else if (!user) {
	    return res.send(404, Error.log("User doesn't exitst."));

	  // Password Doesn't Match
	  } else if (user.password != password) {
		  return res.send(404, Error.log("Password doesn't match."));

		// Found User
	  } else {
	  	return next();
	  }
	});

};