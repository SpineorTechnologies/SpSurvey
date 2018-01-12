/**
 * http://usejsdoc.org/
 */
angular.module('spApp')
.controller('editClientController',['envsetting','$scope','$rootScope','$filter','$localStorage','$location','Upload','$http','sharedProperties','Flash','loginService','$window', function(envsetting,$scope,$rootScope,$filter,$localStorage, $location, Upload, $http, sharedProperties,Flash,loginService,$window){
	var clientThemeColor ="";
	/*For Dynamic url Generation start*/	
	
	var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	//alert(serverURL);
	$scope.configObj= {};
	$scope.configObj.editClientSave = serverURL+"/api/editClient/updateLogo";
	$scope.configObj.updateClientInfo = serverURL+"/api/editClient/updateClientInfo/";
	$scope.configObj.updateClientLogoInfo = serverURL+"/api/editClient/updateClientLogoInfo/";
	$scope.configObj.getClientLogo = serverURL+"/api/editClient/getClientLogo/";
	$scope.configObj.getClientInfo = serverURL+"/api/editClient/getClientInfo/";
	$scope.configObj.getallIndystryType = serverURL+"/api/customers/getallindystrytype/";
	/*For Dynamic url Generation END*/
	$scope.editClientimg = 'images/sp_logo.png';
	/*$scope.editClientimg = {
			dataUrl: ''
	}; */

	$scope.emailFormat = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
	var takeSurveyPrimaryColor = ''; 
	var takeSurveyAccentColor = ''; 
	var clientLogoId ='';
	var previousImgId ='';
	var oldImgId ='';
	var participantId='';

	$scope.getClientdetails=function(clientId){
		$scope.industryType = loginService.getIndustryList();
		$http({
			method: 'POST',
			url: $scope.configObj.getClientInfo,
			data:JSON.stringify({'clientId':clientId})
		}).then(function successCallback(response) {
//			console.log(response);
			$scope.clientName = response.data.data.name;
			$scope.clientEmailId = response.data.data.clientemail;
			$scope.selectedIndustryType=response.data.data.clientindustry;
			$scope.threshold = parseInt(response.data.data.reportthreshould);
			$scope.clientAddress = response.data.data.clientaddress;
			participantId = response.data.data.clientadminId;
			$localStorage.participantId = participantId;
			$rootScope.$emit("participantChangeEvent", participantId);
			/*$scope.$broadcast("participantChangeEvent", {
				data:participantId // send whatever you want
			});*/
			clientLogoId = response.data.data.imageid;
			previousImgId = response.data.data.imageid;
			if(response.data.data.smsconsent=="true"){
				$scope.toggle=true;
			}else{
				$scope.toggle=false;
			}

			$('#selectPrimaryColor li').each(function (i) {
				if($(this).attr('value')==response.data.data.primarycolor)
				{
					$('#selectPrimaryColor .active').removeClass('active');
					$(this).addClass('active');
					takeSurveyPrimaryColor = $(this).attr('value');

				}
			});

			$('#selectAccentColor li').each(function (i) {
				if($(this).attr('value')==response.data.data.accentcolor)
				{
					$('#selectAccentColor .active').removeClass('active');
					$(this).addClass('active');
					takeSurveyAccentColor = $(this).attr('value');

				}
			});


			$scope.getlogo($localStorage.selectedClientid);

			// this callback will be called asynchronously
			// when the response is available
		}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}
	$scope.uploadFile = function($file) {
		Upload.upload({
			url: $scope.configObj.editClientSave,
			data: {file: $file,clientId:$localStorage.selectedClientid}
		})
		.then(function (resp) { 
			//console.log(resp);
			if(previousImgId && clientLogoId == previousImgId){
				oldImgId = previousImgId;
			}
			clientLogoId = resp.data.substr(resp.data.lastIndexOf('&') + 1);

			var resultImg =resp.data.substr(0,resp.data.lastIndexOf('&'));
			$scope.editClientimg.dataUrl =resultImg+"";
			if($localStorage.loginDetails.admin!='superadmin'){
				$rootScope.clientPic.dataUrl = resultImg;
			}

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
		$scope.toggleText = $scope.toggle ? 'Permissioned' : 'No Permission';

	})
	$scope.clientUpdate = function(isValid) {
		$scope.submitted =true;
		if(isValid){

			if($scope.myCroppedImage!="") {
			var data = {
					clientId:$localStorage.selectedClientid,
					clientLogo: $scope.myCroppedImage
					}
			$http({
				method: 'POST',
				url: $scope.configObj.updateClientLogoInfo,
				data:data
			}).then(function successCallback(response) {
				if(response.data.ok==1) { 
					$scope.editClientimg = $scope.myCroppedImage;
					if($localStorage.loginDetails.admin!='superadmin'){
						$rootScope.clientPic.dataUrl = $scope.myCroppedImage;
					}
					$scope.cropShow = false;
				}	
			});
			}
			
			var adminType='';
			//console.log($localStorage.loginDetails.custDetails.email);
			if($scope.clientEmailId =='sp@ix.com'){
				adminType = 'superadmin';
			}else{
				adminType = 'clientadmin';
			}
			var itemFound = $filter('filter')( $scope.industryType, { industryType: $scope.selectedIndustryType  }, true)[0];
//			console.log(itemFound);
			if($scope.industryType.indexOf(itemFound) == -1 ||  itemFound ==undefined) {
				Flash.create('danger','Please Select the Industry Type from the List',2000, {container: 'flash-fixed-editClient'});
				$window.scrollTo(0, 0);
				return;
			}
			console.log(adminType);
			var data = {
					_id:$localStorage.selectedClientid,
					name: $scope.clientName,
					clientemail: $scope.clientEmailId,
					clientindustry:$scope.selectedIndustryType,
					clientaddress:$scope.clientAddress,
					primarycolor:  takeSurveyPrimaryColor ,
					accentcolor:takeSurveyAccentColor,
					smsconsent:$scope.toggle?true:false,
					reportthreshould:$scope.threshold,
					imageid:clientLogoId,
					status:'active',
					admin:adminType,
					previousImgId:oldImgId
			}



			$http({
				method: 'POST',
				url: $scope.configObj.updateClientInfo,
				data:data
			}).then(function successCallback(response) {
				//console.log('indystry Type',response.data);
				if(response.data.type)
				{
					$localStorage.loginDetails.smsEnable=response.data.data.smsconsent;
					var updatedData = {'name':response.data.data.name,'clientId':response.data.data._id}

					var foundItem = $filter('filter')( $rootScope.customers, { clientId: response.data.data._id  }, true)[0];
					//get the index
					var index = $rootScope.customers.indexOf(foundItem );
					$rootScope.customers[index]= updatedData;
//					console.log(updatedData.name)

					$rootScope.$emit("clientNameChange",updatedData.name);
					$rootScope.$broadcast("clientNameChange", {
						data:updatedData.name// send whatever you want
					}); 
					$window.scrollTo(0, 0);
					Flash.create('success','Client Updated Successfuly',2000, {container: 'flash-fixed-editClient'});
							window.location = envsetting.client.contextPath+"#/participants";
							$('.loader').show();

				}
				else{

					console.log('Failure ',response.data);
				}
				// this callback will be called asynchronously
				// when the response is available
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});

		}

	}
	$scope.updateArray = function(index, data) {
		console.log($rootScope.customers[index],index);

		console.log($rootScope.customers);
	};

	$scope.getlogo = function(clientImageid){
		if(clientImageid){
			$http({
				method: 'POST',
				url: $scope.configObj.getClientLogo,
				data:JSON.stringify({'clientId':clientImageid}),
			}).then(function successCallback(response) {
				//console.log('get Image',response);
				if(response.data != undefined && response.data.data!=null && response.data.data.clientLogo)
					$scope.editClientimg =response.data.data.clientLogo;
				else 
					$scope.editClientimg ='images/sp_logo.png';
				//$scope.myCroppedImage = response.data.clientLogo;	
				// this callback will be called asynchronously
				// when the response is available
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}else{
			$scope.editClientimg ='images/sp_logo.png';
		}

	}
	$rootScope.$on('clientChangeEvent', function (event, data) {
		//console.log($localStorage.selectedClientid,'$localStorage.selectedClientid');
		if($localStorage.selectedClientid.length==0){
			clearFields()
		}else{
			$scope.getClientdetails($localStorage.selectedClientid);
		}

	});

	if($localStorage.selectedClientid){
		
		if($localStorage.selectedClientid.length==0){
			clearFields()
		}else{
			$scope.getClientdetails($localStorage.selectedClientid);
		}
	}
	function clearFields(){
		$scope.editClientimg="";
		$scope.clientName= '';
		$scope.clientEmailId='';
		$scope.selectedIndustryType='';
		$scope.clientAddress='';
		$scope.toggle = false;
		$scope.threshold='';
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