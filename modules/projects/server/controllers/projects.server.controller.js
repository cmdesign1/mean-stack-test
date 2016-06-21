'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a project
 */
exports.create = function (req, res) {
  var project = new Project(req.body);
  project.createdBy = req.user;
  project.admins.push(req.user);
  project.members.push(req.user);

  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};

/**
 * Show the current project
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var project = (req.project) ? req.project.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  project.isCurrentUserAdmin = !!(req.user && project.admins && _.includes(project.admins, req.user._id.toString()));

  res.json(project);
};

/**
 * Update a project
 */
exports.update = function (req, res) {
  var project = req.project;

  project.name = req.body.name;
  project.type = req.body.type;
  projects.tags = req.body.tags;
  project.profileImageURL = req.body.profileImageURL;
  project.bannerImageURL = req.body.bannerImageURL;
  projects.status = req.body.status;
  project.desc = req.body.desc;
  project.customURL = req.body.customURL;
  project.googleURL = req.body.googleURL;
  project.twitterURL = req.body.twitterURL;
  project.facebookURL = req.body.facebookURL;
  project.linkedinURL = req.body.linkedinURL;
  project.githubURL = req.body.githubURL;
  project.openRoles = req.body.openRoles;
  project.open = req.body.open;

  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};

/**
 * Delete a project
 */
exports.delete = function (req, res) {
  var project = req.project;

  project.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};

/**
 * List of projects
 */
exports.list = function (req, res) {
  Project.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, projects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(projects);
    }
  });
};

/**
 * project middleware
 */
exports.projectByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    obj = Project.findOne({ customURL: param });
  } else {
    obj = Project.findById(param);
  }

  obj.populate('createdBy', 'displayName').exec(function (err, project) {
    if (err) {
      return next(err);
    } else if (!project) {
      return res.status(404).send({
        message: 'No project with that identifier has been found'
      });
    }
    req.project = project;
    next();
  });
};
