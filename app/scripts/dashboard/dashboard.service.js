'use strict';
angular.module('spApp')
.factory('dashboardService', ['envsetting','$http','$location',function( envsetting,$http,$location){
	//console.log('from dashboard service envsetting',envsetting);
	var serverURL=envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	//alert(serverURL);
	var configObj={};
	
	//grid dataset -- start
	configObj.fetchActionPlanningData= serverURL+"/api/dashboard/fetchActionPlanningData/";
	configObj.fetchActionPlanningHistoricalData= serverURL+"/api/dashboard/fetchActionPlanningHistoricalData/";
	configObj.fetchHighLowByPctFav = serverURL+"/api/dashboard/fetchHighLowByPctFav/";
	configObj.fetchParticipantsRates = serverURL+"/api/dashboard/fetchParticipantsRates/";
	configObj.fetchFilterInitData = serverURL+"/api/dashboard/fetchFilterInitData/";
	configObj.fetchSurveyDates = serverURL+"/api/dashboard/fetchSurveyDates/";
	configObj.saveDashboardPreferences= serverURL+"/api/dashboard/saveDashboardPreferences/";
	configObj.saveActionPlanningData= serverURL+"/api/dashboard/saveActionPlanningData/";
	configObj.fetchHighLevelSummaryData= serverURL+"/api/dashboard/fetchHighLevelSummaryData/";
	configObj.fetchOverallPctFavData= serverURL+"/api/dashboard/fetchOverallPctFavData/";
	configObj.fetchWordCloudData= serverURL+"/api/dashboard/fetchWordCloudData/";
	configObj.fetchWordCloudDataByQuestions= serverURL+"/api/dashboard/fetchWordCloudDataByQuestions/";
	configObj.fetchwordCloudDatabywords= serverURL+"/api/dashboard/fetchwordCloudDatabywords/";
	configObj.fetchHotSpotData= serverURL+"/api/dashboard/fetchHotSpotData/";
	configObj.fetchCommonData= serverURL+"/api/dashboard/fetchCommonData/";
	configObj.fetchHistoricalCommonData= serverURL+"/api/dashboard/fetchHistoricalCommonData/";
	configObj.fetchAPCategoryByQues= serverURL+"/api/dashboard/fetchAPCategoryByQues/";
	configObj.getOverAllData= serverURL+"/api/dashboard/getOverAllData/";
	configObj.pdfexport= serverURL+"/api/dashboard/pdfexport/";
	configObj.fetchAPData= serverURL+"/api/dashboard/fetchAPData/";

	
	
	
	//grid dataset -- end
	
	return {	
		fetchAPData:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.fetchAPData,
		        data:{
		        	"params":params
		        },
		    }).then(success,error);
		},
		pdfexport:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.pdfexport,
		        data:{
		        	"params":params
		        },
		        responseType:'arraybuffer'
		    }).then(success,error);
		},
		getOverAllData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.getOverAllData,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchAPCategoryByQues: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchAPCategoryByQues,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchHotSpotData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchHotSpotData,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchHighLevelSummaryData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchHighLevelSummaryData,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchHistoricalCommonData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchHistoricalCommonData,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchCommonData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchCommonData,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},fetchWordCloudDataByQuestions: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchWordCloudDataByQuestions,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchWordCloudData: function(params,success,error) {
			/*$http({
		        method : "GET",
		        url :'data/wordcloud.json',
		        data:{
		        	"params":params
		        }
		    }).then(success,error);*/
			$http({
		        method : "POST",
		        url :configObj.fetchWordCloudData,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchOverallPctFavData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchOverallPctFavData,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		saveDashboardPreferences: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.saveDashboardPreferences,
		        data:{
		        	"filterData":params
		        }
		    }).then(success,error);
		},
		saveActionPlanningData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.saveActionPlanningData,
		        data:{
		        	"data":params
		        }
		    }).then(success,error);
		},
		fetchParticipantsRates: function(params,success,error) {
			
			$http({
		        method : "POST",
		        url :configObj.fetchParticipantsRates,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchFilterInitData: function(params,success,error) {
			$http({
		        method : "POST",
		        url :configObj.fetchFilterInitData,









		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		},
		fetchwordCloudDatabywords:function (params, success, error) {
			$http({
		        method : "POST",
		        url :configObj.fetchwordCloudDatabywords,
		        data:{
		        	"params":params
		        }
		    }).then(success,error);
		}
	}
	
}]);