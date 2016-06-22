'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Application Schema
 */
var ApplicationSchema = new Schema({
  owner: {
    type: [{
      type: Schema.Types.ObjectId
    }]
  },
  author: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  /* Content */
  body: {
    type: String,
    default: ''
  },
  links: {
    type: [{
      type: String,
      trim: true
    }]
  },
  /* Timestamps */
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* Open? */
  open: {
    type: Boolean
  }
});

mongoose.model('Application', ApplicationSchema);
