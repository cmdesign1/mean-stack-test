'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  BlogPost = mongoose.model('BlogPost'),
  errorHandler = require(path.resolve('./modules/_core/server/controllers/errors.server.controller'));

/**
 * Create a blog post
 */
exports.create = function (req, res) {
  var blog = new BlogPost(req.body);
  blog.owner = req.user;
  blog.author = req.user;

  blog.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blog);
    }
  });
};

/**
 * Show the current blog post
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var blog = (req.blog) ? req.blog.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  blog.isCurrentUserAdmin = !!(req.user && blog.author && req.user._id.toString() === blog.author.toString());

  res.json(blog);
};

/**
 * Update a blog post
 */
exports.update = function (req, res) {
  var blog = req.blog;

  blog.body = req.body.body;
  blog.links = req.body.links;
  blog.open = req.body.open;

  blog.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blog);
    }
  });
};

/**
 * Delete a blog post
 */
exports.delete = function (req, res) {
  var blog = req.blog;

  blog.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blog);
    }
  });
};

/**
 * List of blog posts
 */
exports.list = function (req, res) {
  BlogPost.find().sort('-created').populate('createdBy', 'displayName').exec(function (err, blogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogs);
    }
  });
};

/**
 * Blog post middleware
 */
exports.blogByParam = function (req, res, next, param) {
  var obj;

  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send({
      message: 'Blog post ID does not exist.'
    });
  }

  obj.populate('user', 'displayName').exec(function (err, blog) {
    if (err) {
      return next(err);
    } else if (!blog) {
      return res.status(404).send({
        message: 'No blog post with that identifier has been found'
      });
    }
    req.blog = blog;
    next();
  });
};
