'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a team
 */
exports.create = function (req, res) {
  var team = new Team(req.body);
  team.admins.push(req.user);
  team.members.push(req.user);

  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/**
 * Show the current team
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var team = (req.team) ? req.team.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  team.isCurrentUserAdmin = !!(req.user && team.admins && _.includes(team.admins, req.user._id.toString()));

  res.json(team);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var team = req.team;

  team.name = req.body.name;
  team.type = req.body.type;
  team.profileImageURL = req.body.profileImageURL;
  team.bannerImageURL = req.body.bannerImageURL;
  team.desc = req.body.desc;
  team.customURL = req.body.customURL;
  team.googleURL = req.body.googleURL;
  team.twitterURL = req.body.twitterURL;
  team.facebookURL = req.body.facebookURL;
  team.linkedinURL = req.body.linkedinURL;
  team.githubURL = req.body.githubURL;
  team.rolesOpen = req.body.rolesOpen;
  team.open = req.body.open;

  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var team = req.team;

  team.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Team.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};

/**
 * Article middleware
 */
exports.teamByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    obj = Team.findOne({ customURL: param });
  } else {
    obj = Team.findById(param);
  }

  obj.populate('createdBy', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!team) {
      return res.status(404).send({
        message: 'No team with that identifier has been found'
      });
    }
    req.team = team;
    next();
  });
};
