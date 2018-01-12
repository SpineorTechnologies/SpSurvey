'use strict';
angular.module('spApp')
.constant('envsetting', {  
 /* client: {
    "protocol": "http",
    "ip": "1.22.181.51",
    "port": "8008",
    "serverUrl": "http://192.168.1.47:3010",
    "clientUrl": "http://192.168.1.47:8008",
    "contextPath":""
  },
  server: {
    "protocol": "http",
    "ip": "192.168.1.47",
    "port": "3010",
    "url": "http://192.168.1.47:3010/"
  }*/
  client: {
    "protocol": "http",
    "ip": "1.22.181.51",
    "port": "8008",
    "serverUrl": "http://localhost:3010",
    "clientUrl": "http://localhost:8080",
    "contextPath":""
  },
  server: {
    "protocol": "http",
    "ip": "1.22.181.51",
    "port": "3010",
    "url": "http://localhost:3010"
  }
});