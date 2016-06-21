'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
  name: {
    type: String
  },
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
  status: {
    type: String,
    enum: ['pending', 'active', 'complete']
  },
  /* Content */
  desc: {
    type: String,
    default: ''
  },
  /* Timestamps */
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Task', TaskSchema);
