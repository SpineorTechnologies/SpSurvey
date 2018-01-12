/**
 * http://usejsdoc.org/
 * 
 */
angular.module('spApp')
.controller('addClientController',['envsetting','$scope','$rootScope','$location','Upload','$http','sharedProperties','Flash','loginService','$window', '$filter','$localStorage', function(envsetting,$scope,$rootScope,$location, Upload, $http, sharedProperties,Flash,loginService,$window,$filter,$localStorage){
	
	var takeSurveyPrimaryColor ="";
	var takeSurveyAccentColor ="";
	var clientLogoId = "";
	
	
	var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	
	var serverURLnew=envsetting.client.clientUrl;//$location.protocol() + '://'+ $location.host() +':8008';

	//alert(serverURL);
	$scope.configObj= {};
	$scope.configObj.getClientLogo = serverURL+"/api/editClient/getClientLogo/";
	$scope.configObj.editClientSave = serverURL+"/api/editClient/";
	$scope.configObj.validateEmail = serverURL+"/api/editClient/validateEmail/";
	$scope.configObj.loadData = serverURL+"/api/editClient/loadData/";
	$scope.configObj.sendemail = serverURL+"/api/email/sendemail/";
	$scope.configObj.resetLink = serverURLnew+"/#/resetPassword";
	$scope.configObj.getallIndystryType = serverURL+"/api/customers/getallindystrytype/";	
	$scope.configObj.updateClientLogoInfo = serverURL+"/api/editClient/updateClientLogoInfo/";

	/*For Dynamic url Generation END*/
	$scope.editClientPic = {
			dataUrl: ''
	}; 
	var metadataConstant='';
	
	$http({
        method : "GET",
        url : "data/metadataConstants.json"
    }).then(function (result) {
    	metadataConstant=result.data;
    	
    });
	
	$scope.industryType = loginService.getIndustryList();
	$scope.threshold = 3;
	
	$scope.emailFormat = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
	$scope.uploadFile = function($file) {
		Upload.upload({
			url: $scope.configObj.editClientSave,
			data: {file: $file}
		})
		.then(function (resp) { 
//			console.log('for add client ',resp);
			clientLogoId = resp.data.substr(resp.data.lastIndexOf('&') + 1);
			//console.log('for add client ',temp);
			var resultImg =resp.data.substr(0,resp.data.lastIndexOf('&'));
			$scope.editClientPic.dataUrl =resultImg+"";
			console.log('Success ' +  'uploaded. Response: ');
		}, function (resp) {
			console.log('Error status: ' + resp.status);
		}, function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		});
	};
	$("#selectPrimaryColor li a").click(function(){
		// remove previously added selectedLi
		$('#selectPrimaryColor .active').removeClass('active');
		// add class `selectedLi`
		$(this).parent().addClass('active');
		takeSurveyPrimaryColor = $(this).parent().attr('value');
		//console.log('takeSurveyPrimaryColor',takeSurveyPrimaryColor);
	});
	$("#selectAccentColor li a").click(function(){
		// remove previously added selectedLi
		$('#selectAccentColor .active').removeClass('active');
		// add class `selectedLi`
		//console.log($(this).parent());
		$(this).parent().addClass('active');
		takeSurveyAccentColor = $(this).parent().attr('value');
		//console.log('takeSurveyAccentColor',takeSurveyAccentColor);
	});

	$scope.toggle = true;
	var smsEnabled =false;
	$scope.$watch('toggle', function(){
		$scope.toggleText = $scope.toggle ? 'No Permission' : 'Permissioned';
		smsEnabled = $scope.toggle?false:true;
	})
$scope.flashClear = function() {
       Flash.clear();
      }; 
	$scope.clientInsert = function(isValid) {
		$('.loader').show();
		$scope.submitted =true;
		var itemFound = $filter('filter')( $scope.industryType, { industryType: $scope.selectedIndustryType  }, true)[0];
//		console.log(itemFound);
		if($scope.industryType.indexOf(itemFound) == -1 ||  itemFound ==undefined) {
			Flash.create('danger','Please Select the Industry Type from the List',2000, {container: 'flash-fixed'});
			$window.scrollTo(0, 0);
			$('.loader').hide();
			return;
		}
		if (isValid) { 
			$http({
				method: 'POST',
				url: $scope.configObj.validateEmail,
				data:JSON.stringify({clientemail: $scope.clientEmailId,name: $scope.clientName})
			}).then(function successCallback(response) {
//				console.log(response.data.type);
				if(response.data.type){
					var data = {
							name: $scope.clientName,
							clientemail: $scope.clientEmailId,
							clientindustry:$scope.selectedIndustryType,
							clientaddress:$scope.clientAddress,
							primarycolor:  takeSurveyPrimaryColor ,
							accentcolor:takeSurveyAccentColor,
							smsconsent:smsEnabled,
							reportthreshould:$scope.threshold,
							imageid:clientLogoId,
							status:'active',
							admin:'clientadmin',
							metadataconstant:metadataConstant
					};
					$http({
						method: 'POST',
						url: $scope.configObj.loadData,
						data:JSON.stringify(data)
					}).then(function successCallback(response) {
						if(response.status==200){
							$window.scrollTo(0, 0);
							Flash.create('success','Client Added Successfuly', 2000, {container: 'flash-fixed'});
							clearFields();
							window.location = envsetting.client.contextPath+"#/participants";
							$('.loader').show();
							$localStorage.selectedClientname=response.data.clientData.name
							$localStorage.selectedClientid=response.data.clientData._id
							$rootScope.$emit("clientAddEvent");
							$scope.$broadcast("clientAddEvent");							
							
							$scope.threshold = 3;
						}

						var clientdata = {
								'receiver':response.data.clientData.clientemail,
								'subject':'Reg:Generate Password',
								'resetlink':$scope.configObj.resetLink,
								'mailBody1': 'We have updated our password storage systems to be more secure and more efficient.',
							    'mailBody2': 'Please click the link below to Generate your password so you can login in the future.'
						}


						$http({
							method: 'POST',
							url: $scope.configObj.sendemail,
							data:clientdata
						}).then(function successCallback(response) {
							//console.log(response);
							$('.loader').hide();
							// this callback will be called asynchronously
							// when the response is available
						}, function errorCallback(response) {
							// called asynchronously if an error occurs
							// or server returns response with an error status.
						});

var data = {
							clientId:response.data.clientData._id,
							clientLogo: $scope.myCroppedImage
							};

						$http({
							method: 'POST',
							url: $scope.configObj.updateClientLogoInfo,
							data:data
						}).then(function successCallback(response) {
							if(response.data.ok==1) { 
								$scope.editClientimg = $scope.myCroppedImage;
								$scope.cropShow = false;
							}	
						});						
						//console.log(response);
						$rootScope.customers.push({'name':response.data.clientData.name,'clientId':response.data.clientData._id});
						// this callback will be called asynchronously
						// when the response is available
					}, function errorCallback(response) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
				else{
					 Flash.clear();
					$window.scrollTo(0, 0);
					Flash.create('danger','Email ID or Client Name Already Exist',0, {container: 'flash-fixed'});
					$('.loader').hide();
				}
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}else{
                     $('.loader').hide();
              }


	};

	function clearFields(){
		$scope.editClientPic.dataUrl="";
		$scope.clientName= '';
		$scope.clientEmailId='';
		$scope.selectedIndustryType='';
		$scope.clientAddress='';
		$scope.toggle = false;
		$scope.threshold='';
		$scope.editClientPic = {
				dataUrl: ''
		}; 
		$('#clientImage').attr('src','');
		$scope.submitted =false;
	}

	$scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
		  $scope.cropShow=true;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#image')).on('change',handleFileSelect);

}]);
angular.module('spApp')
.directive('capitalize', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var capitalize = function(inputValue) {
        if (inputValue == undefined) inputValue = '';
        var capitalized = inputValue.toLowerCase();
        if (capitalized !== inputValue) {
          modelCtrl.$setViewValue(capitalized);
          modelCtrl.$render();
        }
        return capitalized;
      }
      modelCtrl.$parsers.push(capitalize);
      capitalize(scope[attrs.ngModel]); // capitalize initial value
    }
  };
});