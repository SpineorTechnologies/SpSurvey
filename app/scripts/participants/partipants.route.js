spApp.config(function ($stateProvider) {
  $stateProvider.state('participants', {
    resolve: {
      // fetching the meta data
      httpMetaData: function ($http, $localStorage, $location, envsetting, $rootScope,envsetting) {
        var vm = this;
//        console.log($localStorage.selectedClientid);
//        console.log("envsetting", envsetting);
        var serverURL = envsetting.client.serverUrl;//$location.protocol() + '://' + $location.host() + ':3010';
        return $http({
          method: 'POST',
          url: serverURL + '/api/metadata/getMetadatByClientId',
          data: {clientId: $localStorage.selectedClientid}
        })
          .then(function (data) {
//            console.log("data.data.metaData");
//            console.dir(data.data);
//            console.log("$localStorage");
//            console.dir($localStorage);
            return data;
          });
      }, 'acl': ['$q', 'AclService', function ($q, AclService) {
        if (AclService.can('participants_tab')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }],
      getAssignSurveyData: function ($http, $localStorage, $location, envsetting, $rootScope) {
        var vm = this;
//        console.log($localStorage.selectedClientid);
//        console.log("envsetting", envsetting);
        var serverURL = envsetting.client.serverUrl;//$location.protocol() + '://' + $location.host() + ':3010';
        return $http({
          method: 'POST',
          url: serverURL + "/api/surveys/loadCustomerSurveys/",
          data: {clientId: $localStorage.selectedClientid}
        })
          .then(function (data) {
//            console.log("getCustomerSurveysData", data.data);
            return data;
          });
      }
    },
    url: '/participants',
    templateUrl: 'scripts/participants/participants.html',
    controller: 'ParticipantsCtrl'
  });
});
