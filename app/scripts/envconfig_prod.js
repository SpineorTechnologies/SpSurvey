'use strict';
angular.module('spApp')
.constant('envsetting', {
  client: {
    "protocol": "https",
    "ip": "peopleelement.net",
    "port": "443",
    "serverUrl": "https://server.peopleelement.net:443",
    "clientUrl": "https://peopleelement.net/app",
    "contextPath":"/app"
  },
  server: {
    "protocol": "https",
    "ip": "server.peopleelement.net",
    "port": "443",
    "url": "https://server.peopleelement.net:443/"
  }
});
