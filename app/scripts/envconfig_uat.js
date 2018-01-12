'use strict';
angular.module('spApp')
.constant('envsetting', {
  client: {
    "protocol": "http",
    "ip": "52.9.63.68",
    "port": "80",
    "serverUrl": "http://52.52.159.112:3010",
    "clientUrl": "http://52.9.63.68",
    "contextPath":""
  },
  server: {
    "protocol": "http",
    "ip": "52.52.159.112",
    "port": "3010",
    "url": "http://52.52.159.112:3010/"
  }
});

