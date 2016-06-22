'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Chat Schema
 */
var ChatSchema = new Schema({
  name: {
    type: String
  },
  /* Timestamps */
  created: {
    type: Date,
    default: Date.now
  },
  /* Relational */
  users: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  messages: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }]
  }
});

mongoose.model('Chat', ChatSchema);
