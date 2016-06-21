'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * BlogPost Schema
 */
var BlogPostSchema = new Schema({
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
  bannerImageURL: {
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
  },
  /* Relational */
  messages: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }]
  }
});

mongoose.model('BlogPost', BlogPostSchema);
