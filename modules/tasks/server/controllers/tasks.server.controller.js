'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  Task = mongoose.model('Task'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a task
 */
exports.create = function (req, res) {
  var task = new Task(req.body);
  task.owner = req.user;
  task.author = req.user;

  task.save(function (err) {
    if (err) {
      return res.status(400).send({
        task: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
};

/**
 * Show the current task
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var task = (req.task) ? req.task.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  task.isCurrentUserAdmin = !!(req.user && task.author && req.user._id.toString() === task.author.toString());

  res.json(task);
};

/**
 * Update a task
 */
exports.update = function (req, res) {
  var task = req.task;

  task.body = req.body.body;
  task.links = req.body.links;
  task.open = req.body.open;

  task.save(function (err) {
    if (err) {
      return res.status(400).send({
        task: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
};

/**
 * Delete a task
 */
exports.delete = function (req, res) {
  var task = req.task;

  task.remove(function (err) {
    if (err) {
      return res.status(400).send({
        task: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
};

/**
 * List of task
 */
exports.list = function (req, res) {
  Task.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, tasks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tasks);
    }
  });
};

/**
 * Task middleware
 */
exports.taskByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send({
      message: 'Task ID does not exist.'
    });
  }

  obj.populate('user', 'displayName').exec(function (err, task) {
    if (err) {
      return next(err);
    } else if (!task) {
      return res.status(404).send({
        message: 'No task with that identifier has been found'
      });
    }
    req.task = task;
    next();
  });
};
