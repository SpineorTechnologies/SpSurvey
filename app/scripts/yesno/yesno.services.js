'use strict';
angular.module('spApp')
.factory('yesnoService', ['envsetting','$http','$location',function( envsetting,$http,$location){
	var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	var configObj={};
	configObj.saveDashboardPreferences= serverURL+"/api/yesno/saveDashboardPreferences/";
	configObj.fetchDemographics= serverURL+"/api/yesno/fetchDemographics/";
	configObj.fetchEngagementData= serverURL+"/api/yesno/fetchEngagementData/";
	configObj.fetchQuestionAnalysis= serverURL+"/api/yesno/fetchQuestionAnalysis/";
	configObj.fetchQuestionAnalysisRgs= serverURL+"/api/yesno/fetchQuestionAnalysisRgs/";
	configObj.fetchEngagementRg= serverURL+"/api/yesno/fetchEngagementRg/";
	configObj.fetchGridAnalysis= serverURL+"/api/yesno/fetchGridAnalysis/";

	return {
		saveDashboardPreferences:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.saveDashboardPreferences,
		        data:{
		        	"filterData":params
		        }
		    }).then(success,error);
		},
		fetchDemographics:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.fetchDemographics,
		        data:{
		        	"params":params
		        },
		    }).then(success,error);
		},
		fetchEngagementData:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.fetchEngagementData,
		        data:{
		        	"params":params
		        },
		    }).then(success,error);
		},
		fetchQuestionAnalysis: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchQuestionAnalysis,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchQuestionAnalysisRgs: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchQuestionAnalysisRgs,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchEngagementRg:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.fetchEngagementRg,
		        data:{
		        	"params":params
		        },
		    }).then(success,error);
		},
		fetchGridAnalysis:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.fetchGridAnalysis,
		        data:{
		        	"params":params
		        },
		    }).then(success,error);
		}
	}
	
}]);