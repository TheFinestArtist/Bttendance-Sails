/**
 * hasDevice
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');

module.exports = function hasDevice (req, res, next) {

	// Params
	var username = req.param('username');
	var email = req.param('email');
	var device_uuid = req.param('device_uuid');

	if (!username && !email)
		return res.send(400, Error.log(req, "Username or Email is required."));

	if (!device_uuid)
		return res.send(400, Error.log(req, "Device UUID is required."));

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

	// Super Email Policy
	if (email == "apple0@apple.com"
		|| email == "apple1@apple.com"
		|| email == "apple2@apple.com"
		|| email == "apple3@apple.com"
		|| email == "apple4@apple.com"
		|| email == "apple5@apple.com"
		|| email == "apple6@apple.com"
		|| email == "apple7@apple.com"
		|| email == "apple8@apple.com"
		|| email == "apple9@apple.com")
		return next();

	Users
	.findOne({
	  or : [
	    { email: email },
	    { username: username }
	  ]
	})
	.populate('device')
	.exec(function callback(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, Error.log(req, "Error in user find method."));

	  // No User found
	  } else if (!user) {
	    return res.send(404, Error.log(req, "User doesn't exitst."));

	  // User Device Doesn't Match
	  } else if (user.device.uuid != device_uuid) {
		  return res.send(404, Error.log(req, "Device uuid doesn't match."));

		// Found User
	  } else {
	  	return next();
	  }
	});

};