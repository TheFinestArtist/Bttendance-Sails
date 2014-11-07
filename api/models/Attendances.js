/**
 * Attendances.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var Moment = require('moment');

module.exports = {

	attributes: {

    type: {
      type: 'string',
      enum: ['auto', 'alarm'],
      required: true
    },

    checked_students: {
      type: 'json',
      defaultsTo: new Array()
    },

    late_students: {
      type: 'json',
      defaultsTo: new Array()
    },

		clusters: {
			type: 'json',
      defaultsTo: new Array()
		},

		post: {
			model: 'Posts',
      index: true
		},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.clusters;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.clusters = this.clusters;
      return obj;
    }
	},

  afterCreate: function(values, next) {

    for (var i =  1; i <= 60; i++) {
      setTimeout(function() { 
    
        Attendances
        .findOneById(values.id)
        .populateAll()
        .exec(function callback(err, attendance) {
          if (attendance && attendance.post && attendance.post.course)
            sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
        });

      }, i * 1000);
    };

    next();
  },

  afterUpdate: function(values, next) {
    
    var createdAt = Moment(values.createdAt);
    var diff = Moment().diff(createdAt);
    if (diff >= 60 * 1000)
      Attendances
      .findOneById(values.id)
      .populateAll()
      .exec(function callback(err, attendance) {
        if (attendance && attendance.post && attendance.post.course)
          sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
      });
    
    next();
  }

};
