'use strict';
/**
 * @ngdoc overview
 * @name spApp
 * @description
 * # spApp
 *
 * Route of the application.
 */
//app.js

var spApp = angular.module('spApp', 
							['ngSanitize','ui.router','ngRoute', 'ngStorage', 'ngDragDrop', 
							 'ui.bootstrap', 'checklist-model', 'angularInlineEdit', 'ngFileUpload',
							 'ui.sortable', 'ngTable', 'angular-md5', '720kb.datepicker', 'ngTagsInput',
							 'ngSanitize','ngIdle','slickCarousel','ngFlash','mm.acl','multipleSelect',
							 'gridster','fixed.table.header','tangcloud','uiCropper', 'ui.grid',
							 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.resizeColumns']);

spApp.config(['$locationProvider','KeepaliveProvider', 'IdleProvider','AclServiceProvider', function ($locationProvider,KeepaliveProvider, IdleProvider, AclServiceProvider) {
	$locationProvider.hashPrefix('');
	IdleProvider.idle(900);
	IdleProvider.timeout(2);
	KeepaliveProvider.interval(10);
}]);

spApp.run(function (envsetting,$rootScope, $location,$localStorage,$http) {
	
	var serverURL=envsetting.client.clientUrl;//$location.protocol() + '://'+ $location.host() +':8008';
	var configObj = {};
	configObj.resetPassword = serverURL+"/#/resetPassword";
	configObj.takesurvey = serverURL+"/#/takesurvey";

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		
		/*if(current.indexOf(serverURL+"/#/takesurvey")!=-1){
			console.log('yyyyy.....'+$location.path());	
			$localStorage.$reset({
			    token: "",
			    takeSurveyLoginDetails:{}
			});
			var nodeServerURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
			var paramArr=current.split("&");
			
			var id=paramArr[0].substr(current.lastIndexOf('?')+1);
			var take_survey_id=paramArr[1];
			
			$http({
		        method : "POST",
		        url :nodeServerURL+"/api/takesurvey/takeSurveyAuthenticate",
		        data:{"id":id,'take_survey_id':take_survey_id}
		    }).then(function mySucces(res){
				var takeSurveyLoginDetails = {'takesurveyParticipantObj':res.data.data};
				takeSurveyLoginDetails.takesurveyParticipantObj.take_survey_id=take_survey_id;
				$localStorage.takeSurveyLoginDetails =takeSurveyLoginDetails;
				$localStorage.selectedClientid =res.data.data.clientId
				$localStorage.token = res.data.token;
				//$location.path("/takesurvey");
				//$rootScope.currentPage = "/takesurvey";
		    }, function myError(response) {
		    	console.log('err',response)
		    });
			
			
		}else */if(current.substr(0,current.lastIndexOf('?'))==configObj.resetPassword){

			$rootScope.currentPage = "/resetPassword";
			var tempID = current.substr(current.lastIndexOf('?') + 1);

			$rootScope.customerId= tempID.substr(0,tempID.lastIndexOf('&'));
			$rootScope.userToken = current.substr(current.lastIndexOf('&') + 1);
		}
		else{
			if(!$localStorage.token && $location.path().length>1) {
				//$location.path("/index.html");
			}else{
				if(!$rootScope.currentPage && $location.path().length>1){
					//$('#sessionValidModel').modal('show');
				}else{
						$rootScope.currentPage = $location.path();

				}
			}

		}
		

	});
	$rootScope.keys = Object.keys;
});
spApp.run(['Idle', 'AclService','$localStorage', function(Idle, AclService,$localStorage) {
    Idle.watch();
    //acl roles
    if ($localStorage.role != undefined) {
        var routedata = {
            superadmin: ['dashboard','edit_client', 'add_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab','spcaller'],
            clientadmin: ['dashboard','edit_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab','spcaller'],
            design: ['dashboard','my_survey', 'build_survey', 'edit_client', 'my_profile'],
            users: ['participants_tab', 'my_profile'],
            report: ['dashboard'],
            actionplanning: ['dashboard'],
            spcaller:['spcaller'],
            calleradmin:['spcaller']
        }
        var allvalues = [];
        if ($localStorage.role == "superadmin") {
            var aclData = {
                superadmin: ['dashboard','edit_client', 'add_client', 'my_survey', 'build_survey', 'my_profile', 'participants_tab','spcaller'],
            }
//            console.log(aclData)
            AclService.setAbilities(aclData);
            AclService.attachRole('superadmin');
        } else if ($localStorage.role == "calleradmin") {
            var aclData = {
            		 calleradmin:['spcaller'],
                }
//                console.log(aclData)
                AclService.setAbilities(aclData);
                AclService.attachRole('calleradmin');
            } else {
            var clientadmin = angular.fromJson($localStorage.role);

            angular.forEach(clientadmin, function(value, key) {
                angular.forEach(routedata, function(value1, key1) {
                    if (value.toLowerCase().replace(/\s/g,'') == key1) {
                        for (var i = 0; i < value1.length; i++) {
                            allvalues.push(value1[i])
                        }
                    }
                })
            });
            var uniquevalues = allvalues.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            })
            var aclData = {
                clientadmin: uniquevalues
            }
           // console.log(aclData)
            AclService.setAbilities(aclData);
            AclService.attachRole('clientadmin');
        }
    }
}]);


spApp.config(function ($templateFactoryProvider,$stateProvider, $urlRouterProvider,$httpProvider) {
	 $templateFactoryProvider.shouldUnsafelyUseHttp(true);
	$stateProvider
	.state('editClient', {
		url: '/editClient',
		templateUrl: 'views/editClient.html',
		controller: 'editClientController',
		resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('edit_client')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
	})
	.state('addClient', {
		url: '/addClient',
		templateUrl: 'views/addClient.html',
		controller: 'addClientController',
		resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('add_client')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
	})
	/*   .state('participants', {
      url: '/participants',
      templateUrl: 'scripts/participants/participants.html',
      controller: 'ParticipantsCtrl'
    })*/
	.state('mySurvey', {
		url: '/mySurvey',
		templateUrl: 'views/mySurvey.html',
		controller: 'mySurveyController',
		resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('my_survey')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
	})
	.state('spcaller', {
		url: '/spcaller',
		templateUrl: 'views/spcaller.html',
		controller: 'spcallerController',
		resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('spcaller')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
	})
	.state('buildSurvey', {
		url: '/buildSurvey',
		templateUrl: 'views/buildSurvey.html',
		controller: 'buildSurveyController',
		resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('build_survey')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
	})
	.state('myProfile', {
		url: '/myProfile',
		templateUrl: 'views/myProfile.html',
		controller: 'myProfileController',
		resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('my_profile')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
	})
	.state('login', {
		url: '/',
		templateUrl: 'views/login.html',
		controller: 'loginController'
	})
	.state('resetPassword', {
		url: '/resetPassword',
		templateUrl: 'views/resetPassword.html',
		controller: 'resetPassWordController'
	})

	.state('dashboard', {
		url: '/dashboard',
		templateUrl: 'views/dashboard.html',
		controller: 'dashboardController',
		resolve : {
	        'acl' : ['$q', 'AclService', function($q, AclService){
	          if(AclService.can('dashboard')){
	            // Has proper permissions
	            return true;
	          } else {
	            // Does not have permission
	            return $q.reject('Unauthorized');
	          }
	        }],
	        initDashboardData: function ($http, $localStorage, $location, envsetting, $rootScope) {
						//$('.loader').show();
	        	var serverURL = envsetting.client.serverUrl;//$location.protocol() + '://' + $location.host() + ':3010';
	        	var params={};
	        	params.clientId=$localStorage.selectedClientid;
	        	params.threshold=0;
	        	//console.log('$localStorage.loginDetails.threshold',$localStorage.loginDetails.threshold)
	        	if($localStorage.loginDetails.threshold){
	        		params.threshold=$localStorage.loginDetails.threshold;
	        	}
	        	params.participantId=$localStorage.loginDetails.participantId;
	        	if($localStorage.loginDetails.dlaQuery){
	        		params.dlaQuery=$localStorage.loginDetails.dlaQuery;
	        	}
	        	params.admin=$localStorage.loginDetails.admin;
	        	return $http({
	        		method: 'POST',
	        		url: serverURL + "/api/dashboard/initDashboardData/",
	        		data:{
			        	"params":params
			        }
	        	})
	        	.then(function (data) {
	        		//console.log(data.data["customerSurveysWithCount"]);
						//	console.log(data.data)
	        		return data.data;
	        	});
	        }
	      }
			
	})	
	.state('yesno', {
		url:'/yesno',
		templateUrl:'views/yesno.html',
		controller:'yesnoController',
		resolve : {
			'acl' : ['$q', 'AclService', function($q, AclService){
				if(AclService.can('dashboard')){
					return true;
				} else {
					return $q.reject('Unauthorized');
				}
			}],
	        initDashboardData: function ($http, $localStorage, $location, envsetting, $rootScope) {
						//$('.loader').show();
	        	var serverURL = envsetting.client.serverUrl;//$location.protocol() + '://' + $location.host() + ':3010';
	        	var params={};
	        	params.clientId=$localStorage.selectedClientid;
	        	params.threshold=0;
	        	//console.log('$localStorage.loginDetails.threshold',$localStorage.loginDetails.threshold)
	        	if($localStorage.loginDetails.threshold){
	        		params.threshold=$localStorage.loginDetails.threshold;
	        	}
	        	params.participantId=$localStorage.loginDetails.participantId;
	        	if($localStorage.loginDetails.dlaQuery){
	        		params.dlaQuery=$localStorage.loginDetails.dlaQuery;
	        	}
	        	params.admin=$localStorage.loginDetails.admin;
	        	return $http({
	        		method: 'POST',
	        		url: serverURL + "/api/dashboard/initDashboardData/",
	        		data:{
			        	"params":params
			        }
	        	})
	        	.then(function (data) {
	        		//console.log(data.data["customerSurveysWithCount"]);
						//	console.log(data.data)
	        		return data.data;
	        	});
	        }
		}
	})
	.state('takesurvey', {
		url: '/takesurvey',
		templateUrl: 'views/takesurvey.html',
		controller: 'takesurveyController',
		resolve : {
	        initSurveyData: function ($http, $localStorage, $location, envsetting, $rootScope) {
	        	var nodeServerURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	        	var current=$location.url()
				var paramArr=current.split("&");
				var id=$location.search().a;//paramArr[0].substr(current.lastIndexOf('?')+1);
				var take_survey_id=$location.search().b;//paramArr[1];
				if($localStorage.token==undefined||$localStorage.token==null||$localStorage.token==""){
					/*$localStorage.$reset({
	        			token: "",
	        			takeSurveyLoginDetails:{}
	        		});*/
					$localStorage.token=$location.search().c;
				}
				
				return $http({
	        		method: 'POST',
	        		url :nodeServerURL+"/api/takesurvey/takeSurveyAuthenticate",
	        		data:{"id":id,'take_survey_id':take_survey_id}
	        	})
	        	.then(function (res) {
	        		var takeSurveyLoginDetails = {'takesurveyParticipantObj':res.data.data};
					takeSurveyLoginDetails.takesurveyParticipantObj.take_survey_id=take_survey_id;
					//console.log('takeSurveyLoginDetails.takesurveyParticipantObj',takeSurveyLoginDetails.takesurveyParticipantObj)
					var errorMsg=takeSurveyLoginDetails.takesurveyParticipantObj.errorInfo;
					if(takeSurveyLoginDetails.takesurveyParticipantObj.status!='active'){
						errorMsg="Inactive";
					}
					//console.log('errorMsg',errorMsg)
					if(errorMsg){
						$localStorage.takeSurvey={};
						$localStorage.takeSurvey.errorInfo=errorMsg;
					}else{
						$localStorage.takeSurvey={};
						$localStorage.takeSurvey.errorInfo="";
					}
					//console.log('$localStorage.takeSurvey.errorInfo',$localStorage.takeSurvey.errorInfo)
					$localStorage.takeSurveyLoginDetails =takeSurveyLoginDetails;
					
					//$localStorage.selectedClientid =res.data.data.clientId
					//$localStorage.token = res.data.token;
	        		return res.data.data;
	        	});
				
	        }
	      }
	})
	.state("takesurvey_spcaller",{
		url: '/takesurvey_spcaller',
		templateUrl: 'views/takesurvey.html',
		controller: 'takesurveyController',
		resolve : {
	        initSurveyData: function ($http, $localStorage, $location, envsetting, $rootScope) {
	        	
	        	var nodeServerURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	        	 
	        	var current=$location.url()
				var paramArr=current.split("&");
				
				var id=$location.search().a;//paramArr[0].substr(current.lastIndexOf('?')+1);
				var take_survey_id=$location.search().b;//paramArr[1];
				$localStorage.TAKE_SURVEY_CALLER_NAME=$location.search().caller_name;
				//var callerName = $location.search().caller;
				//var tkn=$location.search().c;
				
				if($location.search().c){
					$localStorage.token=$location.search().c;
				}else{
					$localStorage.token = $localStorage.surveyAuthToken;
				}
				//$localStorage.token=$location.search().c;

				return $http({
	        		method: 'POST',
	        		url :nodeServerURL+"/api/takesurvey/takeSurveyAuthenticate",
	        		data:{"id":id,'take_survey_id':take_survey_id}
	        	})
	        	.then(function (res) {
	        		var takeSurveyLoginDetails = {'takesurveyParticipantObj':res.data.data};
					takeSurveyLoginDetails.takesurveyParticipantObj.take_survey_id=take_survey_id;
					//takeSurveyLoginDetails.takesurveyParticipantObj.callerName=callerName;
					
					var errorMsg=takeSurveyLoginDetails.takesurveyParticipantObj.errorInfo;
					if(takeSurveyLoginDetails.takesurveyParticipantObj.status!='active'){
						errorMsg="Inactive";
					}
					//console.log('errorMsg',errorMsg)
					if(errorMsg){
						$localStorage.takeSurvey={};
						$localStorage.takeSurvey.errorInfo=errorMsg;
					}else{
						$localStorage.takeSurvey={};
						$localStorage.takeSurvey.errorInfo="";
					}
					//console.log("$localStorage.TAKE_SURVEY_CALLER_NAME",$localStorage.TAKE_SURVEY_CALLER_NAME);
					//console.log('$localStorage.takeSurvey.errorInfo',$localStorage.takeSurvey.errorInfo)
					$localStorage.takeSurveyLoginDetails =takeSurveyLoginDetails;
					
					//$localStorage.selectedClientid =res.data.data.clientId
					$localStorage.token = res.data.token;
	        		return res.data.data;
	        	});
				
	        }
	      }
	}).state('saml', {
		url: '/sso/saml',
		controller: 'samlLoginController',
		resolve:{
			 initSamlData: function ($http, $localStorage, $location, envsetting, $rootScope) {
				 var nodeServerURL=envsetting.client.serverUrl;	
				 
				 var sso_error=$location.search().sso_error;
				 var id=$location.search().id;
				 var data={};
				 if(id!=undefined && id!=""){
					 return $http({
			        		method: 'POST',
			        		url :nodeServerURL+"/api/saml/sso/acs",
			        		data:{"jsessionId":id}
			        	})
			        	.then(function (res) {
			        		console.log('saml node server response: ',JSON.stringify(res));
			        		
			        		
							//data.userName="priyanka.d@intellectyx.com";
							//data.password="1";
							//data.userName="sp@ix.com";
							//data.password="one";
			        		
							data.userName=res.data.data.userName;
							data.password=res.data.data.password;
							return data;
			        	});
				 }else{
					 if(sso_error!=undefined && sso_error!=""){
						 console.log('sso_error',sso_error)
						 data.sso_error=sso_error;
						 //$location.path("/")
						 //$state.go("login", {"sso_error": sso_error});
						 localStorage.setItem("sso_display_error", sso_error);
					 }
					 
					 return {};
				 }
				 
				 
			 }
		}
	}
	);
	// .state('takesurvey-landing', {
	// 	url: '/takesurvey-landing',
	// 	templateUrl: 'scripts/takeSurvey/thankyou.html'
	// });
 /*.state('spcaller', {
		url: '/spcaller',
		templateUrl: 'scripts/spcaller/callerqueue.html',
		controller: 'callerController'
	});
*/
	$urlRouterProvider.otherwise('/');

	$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
		return {
			'request': function (config) {
				config.headers = config.headers || {};
				//route middleware to verify a token #2924 ----Start ---
				if ($localStorage.token) {
					config.headers.authorization = $localStorage.token;
				}
				//route middleware to verify a token #2924 ----End ---
				return config;
			},
			'responseError': function (response) {
			//	$('.loader').hide();
				if (response.status === 401 || response.status === 403) {
					$location.path('/#');
				}
				return $q.reject(response);
			}
		};
	}]);

});

spApp.config(function ($provide) {
  $provide.provider('envsetting', function () {
    this.$get = function ($http) {
    return  $http.get('config.json').then(function(response) {
//        console.log('response.data');
        //console.dir(response.data);
        return {
          server: response.data
          //  ,
         // serverUrl:response.data.serverUrl
        };
      });
    }
  })
});
spApp.directive('loading', ['$http', function($http) {
  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {
      scope.isLoading = function() {
        return $http.pendingRequests.length > 0;
      };

      scope.$watch(scope.isLoading, function(v) {
        if (v) {
          elm.show();
        } else {
          elm.hide();
        }
      });
    }
  };

}]);