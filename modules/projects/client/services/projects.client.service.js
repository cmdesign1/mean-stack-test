(function () {
  'use strict';

  angular
    .module('projects.services')
    .factory('ProjectsService', ProjectsService);

  ProjectsService.$inject = ['$resource'];

  function ProjectsService($resource) {
    return $resource('api/projects/:projectId', {
      projectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
