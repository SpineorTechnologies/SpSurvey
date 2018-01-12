angular.module('spApp')
.factory('participantService', ['envsetting','$http', '$localStorage','$location', function( envsetting,$http, $localStorage, $location){
	
	
		var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
		//alert(serverURL);
		var configObj = {};
		
		configObj.getClientAdmin = serverURL+"/api/participants/getClientAdmin/";
	/*For Dynamic url Generation end*/
		
	return {
		getClientAdmin: function(data, success, error) {
			 var data = {participantId:$localStorage.loginDetails.participantId,clientId: $localStorage.selectedClientid};
			return $http.post(configObj.getClientAdmin, data).then(function(res){
				return res
			})
		}		
		
	};
	
}
]);