/**
 * http://usejsdoc.org/
 */''
angular.module('spApp')
.controller('myProfileController',['envsetting','$scope','$location','Upload','$http','$rootScope','$localStorage','md5','loginService','Flash', function(envsetting,$scope, $location, Upload, $http,$rootScope,$localStorage,md5,loginService,Flash){
	/*$rootScope.myprofilePic = {
			dataUrl: '/images/profile.jpg'
	};*/
	
	var encryptedCurrentPwd = '';
	var encryptedNewPwd = '';
//	for Encrypt the passwod into md5 format
	$scope.$watch('currentPwd' ,function() {
		if($scope.currentPwd){
			var currPwd = $scope.currentPwd;
			if(currPwd.trim().length>0){
				encryptedCurrentPwd = md5.createHash($scope.currentPwd || ''); 
			}
		}
	});
	$scope.$watch('newPwd' ,function() {
		if($scope.newPwd){
			var newPwd = $scope.newPwd;
			if(newPwd.trim().length>0){
				encryptedNewPwd = md5.createHash($scope.newPwd || '');
			}
		}
	});

	
	var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	//alert(serverURL);
	$scope.configObj = {};
	$scope.configObj.upload = serverURL+"/api/myProfile/";
	$scope.configObj.loadData = serverURL+"/api/myProfile/loadData/";					
	$scope.configObj.getParticipantsInfo = serverURL+"/api/myProfile/getParticipantsInfo/";					
	$scope.configObj.getProfileImage = serverURL+"/api/myProfile/getProfileImage/";					
	$scope.configObj.validateCurrentPwd = serverURL+"/api/myProfile/validateCurrentPwd/";					
	$scope.configObj.updateProfileImage = serverURL+"/api/myProfile/updateProfileImage/";
					
	/*For Dynamic url Generation end*/
	var myprofileImgId = '';
	var previousImgId = '';
	var oldImgId = '';
	$scope.getParticipantDetails = function(){
		myprofileImgId = '';
		previousImgId = '';
		var profDetails = loginService.getprofileDetails();
		$scope.firstName = profDetails.firstName;
		$scope.lastName = profDetails.lastName;
		$scope.emailId = profDetails.email;
		if(loginService.getprofileImgDetails().data){
			$rootScope.myprofilePic .dataUrl =loginService.getprofileImgDetails().data;
		}
		previousImgId =profDetails.profileImgId; 
	}

	/*$rootScope.$on('participantChangeEvent', function (event, data) {
		console.log('participantChangeEvent',data);
		if(data){
			$scope.getParticipantDetails(data);
		}
	});	*/
	if($localStorage.loginDetails && $localStorage.loginDetails.participantId && $rootScope.admintype!='superadmin'){
		loginService.getProfileInfo(JSON.stringify({'participantId': $localStorage.loginDetails.participantId}),function(response) {
		loginService.setProfileInfo(response.data.data);
		$scope.getParticipantDetails();
		});
	}else{
		$scope.getParticipantDetails();
	}

	/*$rootScope.$on('clientChangeEvent', function (event, data) {
		$scope.getParticipantDetails();
	});*/	

	/*$scope.getProfileImg=function(profileImageId ){

		if(profileImageId){
			$http({
				method: 'POST',
				url: $scope.configObj.getProfileImage,
				data:JSON.stringify({'profileImageId':profileImageId}),
			}).then(function successCallback(response) {
				//console.log('get Image',response);
				$scope.myprofilePic .dataUrl =response.data+""

				// this callback will be called asynchronously
				// when the response is available
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}else{
			$scope.myprofilePic.dataUrl ='/images/profile.jpg';
		}
	}*/

	$scope.uploadFile = function($file) {
		$('.loader').show();
		Upload.upload({
			url: $scope.configObj.upload,
			data: {file: $file}
		})
		.then(function (resp) {
			$('.loader').hide();
			if(previousImgId && myprofileImgId == previousImgId){
				oldImgId = previousImgId;
			}
			myprofileImgId = resp.data.substr(resp.data.lastIndexOf('&') + 1);
			var resultImg = resp.data.substr(0,resp.data.lastIndexOf('&'));
			$rootScope.myprofilePic.dataUrl =resultImg+"";
			console.log('Success ' +  'uploaded. Response: ');
		}, function (resp) {
			$('.loader').hide();
			console.log('Error status: ' + resp.status);
		}, function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		});
	};

	$scope.validateCurrentPwd = function() {
		if(encryptedCurrentPwd){
				
			var valdateData='';
			if($rootScope.admintype=='superadmin'){
				valdateData= {
						_id:$localStorage.loginDetails.clientId,
						password:encryptedCurrentPwd,
						adminType:$rootScope.admintype
				}
			}else{
				valdateData= {
						_id:$localStorage.loginDetails.participantId,
						password:encryptedCurrentPwd,
				}
			}
			$http({
				method: 'POST',
				url: $scope.configObj.validateCurrentPwd,
				data:valdateData
			}).then(function successCallback(response) {
				if($scope.currentPwd && !(response.data.type)){
					$scope.validatePwd=true;
				}else{
					$scope.validatePwd=false;
				}
				//console.log('validateCurrentPwd Res',response);
				// this callback will be called asynchronously
				// when the response is available
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}
	}
	$scope.profileUpdate = function(isValid) {
		var data = '';
		var updateId='';
		$scope.submitted =true;


		if(isValid && !($scope.validatePwd))
		{
			updateId=$localStorage.loginDetails.participantId;
					
			/*if($rootScope.admintype=='superadmin'){
			}else{
				updateId=$localStorage.loginDetails.participantId;				
			}*/
			if($scope.myCroppedImage!="") {
		var data = {
					profileId:updateId,
					profileLogo: $scope.myCroppedImage
					}
			$http({
				method: 'POST',
				url: $scope.configObj.updateProfileImage,
				data:data
			}).then(function successCallback(response) { console.log(response);
				if(response.data.ok==1) { 
					// if($rootScope.admintype=='superadmin'){
					// $rootScope.myprofilePic.dataUrl = $scope.myCroppedImage;
					// }
					$rootScope.myprofilePic.dataUrl = $scope.myCroppedImage;
					loginService.setProfileImg($scope.myCroppedImage);
					$scope.cropShow = false;
				}	
			});
		}
			/*if($rootScope.admintype=='superadmin'){
				updateId=$localStorage.loginDetails.participantId;
			}else{
				updateId=$localStorage.loginDetails.participantId;
				
			}*/
			
			if(encryptedCurrentPwd.length>0 && encryptedNewPwd.length>0)
			{
				if($scope.emailId!='sp@ix.com'){
					$rootScope.admintype = ' '
				}
				data = {
						_id:updateId,
						firstname: $scope.firstName,
						lastname: $scope.lastName,
						email: $scope.emailId,
						password:encryptedNewPwd,
						profimgId:myprofileImgId,
						previousImgid:oldImgId,
						adminType:$rootScope.admintype
				};
			}
			else{
				if($scope.emailId!='sp@ix.com'){
					$rootScope.admintype = ' '
				}
				data = {
						_id:updateId,
						firstname: $scope.firstName,
						lastname: $scope.lastName,
						email: $scope.emailId,
						profimgId:myprofileImgId,
						previousImgid:oldImgId,
						adminType:$rootScope.admintype
				};
			}
//			console.log(data);
			$http({
				method: 'POST',
				url: $scope.configObj.loadData,
				data:data
			}).then(function successCallback(response) {
				loginService.setProfileInfo(response.data.data);
				Flash.create('success','Profile Updated Successfuly', 2000, {container: 'flash-fixed-myProfile'});
							window.location = envsetting.client.contextPath+"#/participants";
							$('.loader').show();
//				console.log('Participant Update',response);
				// this callback will be called asynchronously
				// when the response is available
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}else{
			console.log('invalid data');
		}
	};

	$scope.logout = function() {
		$scope.$emit("logout");
		
	};

	$scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
	  if(file!=undefined && file!='undefined'){
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
		  $scope.cropShow=true;
        });
      };
	  reader.readAsDataURL(file);
    }
	};
    angular.element(document.querySelector('#image')).on('change',handleFileSelect);

}]);
