'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
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
  /* Accepting Applications? */
  rolesOpen: {
    type: Boolean
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
  projects: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Project'
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
  /* Open? */
  open: {
    type: Boolean
  }
});

mongoose.model('Team', TeamSchema);
