'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bulletin Schema
 */
var BulletinSchema = new Schema({
  type: {
    type: String
  }
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
  title: {
    body: {
      type: String,
      default: ''
    },
  },
  body: {
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

mongoose.model('Bulletin', BulletinSchema);
