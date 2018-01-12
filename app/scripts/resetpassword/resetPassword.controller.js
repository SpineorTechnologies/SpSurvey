'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:buildSurveyController
 * @description
 * # buildSurveyController
 * Controller of the spApp
 */

angular.module('spApp')
.controller('resetPassWordController',['envsetting','$rootScope','$scope','md5','loginService','$localStorage','$location','$http','AclService',function(envsetting,$rootScope,$scope,md5,loginService,$localStorage,$location,$http,AclService){



	var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';

	$scope.configObj = {};
	$scope.configObj.validateLink = serverURL+"/api/login/validateLink/";
	
	var validateLinkData = {
			'_id':$rootScope.customerId,
			'usertoken':$rootScope.userToken
	}
	$scope.routedata = {
			superadmin: ['dashboard','edit_client', 'add_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab'],
			clientadmin:['dashboard','edit_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab'],
			design: ['my_survey', 'build_survey', 'edit_client', 'my_profile'],
			users: ['participants_tab', 'my_profile'],
			report: ['dashboard'],
			actionplanning: ['dashboard']
	}
	$scope.allvalues=[];

	var newPassword ='';
	var conforimPassword ='';

	$scope.$watch('newpassword' ,function() {
		if($scope.newpassword){
			newPassword =  md5.createHash($scope.newpassword||'');
		}
	});
	$scope.$watch('confirmpassword' ,function() {
		if($scope.confirmpassword){
			conforimPassword =  md5.createHash($scope.confirmpassword||'');
		}
	});

	if(validateLinkData.usertoken && validateLinkData._id){
		$http({
			method: 'POST',
			url: $scope.configObj.validateLink,
			data:JSON.stringify(validateLinkData)
		}).then(function successCallback(response) {
//			console.log('response',response.data.type);
			if(response.data.type)
			{
				delete $rootScope.admintype;
				loginService.logout(function() {
					}, function() {
						console.log("Failed to logout!");
				});
			}
			else{

				$('#resetlinkExpiredmodal').modal('show');

			}
			// this callback will be called asynchronously
			// when the response is available
		}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}

	//function to rest the password for the appropriate user in the mongodb and allow the user to login into the application
	$scope.resetPassword = function(isValid){
		if(isValid){
			var custId= $rootScope.customerId;
			if(newPassword==conforimPassword)
			{

				var updatedData = {
						'password': conforimPassword,
						'usertoken':(new Date().getTime()).toString(),
						'_id':custId
				}
				loginService. update(updatedData, function(res) {
					document.cookie = "_instance=true";
					if (res.data.type == false) {

					} else {
					//console.log(JSON.parse(JSON.stringify(res)));
						var resData = JSON.parse(JSON.stringify(res.data));
						$localStorage.loginResult={data:resData};
						$localStorage.selectedClientname =  res.data.data.clientName;
						$("body").removeClass("login_bg");
						var loginDetails =JSON.parse(JSON.stringify(res.data.data));
						$localStorage.loginDetails = loginDetails;
						var outQurery ="";
						if(res.data.data.dlaQuery){
							var str = JSON.parse(res.data.data.dlaQuery);
							outQurery= JSON.stringify(str).replace("/$and", "$and").replace("/$or", "$or");
							var participantQuery ='{"/$or":[{"access":{"$gt": []}},'+res.data.data.dlaQuery+']}';
							participantQuery = JSON.parse(participantQuery)//JSON.stringify(participantQuery).replace("/$and", "$and").replace("/$or", "$or");
//							console.log("$localStorage.participantsDlaQuery ",participantQuery);
							participantQuery = JSON.stringify(participantQuery).replace("/$and", "$and").replace("/$or", "$or");
//							console.log("****",participantQuery,"*****");
							$localStorage.loginDetails.dlaQuery = JSON.parse(outQurery);
							try{
								$localStorage.participantsDlaQuery = JSON.parse(participantQuery);
							}
							catch(e){
									console.log("json Parse Error");
									$localStorage.participantsDlaQuery = "";
								}
						}
						$localStorage.metaDataConstant =loginService.getmetaDataConstant();
						$localStorage.token = res.data.token;
						//window.location = envsetting.client.contextPath+"/#/mySurvey";
						$location.path("/index.html");
						var clientImg = res.data.clientImageid;
						var clientId = res.data.clientId;
						$rootScope.clientPic = {
								dataUrl: ''
						}; 
						if(res.data.data.admin){
							$rootScope.admintype=res.data.data.admin;

						}else{
							$rootScope.admintype="";
						}
						$rootScope.userRoles=res.data.data.access;
						$scope.clientadmin=$rootScope.userRoles;

						angular.forEach($scope.clientadmin, function(value, key) {
							angular.forEach($scope.routedata, function(value1, key1){
								if (value.toLowerCase().replace(/\s/g, '')==key1) {
									for (var i = 0; i < value1.length; i++) {
										$scope.allvalues.push(value1[i])
									}
								}
							})
						});
						$scope.uniquevalues = $scope.allvalues.filter(function(elem, index, self) {
							return index == self.indexOf(elem);
						})

						$scope.aclData={
//							superadmin: ['edit_client', 'add_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab'],
							clientadmin:$scope.uniquevalues
						}
//						console.log($scope.aclData)
						AclService.setAbilities($scope.aclData);
						AclService.attachRole('clientadmin');
						$rootScope.selectedCustomer = res.data.clientName;
						//console.log(JSON.stringify($rootScope.userRoles),"$rootScope.userRoles");
						//$scope.getlogo(res.data.data.imageid);
						if(res.data.data.clientId)
						{
							$localStorage.selectedClientid =res.data.data.clientId;
							$scope.getDetails($localStorage.selectedClientid,false);
							//console.log($localStorage.selectedClientid);
						}

						if($rootScope.admintype)
						{
							$localStorage.role = $rootScope.admintype;
						}
						if($rootScope.userRoles)
						{
							$localStorage.role =$rootScope.userRoles;
						}

						if($rootScope.admintype=='clientadmin'){
							$rootScope.showAddclient = false;
							$scope.callerAdmin = true;
							$rootScope.customerSelection = true;
							$rootScope.showMysurvey = true;
							$rootScope.showParticipants=true;
							$rootScope.showAnalysis=true;
							$rootScope.showReports=true;
							window.location = envsetting.client.contextPath+"/#/mySurvey";
							$rootScope.selectedCustomer = res.data.data.clientName;
							//crAcl.setRole("ROLE_CLIENTADMIN");

						}
						else{
							$rootScope.showAddclient = false;
							$rootScope.customerSelection = true;
							$scope.callerAdmin = true;
							if($rootScope.userRoles.indexOf('Design')!== -1)
							{
								window.location = envsetting.client.contextPath+"/#/mySurvey";
							}
							else if($rootScope.userRoles.indexOf('Users')!== -1 ){
								window.location = envsetting.client.contextPath+"/#/participants";
							}
							else if($rootScope.userRoles.indexOf('Analyze')!== -1){
								//crAcl.setRole("Analyze");
								window.location = envsetting.client.contextPath+"/#/analysis";
							}
							else if($rootScope.userRoles.indexOf('Report')!== -1){
								//crAcl.setRole("Analyze");
								window.location = envsetting.client.contextPath+"/#/dashboard";
							}
							else if($rootScope.userRoles.indexOf('Action Planning')!== -1){
								//crAcl.setRole("Analyze");
								window.location = envsetting.client.contextPath+"/#/dashboard";
							}

						}
						$rootScope.$emit("CallParentMethod", clientId);
					}
				}, function() {
					$rootScope.error = 'Failed to signin';
				})

			}
			else
			{
				$scope.validatePwdField=true;
				$("#showResetError").text("The password given is not matching");
			}
		}else{
			$scope.validatePwdField=true;
			$("#showResetError").text("Enter the Password");
		}
	}

	$scope.getDetails=function(clientId,clientChanged){
		loginService.getClientInfo( JSON.stringify({'clientId':clientId}),function(response) {
			loginService.setclientInfo(response.data.data);
			$localStorage.loginDetails.participantId = response.data.data.clientadminId;
			loginService.getProfileInfo(JSON.stringify({'participantId': response.data.data.clientadminId}),function(response) {
				loginService.setProfileInfo(response.data.data);
//				console.log('response.data.data.profileImgId',response.data.data.profileImgId);
				if(response.data.data.profileImgId){
					loginService.getProfileImg( JSON.stringify({'profileId':$localStorage.loginDetails.participantId}),function(response) {
						loginService.setProfileImg(response.data.data.profileLogo);
						$rootScope.myprofilePic.dataUrl =response.data.data.profileLogo;
					}, function(err) {
						//HAndle error
						console.log('Failure ',response.data);
					})
				}
			}, function(err) {
				//HAndle error
				console.log('Failure ',response.data);
			})

		}, function(err) {
			//HAndle error
			console.log('Failure ',response.data);
		});
//		$localStorage.metaDataConstant='';
		loginService.getMetadata(JSON.stringify({'clientId':clientId}),function(response) {
			if(response.data.type && response.data.data.length>0)
			{
				loginService.setMetadataConstant = response.data.data;
				$localStorage.metaDataConstant = response.data.data;
			}
			else{
				$http({
			        method : "GET",
			        url : "data/metadataConstants.json"
			    }).then(function (result) {
			    	$localStorage.metaDataConstant=result.data;
			    	
			    });
			}
		}, function(err) {
			//HAndle error
			console.log('Failure ',response.data);
		});
	}

//	function to rediret the user to login page  if the reset password link is expired 
	$scope.resetExpireSubmit = function(){

		window.location = envsetting.client.contextPath+"/#"
			$('#resetlinkExpiredmodal').modal('hide');

	};

}]);
