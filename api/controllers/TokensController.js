/**
 * TokensController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var QueryString = require('querystring');
var Arrays = require('../utils/arrays');
var Noti = require('../utils/notifications');
var Random = require('../utils/random');

module.exports = {

	verify: function(req, res) {
		var key = req.param('token_key');
		Tokens
		.findOneByKey(key)
		.exec(function callback(err, token) {
			if (err || !token || token.expired)
				return res.redirect('http://www.bttendance.com/verification-failed');

			if (token.action == 'createCourse') {

				token.expired = true;
				token.save();

				var params = QueryString.parse(token.params);
				return employSchool(params, res);
			} else
				return res.redirect('http://www.bttendance.com/verification-failed');
		});
	}

};

var employSchool = function(params, res) {

	var username = params['username'];
	var name = params['name'];
	var number = params['number'];
	var school_id = params['school_id'];
	var professor_name = params['professor_name'];

	Users
	.findOneByUsername(username)
	.populateAll()
	.exec(function callback(err, user) {
		if (err || !user)
			return res.redirect('http://www.bttendance.com/verification-failed');

	  var employed_schools = Arrays.getIds(user.employed_schools);
	  if (employed_schools.indexOf(Number(school_id)) == -1)
	    user.employed_schools.add(school_id);

		user.save(function callback(err) {
			if (err)
				return res.redirect('http://www.bttendance.com/verification-failed');
	  	return createCourse(params, res);
		});
	});
}

var createCourse = function(params, res) {

	var username = params['username'];
	var name = params['name'];
	var number = params['number'];
	var school_id = params['school_id'];
	var professor_name = params['professor_name'];

  var code = Random.string(4);
	Courses.create({
		name: name,
		number: number,
		school: school_id,
		professor_name: professor_name,
		code: code
	}).exec(function callback(err, course) {
		if (err || !course) 
			return res.redirect('http://www.bttendance.com/verification-failed');

		Users
		.findOneByUsername(username)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user) 
				return res.redirect('http://www.bttendance.com/verification-failed');

			user.supervising_courses.add(course.id);
			user.save(function callback(err) {
				if (err) 
					return res.redirect('http://www.bttendance.com/verification-failed');

				Noti.send(user, "Bttendance", "Your course has been created", "course_created", course.id);
				return res.redirect('http://www.bttendance.com/course-created');
			});
		});
	});
}