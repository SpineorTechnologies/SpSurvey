
'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:dashboardController
 * @description
 * # dashboardController
 * Controller of the spApp
 */
var js_hsViewByurl="";
var js_savepref="";
var js_params={};
var js_dashboard_pref={};
var spApp=angular.module('spApp');
var js_hotspot_row_limit=10;
var js_hotspot_col_limit=10;
var _js_hotspot_viewByData={};
var _js_overAllPctFav=0;
spApp.controller('dashboardController', ['envsetting','orderByFilter','$timeout','$location','$route','$state','$stateParams','$rootScope','dashboardService','$scope','$localStorage','$filter','initDashboardData','NgTableParams','gaugeService','Flash','$window',
function(envsetting,orderBy,$timeout,$location,$route,$state,$stateParams,$rootScope,dashboardService,$scope,$localStorage,$filter,initDashboardData,NgTableParams,gaugeService,Flash,$window) {
	$rootScope.$on('clientChangeEvent', function (event, data) {
		$state.transitionTo($state.current, $stateParams, { 
 		 reload: true, inherit: false, notify: true
		});
	});
	js_hsViewByurl=envsetting.client.serverUrl+"/api/dashboard/fetchHotSpotData/";
	js_savepref=envsetting.client.serverUrl+"/api/dashboard/saveDashboardPreferences/";
	$scope.dbActionPlanningDoc=initDashboardData["actionPlanningData"];
	//console.log('$scope.dbActionPlanningDoc',$scope.dbActionPlanningDoc)
	$scope.actionPlanningDoc={};
	$scope.default_language_key="en";
	$scope.clientId=$localStorage.selectedClientid;
	$scope.surveyTypesModel={};
	$scope.demographicsModel={};
	$scope.demographics=initDashboardData["demographics"];
	$scope.selectedDemographics=[];
	$scope.productTypes=initDashboardData["productTypes"];
	$scope.overAllPctFav=0;
	$scope.hotspot_row_limit=10;
	$scope.hotspot_col_limit=10;
	var apStatusDispArr={};
	var totalAPstatusCount=0;
	var dashboardPref={};	
	dashboardPref.clientId=$scope.clientId;
	dashboardPref.participantId=$localStorage.loginDetails.participantId;
	$scope.apData2save={};
	$scope.wcQuestions= [];
	$scope.export_HLSData=[];

		
	$scope.surveyDates=initDashboardData["surveyDates"];
	
	angular.forEach($scope.surveyDates,function(key,value){
		
		if(value=='completedEndDate'){
			$scope.end_date=$filter('date')(key, "MM/dd/yyyy");

		}else{
			$scope.start_date=$filter('date')(key, "MM/dd/yyyy");
		}
		
		
	});
	//gridster --start
		/*$scope.widgetItems = [
	     { sizeX: 6, sizeY: 2, row: 0, col: 0, id:'container1',title:'Based on your results, we recommend you to take action on these items'},
	     { sizeX: 2, sizeY: 2, row: 2, col: 0, id:'container2',title:'Overall'},
	     { sizeX: 4, sizeY: 2, row: 2, col: 2, id:'container3',title:'High Level Summary'},
	     { sizeX: 4, sizeY: 2, row: 4, col: 0, id:'container4',title:'Your Teams Highest and Lowest Rated Items'},
	     { sizeX: 2, sizeY: 2, row: 4, col: 4, id:'container5',title:'Participation'},
	     //{ sizeX: 2, sizeY: 2, row: 6, col: 0, id:'container6',title:'Top Alerts'},
	     { sizeX: 10, sizeY: 2, row: 10, col: 0, id:'container7',title:'Open Ended Comments'},
	     //{ sizeX: 3, sizeY: 2, row: 8, col: 0, id:'container8',title:'Historical Trending'},
	     //{ sizeX: 3, sizeY: 2, row: 8, col: 3, id:'container9',title:'Your Teams Level of Readiness for Change'},
	     { sizeX: 6, sizeY: 3, row: 10,col: 0, id:'container10',title:'Hotspot'}
	    ];*/
	$scope.widgetItems = [];


	if($localStorage.loginDetails.admin && $localStorage.loginDetails.admin == 'superadmin'){
		$scope.widgetItems = [
		                      { sizeX: 6, sizeY: 2, row: 0, col: 0, id:'container1',title:'Based on your results, we recommend you to take action on these items'},
		                      { sizeX: 2, sizeY: 2, row: 2, col: 0, id:'container2',title:'Overall'},
		                      { sizeX: 4, sizeY: 2, row: 2, col: 2, id:'container3',title:'High Level Summary'},
		                      { sizeX: 4, sizeY: 2, row: 4, col: 0, id:'container4',title:'Your Teams Highest and Lowest Rated Items'},
		                      { sizeX: 2, sizeY: 2, row: 4, col: 4, id:'container5',title:'Participation'},
		                      //{ sizeX: 2, sizeY: 2, row: 6, col: 0, id:'container6',title:'Top Alerts'},
		                      { sizeX: 6, sizeY: 2, row: 6, col: 0, id:'container7',title:'Open Ended Comments'},
		                      //{ sizeX: 3, sizeY: 2, row: 8, col: 0, id:'container8',title:'Historical Trending'},
		                      //{ sizeX: 3, sizeY: 2, row: 8, col: 3, id:'container9',title:'Your Teams Level of Readiness for Change'},
		                      { sizeX: 6, sizeY: 3, row: 8,col: 0, id:'container10',title:'Hotspot'},
							  //{ sizeX: 6, sizeY: 2, row: 11,col: 0, id:'container11',title:'Engagement Index By Demographics'},
							  //{ sizeX: 2, sizeY: 2, row: 0, col: 0, id:'container12',title:'Engagement Index'} 
		                      ];
	}else{
		if($localStorage.loginDetails.access.length >0 && $localStorage.loginDetails.access.indexOf('Report')!== -1){
			$scope.widgetItems = [
			                  //{ sizeX: 6, sizeY: 2, row: 0, col: 0, id:'container1',title:'Based on your results, we recommend you to take action on these items'},
		                      { sizeX: 2, sizeY: 2, row: 2, col: 0, id:'container2',title:'Overall'},
		                      { sizeX: 4, sizeY: 2, row: 2, col: 2, id:'container3',title:'High Level Summary'},
		                      { sizeX: 4, sizeY: 2, row: 4, col: 0, id:'container4',title:'Your Teams Highest and Lowest Rated Items'},
		                      { sizeX: 2, sizeY: 2, row: 4, col: 4, id:'container5',title:'Participation'},
		                      //{ sizeX: 2, sizeY: 2, row: 6, col: 0, id:'container6',title:'Top Alerts'},
		                      { sizeX: 6, sizeY: 2, row: 6, col: 0, id:'container7',title:'Open Ended Comments'},
		                      //{ sizeX: 3, sizeY: 2, row: 8, col: 0, id:'container8',title:'Historical Trending'},
		                      //{ sizeX: 3, sizeY: 2, row: 8, col: 3, id:'container9',title:'Your Teams Level of Readiness for Change'},
		                      { sizeX: 6, sizeY: 3, row: 8,col: 0, id:'container10',title:'Hotspot'},
							  //{ sizeX: 6, sizeY: 2, row: 11,col: 0, id:'container11',title:'Engagement Index By Demographics'},
							  //{ sizeX: 2, sizeY: 2, row: 0, col: 0, id:'container12',title:'Engagement Index'} 
		                      ];
		}
		if($localStorage.loginDetails.access.length >0 && $localStorage.loginDetails.access.indexOf('Action Planning')!== -1){
				$scope.widgetItems.unshift({ sizeX: 6, sizeY: 2, row: 0, col: 0, id:'container1',title:'Based on your results, we recommend you to take action on these items'});
		}

		}
		
				$scope.gridsterOptions = {
				minSizeY: 2,
				columns:6,
				resizable: {
					enabled: false,
					handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
					start: function(event, $element, widget) {
						//$scope.gridsterOptions.minSizeX=widget.sizeX;
					},
					resize: function(event, $element, widget) {
						//$scope.gridsterOptions.minSizeY=widget.sizeY;
					},
					stop: function(event, $element, widget) {
						//$scope.gridsterOptions.minSizeX=widget.sizeX;
					}
				},
				draggable: {
					enabled: true
				},
				margin: [20,20]
			};
			$scope.removedWidgets=[];		
	//gridster --end
	//highlevel summary --start
	$scope.HLS_viewByDemographics=[];
	$scope.HLS_compare2Company="";
	
	$scope.selectedHLSView={};
	$scope.dataHLSOptions=[];
	$scope.viewByDemoGraphicItems=[];
	$scope.selectedHLSDemoGraphicItem={};
	//highlevel summary --end

	//hotspot --start
	$scope.hotspotRg="";
	$scope.hotspotRgs=[];
	$scope.selectedhotspotRg={};
	$scope.selectedHotspotView={};
	$scope.selectedHotspotView='categoryText';
	//$scope.clearFiltersModel=false;
	$scope.showMoreHsRg="default";
	$scope.apOrderedData=[];
	//hotspot --end

	//restore dashboard pref -- start
	var dashboard_pref=initDashboardData["dashboard_pref"];
	js_dashboard_pref=dashboard_pref;
	
	/*if(dashboard_pref["selectedDemographics"] && dashboard_pref["selectedDemographics"].length>0){
		$scope.selectedDemographics=dashboard_pref["selectedDemographics"];
		var rgi4pref=[];
		for(var i=0;i<$scope.selectedDemographics.length;i++){
			var tmpObj={};
			var rgiArr=[];
			var demoObj=$scope.selectedDemographics[i];
			var obj={};
			for(var z=0;z<demoObj.demographicItems.length;z++){
				var rgiObj=demoObj.demographicItems[z];
				if(rgiObj){
					obj[rgiObj.displayName]=rgiObj.count;
				}
				
			}
			tmpObj.respondentCount=demoObj.respondentCount;
			tmpObj.displayName=demoObj.displayName;
			tmpObj.fieldType=demoObj.fieldType;
			tmpObj.demographic=demoObj.demographic;
			tmpObj.demographicItems=obj;
			rgi4pref.push(tmpObj);
		}
		if(rgi4pref.length>0){
			$scope.demographics=rgi4pref;
		}
	}*/
	
	if(dashboard_pref["apOrderedData"]){
		$scope.apOrderedData=dashboard_pref["apOrderedData"];
	}
	if(dashboard_pref["hotspotRgs"]){
		$scope.hotspotRgs=dashboard_pref["hotspotRgs"];
	}
	if(dashboard_pref["widgetItems"]){
		$scope.widgetItems=dashboard_pref["widgetItems"];
	}
	if(dashboard_pref["removedWidgets"]){
			$scope.removedWidgets=dashboard_pref["removedWidgets"];
	}

	if(dashboard_pref["surveyTypesModel"]){
		$scope.surveyTypesModel=dashboard_pref["surveyTypesModel"];
	}
	if(dashboard_pref["demographicsModel"]){
		var demoModel={};
		angular.forEach(dashboard_pref["demographicsModel"],function(value,key){
			//var rgi=key.replace(/_/g,'.');
			demoModel[key]=value;
		});
		$scope.demographicsModel=demoModel;
	}
	
	if(dashboard_pref["start_date"]){
		$scope.start_date=dashboard_pref["start_date"];
	}
	if(dashboard_pref["end_date"]){
		$scope.end_date=dashboard_pref["end_date"];
	}
	if(dashboard_pref["HLS_viewByDemographics"]){
		$scope.HLS_viewByDemographics=dashboard_pref["HLS_viewByDemographics"];
	}
	if(dashboard_pref["HLS_compare2Company"]){
		$scope.HLS_compare2Company=dashboard_pref["HLS_compare2Company"];
	}
	
	if(dashboard_pref["selectedHLSView"]){
		 $scope.selectedHLSView=dashboard_pref["selectedHLSView"];
	}
	if(!$scope.selectedHLSView||!$scope.selectedHLSView["field"] ){
		$scope.selectedHLSView={
			field: 'category', title: 'View By Category'
		}
	}

	if(dashboard_pref["viewByDemoGraphicItems"]){
		 $scope.viewByDemoGraphicItems=dashboard_pref["viewByDemoGraphicItems"];
	}
	
	if(dashboard_pref["selectedHLSDemoGraphicItem"]){
		 $scope.selectedHLSDemoGraphicItem=dashboard_pref["selectedHLSDemoGraphicItem"];
	}
	
	if(dashboard_pref["wordcloudSelectedQuestion"]){
		 $scope.wordcloudSelectedQuestion=dashboard_pref["wordcloudSelectedQuestion"];
	}

	if(dashboard_pref["hotspotRg"]){
		$scope.hotspotRg=dashboard_pref["hotspotRg"];
	}
	if(dashboard_pref["selectedHotspotView"]){
		$scope.selectedHotspotView=dashboard_pref["selectedHotspotView"];
	}
	// if(dashboard_pref["clearFiltersModel"]){
	// 	$scope.clearFiltersModel=dashboard_pref["clearFiltersModel"];
	// }

	if(dashboard_pref["showMoreHsRg"]){
		$scope.showMoreHsRg=dashboard_pref["showMoreHsRg"];
	}
	

		
	//restore dashboard pref --end
	
	
	$scope.surveyTypes=initDashboardData["surveyTypes"];
	$scope.customerSurveys=initDashboardData["customerSurveys"];
	var defaultSurveyTypes=[];
	var surveyNamesNId={};
	for(var x=0;x<$scope.customerSurveys.length;x++){
		var surveyObj=$scope.customerSurveys[x];
		surveyNamesNId[surveyObj.customer_survey_id]=surveyObj.surveyName[$scope.default_language_key];
		defaultSurveyTypes.push(surveyObj.customer_survey_id);
	}
	
	$scope.selectedSurveyTypes="";
	$scope.selectedSurveyDates="";
	
	var  HLSObj= [];

	
	$scope.summaryHeaders=[{
					"field": "summary_demographics",
					"name": "View By Demographic"
				},
				{
					"field": "summary_n",
					"name": "N"
				},
				{
					"field": "mean_score",
					"name": "Mean Score"
				},
				{
					"field": "pctFav",
					"name": "% Favorable"
				},
					{
					"field": "company_delta",
					"name": "Comparison to Company"
				}]
	$($scope.summaryHeaders).each(function(key,value) {
		var item = {}
		item ["sortable"] =false;
		item ["filter"] = false;
		item ["title"] = value.name;
		item ["field"] = value.field;
		item ["show"] = true; 
		HLSObj.push(item);
	});
	$scope.columns = HLSObj;
	//highlevel summary --end
	
	//toggle logic -- start
	$scope.ap_display="dashboard";
	
	$scope.toggleAP=function(val){	
		if(val=='showDashboard'){
			$scope.ap_display="dashboard";
			$state.transitionTo($state.current, $stateParams, { 
				 		 reload: true, inherit: false, notify: true
			});
		}else if(val=='planDashboard'){
			$scope.dbActionPlanningDoc=initDashboardData["actionPlanningData"];
			$scope.ap_display="planDashboard";
			var myPlanObj=[];
			$scope.myPlanHeaders=[{
					"field": "planName",
					"name": "Plan Name"
				},{
					"field": "planSurveyName",
					"name": "Survey Name"
				},{
					"field": "startDate",
					"name": "Start Date"
				},{
					"field": "dueDate",
					"name": "End Date"
				},{
					"field": "actionPlanCreator",
					"name": "Plan Owner"
				},{
					"field": "selectedDLAForPlan",
					"name": "DLA"
				},{
					"field": "planStatus",
					"name": "Plan Status"
				}];
			$($scope.myPlanHeaders).each(function(key,value) {
				var item = {};
				var filterItem ={};
				filterItem [value.field] = "text";
				item ["field"] = value.field;
				item ["title"] = value.name;
				item ["filter"] = filterItem;	
				item ["sortable"] =value.field;	
				item ["show"] = true; 							
				myPlanObj.push(item);
			});
			$scope.myPlanColumns = myPlanObj;
			var myPlanData=[];
			dashboardService.fetchAPData(params,function(response){
				var apViewPlanDataWithFilter=response.data.data["APDataForViewPlans"];
				if($localStorage.loginDetails.admin=="superadmin"){
					angular.forEach($scope.dbActionPlanningDoc,function(value,key){
						angular.forEach(value,function(v,k){
							if(k!="_id" && k!="adminId" && k!="clientId"){
								  if(v.selectedDLAForPlan && v.selectedDLAForPlan!="All"){
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[$]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[/"]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[{]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[}]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[{]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[}]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[[]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[:]+/g,' ');
										v.selectedDLAForPlan = tools_replaceAll(v.selectedDLAForPlan,"nin",'not in') ;
										var splitString=v.selectedDLAForPlan.split(" ");
										if(splitString[0]=="and" || splitString[0]=="or"){
											splitString.splice(0,1);
										}
										v.selectedDLAForPlan= splitString.join(' ');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[,]+/g,', ');
								  }
								  myPlanData.push(v);
							}
						});
					});
				}else{
					angular.forEach(apViewPlanDataWithFilter,function(value,key){
						angular.forEach($scope.dbActionPlanningDoc,function(v,k){
							if(k!="_id" && k!="adminId" && k!="clientId" && value["_id"]==v["areaFocus"]){
								if(v.selectedDLAForPlan && v.selectedDLAForPlan!="All"){
									 	v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[$]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[/"]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[{]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[}]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[{]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[}]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[[]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/]+/g,'');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[:]+/g,' ');
										v.selectedDLAForPlan = tools_replaceAll(v.selectedDLAForPlan,"nin",'not in') ;
										var splitString=v.selectedDLAForPlan.split(" ");
										if(splitString[0]=="and" || splitString[0]=="or"){
											splitString.splice(0,1);
										}
										v.selectedDLAForPlan= splitString.join(' ');
										v.selectedDLAForPlan =  v.selectedDLAForPlan.replace(/[,]+/g,', ');
								  }
								 myPlanData.push(v);				
							}
						});
					});
				}
			$scope.myPlansTableParams = new NgTableParams({page: 1, total: 1,count: Object.keys(myPlanData).length},{counts: [],filterDelay: 30,data: myPlanData});
			});
		}else if(val=='showMyplan'){
			$scope.ap_display="myplan";
			$scope.ActionEmptyErrMsg="";
			if($scope.apOrderedData && $scope.apOrderedData[0]){
			$scope.getRecommendation($scope.apOrderedData[0].formatQuestionText,$localStorage.loginDetails.participantId);
			}
			$scope.checkPlanExists={};
				if($localStorage.loginDetails.admin=="superadmin"){
					angular.forEach($scope.dbActionPlanningDoc,function(value,key){
						angular.forEach(value,function(v,k){
							if(k!="_id" && k!="adminId" && k!="clientId"){
								$scope.checkPlanExists[v.formatQuestionText]=false;
								if(v.planName && v.createdAdmin==$localStorage.loginDetails.participantId){
									$scope.checkPlanExists[v.formatQuestionText]=true;					
								}	
							}
						});
					});
				}else{
					angular.forEach($scope.dbActionPlanningDoc,function(v,k){
						if(k!="_id" && k!="adminId" && k!="clientId"){
							$scope.checkPlanExists[v.formatQuestionText]=false;
							if(v.planName && v.createdAdmin==$localStorage.loginDetails.participantId){
								$scope.checkPlanExists[v.formatQuestionText]=true;					
							}	
						}
					});
			 }
			/*if($scope.apOrderedData && $scope.apOrderedData[0]){
				for(var z=$scope.apOrderedData.length-1;z>=0;z--){
					$scope.getRecommendation($scope.apOrderedData[z].questionText,$localStorage.loginDetails.participantId);
				}
				
			}*/
			
		}else if(val=='showManagePlan'){
			var recommendationEmptyArr=[];
			var recommendationFoundArr=[];
			$scope.actionFoundArr=[];
			angular.forEach($scope.recommendations,function(value,key){
				var kArr=key.split("\t");
				var quesKey=kArr[0]+"";
				if($scope.showRecommendation==quesKey){
					$scope.actionFoundArr.push(value);
					if(!value){
						recommendationEmptyArr.push(value);
					}
					else{
						recommendationFoundArr.push(value);
					}	
				}
			});
			if(recommendationEmptyArr.length>0 || !recommendationFoundArr.length>0){
				$scope.ap_display="myplan";
				$scope.ActionEmptyErrMsg="Actions cannot be empty!"
				
			}else{
				$scope.ap_display="manageplan";
			}
		}
		
	};
	$scope.gotoEditPlan=function(row){	
		$scope.showRecommendation=row.formatQuestionText;
		$scope.getRecommendation(row.formatQuestionText,row.createdAdmin);
		$scope.ap_display="manageplan";
	}
	//toggle logic -- start
	//Participation --start

	$scope.participantRatePct=0;
	$scope.participantRatesCompletedParticipants=0;
	$scope.participantRatesTotalParticipants=0;


	var params={};
	params.clientId=$scope.clientId;
	//params.surveyTypes=defaultSurveyTypes;
	params.customerSurveys=defaultSurveyTypes;
	params.pctFavArr=[];//initDashboardData["pctFavArr"]
	params.productTypes=$scope.productTypes;
	
	/*if(params.pctFavArr){
		params.pctFavArr=initDashboardData["pctFavArr"].reverse();
	}*/
	
//	console.log("params.pctFavArr",params.pctFavArr)
	params.surveyTypesModel=$scope.surveyTypesModel;
	params.demographics=initDashboardData["demographics"];
	params.start_date=$scope.start_date;
	params.end_date=$scope.end_date;
	params.threshold=0;
	params.HLS_viewByDemographics=$scope.HLS_viewByDemographics;
	params.HLS_compare2Company=$scope.HLS_compare2Company;
	params.selectedHLSView=$scope.selectedHLSView;
	params.selectedHLSDemoGraphicItem=$scope.selectedHLSDemoGraphicItem;
	params.hotspotRg=$scope.hotspotRg;
	params.selectedHotspotView=$scope.selectedHotspotView;
	//console.log('$localStorage.loginDetails.threshold',$localStorage.loginDetails.threshold)
	if($localStorage.loginDetails.threshold){
		params.threshold=$localStorage.loginDetails.threshold;
	}
	
	$scope.dla_display='false';
	$scope.dla_displayText="";
	//console.log("dla",JSON.stringify($localStorage.loginDetails.dlaQuery));
	function tools_replaceAll(str, find, replace) {
	   return str.replace(new RegExp(find, 'g'), replace);
	}
	if($localStorage.loginDetails.dlaQuery){
		$scope.dla_display='true';
		params.dlaQuery=$localStorage.loginDetails.dlaQuery;
		$scope.dla_displayText=JSON.stringify($localStorage.loginDetails.dlaQuery);
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[$]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[/"]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[{]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[}]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[{]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[}]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[[]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/]+/g,'');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[:]+/g,' ');
		$scope.dla_displayText = tools_replaceAll($scope.dla_displayText,"nin",'not in') ;
		var splitString=$scope.dla_displayText.split(" ");
		splitString.splice(0,1);
		$scope.dla_displayText= splitString.join(' ');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[,]+/g,', ');
		/*
		$scope.dla_displayText =  $scope.dla_displayText.replace("nin",'not in ');
		$scope.dla_displayText =  $scope.dla_displayText.replace("and :",'');
		$scope.dla_displayText =  $scope.dla_displayText.replace("in :[",'in [');
		$scope.dla_displayText =  $scope.dla_displayText.replace("nin :",'not in ');		
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[/:]+/g,' ');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[,]+/g,', ');
		console.log('from dashboard control params.dlaQuery',JSON.stringify(params.dlaQuery));
		$scope.dla_displayText =  $scope.dla_displayText.replace(/[[]+/g,' ');
		$scope.dla_displayText =  $scope.dla_displayText.replace(/]+/g,' ');
		console.log('from dashboard control params.dlaQuery',JSON.stringify(params.dlaQuery));*/
	}
	//validate Date-start
	$scope.datePattern=/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/i;
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
            }
    }
	 $scope.validateDateRangesForAP=function(){
            if($scope.plan_start_date[$scope.showRecommendation]){
                var dateArr=$scope.plan_start_date[$scope.showRecommendation].split("/");
			    var date1 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);	
            }
            if($scope.due_date[$scope.showRecommendation]){
			dateArr=$scope.due_date[$scope.showRecommendation].split("/");
			var date2 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
            }
            if(date1 && date2){
                var timeDiff = date2.getTime() - date1.getTime();
            if(timeDiff<0){
				 //console.log("timeDiff",timeDiff);
				 Flash.clear();
				 Flash.create('danger','Invalid date range!',2000, {container: 'flash-fixed'});
				 $window.scrollTo(0, 0);
                 $scope.showSurveyDateRangeForAp=true;
            }else{
				 //console.log("else",timeDiff);
                 $scope.showSurveyDateRangeForAp=false;
            } 
        }
    }
	//validate Date-end
	
	 
	$scope.reloadDemographics=function(oprn){
		$scope.validateDateRanges();
		params.historical_start_date="";
		params.historical_end_date="";
		$scope.selectedSurveyTypes="";
		if($scope.surveyTypesModel){
			params.customerSurveys=[];
			var productTypes=[];
			var tmp="";
			angular.forEach($scope.surveyTypesModel,function(value,key){
				value=value+"";
				if(value=="true"){
					if(surveyNamesNId[key]){
						productTypes.push(surveyNamesNId[key])
						tmp+=(surveyNamesNId[key]+", ");
					}
					
					params.customerSurveys.push(key);
				}
				
			});
			
			if(productTypes.length>0){
				if(tmp.indexOf(", ")!=-1){
					tmp=tmp.substring(0,tmp.lastIndexOf(", "));
				}
				$scope.selectedSurveyTypes=tmp;
			}else{
				params.customerSurveys=defaultSurveyTypes;
				$scope.selectedSurveyTypes="";
			}	
		}
		if($scope.start_date){
			var MS_PER_MINUTE = 60000;
			var dateArr=$scope.start_date.split("/");
			var date1 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);	
			params.start_date=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
			params.start_date.setDate(params.start_date.getDate());
			params.start_date = new Date(params.start_date.getTime() - 1 * MS_PER_MINUTE);
			//console.log('params.start_date',params.start_date)
			if($scope.end_date){
				dateArr=$scope.end_date.split("/");
				var date2 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
			params.end_date=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
			//params.end_date.setHours(23,59,59);
			params.end_date.setDate(params.end_date.getDate()+1);
			
			params.end_date = new Date(params.end_date.getTime() - 1 * MS_PER_MINUTE);
		
			
			$scope.selectedSurveyDates=$scope.start_date+" - "+$scope.end_date;
			
			//action planning historical dates  logic -- start
			var timeDiff = Math.abs(date2.getTime() - date1.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
			
			params.historical_end_date = new Date(params.start_date.getTime());
			//var tmpDt=new Date(params.historical_end_date.getFullYear()+"-"+(params.historical_end_date.getMonth()+1)+"-"+params.historical_end_date.getDate());
			var tmpDt=new Date(params.historical_end_date);
			var date3=new Date(tmpDt.setDate(-diffDays));
			params.historical_start_date=new Date(date3.getTime());
			
			/*var date3=new Date(date1.setDate(-diffDays));
			params.historical_start_date=new Date(date3.setDate(1));
			
			var dt=new Date(date2.setDate(-diffDays));
			var month = dt.getMonth(),
			year = dt.getFullYear();
			params.historical_end_date = new Date(year, month + 1, 1);
			*/
			//console.log("params date",params.start_date,params.end_date);
			//console.log('params.historical_start_date',params.historical_start_date);
			//console.log('params.historical_end_date',params.historical_end_date);
			//action planning historical dates  logic -- start
			
			}	
			
		}
		//highlevel summary --end
		
		var demographicsFound=false;
		if($scope.selectedDemographics.length>0){
			demographicsFound=true;
		}
		
		if(oprn!=""){
			params.demographicFilters={};
			$scope.demographicsModel={};
		}
		dashboardService.fetchFilterInitData(params,function(response){
			var itmOrderby=["demographic"];
			//=========================For HLS Demographics============================//
			$scope.demographics=orderBy(response.data, itmOrderby, false,true);
			var tmpRGI=[];
			var rgiItemremoveIdx=[];
			for(var i=0;i<$scope.demographics.length;i++){
				if($scope.demographics[i].demographic){
					var tmpObj=$scope.demographics[i].demographicItems;
					var add2deleteidx=true;
					for(var tmpkey in tmpObj){
						if(tmpkey){
							add2deleteidx=false;
							break;
						}
					}
					if(add2deleteidx){
						rgiItemremoveIdx.push($scope.demographics[i].demographic);
					}
				}
				

			}
			//console.log('rgiItemremoveIdx',rgiItemremoveIdx)
			
			for(var x=0;x<rgiItemremoveIdx.length;x++){
				for(var i=0;i<$scope.demographics.length;i++){
					if(rgiItemremoveIdx[x]==$scope.demographics[i].demographic){
						$scope.demographics.splice(i,1);
					}
				}
			}
			
		var _tmpdemos=[];
        for(var x=0;x<$scope.demographics.length;x++){
            var demoObj=$scope.demographics[x];
            if(demoObj.respondentCount>params.threshold){
                _tmpdemos.push(demoObj);
            }
        }
        $scope.demographics=_tmpdemos;

			for(var i=0;i<$scope.demographics.length;i++){
						var hldrObj={};
						hldrObj.field=$scope.demographics[i].demographic;
						hldrObj.title=$scope.demographics[i].displayName;
						tmpRGI.push(hldrObj);
						
			}
			
			$scope.viewByDemoGraphicItems=tmpRGI;
			$scope.hotspotRgs=tmpRGI;
			dashboardPref.hotspotRgs=$scope.hotspotRgs;	
			
			var rgi4pref=[];
			
			for(var i=0;i<$scope.demographics.length;i++){
				var tmpObj={};
				var rgiArr=[];
				
				var demoObj=$scope.demographics[i];
				for(var rgi in demoObj.demographicItems){
					//console.log(rgi,demoObj.demographicItems[rgi])
					var obj={};
					obj.fmtstr=rgi.replace(/\./g,'_');
					obj.displayName=rgi;
					obj.count=demoObj.demographicItems[rgi];
					rgiArr.push(obj);
				}
				tmpObj.respondentCount=demoObj.respondentCount;
				tmpObj.displayName=demoObj.displayName;
				tmpObj.fieldType=demoObj.fieldType;
				tmpObj.demographic=demoObj.demographic;
				
				tmpObj.demographicItems=rgiArr;
				rgi4pref.push(tmpObj);
				
			}
			$scope.selectedDemographics=rgi4pref;
			dashboardPref.selectedDemographics=$scope.selectedDemographics;
		//	dashboardPref.viewByDemoGraphicItems=$scope.viewByDemoGraphicItems;
			dashboardService.saveDashboardPreferences(dashboardPref,function(response){
			});
			var reportGroupMappings={};
			angular.forEach($scope.demographicsModel,function(value,key){
				var idxArr=key.split("\t");
				var rg=idxArr[0];
				if($scope.demographicsModel[key]){
					if(value!='false'){
						if(!reportGroupMappings[idxArr[0]]){
							reportGroupMappings[idxArr[0]]=[];
						}
						reportGroupMappings[idxArr[0]].push(idxArr[1]);
					}
					
				}
			});
			if(Object.keys(reportGroupMappings).length>0){
				params.demographicFilters=reportGroupMappings;
			}else{
				params.demographicFilters={};
				$scope.demographicsModel={};
			}
			if(oprn==""){
				$scope.loadDataSet();
			}

		});
	}
	//$scope.reloadDemographics --end
	
	//hls table sortinng
	$scope.sort = {}; 
	 $scope.changeSorting = function(column) {
        var sort = $scope.sort;

        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
        console.log($scope.sort)
    };
	  
	//highlevel summary --start
	//=============================For HLS Options=======================//
	$scope.HLSOptions=[{field: 'demographics', title: 'View By Demographic'},
	                   {field: 'category', title: 'View By Category'},
	                   {field: 'question', title: 'View By Questions'}
	                   ];
					
				
	$scope.dataHLSOptions={
				availableOptions: $scope.HLSOptions,
				selectedOption: $scope.selectedHLSView
				};
	$scope.dataHLSDemographicOptions= {};
	$scope.saveRgiItemSelected=function(){
		var reportGroupMappings={};
		angular.forEach($scope.demographicsModel,function(value,key){
			var idxArr=key.split("\t");
			var rg=idxArr[0];
			if($scope.demographicsModel[key]){
				if(value!='false'){
					if(!reportGroupMappings[idxArr[0]]){
						reportGroupMappings[idxArr[0]]=[];
					}
					reportGroupMappings[idxArr[0]].push(idxArr[1]);
				}
			}
		});
		if(Object.keys(reportGroupMappings).length>0){
			params.demographicFilters=reportGroupMappings;
		}else{
			params.demographicFilters={};
			$scope.demographicsModel={};
		}
		var demoModel={};
		angular.forEach($scope.demographicsModel,function(value,key){
			var rgi=key.replace(/\./g,'_');
			demoModel[rgi]=value;
		});
		dashboardPref.demographicsModel=demoModel;
		dashboardService.saveDashboardPreferences(dashboardPref,function(response){
		});
		
	}
	
	$scope.selectHLSView=function(value){

				//$('.loader').show();
				params.selectedHLSView=value;
				dashboardPref.selectedHLSView=value;
				$scope.dataHLSOptions.selectedOption=value;
				$scope.tableParams = new NgTableParams({page: 1, total: 1,count: 300},{counts: [],filterDelay: 30,data: []});
				var viewByDemoGraphicItems=[];
				if(value.field=='demographics'){
					for(var i=0;i<$scope.demographics.length;i++){
						var hldrObj={};
						hldrObj.field=$scope.demographics[i].demographic;
						hldrObj.title=$scope.demographics[i].displayName;
						viewByDemoGraphicItems.push(hldrObj);
					}
				}
				dashboardPref.viewByDemoGraphicItems=viewByDemoGraphicItems;
				$scope.dataHLSDemographicOptions= {
					availableOptions: viewByDemoGraphicItems,
					selectedOption: []
				};	
				dashboardService.saveDashboardPreferences(dashboardPref,function(response){
				});
				if('question'==value.field){
					$scope.prepareHLSDataByQuestions();
				}else if('category'==value.field){
					 dashboardService.fetchHighLevelSummaryData(params,function(response){
						if(response.data.type){
							var pctWithDLA=response.data.data.commonDataWithDLA.overallPctFav;
							var pctWithOutDLA=response.data.data.commonDataNoDLA.overallPctFav;
							$scope.overAllPoints=pctWithDLA-pctWithOutDLA;
							$scope.overAllPctFav=pctWithDLA;
							_js_overAllPctFav=$scope.overAllPctFav+"%";
							$scope.overAllAvg=$scope.appendZeros(response.data.data.commonDataWithDLA.overallAvg);
							$scope.prepareHLSDataByCat(response.data.data.commonDataWithDLA.results,response.data.data.commonDataNoDLA.results,response.data.data.categoryCounts);
						}else{
							$scope.prepareHLSDataByCat({},{},response.data.data.categoryCounts);
						}
						 
					  	
					 });
				}
			}

			$scope.viewByDemographics=function(value){
				var viewByDemoGraphicItems=[];
				for(var i=0;i<$scope.demographics.length;i++){
						var hldrObj={};
						hldrObj.field=$scope.demographics[i].demographic;
						hldrObj.title=$scope.demographics[i].displayName;
						viewByDemoGraphicItems.push(hldrObj);
				}
				dashboardPref.viewByDemoGraphicItems=viewByDemoGraphicItems;
				
				$scope.tableParams = new NgTableParams({page: 1, total: 1,count: 300},{counts: [],filterDelay: 30,data: []});
				dashboardPref.selectedHLSDemoGraphicItem=value;
				params.selectedHLSDemoGraphicItem=value;
				$scope.selectedHLSDemoGraphicItem=value;
				dashboardService.saveDashboardPreferences(dashboardPref,function(response){
				});
				dashboardService.fetchHighLevelSummaryData(params,function(response){
					var rgiWithCounts=$.grep($scope.demographics, function(obj){
						return obj.demographic === $scope.selectedHLSDemoGraphicItem.field;
			    	})[0];
					if(rgiWithCounts && Object.keys(rgiWithCounts).length!=0){
						rgiWithCounts=rgiWithCounts.demographicItems;
					}
					
					if(response.data.type){
						var pctWithDLA=response.data.data.commonDataWithDLA.overallPctFav;
						var pctWithOutDLA=response.data.data.commonDataNoDLA.overallPctFav;
						$scope.overAllPoints=pctWithDLA-pctWithOutDLA;
						$scope.overAllPctFav=pctWithDLA;
						_js_overAllPctFav=$scope.overAllPctFav+"%";
						$scope.overAllAvg=$scope.appendZeros(response.data.data.commonDataWithDLA.overallAvg);
						$scope.prepareHLSDataByDemographics(response.data.data.commonDataWithDLA.results,response.data.data.commonDataNoDLA.results,response.data.data.demoCount);
					}else{
						$scope.prepareHLSDataByDemographics({},{},{});
					}

				});
			}
			//hotspot --start


			$scope.hotspotLegendColors=[
				{"color":"#f79646","value":"Minimum"},
				{"color":"#fac090","value":""},
				{"color":"#eeece1","value":"Median"},
				{"color":"#bee5e7","value":""},
				{"color":"#68c8c6","value":"Maximum"}];
			$scope.hotspotViews=[
	                   {field: 'categoryText', title: 'View By Category'},
	                   {field: 'questionText', title: 'View By Questions'}
	        ];
			$scope.hotspotDisplayHeader=[];
			$scope.hotspotDisplayViewByRows=[];
			$scope.handleHotspotRgOnchange=function(value){
				dashboardPref.hotspotRg=value;
				params.hotspotRg=value;
				dashboardService.saveDashboardPreferences(dashboardPref,function(response){
				});
				js_params=params;
				js_dashboard_pref=dashboardPref;
				dashboardService.fetchHotSpotData(params,function(response){
					if(response.data.type){
						var dataObj=response.data.data;
							$scope.prepareHotSpotData(dataObj);
					}
				});
			}
			
			$scope.handleHotspotViewOnchange=function(value){
				dashboardPref.selectedHotspotView=value;
				params.selectedHotspotView=value;
				
				dashboardService.saveDashboardPreferences(dashboardPref,function(response){
				});
				dashboardService.fetchHotSpotData(params,function(response){
					if(response.data.type){
						$scope.HSdemographictot=response.data.data.demographictot;
						$scope.prepareHotSpotData(response.data);
						
						
					}else{
						console.log("error in fetching hotspot data");
					}
				});
				
			}


			//=========================For HLS Demographics============================//
		
	 $scope.HLSDelta=function(objId,widthReq){
	  	  var width = 1;
	  	  var id = setInterval(frame, 25);
	  	  function frame() {
		  	   var elem = document.getElementsByClassName("hlsBar")[objId];
				  if(elem!=undefined)
				  {
					  if (width >= widthReq-10) {
		  	      		clearInterval(id);
		  	    	} else {
		  	      		width++; 
		  	      		elem.style.width = width + '%'; 
		  	    	}
				}
	  	 }
	   }
$scope.getWordCloudDatas = function (name) {
	
if(name!=undefined) {
	dashboardPref.wordcloudSelectedQuestion=name;

	dashboardService.saveDashboardPreferences(dashboardPref,function(response){
	});
	$timeout(function() {
		$('#questionName').val(name);
	}, 100);
	params.questionName=name;
			dashboardService.fetchWordCloudDataByQuestions(params,function(response){
				
				var result = [];
				var it=1;
				
				var cnt=response.data.data.length;
				for(var i=0;i<cnt;i++){
					var str=response.data.data[i].split("\t");
					result.push({'word': str[0],'fontSize':'', 'size': parseInt(str[1])});

				}
			var wordcloudorderBy=[];
				wordcloudorderBy.push("size");
				//console.log('before',result);
				$scope.totalWords = orderBy(result, wordcloudorderBy, true);
				$scope.totalWords=$scope.totalWords.slice(0, 50);
				//console.log('after',$scope.totalWords);


				var maxFontsize =48;
				for(var m=0;m<$scope.totalWords.length;m++){
					if(maxFontsize>12)
						$scope.totalWords[m].fontSize = maxFontsize;
					else
						$scope.totalWords[m].fontSize = 12;
					maxFontsize--;
				} 




				//$scope.totalWords = result;
				
				// var colorsarr = ['color1', 'color2','color3','color4','color5','color6','color7','color8','color9','color10'];
				// var currentval=''
    // 				$scope.totalWords.map(function (d, i) {
    // 					if (i>=10) {
    // 						currentval=i%10;
    // 						//console.log(, 'else')
    // 					}else{
    // 						currentval=i;
    // 						//console.log(currentval)
    // 					}
    // 					$scope.totalWords[i].color=colorsarr[currentval];
    // 					$scope.words=$scope.totalWords;
    // 					//console.log($scope.words)
    // 				});	
					
    			$('.worldcloud_data').html('');
   			var fill = d3.scale.category20();
			var widths= document.getElementById("worldcloud_data");
   			var cliWidth=widths.clientWidth-10;
   			var cliHeigth=widths.clientHeight-7;
			    var layout = d3.layout.cloud()
			      .size([cliWidth, cliHeigth])
			      //.words(["a", "able", "about", "above", "abroad", "according", "accordingly", "across", "actually", "adj", "after", "afterwards", "again", "against", "ago", "ahead", "ain't", "all", "allow", "allows", "almost", "alone", "along", "alongside", "already", "also", "although", "always", "am", "amid", "amidst", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "b", "back", "backward", "backwards", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c", "came", "can", "cannot", "cant", "can't", "caption", "cause", "causes", "certain", "certainly", "changes", "clearly", "c'mon", "co", "co.", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "c's", "currently", "d", "dare", "daren't", "definitely", "described", "despite", "did", "didn't", "different", "directly", "do", "does", "doesn't", "doing", "done", "don't", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "eighty", "either", "else", "elsewhere", "end", "ending", "enough", "entirely", "especially", "et", "etc", "even", "ever", "evermore", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "f", "fairly", "far", "farther", "few", "fewer", "fifth", "first", "five", "followed", "following", "follows", "for", "forever", "former", "formerly", "forth", "forward", "found", "four", "from", "further", "furthermore", "g", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten", "greetings", "h", "had", "hadn't", "half", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "hello", "help\thence", "her", "here", "hereafter", "hereby", "herein", "here's", "hereupon", "hers", "herself", "he's", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "hundred", "i", "i'd", "ie", "if", "ignored", "i'll", "i'm", "immediate", "in", "inasmuch", "inc", "inc.", "indeed", "indicate", "indicated", "indicates", "inner", "inside", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "its", "it's", "itself", "i've", "j", "just", "k", "keep", "keeps", "kept", "know", "known", "knows", "l", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "likewise", "little", "look", "looking", "looks", "low", "lower", "ltd", "m", "made", "mainly", "make", "makes", "many", "may", "maybe", "mayn't", "me", "mean", "meantime", "meanwhile", "merely", "might", "mightn't", "mine", "minus", "miss", "more", "moreover", "most", "mostly", "mr", "mrs", "much", "must", "mustn't", "my", "myself", "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needn't", "needs", "neither", "never", "neverf", "neverless", "nevertheless", "new", "next", "nine", "ninety", "no", "nobody", "non", "none", "nonetheless", "noone", "no-one", "nor", "normally", "not", "nothing", "notwithstanding", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "one's", "only", "onto", "opposite", "or", "other", "others", "otherwise", "ought", "oughtn't", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular", "particularly", "past", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provided", "provides", "q", "que", "quite", "qv", "r", "rather", "rd", "re", "really", "reasonably", "recent", "recently", "regarding", "regardless", "regards", "relatively", "respectively", "right", "round", "s", "said", "same", "saw", "say", "saying", "says", "second", "secondly\tsee", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "since", "six", "so", "some", "somebody", "someday", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t", "take", "taken", "taking", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "there'd", "therefore", "therein", "there'll", "there're", "theres", "there's", "thereupon", "there've", "these", "they", "they'd", "they'll", "they're", "they've", "thing", "things", "think", "third", "thirty", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "till", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "t's", "twice", "two", "u", "un", "under", "underneath", "undoing", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "up", "upon", "upwards", "us", "use", "used", "useful", "uses", "using", "usually", "v", "value", "various", "versus", "very", "via", "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "welcome", "well", "we'll", "went", "were", "we're", "weren't", "we've", "what", "whatever", "what'll", "what's", "what've", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "where's", "whereupon", "wherever", "whether", "which", "whichever", "while", "whilst", "whither", "who", "who'd", "whoever", "whole", "who'll", "whom", "whomever", "who's", "whose", "why", "will", "willing", "wish", "with", "within", "without", "wonder", "won't", "would", "wouldn't", "x", "y", "yes", "yet", "you", "you'd", "you'll", "your", "you're", "yours", "yourself", "yourselves", "you've", "z", "zero", "amoungst", "amount", "bill", "bottom", "call", "con", "couldnt", "cry", "de", "describe", "detail", "due", "eleven", "empty", "fifteen", "fify", "fill", "find", "fire", "forty", "front", "full", "give", "hasnt", "hence", "interest", "mill", "move", "part", "put", "see", "show", "side", "sincere", "sixty", "system", "ten", "thickv", "thin", "top", "twelve", "twenty"].map(function(d) {
			        .words($scope.totalWords.map(function(d) {
			       return { text: d.word, size: d.fontSize, count:d.size};
			      }))
			      .padding(10)
			      .rotate(function() { return 0 })
			      .font("Impact")
			      .fontSize(function(d) { return d.size; })
			     .on("end", draw);

			    layout.start();

			    function draw(words) {
					//console.log("words",words.length);
			      d3.select(".worldcloud_data").append("svg")
			        .attr("width", layout.size()[0])
					 .attr("id", "wordcloudId")
			        .attr("height", layout.size()[1])
			        .append("g")
			        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
			        .selectAll("text")
			        .data(words)
			        .enter().append("text")
			        .style("font-size", function(d) { return d.size + "px"; })
			        .style("font-family", "arial")
			        .style("fill", function(d, i) { return fill(i); })
			        .attr("text-anchor", "middle")
			        .attr("transform", function(d) {
			          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			        })
			        .text(function(d) { return d.text; })
			        .on("click", function(d) {
			         // console.log(d.text);
			          $scope.highlightWord(d.text, d.count);
			        });
			    }
			});
		}
		
	}
	$scope.clearFilters=function(){
		$scope.demographicsModel={};
	} 
	$scope.historicalAPDataWithDLA={};
	$scope.historicalAPDataNoDLA={};
	$scope.commonDataWithDLA={};
	$scope.commonDataNoDLA={};
	$scope.default_language_key='en';
	$scope.prepareHotSpotData=function(databObj){
		
		_js_hotspot_viewByData=databObj;
		var orderedRgisAll=databObj.demographicItemDataOrdered.orderedRgis;
		var orderedRgis=[];
		for(var x=0;x<orderedRgisAll.length;x++){
			orderedRgis.push(orderedRgisAll[x]);
			if(x==$scope.hotspot_col_limit){
				break;
			}
			
		}

		var noOfResponses=databObj.demographicItemDataOrdered.noOfResponses;
		var overAllPct=databObj.demographicItemDataOrdered.overAllPct;
		var hotspotWithDLA= databObj.hotspotWithDLA;
		//console.log('orderedRgis',JSON.stringify(orderedRgis));
		//console.log('noOfResponses',JSON.stringify(noOfResponses));
		//console.log('overAllPct',JSON.stringify(overAllPct));
		//console.log('hotspotWithDLA',JSON.stringify(hotspotWithDLA));
		
		//$('#hotspotTable tr').remove();
		$('#hotspotTable tr').remove();
		var str="";
		str+="<tr>";
		var selectstr="";
		var catselected="";
		var quesselected="";
		if("questionText"==js_dashboard_pref.selectedHotspotView){
			catselected="";
			quesselected="selected";
		}else{
			catselected="selected";
			quesselected="";
		}
		selectstr+="<select id='hsviweby' onchange='js_handleHsViewBy(this)'>";
		selectstr+="<option value='categoryText' "+catselected+">View By Category</option>";
		selectstr+="<option value='questionText' "+quesselected+">View By Questions</option>";
		selectstr+="</select>";
		str+="<td>"+selectstr+"</td>";
		for(var x=0;x<orderedRgis.length;x++){
			str+="<td>"+orderedRgis[x]+"</td>";
			
		}
		str+="<tr>";
		str+="<td>No. Responses</td>";
		for(var x=0;x<orderedRgis.length;x++){
			str+="<td>"+databObj.categoryCounts[orderedRgis[x]]+"</td>";
			
		}
		str+="</tr>";
		
		str+="<tr>";
		str+="<td>Overall</td>";
		str+="<td>"+_js_overAllPctFav+"</td>";
		for(var x=1;x<orderedRgis.length;x++){
			str+="<td>"+overAllPct[orderedRgis[x]]+"%</td>";
			
		}
		str+="</tr>";
		var rowcnt=0;
		var ranges=databObj.ranges;
		//console.log("ranges",ranges,JSON.stringify(hotspotWithDLA));
			/*var ranges=[];
		ranges.push("0\t69\t#F79646");
		ranges.push("70\t75\t#FAC090");
		ranges.push("76\t79\t#EEECE1");
		ranges.push("80\t84\t#B6DDE8");
		ranges.push("85\t100\t#4BACC6");
		*/

		for(var key in hotspotWithDLA){
			str+="<tr onclick='zoomHotspot();' style='cursor:zoom-in;' title='Click to view all data'>";
			str+="<td>"+key+"</td>";
			var items=hotspotWithDLA[key];
			for(var x=0;x<orderedRgis.length;x++){
				var item=items[orderedRgis[x]];	
				var tdval="-";
				var stylestr="";
				if(item!=undefined){
					/*if(item.pctFav>=0&&item.pctFav<=69){
							stylestr+=" style='background-color:#F79646'";
					}else if(item.pctFav>=70&&item.pctFav<=75){
						stylestr+=" style='background-color:#FAC090'";
					}else if(item.pctFav>=76&&item.pctFav<=79){
						stylestr+=" style='background-color:#EEECE1'";
					}else if(item.pctFav>=80&&item.pctFav<=84){
						stylestr+=" style='background-color:#B6DDE8'";
					}else if(item.pctFav>=85&&item.pctFav<=100){
						stylestr+=" style='background-color:#4BACC6'";
					}*/	
					var dynaStyle="";
					for(var q=0;q<ranges.length;q++){
						var rangeArr=ranges[q].split("\t");
						var lowerLimit=parseInt(rangeArr[0]);
						var upperLimit=parseInt(rangeArr[1]);
						var colorCode=rangeArr[2];
						if(q==0){
							lowerLimit=0;
						}
						if(lowerLimit!=upperLimit){
							if(q==0 || q==1){
						 		upperLimit=upperLimit-1;
						 	}
							if(q==3 || q==4){
						 		lowerLimit=lowerLimit+1;
						 	}
							if(item.pctFav>=lowerLimit && item.pctFav<=upperLimit){
								stylestr=" style='background-color:"+colorCode+"'";
						  	}	
						}else{
							if(item.pctFav>=lowerLimit && item.pctFav<=upperLimit){
								stylestr=" style='background-color:"+colorCode+"'";
						  	}
						}
						//console.log("q",q,"lowerLimit",lowerLimit,"upperLimit",upperLimit);						
					}

					tdval=item.pctFav;
				}
				if('overall'==key){
					stylestr="";					
				}
				if (orderedRgis[x]=='overall'){
					stylestr="";
					tdval=tdval+'%';
				}
				str+="<td"+stylestr+">"+tdval+"</td>";
			}
			str+="</tr>";

			++rowcnt;
			if(rowcnt==$scope.hotspot_row_limit){
				break;
			}

		}
		
		
		$("#hotspotTable").append(str);
	
		
	}
	$scope.prepareHLSDataByQuestions=function(){
		var pctFavCount=0;
		var totCount=0;
		var overAllPctWithDlA=0;
		var totalSum=0;
		var tblDataArr=[];
		for(var _key in $scope.commonDataNoDLA){
			var _value=$scope.commonDataWithDLA[_key];
			
			var withoutDLA=$scope.commonDataNoDLA[_key];
			if(_value){
				var obj={};
				obj.summary_demographics=_key;
				obj.summary_n=_value.totalCount;
				obj.mean_score=$scope.appendZeros(_value.average.toFixed(2));
				obj.pctFav=_value.pctFav;
				obj.company_delta=_value.pctFav-withoutDLA.pctFav;
				if(obj.summary_n>params.threshold){
					tblDataArr.push(obj);
				}
				
			}
			
		}
		$scope.export_HLSData=tblDataArr;
		$scope.tableParams = new NgTableParams({page: 1, total: 1,count: 300},{counts: [],filterDelay: 30,data: tblDataArr});
		//console.log("tblDataArr",tblDataArr);
	}
	
	$scope.prepareHLSDataByDemographics=function(dataWithDLA,dataWithOutDLA,rgiItemsCount){
		var pctFavCount=0;
		var totCount=0;
		var overAllPctWithDlA=0;
		var totalSum=0;
		var tblDataArr=[];
		for(var _key in dataWithOutDLA){
			var _value=dataWithDLA[_key];
			var withoutDLA=dataWithOutDLA[_key];
			if(_key!=undefined && _key!="undefined" ){
				if(_value){
					var obj={};
					obj.summary_demographics=_key;
					obj.summary_n=rgiItemsCount[_key];
					obj.mean_score=$scope.appendZeros(_value.average.toFixed(2));
					obj.pctFav=_value.pctFav;
					obj.company_delta=_value.pctFav-withoutDLA.pctFav;
					if(obj.summary_n>params.threshold){
						tblDataArr.push(obj);
					}
					
				}
			}
			//console.log(_key,_value);
			
		}
		$scope.export_HLSData=tblDataArr;
		$scope.tableParams = new NgTableParams({page: 1, total: 1,count: 300},{counts: [],filterDelay: 30,data: tblDataArr});
	}
	$scope.prepareHLSDataByCat=function(dataWithDLA,dataWithOutDLA,categoryCounts){
		var pctFavCount=0;
		var totCount=0;
		var overAllPctWithDlA=0;
		var totalSum=0;
		var tblDataArr=[];
		for(var _key in dataWithOutDLA){
			var _value=dataWithDLA[_key];
			var withoutDLA=dataWithOutDLA[_key];
			if(_key!=undefined && _key!="undefined" ){
				if(_value){
					var obj={};
					obj.summary_demographics=_key;
					obj.summary_n=categoryCounts[_key];
					obj.mean_score=$scope.appendZeros(_value.average.toFixed(2));

					obj.pctFav=_value.pctFav;
					obj.company_delta=_value.pctFav-withoutDLA.pctFav;
					if(obj.summary_n>params.threshold){
						tblDataArr.push(obj);
					}
					
				}
			}
			//console.log(_key,_value);
			
		}
		$scope.export_HLSData=tblDataArr;
		$scope.tableParams = new NgTableParams({page: 1, total: 1,count: 300},{counts: [],filterDelay: 30,data: tblDataArr});
	}
		$scope.appendZeros=function(str){
			return str;
		/*str=str+"";
		if(str.indexOf(".")==-1){
			str=str+".00";
		}else{
			var decimalStr=str.substring(str.indexOf(".")+1);
			if(decimalStr.length<2){
				str=str+"0";
			}
		}
		return str;
		*/
	}	
	$scope.prepareHighLowChart=function(){
		var highlowData=[];
		var hlsort=[];
		var highloworderBy=[];
		var pctTotal=0;
		var total=0;
		//console.log('$scope.commonDataWithDLA',$scope.commonDataWithDLA)
		//console.log('$scope.commonDataNoDLA',$scope.commonDataNoDLA)
		if(Object.keys($scope.commonDataWithDLA).length>0){
			var pctFavCount=0;
			var totCount=0;
			var overAllPctWithDlA=0;
			var totalSum=0;
			var pctWithOutDLA=0;
			for(var _key in $scope.commonDataWithDLA){
				var _value=$scope.commonDataWithDLA[_key];
				var highlow={};
				if(_value){
					highlow.avg=_value.average.toFixed(2);
					highlow.question=_key;
					highlow.pctFav=_value.pctFav;
					pctTotal+=_value.favCount;
					total+=_value.totalCount;
					totalSum+=_value.ansSum;
					hlsort.push(highlow.pctFav);
					if(_value.totalCount>params.threshold){
						highlowData.push(highlow);
					}
					
				}
				if(hlsort.length>0){
					for(var q=0;q<highlowData.length;q++){
						var c=((highlowData[q].pctFav/100)*50)+50;
						highlowData[q].displayPct=c;
					}
				}
				
				highloworderBy.push("pctFav");
				highloworderBy.push("avg");
				$scope.highlowDataAsc =orderBy(highlowData, highloworderBy, true);
				$scope.highlowDataDesc = orderBy(highlowData, highloworderBy, false);
			}
			
		}else{
			$scope.highlowDataAsc={};
			$scope.highlowDataDesc={};
		}
		function sortNumber(a,b) {
		    return a - b;
		}

		
	}
	$scope.loadDataSet=function(){

		var rgitmMappingArr=[];
		var reportGroupMappings={};
		
		angular.forEach($scope.demographicsModel,function(value,key){
			var idxArr=key.split("\t");
			var rg=idxArr[0];
			
			if($scope.demographicsModel[key]){
				if(value!='false'){
					if(!reportGroupMappings[idxArr[0]]){
						reportGroupMappings[idxArr[0]]=[];
					}
					reportGroupMappings[idxArr[0]].push(idxArr[1]);
				}
				
			}
		});
		
		if(Object.keys(reportGroupMappings).length>0){
			params.demographicFilters=reportGroupMappings;
		}else{
			params.demographicFilters={};
			$scope.demographicsModel={};
		}
		
		dashboardService.fetchCommonData(params,function(response){			
			if(response.data.type){
				$scope.commonDataWithDLA=response.data.data.commonDataWithDLA;
				//console.log("$scope.commonDataWithDLA",$scope.commonDataWithDLA);
				$scope.commonDataNoDLA=response.data.data.commonDataNoDLA;
				$scope.prepareHighLowChart();
				$scope.prepareActionPlanningData();
				
				//$scope.processAPData();
				dashboardService.fetchHotSpotData(params,function(response){
					if(response.data.type){
						var dataObj=response.data.data;
						$scope.prepareHotSpotData(dataObj);
					}
				});
				if(dashboard_pref.selectedHLSView && dashboard_pref.selectedHLSView["field"]){
					if(dashboard_pref.selectedHLSView["field"]=='demographics'){
						$scope.dataHLSDemographicOptions= {
						availableOptions: $scope.viewByDemoGraphicItems,
						selectedOption: $scope.selectedHLSDemoGraphicItem
					};	
						$scope.viewByDemographics($scope.selectedHLSDemoGraphicItem);
					}else{
						$scope.selectHLSView($scope.selectedHLSView);
					}
				}
				//if($scope.overAllPctFav ==0 || _js_overAllPctFav==0){
					dashboardService.getOverAllData(params,function(response){
						if(response.data.type){
							var dataObj=response.data.data;
							var pctWithDLA=response.data.data.commonDataWithDLA.overallPctFav;
							var pctWithOutDLA=response.data.data.commonDataNoDLA.overallPctFav;
							$scope.overAllPoints=pctWithDLA-pctWithOutDLA;
							$scope.overAllPctFav=pctWithDLA;
							_js_overAllPctFav=$scope.overAllPctFav+"%";
							$scope.overAllAvg=$scope.appendZeros(response.data.data.commonDataWithDLA.overallAvg);
						}
					});
					
				//}
			}
		});
			
		//Dashboard pref --start
		dashboardPref.toggleDemographicsFilterKey=$scope.selectedDemographicsUIkey;
		dashboardPref.clientId=$scope.clientId;
		dashboardPref.participantId=$localStorage.loginDetails.participantId;
		dashboardPref.start_date=$scope.start_date;
		dashboardPref.end_date=$scope.end_date;
		dashboardPref.surveyTypesModel=$scope.surveyTypesModel;
		var demoModel={};
		angular.forEach($scope.demographicsModel,function(value,key){
			var rgi=key.replace(/\./g,'_');
			demoModel[rgi]=value;
		});
		dashboardPref.demographicsModel=demoModel;
		dashboard_pref.selectedHLSView=$scope.selectedHLSView;
		dashboard_pref.viewByDemoGraphicItems=$scope.viewByDemoGraphicItems
		dashboard_pref.selectedHLSDemoGraphicItem=$scope.selectedHLSDemoGraphicItem;
		
		
		dashboardService.saveDashboardPreferences(dashboardPref,function(response){
		});

		js_params=params;
		js_dashboard_pref=dashboard_pref;
		
		//Dashboard pref --end
		dashboardService.fetchParticipantsRates(params,function(response){
			if(response.data.type){
				$scope.participantRatesCompletedParticipants=response.data.data.participantRatesCompletedParticipants;
				$scope.participantRatesTotalParticipants=response.data.data.participantRatesTotalParticipants;				
				if($scope.participantRatesTotalParticipants && $scope.participantRatesCompletedParticipants){
					$scope.participantRatePct=Math.round(($scope.participantRatesCompletedParticipants/$scope.participantRatesTotalParticipants)*100);
					$scope.overallPctFavDataFound=true;	
				}else{
					$scope.participantRatePct=0;
					$scope.overallPctFavDataFound=false;
				}

				
			}else{
				console.log('err',response.data.data);
			}
		});
		dashboardService.fetchWordCloudData(params,function(response){
			if(response.data.type && response.data!=undefined && response.data.data){
				$scope.wcQuestions=response.data.data;
				$scope.isActive=false;
				if($scope.wcQuestions.length>0 && $scope.wcQuestions[0].questionText!=undefined) {
					if ($scope.wordcloudSelectedQuestion!=undefined) {						
						for (var i = 0; i < $scope.wcQuestions.length; i++) {
							if ($scope.wcQuestions[i].questionText==$scope.wordcloudSelectedQuestion) {
								//console.log($scope.wcQuestions[i].questionText==$scope.wordcloudSelectedQuestion, $scope.wcQuestions[i].questionText)
								$scope.isActive=true;
								break;
							}
						}
						if ($scope.isActive==true) {
							$scope.getWordCloudDatas($scope.wordcloudSelectedQuestion);
						}else{
							$scope.getWordCloudDatas($scope.wcQuestions[0].questionText);
						}
					}else{
						$scope.getWordCloudDatas($scope.wcQuestions[0].questionText);
					}
				}

			}else{
				$scope.wcQuestions={};
				$('.worldcloud_data').html('');
			}
		});	
		
	}
	
	
	$scope.prepareActionPlanningData=function(){
		 dashboardService.fetchHistoricalCommonData(params,function(response){
			 if(response.data.type){
				$scope.historicalAPDataWithDLA=response.data.data.commonDataWithDLA;
				$scope.historicalAPDataNoDLA=response.data.data.commonDataNoDLA;
			 }
			 /*console.log("$scope.commonDataWithDLA",JSON.stringify($scope.commonDataWithDLA));
			 console.log('$scope.commonDataNoDLA',JSON.stringify($scope.commonDataNoDLA));
			 console.log("$scope.historicalAPDataWithDLA",JSON.stringify($scope.historicalAPDataWithDLA));
			 console.log("$scope.historicalAPDataNoDLA",JSON.stringify($scope.historicalAPDataNoDLA));
			 console.log("length",$scope.totalResponsesWithDLA);*/
			var avgArr=[];
			var avgArrMedian=0;
			var pctFavArr=[];
			var pctFavArrMedian=0;
			var companyDeltaArr=[];
			var companyDeltaArrMedian=0;
			var histcompanyDeltaArr=[];			
			var histcompanyDeltaArrMedian=0;
			angular.forEach($scope.commonDataWithDLA,function(val,key){
				if(val.totalCount){
					avgArr.push(val.average);
					pctFavArr.push(val.pctFav);	
				}	
			});
			if(avgArr.length>0){
				avgArrMedian=math.median(avgArr);
			}
			if(pctFavArr.length>0){
				pctFavArrMedian=math.median(pctFavArr);
			}
			$scope.apDataBelowFavMedian={};
			angular.forEach($scope.commonDataWithDLA,function(val,key){
				if(val.totalCount){
					if(val.pctFav < pctFavArrMedian){
						$scope.apDataBelowFavMedian[key]=val;
						$scope.apDataBelowFavMedian[key]["questionText"]=key;
					}
				}
				
			});	
			angular.forEach($scope.apDataBelowFavMedian,function(val,key){
				if(val.totalCount){			
					val.companyBenchmark=val.pctFav;
					val.companyDelta=0;
					val.histcompanyDelta=0;
					if($scope.commonDataNoDLA[key]){
						val.companyBenchmark=$scope.commonDataNoDLA[key].pctFav;
						var companyDelta=val.pctFav-val.companyBenchmark;
						val.companyDelta=companyDelta;
						companyDeltaArr.push(companyDelta);
					}
					if($scope.historicalAPDataWithDLA[key]){
						var histcompanyDelta=val.pctFav-$scope.historicalAPDataWithDLA[key].pctFav;
						val.histcompanyDelta=histcompanyDelta;
						histcompanyDeltaArr.push(histcompanyDelta);
					}
				}
			});
				
			if(companyDeltaArr.length>0){
				companyDeltaArrMedian=math.median(companyDeltaArr);
			}							
			if(histcompanyDeltaArr.length>0){
				histcompanyDeltaArrMedian=math.median(histcompanyDeltaArr);
			}					
			$scope.apDataAllCriteria=[];
			$scope.apDataCriteria12=[];
			$scope.apDataCriteria13=[];
			$scope.apDataNoCriteria=[];
			$scope.apOrderedData=[];
			angular.forEach($scope.apDataBelowFavMedian,function(value,key){
				if( (value.companyDelta < 0 && value.companyDelta < companyDeltaArrMedian && value.companyDelta!=0) && (value.histcompanyDelta < histcompanyDeltaArrMedian && value.histcompanyDelta!=0)){
						$scope.apDataAllCriteria.push(value);	
				}else if( (value.companyDelta< 0 && value.companyDelta< companyDeltaArrMedian && value.companyDelta!=0) && !(value.histcompanyDelta < histcompanyDeltaArrMedian && value.histcompanyDelta!=0)){
						$scope.apDataCriteria12.push(value);
				}else if( !(value.companyDelta< 0 && value.companyDelta< companyDeltaArrMedian && value.companyDelta!=0) && (value.histcompanyDelta < histcompanyDeltaArrMedian && value.histcompanyDelta!=0)){
						$scope.apDataCriteria13.push(value);
				}else{
						$scope.apDataNoCriteria.push(value);
				}						
			});
				$scope.reverse = false;
				$scope.orderAllCriteria=['pctFav','companyDelta','histcompanyDelta','average'];
				$scope.orderCriteria12=['average','companyDelta'];
				$scope.orderCriteria13=['average','histcompanyDelta'];
				$scope.orderNoCriteria=['pctFav','average','companyDelta'];
				$scope.apDataAllCriteria = orderBy($scope.apDataAllCriteria,$scope.orderAllCriteria, $scope.reverse);
				$scope.apDataCriteria12= orderBy($scope.apDataCriteria12,$scope.orderCriteria12, $scope.reverse);
				$scope.apDataCriteria13 = orderBy($scope.apDataCriteria13,$scope.orderCriteria13, $scope.reverse);
				$scope.apDataNoCriteria= orderBy($scope.apDataNoCriteria,$scope.orderNoCriteria, $scope.reverse);
				//console.log("totalResponsesWithDLA",$scope.totalResponsesWithDLA,"threshold",params.threshold);
				var _orderedData=[];
				var totalResponsesWithDLA=0;
				$scope.diplayApData="false";
			    //console.log("$scope.commonDataWithDLA",$scope.commonDataWithDLA);
				angular.forEach($scope.commonDataWithDLA,function(v,k){
					if(v.totalCount){
						totalResponsesWithDLA+=v.totalCount;
					}
				});
				//console.log("$scope.totalResponsesWithDLA",totalResponsesWithDLA,params.threshold);
				if(totalResponsesWithDLA>params.threshold){					 
					_orderedData=$scope.apOrderedData.concat($scope.apDataAllCriteria,$scope.apDataCriteria12,$scope.apDataCriteria13,$scope.apDataNoCriteria);
					if(_orderedData.length>0){
						$scope.diplayApData="true";
					}
				}
				//console.log("_orderedData",JSON.stringify(_orderedData));
				$scope.apOrderedData=[];
				var apQuestionText=[];
				var apQuestionValue={};
				angular.forEach(_orderedData,function(v,k){					
					apQuestionValue[v.questionText]=v;
					apQuestionText.push(v.questionText);
				});
				if(apQuestionText.length>0){
					params.apQuestionText=apQuestionText;
					
					dashboardService.fetchAPCategoryByQues(params,function(response){
						//console.log("response",JSON.stringify(response.data.data));
						if(response.data.type){
							var baseObj=response.data.data;
							
							for(var x=0;x<apQuestionText.length;x++){
								var qText=apQuestionText[x];
								var obj=baseObj[qText];
								for(var key in apQuestionValue[qText]){
									obj[key]=apQuestionValue[qText][key];
									if(key=="questionText"){
										var str=apQuestionValue[qText][key].replace(/\./g,'&#46;');
										str=str.replace(/[$]+/g,'&#36;');
										str=str.replace(/ /g,'&#32;');
										obj["formatQuestionText"]=str;
										//console.log(obj["formatQuestionText"]);
									}	
								}
								$scope.apOrderedData.push(obj);
							}
							$scope.processAPData();
						}
						
					});
				}else{
					$scope.processAPData();
				}
				
				
				//console.log("$scope.apOrderedData",JSON.stringify(apQuestionText),"data",$scope.apOrderedData);
		 });
	}
		$scope.processAPData=function(){
			for(var x=0;x<$scope.apOrderedData.length;x++){
				var tmpAPObj=$scope.apOrderedData[x];
				var questionKey=tmpAPObj.question.baseQuestionId;
				if($scope.apData2save[questionKey]){
								
				}			
			}
			var planCnt=0;
			var planStatusHldr={};
			var apPlanBarData={};
			dashboardService.fetchAPData(params,function(response){
				var apBarDataWithFilter=response.data.data["APDataForBarChart"];
				if($localStorage.loginDetails.admin=="superadmin"){
				angular.forEach(apBarDataWithFilter,function(value1,key1){
					angular.forEach($scope.dbActionPlanningDoc,function(value,key){
						angular.forEach(value,function(v,k){
							if(k!="_id" && k!="adminId" && k!="clientId" && value1["_id"]==v["areaFocus"]){
								apPlanBarData[k+'\t'+v.createdAdmin]=v;					
							}
						});
					});
				});	
				}else{
					angular.forEach(apBarDataWithFilter,function(value,key){
						angular.forEach($scope.dbActionPlanningDoc,function(v,k){
							if(k!="_id" && k!="adminId" && k!="clientId" && value["_id"]==v["areaFocus"]){
								apPlanBarData[k+'\t'+v.createdAdmin]=v;					
							}
						});
					});
				}
			angular.forEach(apPlanBarData,function(value,key){
				if(value.planName){
						var itObj=value;
						if(itObj.planStatus && itObj.planStatus=="Open"){
							status="Open"
							if(itObj.dueDate){
								var dateArr=[];
								var endDate;
								var today;
								dateArr=itObj.dueDate.split("/");
								endDate=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
								endDate.setHours(0,0,0,0);
								endDate=endDate.getTime();								
								today = new Date();	
								var dd = today.getDate();
								var mm = today.getMonth()+1;
								var yyyy = today.getFullYear();
								if(dd<10){
									dd='0'+dd;
								} 
								if(mm<10){
									mm='0'+mm;
								} 
								today = mm+'/'+dd+'/'+yyyy;
								
								dateArr=today.split("/");
								today=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
								today.setHours(0,0,0,0);
								today=today.getTime();
								if(today>endDate){
									status='Overdue';
								}
							}	
							
							if(!planStatusHldr[status]){
								planStatusHldr[status]=0;
							}
							planStatusHldr[status]=planStatusHldr[status]+1;
						}else if(itObj.planStatus && itObj.planStatus=="Draft"){
							status="Draft"
								if(itObj.dueDate){
									var dateArr=[];
									var endDate;
									var today;
									dateArr=itObj.dueDate.split("/");
									endDate=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
									endDate.setHours(0,0,0,0);
									endDate=endDate.getTime();
									
									today = new Date();
									
									var dd = today.getDate();
									var mm = today.getMonth()+1;
									var yyyy = today.getFullYear();
									if(dd<10){
										dd='0'+dd;
									} 
									if(mm<10){
										mm='0'+mm;
									} 
									today = mm+'/'+dd+'/'+yyyy;
									
									dateArr=today.split("/");
									today=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
									today.setHours(0,0,0,0);
									today=today.getTime();
									if(today>endDate){
										status='Overdue';
									}
								}	
								
								if(!planStatusHldr[status]){
									planStatusHldr[status]=0;
								}
								planStatusHldr[status]=planStatusHldr[status]+1;
						}else if(itObj.planStatus && itObj.planStatus=="Complete"){
							if(!planStatusHldr["Complete"]){
								planStatusHldr["Complete"]=0;
							}
							planStatusHldr["Complete"]=planStatusHldr["Complete"]+1;
						}else{
							if(!planStatusHldr["Draft"]){
								planStatusHldr["Draft"]=0;
							}
							planStatusHldr["Draft"]=planStatusHldr["Draft"]+1;
						}
					}
					++planCnt;
				});
				$scope.framePlanStatusDataSet(planStatusHldr,planCnt);
				angular.forEach($scope.apOrderedData,function(value,key){
					if($scope.dbActionPlanningDoc[value.formatQuestionText]){
						for(var z=0;z<$scope.dbActionPlanningDoc[value.formatQuestionText].actionItems.length;z++){
							$scope.recommendations[value.formatQuestionText+"\t"+z]=$scope.dbActionPlanningDoc[value.formatQuestionText].actionItems[z];
						}
					}else{
						if(value.question.actionItems){
							for(var z=0;z<value.question.actionItems.length;z++){
								$scope.recommendations[value.formatQuestionText+"\t"+z]=value.question.actionItems[z];
							}
						}
					}
				});
				$scope.apPlanStatusArr=['Open','Draft','Complete'];
				$timeout(function (){						
					$scope.loadApBarChart();
				},290);
				if($localStorage.toggle2ApMyPlan){
					$scope.toggleAP("planDashboard");
					$localStorage.toggle2ApMyPlan=false;
				}
							
			});	
						
		}
		$scope.framePlanStatusDataSet=function(apStatusDispArr,totalAPstatusCount){	
			var rg={};
			$scope.selectedDemographicsPlan={};
			//$scope.demographicsSelected="false";
			angular.forEach($scope.demographicsModel,function(key,val){
				var field=val.split("\t")[0];
				angular.forEach($scope.demographics,function(v,k){
					if(v.demographic==field){
						if(!rg[field]){
							rg[field]={};
							rg[field]["rgName"]="";
							rg[field]["rgItemArray"]=[];
							rg[field]["rgName"]=v.displayName;
							rg[field]["rgItemArray"].push(val.split("\t")[1]);
					}else{
							rg[field]["rgItemArray"].push(val.split("\t")[1]);
						}
					}
				});
			});
			$scope.selectedDemographicsPlan=rg;
			// if(Object.keys($scope.selectedDemographicsForPlan).length>0){
			// 	$scope.demographicsSelected="true";
			// }
			var inprogressObj={};
			var draftObj={};
			var completeObj={};
			var overdueObj={};
			$scope.apBarData=[];
			//console.log('apStatusDispArr',apStatusDispArr)
			angular.forEach(apStatusDispArr,function (v,k){
				var obj={};
				var statusPct=Math.round((v/totalAPstatusCount)*100);
				if(k=='Open'){
					obj.name='In Progress';
					obj.value=statusPct;
					obj.count=v;
					inprogressObj=obj;
				}else if(k=='Draft'){
					obj.name='Drafted';
					obj.value=statusPct;
					obj.count=v;
					draftObj=obj
				}else if(k=='Complete'){
					obj.name='Completed';
					obj.value=statusPct;
					obj.count=v;
					completeObj=obj
				}else if(k=='Overdue'){
					obj.name='Overdue';
					obj.value=statusPct;
					obj.count=v;
					overdueObj=obj
				}
				
				
			});
			//if($scope.diplayApData=="true"){
				if(Object.keys(inprogressObj).length>0){
				$scope.apBarData.push(inprogressObj);
			}
			if(Object.keys(completeObj).length>0){
				$scope.apBarData.push(completeObj);
			}
			if(Object.keys(draftObj).length>0){
				$scope.apBarData.push(draftObj);
			}
			if(Object.keys(overdueObj).length>0){
				$scope.apBarData.push(overdueObj);
			}
			//}
		}
		$scope.recommendations={};
		$scope.showRecommendation="";
		$scope.recommendationQuestionId="";
		
		$scope.planName={};
		$scope.actionPlanCreator={};
		$scope.itemScore={};
		$scope.recommendQues={};
		$scope.plan_start_date={};
		$scope.due_date={};
		$scope.planStatus={};
		$scope.planNotes={};
		$scope.planSurveyName={};
		$scope.selectedSurveyTypesForPlan={};
		$scope.selectedSurveyDatesForPlan={};
		$scope.selectedDemographicsForPlan={};
		/*console.log("customerSurveys",$scope.customerSurveys);
		console.log("start_date",$scope.start_date);
		console.log("start_date",$scope.end_date);
		console.log("demographics",$scope.demographics);*/
		$scope.planAdmin="";
		$scope.checkObjectLen=function(obj1,obj2){
			if(obj1 && obj1.length>0 && obj2 && Object.keys(obj2).length>0){
				return true;
			}else{
				return false;
			}
			
		}
		$scope.getRecommendation=function(ques_text,planAdmin){
			$scope.ActionEmptyErrMsg="";
			$scope.planAdmin=planAdmin;
			$scope.showRecommendation=ques_text;
			var actionPlanningDoc={};
			if($localStorage.loginDetails.admin=="superadmin"){
				angular.forEach($scope.dbActionPlanningDoc,function(value,key){
					angular.forEach(value,function(v,k){
						if(k!="_id" && k!="adminId" && k!="clientId"){
							if(v.formatQuestionText==ques_text && v.createdAdmin==planAdmin){
								actionPlanningDoc=v;					
							}	
						}
					});
				});
			}else{
				actionPlanningDoc=$scope.dbActionPlanningDoc[$scope.showRecommendation];
			}
				if(actionPlanningDoc && Object.keys(actionPlanningDoc).length>0){
					$scope.planName[$scope.showRecommendation]=actionPlanningDoc.planName;
					$scope.actionPlanCreator[$scope.showRecommendation]=actionPlanningDoc.actionPlanCreator;
					$scope.itemScore[$scope.showRecommendation]=actionPlanningDoc.itemScore;
					$scope.recommendQues[$scope.showRecommendation]=actionPlanningDoc.areaFocus;
					$scope.planSurveyName[$scope.showRecommendation]=actionPlanningDoc.planSurveyName;
					$scope.recommendations=actionPlanningDoc.recommendations;
					$scope.plan_start_date[$scope.showRecommendation]=actionPlanningDoc.startDate;
					$scope.due_date[$scope.showRecommendation]=actionPlanningDoc.dueDate;
					$scope.planStatus[$scope.showRecommendation]=actionPlanningDoc.planStatus;
					$scope.planNotes[$scope.showRecommendation]=actionPlanningDoc.planNotes;
					$scope.selectedSurveyTypesForPlan[$scope.showRecommendation]=actionPlanningDoc.selectedSurveyTypesForPlan;
					$scope.selectedSurveyDatesForPlan[$scope.showRecommendation]=actionPlanningDoc.selectedSurveyDatesForPlan;
					$scope.selectedDemographicsForPlan[$scope.showRecommendation]=actionPlanningDoc.selectedDemographicsForPlan;					
				}else{	
					
					$scope.actionPlanCreator[$scope.showRecommendation]=$localStorage.loginDetails.clientName;		
					angular.forEach($scope.apOrderedData,function(value,key){	
						if(value.formatQuestionText==ques_text){
							$scope.recommendQues[ques_text]=value.question.question[$scope.default_language_key][0];
							$scope.itemScore[ques_text]=value.pctFav;
							$scope.planSurveyName[ques_text]=value.question.survey_name;
						}
					});
					$scope.selectedSurveyTypesForPlan[$scope.showRecommendation]=$scope.selectedSurveyTypes;
					$scope.selectedSurveyDatesForPlan[$scope.showRecommendation]=$scope.selectedSurveyDates;
					$scope.selectedDemographicsForPlan[$scope.showRecommendation]=$scope.selectedDemographicsPlan;
							
				}
			}
			
		$scope.addAnAction=function(){
			$scope.ActionEmptyErrMsg="";
			var insertIdx=0;
			var indexArr=[];
			for(var key in $scope.recommendations){
				var kArr=key.split("\t");
				var quesKey=kArr[0]+"";			
				if($scope.showRecommendation==quesKey){
					//console.log($scope.showRecommendation,quesKey);
					indexArr.push(kArr[1]);
				}
			}
			if(indexArr.length>0){
				indexArr.sort();
				insertIdx=parseInt(indexArr[indexArr.length-1])+1;
			}
			$scope.recommendations[$scope.showRecommendation+"\t"+insertIdx]="";
		}
		$scope.deleteRecommendation=function(key){
			$scope.ActionEmptyErrMsg="";
			var recommendationkeyToDelete =key;
			delete $scope.recommendations[recommendationkeyToDelete]; 
		}
		$scope.closeRecommendation=function(){
			//$scope.showRecommendation="";
			//$scope.recommendations={};
			//$scope.recommendQues="";
			
		}

		$scope.catLimit=3;
		$scope.questionLimit=3;
		
		
		$scope.showQuestions=function(){
			if($scope.questionLimit==3){
				$scope.questionLimit=10;
			}else{
				$scope.questionLimit=3;
			}
			
		}
		$scope.showStartDate=function(){
			angular.element("#plan_start_date").trigger('click');
		}
		$scope.removeStartDate=function(){
			angular.element("#plan_start_date").blur();
		}
		$scope.showDueDate=function(){
			angular.element("#due_date").trigger('click');
		}
		$scope.removeDueDate=function(){
			angular.element("#due_date").blur();
		}	
		$scope.savePlan=function(validObj){
			Flash.clear();
			// Flash.create('success','Plan Saved Successfully!',4000, {container: 'flash-fixed'});
			// $window.scrollTo(0, 0);
			var recommendationEmptyArr=[];
			var recommendationFoundArr=[];
			$scope.actionFoundArr=[];
			angular.forEach($scope.recommendations,function(value,key){
				var kArr=key.split("\t");
				var quesKey=kArr[0]+"";
				if($scope.showRecommendation==quesKey){
					$scope.actionFoundArr.push(value);
					if(!value){
						recommendationEmptyArr.push(value);
					}
					else{
						recommendationFoundArr.push(value);
					}	
				}
			});
			if(recommendationEmptyArr.length>0 || !recommendationFoundArr.length>0){
				Flash.clear();
				Flash.create('danger','Actions cannot be empty!',4000, {container: 'flash-fixed'});
				$window.scrollTo(0, 0);	
				return;		
			}else{
				if(validObj){
					var recObjArr=[];
					var recObj={};
					angular.forEach($scope.recommendations,function(v,k){
						var kArr=k.split("\t");
						var key=kArr[0]+"";
						if(!recObj[key]){
							recObj[key]=[];
						}
						recObj[key].push($scope.recommendations[k]);
						
					});
					var planObj={};
					var planDoc={};
					if($localStorage.loginDetails.admin=="superadmin"){
						angular.forEach($scope.dbActionPlanningDoc,function(value,key){
							angular.forEach(value,function(v,k){
								if(k!="_id" && k!="adminId" && k!="clientId"){
									if(v.areaFocus==$scope.showRecommendation && v.createdAdmin==$scope.planAdmin){
										planDoc=v;
									}
								}
							});
						});
					}else{
						planDoc=$scope.dbActionPlanningDoc[$scope.showRecommendation];
					}
					apStatusDispArr={};
					totalAPstatusCount=0;
						if(!recObj[$scope.showRecommendation]){
							recObj[$scope.showRecommendation]=[];
						}
					var obj={
							"planName": $scope.planName[$scope.showRecommendation],
							"actionPlanCreator": $scope.actionPlanCreator[$scope.showRecommendation],
							"itemScore": $scope.itemScore[$scope.showRecommendation],
							"areaFocus": $scope.recommendQues[$scope.showRecommendation],
							"formatQuestionText":$scope.showRecommendation,
							"actionItems": recObj[$scope.showRecommendation],
							"startDate": $scope.plan_start_date[$scope.showRecommendation],
							"dueDate": $scope.due_date[$scope.showRecommendation],
							"planStatus":$scope.planStatus[$scope.showRecommendation],
							"planNotes": $scope.planNotes[$scope.showRecommendation],
							"planSurveyName":$scope.planSurveyName[$scope.showRecommendation],
							"selectedSurveyTypesForPlan":$scope.selectedSurveyTypes,
							"selectedSurveyDatesForPlan":$scope.selectedSurveyDates,
							"selectedDemographicsForPlan":$scope.selectedDemographicsPlan,
							"selectedDLAForPlan":JSON.stringify($localStorage.loginDetails.dlaQuery),
							"recommendations":$scope.recommendations
						}
							obj.createdAdmin=$localStorage.loginDetails.participantId;
							obj.modifiedAdmin=$localStorage.loginDetails.participantId;
							obj.clientId=$scope.clientId
							planObj={
								"clientId" : $scope.clientId,
								"adminId" : $localStorage.loginDetails.participantId
							}
							obj.cdt=new Date();
							obj.mdt=new Date();
						if(planDoc && Object.keys(planDoc).length>0){
							obj.selectedDLAForPlan=planDoc.selectedDLAForPlan;
							if($localStorage.loginDetails.dlaQuery && Object.keys($localStorage.loginDetails.dlaQuery).length>0){	
								obj.selectedDLAForPlan=JSON.stringify($localStorage.loginDetails.dlaQuery);
							}
							obj.createdAdmin=planDoc.createdAdmin;
							obj.modifiedAdmin=$localStorage.loginDetails.participantId;
							obj.clientId=planDoc.clientId;
							obj.mdt=new Date();
							obj.cdt=planDoc.cdt;
							planObj={
								"clientId" :planDoc.clientId,
								"adminId" : planDoc.createdAdmin
							}
						}
						if(($localStorage.loginDetails.dlaQuery=="" || $localStorage.loginDetails.dlaQuery==undefined) && obj.createdAdmin==$localStorage.loginDetails.participantId) {
							obj.selectedDLAForPlan="All";
						}
						planObj[$scope.showRecommendation]=obj;
						var insertObj={};
						insertObj._id=$scope.dbActionPlanningDoc["_id"];
						insertObj.doc=planObj;
						$scope.toggle2Apdashboard=true;

						dashboardService.saveActionPlanningData(insertObj,function(response){
							if(response.data.type){
								$localStorage.toggle2ApMyPlan=true;
								$state.transitionTo($state.current, $stateParams, { 
									reload: true, inherit: false, notify: true
							});			
							}else{
								console.log('err',response.data.data);
							}
						});
				//
					}else{
							Flash.clear();
							Flash.create('danger','Please enter the mandatory fields',4000, {container: 'flash-fixed'});
							$window.scrollTo(0, 0);
							return;
					}			
				}
		}

		  //===================================c3 chart start====================================//
	   $scope.apBarData = [];
	   $scope.loadApBarChart=function(){
		   $("#barchart").html("");
			   var chart = c3.generate({
						bindto:"#barchart",
						data: {
							json: $scope.apBarData,
							keys: {	
								x: 'name',
								value: ['value']	
							},
							type: 'bar',
							labels: {
								format: function (value,name) {
									var val={};
									angular.forEach($scope.apBarData,function(v,k){
										if(value==v.value && name){
											val=v;
										}
									});
									return val.value+'%'+'\t('+val.count+')';
								}
							},
						},
						 color: {
    						pattern: ['#5c9741']
						},
						axis: {
								x: {
									type: 'category'
									},
								y: {
									show: false
								}
							},
						bar: {
							width: {
								ratio: 0.5 // this makes bar width 50% of length between ticks
							}
							// or
							//width: 100 // this makes bar width 100px
						},
					    legend: {
					        show: false
					    },
					    tooltip: {
					        show: false
					    }
						
					});
					if($scope.apBarData.length>0){
						d3.select('#barchart svg').append('text')
						.attr('x', d3.select('#barchart svg').node().getBoundingClientRect().width / 2)
						.attr('y', 13)
						.attr('text-anchor', 'middle')
						.style('font-size', '16px')
						.style('fill','#453c51')
						.style('font-size', '18px')
						.style("fill", "#453c51")
						.attr("xLabel","xLabel")
						.text('Action Plan Progress');
						d3.select('#barchart svg g path.domain').style("fill","none").style("stroke","#453c51")
						d3.select('#barchart svg').attr("id", "apChart");
						
					}
		   }
		  
		 //===================================c3 chart end====================================//
		
	

	
	//===============================toggle demographics-start=====================================//
	$scope.demographicsItemsDisplay={};
	angular.forEach($scope.demographics,function(val,key){
		$scope.demographicsItemsDisplay[key]=false;
	});
	$scope.selectedDemographicsUIkey=-1;
            

	$scope.toggleDemographics=function(selectedkey){	
		$scope.selectedDemographicsUIkey=selectedkey;
		if($scope.demographicsItemsDisplay[selectedkey]==true){
			$scope.demographicsItemsDisplay[selectedkey]=false;
		}else{		
			$scope.demographicsItemsDisplay[selectedkey]=true;
			angular.forEach($scope.demographics,function(val,key){
				if(key!=selectedkey){
					$scope.demographicsItemsDisplay[key]=false;
				}
			});
		}					
	}
	//===============================toggle demographics-end=====================================//
	$scope.reloadDemographics("");
	//$scope.loadDataSet();
$scope.pdfDownload=function () {
		$('.loader').show();
		var pdfexportparams={};
		pdfexportparams.overAllPctFav=$scope.overAllPctFav;
		pdfexportparams.overAllAvg=$scope.overAllAvg;
		pdfexportparams.overAllPoints=$scope.overAllPoints;
		pdfexportparams.overallPctFavDataFound=$scope.overallPctFavDataFound;
		pdfexportparams.highlowDataAsc=$filter('limitTo')($scope.highlowDataAsc, 5);
		pdfexportparams.highlowDataDesc=$filter('limitTo')($scope.highlowDataDesc, 5);
		pdfexportparams.participantRatePct=$scope.participantRatePct;
		pdfexportparams.participantRatesCompletedParticipants=$scope.participantRatesCompletedParticipants;
		pdfexportparams.participantRatesTotalParticipants=$scope.participantRatesTotalParticipants;
		pdfexportparams.hlsData=$scope.export_HLSData;
		pdfexportparams.apOrderedData=$filter('limitTo')($scope.apOrderedData, 3);
		pdfexportparams.hlsSelectedview=$scope.dataHLSOptions.selectedOption;
		pdfexportparams.hlsSelectedRG=$scope.dataHLSDemographicOptions.selectedOption;//$scope.selectedHLSView;
		pdfexportparams.hlsColumns=$scope.columns;
		pdfexportparams.hotspotData=_js_hotspot_viewByData;
		pdfexportparams._js_overAllPctFav=_js_overAllPctFav;
		for(var _k in $scope.hotspotRgs){
			var _obj=$scope.hotspotRgs[_k];
			if(_obj.field==params.hotspotRg){
				pdfexportparams.hotspotRg=_obj.title;
				break;
			}
		}
		if("questionText"==params.selectedHotspotView){
			pdfexportparams.selectedHotspotView="View By Questions";
		}else{
			pdfexportparams.selectedHotspotView="View By Category";
		}

		pdfexportparams.commentPulse=$('#questionName').val();
		
		var commentPulse_svg = document.getElementById("wordcloudId");
		if (commentPulse_svg!=null) {
			commentPulse_svg.toDataURL("image/png", {
	    		callback: function(data) {
	        		pdfexportparams.commentPulse_src=data;
	    		}	
			});	
		}
		var apChart = document.getElementById("apChart");
		if ($scope.apBarData.length>0) {
			apChart.toDataURL("image/png", {
	    		callback: function(data) {
	        		pdfexportparams.apChart=data;
	    		}	
			});	
		}  
		var dla_displayText=$scope.dla_displayText.replace(/[[]+/gi,'');
		dla_displayText=dla_displayText.replace(/[^]]+/gi,'');
		pdfexportparams.dla_displayText=dla_displayText;
		pdfexportparams.selectedSurveyTypes=$scope.selectedSurveyTypes;
		pdfexportparams.selectedSurveyDates=$scope.selectedSurveyDates;
		var aplyedFilter="";
		var ind=0;
		angular.forEach($scope.demographicsModel,function(value,key){
			var idxArr=key.split("\t");
			console.log("idxArr", idxArr)
			var demoname=idxArr[0];
			demoname=$scope.demographics.find(function (value) {
				return value.demographic===demoname;
			});
			var key1=idxArr[1];
			ind++;
			if($scope.demographicsModel[key]){
				console.log(demoname.displayName)
				if (Object.keys($scope.demographicsModel).length==ind) {
					aplyedFilter+=demoname.displayName+" in "+key1;
				}else{
					aplyedFilter+=demoname.displayName+" in "+key1+", ";
				}
									
			}
			
		});

		pdfexportparams.aplyedFilter=aplyedFilter;
		$timeout(function() {
			dashboardService.pdfexport(pdfexportparams,function(response){
				var blob = new Blob([response.data],
						{type: 'application/pdf'});
				saveAs(blob, "download.pdf");
			});			
		}, 500);
	}
	if(dashboard_pref["toggleDemographicsFilterKey"]){
        $scope.toggleDemographics(dashboard_pref["toggleDemographicsFilterKey"]);
    }

	//==============================gridster settings --start===================================//
	    $scope.removeWidget=function(widget){
	    		var index=$scope.widgetItems.indexOf(widget);
				$scope.removedWidgets.push($scope.widgetItems[index]);  
	    		$scope.widgetItems.splice(index,1);
				dashboardPref.widgetItems=$scope.widgetItems;
				dashboardPref.removedWidgets=$scope.removedWidgets;
				dashboardService.saveDashboardPreferences(dashboardPref,function(response){
				});

		}
		$scope.addWidget=function(value){
			var index=$scope.removedWidgets.indexOf(value);
			$scope.widgetItems.push(value);
			$scope.removedWidgets.splice(index,1);
			dashboardPref.widgetItems=$scope.widgetItems;
			dashboardPref.removedWidgets=$scope.removedWidgets;
			dashboardService.saveDashboardPreferences(dashboardPref,function(response){
			});
			if(value.id=="container1"){
				$state.transitionTo($state.current, $stateParams, { 
 				 reload: true, inherit: false, notify: true
				});	
			}
			if (value.title=="Open Ended Comments") {
				$scope.isActive=false;
				if($scope.wcQuestions.length>0 && $scope.wcQuestions[0].questionText!=undefined) {
					if ($scope.wordcloudSelectedQuestion!=undefined) {						
						for (var i = 0; i < $scope.wcQuestions.length; i++) {
							if ($scope.wcQuestions[i].questionText==$scope.wordcloudSelectedQuestion) {
								//console.log($scope.wcQuestions[i].questionText==$scope.wordcloudSelectedQuestion, $scope.wcQuestions[i].questionText)
								$scope.isActive=true;
								break;
							}
						}
						if ($scope.isActive==true) {
							$scope.getWordCloudDatas($scope.wordcloudSelectedQuestion);
						}else{
							$scope.getWordCloudDatas($scope.wcQuestions[0].questionText);
						}
					}else{
						$scope.getWordCloudDatas($scope.wcQuestions[0].questionText);
					}
				}
				
		}
		}
	    $scope.animateAsc=function(objId,widthReq){
	  	  var width = 1;
	  	  var id = setInterval(frame, 25);
	  	  function frame() {
		  	   var elem = document.getElementsByClassName("barAsc")[objId];
				  if(elem!=undefined)
				  {
					  if (width >= widthReq-10) {
		  	      		clearInterval(id);
		  	    	} else {
		  	      		width++; 
		  	      		elem.style.width = width + '%';
		  	    	}
				}
	  	 }
	   }
	    
	    $scope.animateDesc=function(objId,widthReq){
	    $scope.rateDescShow = true;	
	  	 var width = 1;
	  	  var id = setInterval(frame, 25);
	  	  function frame() {
		  	   var elem = document.getElementsByClassName("barDesc")[objId];
				 if(elem!=undefined){
					  if (width >= widthReq-10) {
		  	      		clearInterval(id);
		  	    	} else {
		  	      		width++; 
		  	      		elem.style.width = width + '%'; 										
		  	   		 }
				 }
		  	   
	  	 }  	
	    }	//==============================gridster settings --end===================================//
		//==================================word start cloud ==============================================
	   	$timeout(function() {
	   		/*$scope.words = [
            {id: 1, word: "survey", size: 10},
            {id: 2, word: "dates", size: 6},
            {id: 3, word: "test", size: 7},
            {id: 4, word: "build", size: 2},
            {id: 5, word: "deployment", size: 1},
            {id: 6, word: "word3", size: 3},
            {id: 7, word: "participant", size: 4},
            {id: 8, word: "word5", size: 5},
            {id: 9, word: "word8", size: 8},
            {id: 10, word: "word9", size: 9},
            {id: 1, word: "customer", size: 1},
            {id: 2, word: "client", size: 6},
            {id: 3, word: "module", size: 7},
            {id: 4, word: "manager", size: 2},
            {id: 5, word: "deployment", size: 9},
            {id: 6, word: "word3", size: 3},
            {id: 7, word: "active", size: 4},
            {id: 8, word: "word5", size: 5},
            {id: 9, word: "word8", size: 8},
            {id: 10, word: "word9", size: 9}
        ];*/
		var sample=90;
		var datas=[{
            "yearmonth": "Jan",
            "value": 1
        }, {
            "yearmonth": "Feb",
            "value": 2
        }, {
            "yearmonth": "Mar",
            "value": 0
        }, {
            "yearmonth": "Apr",
            "value": 3
        }, {
            "yearmonth": "May",
            "value": 5
        }, {
            "yearmonth": "Jun",
            "value": 4
        }, {
            "yearmonth": "Jul",
            "value": 6
        }, {
            "yearmonth": "Aug",
            "value": 8
        }, {
            "yearmonth": "Sep",
            "value": 7
        }, {
            "yearmonth": "Oct",
            "value": 2
        }, {
            "yearmonth": "Nov",
            "value": 1
        }, {
            "yearmonth": "Dec",
            "value": 9
        }];
	    // gaugeService.GenerateChart(sample);
	    // gaugeService.regressionChart(datas);
	}, 500);	
	$scope.highlightWord=function (word, size) {
		//console.log(word,size)
			//var desired = word.replace(/[^\w\s]/gi, '')
			word=word.toString().trim();
			console.log(word)
			params.word=word;
		//	params.word=$scope.escapeRegExp(word);
			params.questionText=$('#questionName').val();
	    	dashboardService.fetchwordCloudDatabywords(params,function(response){
				$scope.selectedWord=word;
				$scope.selictedSize=size;
	    		$('#word_cloud').modal('show');
	    		//console.log(response.data.data[0]['answer']);
				$scope.wordshilighed=response.data.data;
			});
	    	// $scope.wordshilighed=[
	    	// {id:'1', text:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
	    	// {id:'2', text:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
	    	// {id:'3', text:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
	    	// {id:'4', text:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"}
	    	// ]
			 }
	    $scope.escapeRegExp=function (str) {
	    	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	    }	    
        //==============================word cloud end================================================ 
}]);
spApp.filter('highlight', function($sce) {
  return function(text, phrase) {
 //  	var str = phrase;
 //    var patt1 = /\W/g;
 //    var result = str.toString(patt1);
 //    String.prototype.replaceAll = function(target, replacement) {
	//   return this.split(target).join(replacement);
	// };
 //    if (phrase) text = text.replaceAll(result,
 //      '<span class="highlighted">'+result+'</span>')
 	var allArr=text.split(/[\s\n]+/);
 	var resultArr=[];
 	for (var i = 0; i < allArr.length; i++) {
 		var temptext=allArr[i];
 		// if (/^[a-zA-Z0-9- ]*$/.test(temptext.charAt(0)) == false && /^[a-zA-Z0-9- ]*$/.test(temptext.charAt(temptext.length-1))==false) {
 		// 	var result=temptext;
 		// }else if (/^[a-zA-Z0-9- ]*$/.test(temptext.charAt(0)) == false) {
 		// 	var result = temptext.slice(1, temptext.length);
 		// }else if (/^[a-zA-Z0-9- ]*$/.test(temptext.charAt(temptext.length-1))==false) {
 		// 	var result= temptext.slice(0, temptext.length-1)
 		// }else{
 		// 	var result=temptext;
 		// }
 		var result=temptext.replace(/^[\s\\'_-]/gi, '');
 		result = result.replace(/[,".)(!?:;_-]/gi, '');
 		//console.log(result)
 		if (result.toLowerCase()==phrase.toLowerCase()) {
 			resultArr.push("<span class='highlighted'>"+allArr[i]+"</span>")
 		}else{
			resultArr.push(allArr[i]) 			
 		}
 	}
 	var resultText= resultArr.join(' ');
    return $sce.trustAsHtml(resultText)
  }
});
spApp.filter('limitObjectTo', function() {
  return function(obj, limit) {
     var newObj = {},
      i = 0;
  for (var p in obj) {
    newObj[p] = obj[p];
    if (++i === limit) break;
  }
	return newObj;
  };
});
	/*$scope.dummyData= [{
					"summary_demographics": "Less than 3 months",
					"summary_n": 3,
					"mean_score": 2.9,
					"pctFav": 100,
					"company_delta": 5
				}, {
					"summary_demographics": "5 years - less than 10 years",
					"summary_n": 1,
					"mean_score": 4.95,
					"pctFav": 100,
					"company_delta": 10
				}, {
					"summary_demographics": "3 months - less than 6 months",
					"summary_n": 1,
					"mean_score": 2.05,
					"pctFav": 100,
					"company_delta": -3
				}, {
					"summary_demographics": "1 year - less than 3 years",
					"summary_n": 3,
					"mean_score": 3.33,
					"pctFav": 100,
					"company_delta": -10
				}]*/


/*deprecated heigth calculation
$scope.clientHeight=[];
	$scope.maxHt=0;
	$scope.openSettings=function(){
		$timeout(function () {
			angular.forEach(angular.element('.filter_groups_body'),function(value,key){
				$scope.clientHeight.push(value.clientHeight);	
			});
			if($scope.maxHt==0){
				$scope.maxHt=Math.max.apply(null,$scope.clientHeight)+100;
				//$scope.maxHt=Math.max(...$scope.clientHeight)+100;
				//scope.maxHt="100%";
			}else{
				$scope.maxHt=Math.max.apply(null,$scope.clientHeight);
				//$scope.maxHt=Math.max(...$scope.clientHeight);
				//$scope.maxHt="100%";
			}	
			$scope.fh=$scope.maxHt;
			$scope.filterDlgHgt=$scope.fh+angular.element('.dashboard-filter-header')[0].clientHeight+angular.element('.filter_dashboard_header')[0].clientHeight+100;
		},250);
		
	}
	$scope.filterDlgHgt="";
	$scope.fh="";

	$scope.toggleDemographics=function(selectedkey){	
		if($scope.demographicsItemsDisplay[selectedkey]==true){
			$scope.demographicsItemsDisplay[selectedkey]=false;
		}else{		
			$scope.demographicsItemsDisplay[selectedkey]=true;
			angular.forEach($scope.demographics,function(val,key){
				if(key!=selectedkey){
					$scope.demographicsItemsDisplay[key]=false;
				}
			});
		}	
		if($scope.demographicsItemsDisplay[selectedkey]==true){
			$timeout(function () {
			angular.forEach(angular.element('.filter_groups_body'),function(value,key){
				$scope.clientHeight.push(value.clientHeight);	
			});
			$scope.fh=Math.max.apply(null,$scope.clientHeight);//;Math.max.apply(null, numbers) 
			//$scope.fh="100%";
			$scope.filterDlgHgt=$scope.fh+angular.element('.dashboard-filter-header')[0].clientHeight+angular.element('.filter_dashboard_header')[0].clientHeight+100;
			 },0);
		
		}else{
			$timeout(function () {
			$scope.fh=$scope.maxHt;
			$scope.filterDlgHgt=$scope.fh+angular.element('.dashboard-filter-header')[0].clientHeight+angular.element('.filter_dashboard_header')[0].clientHeight+100;
		},0);
		}				
	}



	draggable
	.directive('onScroll', function($timeout) {
    'use strict';

    return {
        scope: {
            onScroll: '&onScroll'
        },
        link: function(scope, element) {
            var scrollHandler = function() {
                scope.onScroll();
				element[0].draggable=true;
            };
            element.on("scroll", scrollHandler);
        }
    };
});
	*/


function js_handleHsViewBy(formobj){
	$('.loader').show();
	js_params.selectedHotspotView=formobj.value;
	js_dashboard_pref.selectedHotspotView=formobj.value;
	$.ajax({
	    url : js_hsViewByurl,	
	    data:{"params":js_params,
	    	"fromDate":JSON.stringify(js_params.start_date),
	    	"toDate":JSON.stringify(js_params.end_date)},
	    type : "post",
	    success : function(data1) {
	    	
	    	if(data1.type){
				var databObj=data1.data;
				_js_hotspot_viewByData=data1.data;
				var orderedRgisAll=databObj.demographicItemDataOrdered.orderedRgis;
				var orderedRgis=[];
				for(var x=0;x<orderedRgisAll.length;x++){
					orderedRgis.push(orderedRgisAll[x]);
					if(x==js_hotspot_row_limit){
						break;
					}
				
				}
			
				var noOfResponses=databObj.demographicItemDataOrdered.noOfResponses;
				var overAllPct=databObj.demographicItemDataOrdered.overAllPct;
				var hotspotWithDLA= databObj.hotspotWithDLA;
				//console.log('orderedRgis',JSON.stringify(orderedRgis));
				//console.log('noOfResponses',JSON.stringify(noOfResponses));
				//console.log('overAllPct',JSON.stringify(overAllPct));
				//console.log('hotspotWithDLA',JSON.stringify(hotspotWithDLA));
			
				//$('#hotspotTable tr').remove();
				$('#hotspotTable tr').remove();
				var str="";
				str+="<tr>";
				var selectstr="";
				var catselected="";
				var quesselected="";
				if("questionText"==js_dashboard_pref.selectedHotspotView){
					catselected="";
					quesselected="selected";
				}else{
					catselected="selected";
					quesselected="";
				}
				selectstr+="<select id='hsviweby' onchange='js_handleHsViewBy(this)'>";
				selectstr+="<option value='categoryText' "+catselected+">View By Category</option>";
				selectstr+="<option value='questionText' "+quesselected+">View By Questions</option>";
				selectstr+="</select>";
				str+="<td>"+selectstr+"</td>";
				for(var x=0;x<orderedRgis.length;x++){
					str+="<td>"+orderedRgis[x]+"</td>";
				
				}
				str+="<tr>";
				str+="<td>No. Responses</td>";
				for(var x=0;x<orderedRgis.length;x++){
					str+="<td>"+databObj.categoryCounts[orderedRgis[x]]+"</td>";
				
				}
				str+="</tr>";
			
				str+="<tr>";
				str+="<td>Overall</td>";
				str+="<td>"+_js_overAllPctFav+"</td>";
				for(var x=1;x<orderedRgis.length;x++){
					str+="<td>"+overAllPct[orderedRgis[x]]+"%</td>";
				
				}
				str+="</tr>";
				var rowcnt=0;
				var ranges=databObj.ranges;
				for(var key in hotspotWithDLA){
					str+="<tr onclick='zoomHotspot();' style='cursor:zoom-in;' title='Click to view all data'>";
					str+="<td>"+key+"</td>";
					var items=hotspotWithDLA[key];
					for(var x=0;x<orderedRgis.length;x++){
						var item=items[orderedRgis[x]];
						var tdval="-";
						var stylestr="";
						if(item!=undefined){
							/*if(item.pctFav>=0&&item.pctFav<=69){
								stylestr+=" style='background-color:#F79646'";
							}else if(item.pctFav>=70&&item.pctFav<=75){
								stylestr+=" style='background-color:#FAC090'";
							}else if(item.pctFav>=76&&item.pctFav<=79){
								stylestr+=" style='background-color:#EEECE1'";
							}else if(item.pctFav>=80&&item.pctFav<=84){
								stylestr+=" style='background-color:#B6DDE8'";
							}else if(item.pctFav>=85&&item.pctFav<=100){
								stylestr+=" style='background-color:#4BACC6'";
							}*/
							var dynaStyle="";
								for(var q=0;q<ranges.length;q++){
									var rangeArr=ranges[q].split("\t");
									var lowerLimit=parseInt(rangeArr[0]);
									var upperLimit=parseInt(rangeArr[1]);
									var colorCode=rangeArr[2];
									if(q==0){
										lowerLimit=0;
									}
									if(lowerLimit!=upperLimit){
										if(q==0 || q==1){
											upperLimit=upperLimit-1;
										}
										if(q==3 || q==4){
											lowerLimit=lowerLimit+1;
										}
										if(item.pctFav>=lowerLimit && item.pctFav<=upperLimit){
											stylestr=" style='background-color:"+colorCode+"'";
										}	
									}else{
										if(item.pctFav>=lowerLimit && item.pctFav<=upperLimit){
											stylestr=" style='background-color:"+colorCode+"'";
										}
									}
									//console.log("q",q,"lowerLimit",lowerLimit,"upperLimit",upperLimit);						
								}

							tdval=item.pctFav;
						}
						if('overall'==key){
							stylestr="";
						}
						if (orderedRgis[x]=='overall'){
							stylestr="";	
							tdval=tdval+'%';
						}
						str+="<td"+stylestr+">"+tdval+"</td>";
					}
					str+="</tr>";
				
					++rowcnt;
					if(rowcnt==js_hotspot_row_limit){
						break;
					}
				
				}
			
				$("#hotspotTable").append(str);
	    	}
	    	$.ajax({
	    	    url : js_savepref,	
	    	    data:{"filterData":js_dashboard_pref},
	    	    type : "post",
	    	    success : function(data1) {
	    		//console.log('js_dashboard_pref',JSON.stringify(js_dashboard_pref));
	    	    	$('.loader').hide();
	    	    	//console.log('success',data1)
	        	},
	    	    error : function(request, status, errorThrown) {
	    		  console.log(errorThrown);
	    		  $('.loader').hide();
	    	}
	        	
	    	});
		
    	},
	    error : function(request, status, errorThrown) {
		  console.log(errorThrown);
		  $('.loader').hide();
	    }	

	});
	
	
	
}

function zoomHotspot(){
	$("#hotsport_zoom").modal('show');
	var databObj=_js_hotspot_viewByData;
	$("#zoomedHotspotTable tr").remove();
	if(databObj==undefined || databObj==null || Object.keys(databObj).length==0){
		
		return;
	}
	var orderedRgisAll=databObj.demographicItemDataOrdered.orderedRgis;
	var orderedRgis=[];
	for(var x=0;x<orderedRgisAll.length;x++){
		orderedRgis.push(orderedRgisAll[x]);
		/*if(x==js_hotspot_row_limit){
			break;
		}*/
	
	}

	var noOfResponses=databObj.demographicItemDataOrdered.noOfResponses;
	var overAllPct=databObj.demographicItemDataOrdered.overAllPct;
	var hotspotWithDLA= databObj.hotspotWithDLA;
	
	var str="";
	str+="<tr>";
	var selectstr="";
	var catselected="";
	var quesselected="";
	if("questionText"==js_dashboard_pref.selectedHotspotView){
		catselected="";
		quesselected="selected";
	}else{
		catselected="selected";
		quesselected="";
	}
	if(catselected!=""){
		selectstr="View By Category";
	}else if(quesselected!=""){
		selectstr="View By Questions";
	}
	var selectqes=$('#hsviweby').val();

	if (selectqes=="questionText") {
		str+="<td style='width:600px;padding-left: 10px!important;'>View By Questions</td>";
	}else{
		str+="<td style='width:230px;padding-left: 10px!important;'>View By Category</td>";
	}
	for(var x=0;x<orderedRgis.length;x++){
		 str+="<td><div style='display: flex;align-items: center;justify-content: space-between;'><div style='width:90%'>"+orderedRgis[x]+"</div><span style='display: inline-grid;width:10%;'><i class='fa fa-caret-up uparrow' onclick='hstsortup("+(x+1)+','+'this'+")' aria-hidden='true'></i><i class='fa fa-caret-down downarrow' onclick='hstsortdown("+(x+1)+','+'this'+")' aria-hidden='true'></i></span></div></td>";
		//str+="<td>"+orderedRgis[x]+"</td>";
	
	}
	str+="<tr>";
	str+="<td>No. Responses</td>";
	for(var x=0;x<orderedRgis.length;x++){
		str+="<td>"+databObj.categoryCounts[orderedRgis[x]]+"</td>";
	
	}
	str+="</tr>";

	str+="<tr>";
	str+="<td>Overall</td>";
	str+="<td>"+_js_overAllPctFav+"</td>";
	for(var x=1;x<orderedRgis.length;x++){
		str+="<td>"+overAllPct[orderedRgis[x]]+"%</td>";
	
	}
	str+="</tr>";
	var rowcnt=0;
	var ranges=databObj.ranges;
	//console.log("orderedRgis",orderedRgis);
	for(var key in hotspotWithDLA){
		str+="<tr>";
		str+="<td>"+key+"</td>";
		var items=hotspotWithDLA[key];
		for(var x=0;x<orderedRgis.length;x++){
			var item=items[orderedRgis[x]];
			//console.log(item);
			var tdval="-";
			var stylestr="";
			if(item!=undefined){
				/*if(item.pctFav>=0&&item.pctFav<=69){
					stylestr+=" style='background-color:#F79646'";
				}else if(item.pctFav>=70&&item.pctFav<=75){
					stylestr+=" style='background-color:#FAC090'";
				}else if(item.pctFav>=76&&item.pctFav<=79){
					stylestr+=" style='background-color:#EEECE1'";
				}else if(item.pctFav>=80&&item.pctFav<=84){
					stylestr+=" style='background-color:#B6DDE8'";
				}else if(item.pctFav>=85&&item.pctFav<=100){
					stylestr+=" style='background-color:#4BACC6'";
				}*/

				var dynaStyle="";
					for(var q=0;q<ranges.length;q++){
						var rangeArr=ranges[q].split("\t");
						var lowerLimit=parseInt(rangeArr[0]);
						var upperLimit=parseInt(rangeArr[1]);
						var colorCode=rangeArr[2];
						if(q==0){
							lowerLimit=0;
						}
						if(lowerLimit!=upperLimit){
							if(q==0 || q==1){
						 		upperLimit=upperLimit-1;
						 	}
							if(q==3 || q==4){
						 		lowerLimit=lowerLimit+1;
						 	}
							if(item.pctFav>=lowerLimit && item.pctFav<=upperLimit){
								stylestr=" style='background-color:"+colorCode+"'";
						  	}	
						}else{
							if(item.pctFav>=lowerLimit && item.pctFav<=upperLimit){
								stylestr=" style='background-color:"+colorCode+"'";
						  	}
						}
						//console.log("q",q,"lowerLimit",lowerLimit,"upperLimit",upperLimit);						
					}

				tdval=item.pctFav;
			}
			if('overall'==key){
				stylestr="";
			}
			if (orderedRgis[x]=='overall'){
					stylestr="";	
					tdval=tdval+'%';
				}
			str+="<td"+stylestr+">"+tdval+"</td>";
		}
		str+="</tr>";
	
		++rowcnt;
		/*if(rowcnt==js_hotspot_row_limit){
			break;
		}*/
	
	}

	$("#zoomedHotspotTable").append(str);
}
function hstsortup(col, reverse) {
  $('.downarrow').show();
  $('.uparrow').show();
  reverse.style.display = "none";
  var table = document.getElementById('zoomedHotspotTable')
  var tb = table,
    i,
    tr = Array.prototype.slice.call(tb.rows, 3);
  tr = tr.sort(function(a, b) {
    if (a.cells[col].textContent == '-') {
      a.cells[col].textContent = -1;
    } else if (b.cells[col].textContent == '-') {
      b.cells[col].textContent = -1;
    }
    return a.cells[col].textContent - b.cells[col].textContent;
  });
  tr = tr.map(function(i, k) {
    if (i.cells[col].textContent == -1) {
      i.cells[col].textContent = '-'
    }
    return i
  })
  for (i = 0; i < tr.length; ++i) {
    tb.appendChild(tr[i]);
  }
}

function hstsortdown(col, reverse) {
  $('.downarrow').show();
  $('.uparrow').show();
  reverse.style.display = "none";
  var table = document.getElementById('zoomedHotspotTable')
  var tb = table,
    i,
    tr = Array.prototype.slice.call(tb.rows, 3);
  tr = tr.sort(function(a, b) {
    if (a.cells[col].textContent == '-') {
      a.cells[col].textContent = -1;
    } else if (b.cells[col].textContent == '-') {
      b.cells[col].textContent = -1;
    }
    return b.cells[col].textContent - a.cells[col].textContent;
  });
  tr = tr.map(function(i, k) {
    if (
      i.cells[col].textContent == -1) {
      i.cells[col].textContent = '-'
    }
    return i
  })
  for (i = 0; i < tr.length; ++i) tb.appendChild(tr[i]);
}
