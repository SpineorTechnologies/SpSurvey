'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:distributeController
 * @description
 * # distributeController
 * Controller of the spApp
 */
var spApp=angular.module('spApp');

spApp.controller('distributeController', ['$scope','$rootScope','$localStorage','$filter','$location',function($scope,$rootScope,$localStorage,$filter,$location) {
    $scope.showSurveyDateRange=false;

    //initialising the values-start
    $scope.survey_url="";
    $scope.phone=true;
    $scope.email=true;
    $scope.sms=($localStorage.loginDetails.smsEnable=='true');
    $scope.distribute_pulse=false;
    $scope.distribute_pulse_period='Weekly';
    $scope.target_audience="select_all";
    $scope.anonymous=false;
    $scope.datePattern=/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/i;
    // var today=new Date();
    // $scope.currentDate=$filter('date')(today, "MM/dd/yyyy");
    //initialising the values-end

    //updating the start date and end date-start
	var start_date=$localStorage.SURVEY_OBJ2EDIT.start_date;
	var end_date=$localStorage.SURVEY_OBJ2EDIT.end_date;    
    var distribute=$localStorage.SURVEY_OBJ2EDIT.distribute;
	if(start_date){
		$scope.start_date=$filter('date')(start_date, "MM/dd/yyyy");
	}else{
	    start_date= $scope.start_date;
	}
	if(end_date){
		$scope.end_date=$filter('date')(end_date, "MM/dd/yyyy");
	}
	else{
        end_date= $scope.end_date;
    }
    //updating the start date and end date-end
    
    //updating or creating the new distribute dataset-start

    if(distribute){
            $scope.survey_url="";//distribute.survey_url;
            $scope.phone=distribute.channel.phone.phone_select;
            $scope.email=distribute.channel.email.email_select;
            if($localStorage.loginDetails.smsEnable=='true'){
                $scope.sms=distribute.channel.sms.sms_select;
            }
            $scope.target_audience=distribute.target_audience.select;
            $scope.random_percentage=distribute.target_audience.random_percentage;
            $scope.distribute_pulse=distribute.pulse
            $scope.distribute_pulse_period=distribute.pulse_period;
            $scope.anonymous=distribute.anonymous;
    }else{
        // if($scope.survey_url==undefined){
        //     $scope.survey_url="";
        // }
        $localStorage.SURVEY_OBJ2EDIT.distribute={
            "survey_url":$scope.survey_url,
            "anonymous":$scope.anonymous,
            "pulse":$scope.distribute_pulse,
            "pulse_period":$scope.distribute_pulse_period,
            "target_audience": {
                "select":$scope.target_audience,
                "random_percentage":$scope.random_percentage
                },
            "channel": {
                "phone":{
                    "phone_select":$scope.phone,
                    "phone_remainder":8
                },
                "email":{
                    "email_select":$scope.email,
                    "phone_remainder":4
                },
                "sms":{
                   "sms_select":$scope.email,
                   "sms_remainder":3
                }
            }
        };
    }
    //updating or creating the new distribute dataset-end
    $scope.validateDateRanges=function(){
            if($scope.start_date){
                var dateArr=$scope.start_date.split("/");
			    var date1 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);	
            }
            if($scope.end_date){
			dateArr=$scope.end_date.split("/");
			var date2 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
            }
            if(date1 &&  date2){
                var timeDiff = date2.getTime() - date1.getTime();
            if(timeDiff<0){
                 $scope.showSurveyDateRange=true;
            }else{
                 $scope.showSurveyDateRange=false;
            }
			//var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            }
			//console.log('$scope.start_date',$scope.start_date,'$scope.end_date',$scope.end_date,'diffDays',diffDays);
    }
    //synchronising the changes-start
    $scope.syncDistributeDataChanges=function(){
            $scope.validateDateRanges();
            $localStorage.SURVEY_OBJ2EDIT.survey_url=$scope.survey_url;
            $localStorage.SURVEY_OBJ2EDIT.start_date=$scope.start_date;
            $localStorage.SURVEY_OBJ2EDIT.end_date=$scope.end_date;
            if($localStorage.SURVEY_OBJ2EDIT.distribute){
                $localStorage.SURVEY_OBJ2EDIT.distribute.survey_url=$scope.survey_url;       
                $localStorage.SURVEY_OBJ2EDIT.distribute.channel.phone.phone_select=$scope.phone;
                $localStorage.SURVEY_OBJ2EDIT.distribute.channel.email.email_select=$scope.email;
                if($localStorage.loginDetails.smsEnable!='true'){
                    $scope.sms=false; 
                }
                $localStorage.SURVEY_OBJ2EDIT.distribute.channel.sms.sms_select=$scope.sms;
                $localStorage.SURVEY_OBJ2EDIT.distribute.target_audience.select=$scope.target_audience;
                $localStorage.SURVEY_OBJ2EDIT.distribute.target_audience.random_percentage=$scope.random_percentage;
                $localStorage.SURVEY_OBJ2EDIT.distribute.pulse=$scope.distribute_pulse;             
                $localStorage.SURVEY_OBJ2EDIT.distribute.pulse_period=$scope.distribute_pulse_period; 
                $localStorage.SURVEY_OBJ2EDIT.distribute.anonymous=$scope.anonymous;  
            }             
    }
     //synchronising the changes-end
	
}]);