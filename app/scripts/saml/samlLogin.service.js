angular.module('spApp')
.factory('samlLoginService', ['envsetting','$http', '$localStorage','$location', function( envsetting,$http, $localStorage, $location){
	
	
		var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
		//alert(serverURL);
		var configObj = {};
		configObj.sigin = serverURL+"/api/saml/signin/";
		configObj.authenticate = serverURL+"/api/saml/authenticate/";
		configObj.sendEmail = serverURL+"/api/email/sendemail/";
		configObj.updatepassword = serverURL+"/api/saml/update/";
		configObj.getallIndystryType = serverURL+"/api/customers/getallindystrytype/";
		configObj.getClientLogo = serverURL+"/api/editClient/getClientLogo/";
		configObj.getClientInfo = serverURL+"/api/editClient/getClientInfo/";
		configObj.getMetadata = serverURL+"/api/editClient/getMetadata/";
		configObj.getParticipantsInfo = serverURL+"/api/myProfile/getParticipantsInfo/";					
		configObj.getProfileImage = serverURL+"/api/myProfile/getProfileImage/";	
		configObj.getallIndystryType = serverURL+"/api/customers/getallindystrytype/";
		configObj.getallCustomers = serverURL+"/api/customers/getallcustomers/";
	/*For Dynamic url Generation end*/
		var clientInfo = '';
		var clientImg ='';
		var profileInfo='';
		var profileImg='';
		var customerList=[];
		var industryTypeList=[];
		var metaDataConstant='';

		
	function changeUser(user) {
		angular.extend(currentUser, user);
	}

	function urlBase64Decode(str) {
		var output = str.replace('-', '+').replace('_', '/');
		switch (output.length % 4) {
		case 0:
			break;
		case 2:
			output += '==';
			break;
		case 3:
			output += '=';
			break;
		default:
			throw 'Illegal base64url string!';
		}
		return window.atob(output);
	}

	function getUserFromToken() {
		var token = $localStorage.token;
		var user = {};
		if (typeof token !== 'undefined') {
			var encoded = token.split('.')[1];
			user = JSON.parse(urlBase64Decode(encoded));
			$localStorage.user = user;
		}
		return user;
	}

	var currentUser = getUserFromToken();

	return {
		save: function(data, success, error) {
			$http.post(configObj.sigin, data).then(success,error)
		},
		signin: function(data, success, error) {
					$http.post(configObj.authenticate, data).then(success,error)
		},
		sendEmail:function(data,success,error){
			$http.post(configObj.sendEmail, data).then(success,error)
		},
		logout: function(success) {
			changeUser({});
			//delete $localStorage.token;
			document.cookie = "_instance=false";
			$localStorage.$reset();
			success();
		},
		update: function(data, success, error){
			$http.post(configObj.updatepassword, data).then(success,error)
		},
		getUser:function(success){
			success();
		},
		getClientInfo:function(data,success,error){
			$http.post(configObj.getClientInfo, data).then(success,error)
		},
		getClientImg:function(data,success,error){
			$http.post(configObj.getClientLogo, data).then(success,error)
		},
		getProfileInfo:function(data,success,error){
			$http.post(configObj.getParticipantsInfo, data).then(success,error)
		},
		getProfileImg:function(data,success,error){
			$http.post(configObj.getProfileImage, data).then(success,error)
		},
		getIndustryType:function(data,success,error){
			$http.post(configObj.getallIndystryType, data).then(success,error)
			
		},getMetadata:function(data,success,error){
			$http.post(configObj.getMetadata, data).then(success,error)
		},
		getAllcustomers:function(data,success,error){
			$http.post(configObj.getallCustomers, data).then(success,error)
			
		},getClientDetails:function(){
			return clientInfo;
		},getprofileDetails:function(){
			return profileInfo;
		},getprofileImgDetails:function(){
			return profileImg;
		},getIndustryList:function(){
			return industryTypeList;
		},getmetaDataConstant:function(){
			return metaDataConstant;
		},setMetadataConstant: function(value) {
			metaDataConstant = value;
		},
		setclientInfo: function(value) {
			clientInfo = value;
        },setClientImg: function(value) {
        	clientImg = value;
        },setProfileInfo: function(value) {
        	profileInfo = value;
        },setProfileImg: function(value) {
        	profileImg = value;
        },setIndustryType: function(value) {
        	industryTypeList = value;
        },setAllcustomers: function(value) {
        	customerList = value;
        }
		
	};
	
}
]);