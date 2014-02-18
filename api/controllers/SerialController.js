/**
 * SerialController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var nodemailer = require("nodemailer");

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SerialController)
   */
   
  _config: {},

	validate: function(req, res) {
		res.contentType('application/json');
		var serial = req.param('serial');

		Serial.findOne({
			key: serial
		}).done(function(err, serial) {
			if (err || !serial) 
	    	return res.send(404, { message: "No Serial Found Error" });

			School.findOne(serial.school).done(function(err, school) {
				if (err || !school) 
	    		return res.send(404, { message: "No School Found Error" });

		  	// return SchoolJSON
				var schoolJSON = JSON.stringify(school);
		  	return res.send(schoolJSON);
			});
		});

	},

	request: function(req, res) {
		res.contentType('application/json');
		var email = req.param('email');

		Serial.create({
		  school: 1
		}).done(function(err, serial) {

		  // Error handling
		  if (err || !serial)
	    	return res.send(404, { message: "No Serial Created Error" });

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "no-reply@bttendance.com",
			        pass: "N0n0r2ply"
			    }
			});

			var text = "Dear " + email + ",\n\nThank you for registering with team Bttendance!\nYour serial code is following.\n\nSerial Code : " + serial.key + "\n\nNow you can create your personal course in the “Bttendance School”.\nUsing Bttendance for personal purpose is for free under the current pricing policy.\n\nYours sincerely,\nTeam Bttendance."

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: "Bttendance<no-reply@bttendance.com>", // sender address
			    to: email, // list of receivers
			    subject: "Welcome to Bttendance", // Subject line
			    text: text, // plaintext body
			}

			// send mail with defined transport object
			smtpTransport.sendMail(mailOptions, function(error, response) {
			    if(error || !response || !response.message)
			      console.log(error);

			    console.log("Message sent: " + response.message);
			});

			School.findOne(serial.school).done(function(err, school) {
		  	if (!school.serials) user.serials = new Array();

	    	// add course if user doesn't have course
		  	if (school.serials.indexOf(Number(serial.id)) == -1)
			  	school.serials.push(Number(serial.id));

	      school.save(function(err) {
					if (err)
				    return res.send(500, { message: "School Save Error" });

			  	// return SerialJSON
					var serialJSON = JSON.stringify(serial);
			  	return res.send(serialJSON);
	      });
			})
		});
	}
  
};
