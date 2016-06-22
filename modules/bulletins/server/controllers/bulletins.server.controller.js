'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bulletin = mongoose.model('Bulletin'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a bulletin
 */
exports.create = function (req, res) {
  var bulletin = new Bulletin(req.body);
  bulletin.owner = req.project || req.team;
  bulletin.author = req.user;

  bulletin.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bulletin);
    }
  });
};

/**
 * Show the current bulletin
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var bulletin = (req.bulletin) ? req.bulletin.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  bulletin.isCurrentUserAdmin = !!(req.user && bulletin.author && req.user._id.toString() === bulletin.author.toString());

  res.json(bulletin);
};

/**
 * Update a bulletin
 */
exports.update = function (req, res) {
  var bulletin = req.bulletin;

  bulletin.type = req.body.type;
  bulletin.title = req.body.title;
  bulletin.body = req.body.body;
  bulletin.profileImageURL = req.body.profileImageURL;

  bulletin.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bulletin);
    }
  });
};

/**
 * Delete a bulletin
 */
exports.delete = function (req, res) {
  var bulletin = req.bulletin;

  bulletin.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bulletin);
    }
  });
};

/**
 * List of bulletin
 */
exports.list = function (req, res) {
  Bulletin.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, bulletins) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bulletins);
    }
  });
};

/**
 * Bulletin middleware
 */
exports.bulletinByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send({
      message: 'Bulletin post ID does not exist.'
    });
  }

  obj.populate('user', 'displayName').exec(function (err, bulletin) {
    if (err) {
      return next(err);
    } else if (!bulletin) {
      return res.status(404).send({
        message: 'No bulletin post with that identifier has been found'
      });
    }
    req.bulletin = bulletin;
    next();
  });
};
