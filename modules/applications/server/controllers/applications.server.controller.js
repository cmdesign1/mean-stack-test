'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  Application = mongoose.model('Application'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a application
 */
exports.create = function (req, res) {
  var application = new Application(req.body);
  application.owner = req.project || req.team;
  application.author = req.user;

  application.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(application);
    }
  });
};

/**
 * Show the current application
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var application = (req.application) ? req.application.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  application.isCurrentUserAdmin = !!(req.user && application.author && req.user._id.toString() === application.author.toString());

  res.json(application);
};

/**
 * Update a application
 */
exports.update = function (req, res) {
  var application = req.application;

  application.body = req.body.body;
  application.links = req.body.links;
  application.open = req.body.open;

  application.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(application);
    }
  });
};

/**
 * Delete a application
 */
exports.delete = function (req, res) {
  var application = req.application;

  application.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(application);
    }
  });
};

/**
 * List of applications
 */
exports.list = function (req, res) {
  Application.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, applications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(applications);
    }
  });
};

/**
 * Application middleware
 */
exports.applicationByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send({
      message: 'Application ID does not exist.'
    });
  }

  obj.populate('user', 'displayName').exec(function (err, application) {
    if (err) {
      return next(err);
    } else if (!application) {
      return res.status(404).send({
        message: 'No application with that identifier has been found'
      });
    }
    req.application = application;
    next();
  });
};
