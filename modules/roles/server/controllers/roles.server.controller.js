'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  Role = mongoose.model('Role'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a role
 */
exports.create = function (req, res) {
  var role = new Role(req.body);
  role.owner = req.project;

  role.save(function (err) {
    if (err) {
      return res.status(400).send({
        role: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

/**
 * Show the current role
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var role = (req.role) ? req.role.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  role.isCurrentUserAdmin = !!(req.user && role.user && req.user._id.toString() === role.user.toString());

  res.json(role);
};

/**
 * Update a role
 */
exports.update = function (req, res) {
  var role = req.role;

  role.name = req.body.name;
  role.desc = req.body.desc;
  role.offer = req.body.offer;
  role.open = req.body.open;

  role.save(function (err) {
    if (err) {
      return res.status(400).send({
        role: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

/**
 * Delete a role
 */
exports.delete = function (req, res) {
  var role = req.role;

  role.remove(function (err) {
    if (err) {
      return res.status(400).send({
        role: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

/**
 * List of role
 */
exports.list = function (req, res) {
  Role.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, roles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(roles);
    }
  });
};

/**
 * Role middleware
 */
exports.roleByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send({
      message: 'Role ID does not exist.'
    });
  }

  obj.populate('user', 'displayName').exec(function (err, role) {
    if (err) {
      return next(err);
    } else if (!role) {
      return res.status(404).send({
        message: 'No role with that identifier has been found'
      });
    }
    req.role = role;
    next();
  });
};
