'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  Chat = mongoose.model('Chat'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a chat
 */
exports.create = function (req, res) {
  var chat = new Chat(req.body);
  chat.owner = req.user;
  chat.author = req.user;

  chat.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chat);
    }
  });
};

/**
 * Show the current chat
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var chat = (req.chat) ? req.chat.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  chat.isCurrentUserAdmin = !!(req.user && chat.author && req.user._id.toString() === chat.author.toString());

  res.json(chat);
};

/**
 * Update a chat
 */
exports.update = function (req, res) {
  var chat = req.chat;

  chat.body = req.body.body;
  chat.links = req.body.links;
  chat.open = req.body.open;

  chat.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chat);
    }
  });
};

/**
 * Delete a chat
 */
exports.delete = function (req, res) {
  var chat = req.chat;

  chat.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chat);
    }
  });
};

/**
 * List of chat
 */
exports.list = function (req, res) {
  Chat.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, chats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chats);
    }
  });
};

/**
 * Chat middleware
 */
exports.chatByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send({
      message: 'Chat ID does not exist.'
    });
  }

  obj.populate('user', 'displayName').exec(function (err, chat) {
    if (err) {
      return next(err);
    } else if (!chat) {
      return res.status(404).send({
        message: 'No chat with that identifier has been found'
      });
    }
    req.chat = chat;
    next();
  });
};
