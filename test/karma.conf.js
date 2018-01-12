// Karma configuration
// Generated on 2017-01-18

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/angular-dragdrop/src/angular-dragdrop.js',
      'bower_components/checklist-model/checklist-model.js',
      'bower_components/ng-inline-edit/dist/ng-inline-edit.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/dragtable/jquery.dragtable.js',
      'bower_components/angular-ui-sortable/sortable.js',
      'bower_components/ng-table/dist/ng-table.min.js',
      'bower_components/angularjs-datepicker/dist/angular-datepicker.js',
      'bower_components/angular-md5/angular-md5.js',
      'bower_components/ng-tags-input/ng-tags-input.js',
      'bower_components/ng-idle/angular-idle.js',
      'bower_components/slick-carousel/slick/slick.js',
      'bower_components/angular-slick-carousel/dist/angular-slick.js',
      'bower_components/angular-flash-alert/dist/angular-flash.js',
      'bower_components/angular-jq-querybuilder/dist/AngularJqueryQueryBuilderDirective.js',
      'bower_components/file-saver/FileSaver.js',
      'bower_components/js-xlsx/dist/xlsx.core.min.js',
      'bower_components/moment/moment.js',
      'bower_components/jquery-extendext/jQuery.extendext.js',
      'bower_components/doT/doT.js',
      'bower_components/jQuery-QueryBuilder/dist/js/query-builder.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/ng-contextmenu/dist/ng-contextmenu.js',
      'bower_components/bootstrap-contextmenu/bootstrap-contextmenu.js',
      'bower_components/angular-acl/angular-acl.js',
      'bower_components/javascript-detect-element-resize/detect-element-resize.js',
      'bower_components/angular-gridster/src/angular-gridster.js',
      'bower_components/angular-fixed-table-header/src/fixed-table-header.js',
      'bower_components/mathjs/dist/math.min.js',
      'bower_components/jquery.floatThead/dist/jquery.floatThead.js',
      'bower_components/jquery.floatThead/dist/jquery.floatThead.min.js',
      'bower_components/tiny-angular-wordcloud/dist/tangCloud.js',
      'bower_components/ui-cropper/compile/minified/ui-cropper.js',
      'bower_components/bootstrap-timepicker/js/bootstrap-timepicker.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
