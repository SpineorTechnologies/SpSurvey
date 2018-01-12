  'use strict';

/**
 * @ngdoc overview
 * @name spApp
 * @description
 * # spApp
 *
 * Main module of the application.
 */
/*
angular
  .module('spApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.grid.pagination',
    'angularInlineEdit'
  ])
*/

var spApp=angular.module('spApp', ['ngRoute','ngStorage','ngDragDrop','ui.bootstrap','checklist-model','angularInlineEdit']);

  /*
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
*/
