
'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:mySurveyController
 * @description
 * # mySurveyController
 * Controller of the spApp
 */
var spApp=angular.module('spApp');
spApp.controller('mySurveyController',['envsetting','$localStorage','$scope','$location','$http','NgTableParams','$rootScope',function(envsetting,$localStorage,$scope,$location,$http,NgTableParams,$rootScope) {


	
var serverURL= envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	$scope.configObj = {};
	$scope.configObj.loadCustomerSurveys = serverURL+"/api/surveys/loadCustomerSurveys/";
	$scope.configObj.deleteCustomerSurvey = serverURL+"/api/surveys/deleteCustomerSurvey/";
	$scope.configObj.fetchCustomerSurveyResponses = serverURL+"/api/surveys/fetchCustomerSurveyResponses/";
		
		


//-----------------creating a new survey -start-------------------//
	$scope.gotoBuildSurvey=function(){
		$localStorage.SURVEY_OBJ2EDIT={};
		$location.path("/buildSurvey" );
	}
//-----------------creating a new survey -end--------------------//

$rootScope.$on('clientChangeEvent', function (event, data) {
	$scope.loadMysurvey();
});
$scope.loadMysurvey=function(){
	$('.loader').show();
	$http({
		method : "POST",
		url : $scope.configObj.loadCustomerSurveys,
		// data:{"clientId":$localStorage.loginDetails.clientId}
		 data:{"clientId":$localStorage.selectedClientid}
		}).then(function (response) {
			$('.loader').hide();
		if(!$rootScope.mysurveydata){
			$rootScope.mysurveydata=[];	
		}
		//-----------------loading the column headers-start-------------------//		
		var  jsonObj = [];
		$scope.headers=[{
				"field": "survey_name",
				"name": "Survey Name"
			},
			{
				"field": "survey_type",
				"name": "Survey Type"
			},
			{
				"field": "start_date",
				"name": "Start Date"
			},
			{
				"field": "end_date",
				"name": "End Date"
			},
				{
				"field": "status",
				"name": "Status"
		},/*
				{
				"field": "participation_rates",
				"name": "Participation Rates"
			},*/
				{
				"field": "actions",
				"name": "Actions"
			}]
			$($scope.headers).each(function(key,value) {
				var item = {}
				var filterItem ={}
				if(value.field=="actions"){
					item ["sortable"] =false;
					item ["filter"] = false;
				}
				else{
					item ["sortable"] = value.field;
					item ["filter"] = filterItem;
				}
				filterItem [value.field] = "text"
				item ["title"] = value.name;
				item ["field"] = value.field;
				item ["show"] = true; 
				jsonObj.push(item);
			});
		$scope.columns = jsonObj;
		//-----------------loading the column headers-end-------------------//	
		if($rootScope.mysurveydata.length>0){
			$scope.data=$rootScope.mysurveydata;
			
		}else{
			$scope.data=response.data["surveyList"];
		}
//-----------------dynamically loading the rows in the data-grid -start--------------------//	
	/*var survey_container= $( "#mysurvey_container" );
	var window_height = $(window).height();
	var survey_container_position = survey_container.offset();
	var content_blockheight = $(window).height() - survey_container_position.top - 50;
	$("#mysurvey_container").height(content_blockheight);	
	var panel_table_height=Math.floor((angular.element("#panel_table").height()-255)/45);*/
		$scope.tableParams = new NgTableParams({
			page: 1, 
			total: 1,
			count: 10
		}, {
			counts: [],
			filterDelay: 30,                        
			data: $scope.data
		});
		(function() {
			"use strict";
			angular.module("spApp").run(configureDefaults);
			configureDefaults.$inject = ["ngTableDefaults"];
			function configureDefaults(ngTableDefaults) {
				ngTableDefaults.params.count =10;
				ngTableDefaults.settings.counts = [];
			}
		})  
//-----------------dynamically loading the rows in the data-grid -end--------------------//
});
	
}
	$scope.loadMysurvey();
	//deleteSurvey -- start
	$scope.deletemsg="";
	$scope.confirmDeleteOption=true;
	$scope.delete_survey=function(row){
		angular.element('.modal-backdrop').removeClass('in');
		$http({
			method : "POST",
			url : $scope.configObj.fetchCustomerSurveyResponses,
			data:{
				"customer_survey_id":row._id
				}
			}).then(function mySucces(response) {
				if(response.data.type==true){
					angular.element('.modal-backdrop').css('display', 'none');
					$scope.deletemsg="Are you sure you want to delete the survey?";
					$scope.confirmDeleteOption=true;
				}else{
					$scope.deletemsg="You cannot delete this survey";
					$scope.confirmDeleteOption=false;
				}
			},function myError(response){
				console.log("test response.statusText:"+response.statusText);
			});
	}
	$scope.confirmDelete=function(row){
		var index=$scope.data.indexOf(row);
		$scope.data.splice(index,1);
		$scope.tableParams.reload();
		$scope.tableParams.total($scope.data.length);
		$http({
			method : "POST",
			url : $scope.configObj.deleteCustomerSurvey,
			data:{
				"customer_survey_id":row._id
				}
			}).then(function mySucces(response) {
				//console.log(response);
				 $('body').removeClass('modal-open');
				 $('body').css('padding-right','0'); 
			},function myError(response){
				//console.log("test response.statusText:"+response.statusText);
			});
		//$scope.loadMysurvey();	
	}
//deleteSurvey -- end
//----------------copying the survey -start--------------------//
		$scope.survey_name=[];
		$scope.copy_survey=function(row){
			var index=$scope.data.indexOf(row);
			var row_copy={};
			angular.copy(row,row_copy);
			angular.forEach($scope.data,function(value,key){
				$scope.survey_name.push(value.survey_name);
			});
			if($scope.survey_name.indexOf(row_copy.survey_name+"_copy_"+0)>0){
				row_copy.survey_name=row.survey_name+"_copy_"+$localStorage[row.survey_name];
			}else{
				
				$localStorage[row.survey_name] = 0;
				row_copy.survey_name=row.survey_name+"_copy_"+$localStorage[row.survey_name];
			}
			$localStorage[row.survey_name]++;
			$scope.configObj.copyCustomerSurvey = serverURL+"/api/surveys/copyCustomerSurvey/";			
			$http({
				method : "POST",
				url : $scope.configObj.copyCustomerSurvey,
				data:{
					"surveyObj2copy":row,
					"survey_name":row_copy.survey_name
					}
			    }).then(function mySucces(response) {
					var new_row=response.data.data;
					$scope.data.splice(index+1,0,response.data.data);
					$scope.tableParams.reload();
					$scope.tableParams.total($scope.data.length);
			    },function myError(response){
				    console.log("test response.statusText:"+response.statusText);
				});
		}
//----------------copying the survey -end--------------------//		
	

//----------------editing the survey -start------------------//	
	$scope.edit_survey=function(row){
		$localStorage.SURVEY_OBJ2EDIT=row;
		$location.path("/buildSurvey");		
	}
//----------------editing the survey -end--------------------//	

//----------------lock/unlock the survey-start---------------//
$scope.enableSurveyLock=false;
$scope.lockCustomerSurvey=function(item){
	item.lock=true;
}
$scope.unlockCustomerSurvey=function(item){
	item.lock=false;
}
//---------------lock/unlock the survey-end------------------//

}]) ;
