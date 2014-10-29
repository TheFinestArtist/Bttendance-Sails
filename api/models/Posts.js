/**
 * Posts
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    type: {
      type: 'string',
      enum: ['attendance', 'notice', 'clicker', 'curious'],
      required: true
    },

  	message: {
  		type: 'string'
  	},

    // One Way
    author: {
    	model: 'Users',
      index: true
    },

    // One to Many
    course: {
    	model: 'Courses',
      index: true
    },

    // One to One
    attendance: {
      model: 'Attendances',
      index: true
    },

    // One to One
    clicker: {
      model: 'Clickers',
      index: true
    },

    // One to One
    notice: {
      model: 'Notices',
      index: true
    },

    // One to One
    curious: {
      model: 'Curiouses',
      index: true
    },

    seen_students: {
      type: 'json',
      defaultsTo: new Array()
    },

    seen_managers: {
      type: 'json',
      defaultsTo: new Array()
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.attendance;
      delete obj.clicker;
      delete obj.notice;
      delete obj.curious;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.attendance = this.attendance;
      obj.clicker = this.clicker;
      obj.notice = this.notice;
      obj.curious = this.curious;
      return obj;
    }
  },

  beforeCreate: function(values, next) {

    if (values.type == 'attendance') {
      values.message = 'Attendance';

      var clusters = new Array();
      var prof = new Array();
      prof.push(values.author);
      clusters.push(prof);

      Attendances
      .create({
        clusters: clusters,
        type: values.attendance_type
      }).exec(function callback(err, attendance) {
        if (err || !attendance)
          next(err);
        else {
          values.attendance = attendance.id;
          next();
        }
      });
    } else if (values.type == 'clicker') {
      Clickers
      .create({
        choice_count: Number(values.choice_count),
        progress_time: Number(values.progress_time),
        show_info_on_select: values.show_info_on_select,
        detail_privacy: values.detail_privacy,
      }).exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        else {
          values.clicker = clicker.id;
          next();
        }
      });
    } else if (values.type == 'notice') {
      Notices
      .create({
      }).exec(function callback(err, notice) {
        if (err || !notice)
          next(err);
        else {
          values.notice = notice.id;
          next();
        }
      });
    } else if (values.type == 'curious') {
      Curiouses
      .create({
      }).exec(function callback(err, curious) {
        if (err || !curious)
          next(err);
        else {
          values.curious = curious.id;
          next();
        }
      });
    } else
      next();
  },

  afterCreate: function(values, next) {
    if (values.type == 'attendance') {
      Attendances
      .update({id: values.attendance}, {post: values.id})
      .exec(function callback(err, attendance) {
        if (err || !attendance)
          next(err);
        else
          next();
      });
    } else if (values.type == 'clicker') {
      Clickers
      .update({id: values.clicker}, {post: values.id})
      .exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        else
          next();
      });
    } else if (values.type == 'notice') {
      Notices
      .update({id: values.notice}, {post: values.id})
      .exec(function callback(err, notice) {
        if (err || !notice)
          next(err);
        else
          next();
      });
    } else if (values.type == 'curious') {
      Curiouses
      .update({id: values.curious}, {post: values.id})
      .exec(function callback(err, curious) {
        if (err || !curious)
          next(err);
        else
          next();
      });
    } else
      next();
  },

  afterUpdate: function(values, next) {
    
    Posts
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, post) {
      if (post && post.course) 
        sails.sockets.broadcast('Course#' + post.course.id, 'post', post.toWholeObject());
    });

    next();
  }

};
