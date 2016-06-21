'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Role Schema
 */
var RoleSchema = new Schema({
  name: {
    type: String
  },
  owner: {
    type: [{
      type: Schema.Types.ObjectId
    }]
  },
  user: {
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
  offer: {
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
  ended: {
    typ: Date,
  },
  /* Relational */
  applications: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Application'
    }]
  },
  /* Open? */
  open: {
    type: Boolean
  }
});

mongoose.model('Role', RoleSchema);
