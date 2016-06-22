'use strict';

/**
 * Module dependencies
 */
var bulletinsPolicy = require('../policies/bulletins.server.policy'),
  bulletins = require('../controllers/bulletins.server.controller');

module.exports = function (app) {
  // Bulletins collection routes
  app.route('/api/bulletins').all(bulletinsPolicy.isAllowed)
    .get(bulletins.list)
    .post(bulletins.create);

  // Single bulletin routes
  app.route('/api/bulletins/:bulletinId').all(bulletinsPolicy.isAllowed)
    .get(bulletins.read)
    .put(bulletins.update)
    .delete(bulletins.delete);

  // Finish by binding the bulletin middleware
  app.param('bulletinId', bulletins.bulletinByParam);
};
