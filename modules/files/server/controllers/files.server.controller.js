'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  File = mongoose.model('File'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a file
 */
exports.create = function (req, res) {
  var file = new File(req.body);
  file.owner = req.user;
  file.author = req.user;

  file.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(file);
    }
  });
};

/**
 * Show the current file
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var file = (req.file) ? req.file.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  file.isCurrentUserAdmin = !!(req.user && file.author && req.user._id.toString() === file.author.toString());

  res.json(file);
};

/**
 * Update a file
 */
exports.update = function (req, res) {
  var file = req.file;

  file.body = req.body.body;
  file.links = req.body.links;
  file.open = req.body.open;

  file.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(file);
    }
  });
};

/**
 * Delete a file
 */
exports.delete = function (req, res) {
  var file = req.file;

  file.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(file);
    }
  });
};

/**
 * List of file
 */
exports.list = function (req, res) {
  File.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, files) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(files);
    }
  });
};

/**
 * File middleware
 */
exports.fileByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send({
      message: 'File ID does not exist.'
    });
  }

  obj.populate('user', 'displayName').exec(function (err, file) {
    if (err) {
      return next(err);
    } else if (!file) {
      return res.status(404).send({
        message: 'No file with that identifier has been found'
      });
    }
    req.file = file;
    next();
  });
};
