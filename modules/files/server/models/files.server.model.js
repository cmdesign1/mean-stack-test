'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * File Schema
 */
var FileSchema = new Schema({
  name: {
    type: String
  },
  type: {
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
  /* Content */
  desc: {
    type: String,
    default: ''
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  /* Timestamps */
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* Relational */
  messages: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }]
  }
});

mongoose.model('File', FileSchema);
