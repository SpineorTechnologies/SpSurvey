'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:buildSurveyController
 * @description
 * # buildSurveyController
 * Controller of the spApp
 * 
 */

angular.module('spApp')
.controller('samlLoginController', ['initSamlData','envsetting','$rootScope', '$scope', '$location', '$localStorage','$sessionStorage','$filter','md5', 'samlLoginService', 'Idle', 'Keepalive', '$http','AclService','$state', function(initSamlData,envsetting,$rootScope, $scope, $location, $localStorage,$sessionStorage,$filter, md5, samlLoginService, Idle, Keepalive, $http,AclService,$state) {
		
	var encryptedPassWord ="";
	var status = 'active';
	$scope.started = false;
	$scope.routedata = {
			superadmin: ['dashboard','edit_client', 'add_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab'],
			clientadmin:['dashboard','edit_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab'],
			design: ['my_survey', 'build_survey', 'edit_client', 'my_profile'],
			users: ['participants_tab', 'my_profile'],
			report: ['dashboard'],
			actionplanning: ['dashboard'],
			spcaller:['spcaller']
	}
	$scope.allvalues=[];

	
	var serverURL=envsetting.client.clientUrl;//$location.protocol() + '://'+ $location.host() +':8008';
	var serverURLNew=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	//alert(serverURL);
	var configObj = {};
	configObj.resetLink = serverURL+"/#/resetPassword";
	configObj.getClientLogo = serverURLNew+"/api/editClient/getClientLogo/";
	configObj.getallCustomers = serverURLNew+"/api/customers/getallcustomers/";
	configObj.updatePreference = serverURLNew+"/api/editClient/updatePreference/";
	$scope.forgotSubmit = false;
	/*For Dynamic url Generation end*/
//	for Encrypt the passwod into md5 format
	$scope.$watch('passWord' ,function() {
		encryptedPassWord = md5.createHash($scope.passWord || '');
	});
	$rootScope.myprofilePic = {
			dataUrl: envsetting.client.contextPath +'/images/place_holder.png'
	};
	$scope.userName=initSamlData.userName;
	
	encryptedPassWord = initSamlData.password;//md5.createHash(initSamlData.password || '');
	$scope.samlSignin = function() {
		var formData = {
				email: $scope.userName,
				password:encryptedPassWord,
				status:status
		}
     // console.log('formData',JSON.stringify(formData));
		/*if($localStorage.token){
			$('#sessionValidModel').modal('show');
			return;
		}*/
		samlLoginService.signin(formData, function(res) {
		//console.log("res.data",res.data);
			if (res.data.type == false) {
				$('#loginError').css({ "display": 'block'});
				$scope.passWord = '';
				$scope.logout();

			} else {
					
				$localStorage.loginResult={data:res.data}; 
				if (res.data.data.preferences!=undefined && res.data.data.preferences.length>0) {
					$localStorage.selectedClientid =res.data.data.preferences[0].selectedClientId;
					$localStorage.selectedClientname = res.data.data.preferences[0].selectedClientName;
					$scope.getDetails($localStorage.selectedClientid,false);
				}else{
					$localStorage.selectedClientid ="";
					$localStorage.selectedClientname = '';
				}
				
				$scope.loginSuccess(res);
				document.cookie = "_instance=true";	
				var outQurery ="";
				if(res.data.data.dlaQuery){
					var str = JSON.parse(res.data.data.dlaQuery);
					outQurery= JSON.stringify(str).replace("/$and", "$and").replace("/$or", "$or");
					
					if(outQurery != '{"$and":[]}'){
						var participantQuery ='{"/$or":[{"access":{"$gt": []}},'+res.data.data.dlaQuery+']}';
						participantQuery=participantQuery.replace("/$and", "$and").replace("/$or", "$or");
						participantQuery = JSON.parse(participantQuery)//JSON.stringify(participantQuery).replace("/$and", "$and").replace("/$or", "$or");
						participantQuery = JSON.stringify(participantQuery).replace("/$and", "$and").replace("/$or", "$or");
						try{
							$localStorage.participantsDlaQuery = JSON.parse(participantQuery);
						}
						catch(e){
							$localStorage.participantsDlaQuery = "";
						}
						$localStorage.loginDetails.dlaQuery = JSON.parse(outQurery);
					}else{
						console.log("json input is not valid");
					}
//					console.log("$localStorage.participantsDlaQuery ",participantQuery);
//					console.log("****",participantQuery,"*****");
				}
			}
		}, function() {
			$rootScope.error = 'Failed to signin';
		})
	};
	
	$scope.loginSuccess=function(res){

		$localStorage.token = res.data.token;
		$scope.start();
		$localStorage.loginDetails='';
		$rootScope.admintype=res.data.data.admin;
		$rootScope.userRoles=res.data.data.access;
		$scope.selectedCustomer = res.data.clientName;
		$localStorage.loginDetails =res.data.data;
		$rootScope.clientPic = {
				dataUrl: 'images/sp_logo.png'
		}; 

		if(res.data.data.clientId && $rootScope.admintype!=='superadmin')
		{
			$localStorage.selectedClientid =res.data.data.clientId;
			$scope.getDetails($localStorage.selectedClientid,false);
		} 
		if($rootScope.admintype)
		{
			$localStorage.role = $rootScope.admintype;
			$scope.aclData={
					superadmin: ['dashboard','edit_client', 'add_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab','spcaller'],
					//clientadmin:$scope.uniquevalues
			}
			AclService.setAbilities($scope.aclData);
			AclService.attachRole('superadmin');
		}
		if($rootScope.userRoles)
		{
			$localStorage.role =$rootScope.userRoles;

			$scope.clientadmin=$rootScope.userRoles;

			angular.forEach($scope.clientadmin, function(value, key) {
				angular.forEach($scope.routedata, function(value1, key1){
//					console.log(value.toLowerCase().replace(/\s/g, ''), " --->> ",key1.trim());
					if (value.toLowerCase().replace(/\s/g, '')==key1) {
						for (var i = 0; i < value1.length; i++) {
							$scope.allvalues.push(value1[i])
						}
					}
				})
			});
			//console.log($scope.allvalues,' $scope.allvalues');
			$scope.uniquevalues = $scope.allvalues.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})

			$scope.aclData={
//				superadmin: ['edit_client', 'add_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab'],
				clientadmin:$scope.uniquevalues
			}
			//console.log($scope.aclData,' $scope.aclData');
			AclService.setAbilities($scope.aclData);
			AclService.attachRole('clientadmin');
		}
		$scope.getallcustomers();
		if($rootScope.admintype=='superadmin'){
			if($localStorage.loginDetails.participantId && $localStorage.loginDetails.custDetails.email!=='sp@ix.com'){
				samlLoginService.setProfileImg('');
				$rootScope.myprofilePic = {
						dataUrl: envsetting.client.contextPath+'/images/place_holder.png'
				};
				samlLoginService.getProfileInfo(JSON.stringify({'participantId': $localStorage.loginDetails.participantId}),function(response) {
					samlLoginService.setProfileInfo(response.data.data);
						samlLoginService.getProfileImg( JSON.stringify({'profileId':$localStorage.loginDetails.participantId}),function(response) {
							if(response.data.data!=null && response.data.data!='null'){
							samlLoginService.setProfileImg(response.data.data.profileLogo);
							$rootScope.myprofilePic.dataUrl = response.data.data.profileLogo;
							}
						}, function(err) {
							//HAndle error
							console.log('Failure ',err);
						})
				}, function(err) {
					//HAndle error
					console.log('Failure ',err);
				})
			}else{
				
				var superAdminProfileData={
						firstName:$localStorage.loginDetails.clientName,
						lastName:$localStorage.loginDetails.custDetails.lastname,
						email:$localStorage.loginDetails.custDetails.email,
				};
				$localStorage.loginDetails.participantId = $localStorage.loginDetails.clientId;
				samlLoginService.setProfileInfo(superAdminProfileData);
				if($localStorage.loginDetails.participantId){
					samlLoginService.getProfileImg(JSON.stringify({'profileId':$localStorage.loginDetails.participantId}),function(response) {
						if(response.data.data!=null && response.data.data!='null'){
							samlLoginService.setProfileImg(response.data.data.profileLogo);
							$rootScope.myprofilePic.dataUrl =response.data.data.profileLogo;
						}	
					}, function(err) {
						//HAndle error
						console.log('Failure ',response.data);
					})
				}
			}
			
			if($localStorage.selectedClientname){
				var default_selectedCustomer = {'clientId':$localStorage.selectedClientid,'name':$localStorage.selectedClientname};
				//console.log('$localStorage.selectedClientname',default_selectedCustomer);
				$scope.selectedCustomer = default_selectedCustomer;
			}
		}
		
		if($rootScope.admintype=='superadmin' && $state.current.name=='saml'){
			$rootScope.showAddclient = true;
			$rootScope.customerSelection = false;
			$rootScope.showMysurvey = true;
			$rootScope.showParticipants=true;
			$rootScope.showAnalysis=true; 
			$rootScope.showReports=true;
			//window.location = "/#/mySurvey";
			window.location = envsetting.client.contextPath+"/#/mySurvey";
//			$rootScope.selectedCustomer = '';
			$rootScope.clientPic.dataUrl='images/sp_logo.png';
			$http({
				method : "GET",
				url : "data/metadataConstants.json"
			}).then(function (result) {
				$localStorage.metaDataConstant=result.data;
			});
		}
		else if($rootScope.admintype=='clientadmin' && $state.current.name=='saml'){
			$rootScope.showAddclient = false;
			$rootScope.customerSelection = true;
			$rootScope.showMysurvey = true;
			$rootScope.showParticipants=true;
			$rootScope.showAnalysis=true;
			$rootScope.showReports=true;
			window.location = envsetting.client.contextPath+"/#/mySurvey";
			$rootScope.selectedCustomer = res.data.data.clientName;
			$scope.getlogo(res.data.data.clientId);
			

		}
		else if($rootScope.admintype!='clientadmin' && $rootScope.admintype!='superadmin') {
			
			$scope.getlogo(res.data.data.clientId);
			if($state.current.name=='saml'){
				$rootScope.selectedCustomer = res.data.data.clientName;
				$localStorage.selectedClientname =  res.data.data.clientName;
					$rootScope.showAddclient = false;
					$rootScope.customerSelection = true;
					if($rootScope.userRoles.indexOf('Design')!== -1)
					{
						window.location = envsetting.client.contextPath+"/#/mySurvey";
					}
					else if($rootScope.userRoles.indexOf('Users')!== -1){
						//crAcl.setRole("Users");
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
						else if($rootScope.userRoles.indexOf('Spcaller')!== -1){
						//crAcl.setRole("Analyze");
						window.location = envsetting.client.contextPath+"/#/spcaller";
					}
			}
			

		}
	}

	$scope.onSelect = function ($item, $model, $label) {
		$localStorage.selectedClientid = $item.clientId;
		$rootScope.selectedClientId= $item.clientId;
		$localStorage.selectedClientname = $item.name;
		$scope.getDetails($item.clientId,true);
		$http({
				method: 'POST',
				url: configObj.updatePreference,
				data:{
					superadminId:$localStorage.loginDetails.participantId,
					preferences:[
					{
						selectedClientId:$item.clientId,
						selectedClientName:$item.name
					}
					]
				},
			}).then(function successCallback(response) {
				location.reload(); 
//				console.log("updated")
				
			}, function errorCallback(response) {
				
			});
	};
	$scope.onSelectCustomerChange = function(){
		if($scope.selectedCustomer.length==0){
			$localStorage.selectedClientid = '';
			$rootScope.selectedClientId= '';
			$scope.getDetails('',true);
		}
	}

	$scope.getDetails=function(clientId,clientChanged){
		samlLoginService.getClientInfo( JSON.stringify({'clientId':clientId}),function(response) {
			//console.log(response,'response');
			samlLoginService.setclientInfo(response.data.data);
			if($rootScope.admintype!=='superadmin'){
				samlLoginService.setProfileImg('');
				$rootScope.myprofilePic = {
						dataUrl: envsetting.client.contextPath+'/images/place_holder.png'
				};
				samlLoginService.getProfileInfo(JSON.stringify({'participantId': $localStorage.loginDetails.participantId}),function(response) {
					samlLoginService.setProfileInfo(response.data.data);
					if($localStorage.loginDetails.participantId){
						samlLoginService.getProfileImg( JSON.stringify({'profileId':$localStorage.loginDetails.participantId}),function(response) {
							if(response.data.data!=null && response.data.data!='null'){
							samlLoginService.setProfileImg(response.data.data.profileLogo);
							$rootScope.myprofilePic.dataUrl = response.data.data.profileLogo;
							}
							if(clientChanged){
								$rootScope.$emit("clientChangeEvent", $rootScope.selectedClientId);
								$scope.$broadcast("clientChangeEvent", {
									data:$rootScope.selectedClientId // send whatever you want
								});
							}

						}, function(err) {
							//HAndle error
							console.log('Failure ',response.data);
						})
					}else{
						if(clientChanged){
							$rootScope.$emit("clientChangeEvent", $rootScope.selectedClientId);
							$scope.$broadcast("clientChangeEvent", {
								data:$rootScope.selectedClientId // send whatever you want
							});
						}
					}
				}, function(err) {
					//HAndle error
					console.log('Failure ',response.data);
				})
			}
			else{
				if(clientChanged){
					$rootScope.$emit("clientChangeEvent", $rootScope.selectedClientId);
					$scope.$broadcast("clientChangeEvent", {
						data:$rootScope.selectedClientId // send whatever you want
					});
				}
				$localStorage.loginDetails.threshold = response.data.data.reportthreshould;
				$localStorage.loginResult.threshold = response.data.data.reportthreshould;
			}

		}, function(err) {
			//HAndle error
			console.log('Failure ',err);
			if(clientChanged){
				$rootScope.$emit("clientChangeEvent", $rootScope.selectedClientId);
				$scope.$broadcast("clientChangeEvent", {
					data:$rootScope.selectedClientId // send whatever you want
				});
			}
		})

		samlLoginService.getMetadata(JSON.stringify({'clientId':clientId}),function(response) {
			if(response.data.type && response.data.data.length>0)
			{
				samlLoginService.setMetadataConstant = response.data.data;
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
			console.log('Failure ',err);
		});
	}

	$scope.getallcustomers = function(){
		var dataPassing='';
		samlLoginService.getAllcustomers(dataPassing,function(response) {
			if(response.data.type)
			{
				var data= [];
				for(var i = 0; i < response.data.data.length; i++) {
					data.push({'name':response.data.data[i].name,'clientId':response.data.data[i]._id});
				}
				$rootScope.customers = data;
				samlLoginService.setAllcustomers(data);
			}

		}, function(err) {
			//HAndle error
			console.log('Failure ',err);
		});

		samlLoginService.getIndustryType(dataPassing,function(response) {
			if(response.data.type)
			{

				var dataIndusrtyType= [];
				for(var i = 0; i < response.data.data.length; i++) {
					dataIndusrtyType.push({'industryType':response.data.data[i].industryType,'id':response.data.data[i]._id});
				}
				samlLoginService.setIndustryType(dataIndusrtyType);
			}
		}, function(err) {
			//HAndle error
			console.log('Failure ',err);
		});

	}

	$scope.can=function (items) {
		return AclService.can(items);
	}

	$scope.getlogo = function(clientImageid){ 
		if(clientImageid){
			$http({
				method: 'POST',
				url: configObj.getClientLogo,
				data:JSON.stringify({'clientId':clientImageid}),
			}).then(function successCallback(response) {
				if(response.data != undefined && response.data.data!=null && response.data.data.clientLogo) {
					$rootScope.clientPic.dataUrl =response.data.data.clientLogo;
				} else {
					$rootScope.clientPic.dataUrl ='images/sp_logo.png';
				}

				//$scope.editClientPic.dataUrl =response.data+"";
				// console.log(response);
				// this callback will be called asynchronously
				// when the response is available
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}else{
			$rootScope.clientPic.dataUrl ='images/sp_logo.png';
		}

	}

//	function to logout from the application 
	$scope.logout = function() {
		samlLoginService.logout(function() {
			//$localStorage.$reset();
			delete $rootScope.admintype;
			$scope.stop();
			window.location = envsetting.client.contextPath+"/#";
				$('#sessionValidModel').modal('hide');
		}, function() {
			alert("Failed to logout!");
		});
	};
	$scope.onForgotPwdClickHandler= function(){
		$scope.forgotSubmit = false;
		$scope.forgotPwdEmail ='';
		$('#forgotPwdError').css({ "display": 'none'});
	}


//	function to send mail on forgot password click 
	$scope.forgotPwdSubmit = function (isValid){ 
		if(isValid){
			$('.loader').show();
			$scope.forgotSubmit = true;
			var emailData = {
					'receiver':$scope.forgotPwdEmail,
					'subject':'Reg: password change Request',
					'resetlink':configObj.resetLink,
					'mailBody':'We have updated our password storage systems to be more secure and more efficient, please click the link below to reset your password so you can login in the future.  ' 
			}
			samlLoginService.sendEmail(emailData, function(res){
				$('.loader').hide();
				if(res.data.type)
				{
					//console.log(res.data);
					alert("Reset Password Link sent to your mail");
					$scope.forgotPwdEmail ='';
					$('#forgotpwdmodal').modal('hide');
					$scope.forgotSubmit = false;

				}else{
					$('#forgotPwdError').css({ "display": 'block'});
					setTimeout(function () {
						$('#forgotPwdError').css({ "display": 'none'});
					  }, 1500);
					//console.log(res.data);
					$scope.forgotSubmit = false;
				}


			},function() {
				$('.loader').hide();
				alert('Failed to signin');
				$rootScope.error = 'Failed to signin';
			})
			
		}else{
			if(!$scope.forgotPwdEmail){
				$scope.forgotCheckEmpty=true;
			}
		}
	};
//	fuction to cancel form the modal popup 
	$scope.cancel = function() {
		$rootScope.currentPage = $location.path();
		$('#sessionValidModel').modal('hide');
	}
//	fuction to monitor the user when he idel doing nothing 
	$scope.$on('IdleTimeout', function() {
		$scope.logout();
	});
//	fuction to call from reset password controller when the user reset the password and login  
	$rootScope.$on("CallParentMethod", function(event, clientImageid){ 
		//alert(clientImageid);
		$scope.getallcustomers();
		$scope.start();
		$scope.getlogo(clientImageid);
	});
//	function  to start watching the idel time of the user
	$scope.start = function() {
		Idle.watch();
		$scope.started = true;
	};
//	function  to stop the idel time watching and clear the variables
	$scope.stop = function() {
		Idle.unwatch();
		$scope.started = false;
	};
	$scope.$on('logout', function() {
		$scope.logout();
	});

	$rootScope.$on("clientNameChange", function(event, clientName){
//		console.log("event Change",clientName.data);
		if(clientName.data){
			$scope.selectedCustomer =clientName.data;
		}
	});
	$rootScope.$on("clientAddEvent", function(event){
//		console.log("event Change",clientName.data);
		var default_selectedCustomer = {'clientId':$localStorage.selectedClientid,'name':$localStorage.selectedClientname};
							$scope.selectedCustomer = default_selectedCustomer;
							$('.loader').hide();
	});
	
	$scope.token = $localStorage.token;
	if($localStorage.loginResult!=undefined && $localStorage.loginResult.data!=undefined){ 
		$scope.loginSuccess($localStorage.loginResult);
	}
	$scope.samlSignin();
}]);
