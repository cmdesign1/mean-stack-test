'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  tags: {
    type: [{
      type: String,
      trim: true
    }]
  },
  /* Profile */
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  bannerImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  status: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  customURL: {
    type: String,
    default: '',
    trim: true
  },
  /* Timestamps */
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* Social */
  googleURL: {
    type: String,
    default: '',
    trim: true
  },
  twitterURL: {
    type: String,
    default: '',
    trim: true
  },
  facebookURL: {
    type: String,
    default: '',
    trim: true
  },
  linkedinURL: {
    type: String,
    default: '',
    trim: true
  },
  githubURL: {
    type: String,
    default: '',
    trim: true
  },
  /* Administrators */
  createdBy: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  admins: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  /* Relational */
  members: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  openRoles: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }]
  },
  tasks: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }]
  },
  bulletins: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Bulletin'
    }]
  },
  applications: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Application'
    }]
  },
  blogPosts: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'BlogPost'
    }]
  },
  files: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'File'
    }]
  },
  /* Open? */
  open: {
    type: Boolean
  }
});

mongoose.model('Project', ProjectSchema);
