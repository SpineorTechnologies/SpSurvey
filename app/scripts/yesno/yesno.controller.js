var spApp=angular.module('spApp');
spApp.controller('yesnoController', ['envsetting','orderByFilter','$timeout','$location','$route','$state','$stateParams','$rootScope','yesnoService','$scope','$localStorage','$filter','$http','initDashboardData'
,function(envsetting,orderBy,$timeout,$location,$route,$state,$stateParams,$rootScope,yesnoService,$scope,$localStorage,$filter,$http,initDashboardData) {
	$rootScope.$on('clientChangeEvent', function (event, data) {
		$state.transitionTo($state.current, $stateParams, { 
 		 reload: true, inherit: false, notify: true
		});
	});

	$scope.default_language_key='en';

	//=============Loading From Local Storage Start===================//
	var params={};
	var dashboardPref={};
	dashboardPref.clientId=$localStorage.selectedClientid;
	dashboardPref.participantId=$localStorage.loginDetails.participantId;
	var dashboard_pref=initDashboardData["dashboard_pref"];
	$scope.clientId=$localStorage.selectedClientid;
	params.threshold=0;
	if($localStorage.loginDetails.threshold){
		params.threshold=$localStorage.loginDetails.threshold;
	}
	//=============Loading From Local Storage End===================//

	//============For Loading Customer Surveys Start===================//
	$scope.customerSurveys=initDashboardData["customerSurveys"];
	$scope.surveyTypesModel={};
	if(dashboard_pref.surveyTypesModel){
		$scope.surveyTypesModel=dashboard_pref.surveyTypesModel;
	}
	$scope.productTypes=initDashboardData["productTypes"];
	$scope.selectedSurveyTypes="";
		var defaultSurveyTypes=[];
	var surveyNamesNId={};
	for(var x=0;x<$scope.customerSurveys.length;x++){
		var surveyObj=$scope.customerSurveys[x];
		surveyNamesNId[surveyObj.customer_survey_id]=surveyObj.surveyName[$scope.default_language_key];
		defaultSurveyTypes.push(surveyObj.customer_survey_id);
	}
	
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
		//console.log("$scope.surveyTypesModel",$scope.surveyTypesModel);	
	}
	//============For Loading Customer Surveys End===================//

	//============For Loading Surveys Date Start=====================//
	$scope.surveyDates=initDashboardData["surveyDates"];
	angular.forEach($scope.surveyDates,function(key,value){	
		if(value=='completedEndDate'){
			$scope.end_date=$filter('date')(key, "MM/dd/yyyy");
		}else{
			$scope.start_date=$filter('date')(key, "MM/dd/yyyy");
		}	
	});
	if(dashboard_pref.start_date){
		$scope.start_date=dashboard_pref.start_date;
	}
	if(dashboard_pref.end_date){
		$scope.end_date=dashboard_pref.end_date;
	}
	if($scope.start_date){
		var MS_PER_MINUTE = 60000;
		var dateArr=$scope.start_date.split("/");
		var date1 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);	
		params.start_date=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
		params.start_date.setDate(params.start_date.getDate());
		params.start_date = new Date(params.start_date.getTime() - 1 * MS_PER_MINUTE);
		if($scope.end_date){
			dateArr=$scope.end_date.split("/");
			var date2 = new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
			params.end_date=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
			params.end_date.setDate(params.end_date.getDate()+1);
			params.end_date = new Date(params.end_date.getTime() - 1 * MS_PER_MINUTE);
		}				
	}
	//============For Loading Surveys Date End=====================//

	//============For Loading Demographics Start====================//
	$scope.demographics=initDashboardData["demographics"];
	$scope.demographicsModel={};
	if(dashboard_pref.demographicsModel){
		var demoModel={};
		angular.forEach(dashboard_pref["demographicsModel"],function(value,key){
			demoModel[key]=value;
		});
		$scope.demographicsModel=demoModel;
	}
	$scope.dataArray = Object.keys($scope.demographics).map(function (key) {
	    return $scope.demographics[key];
	});
	$scope.engagementRgs=$scope.dataArray;
	$scope.demographicItemrg=$scope.dataArray;	
	$scope.selectedDemographicsUIkey=-1;
	$scope.demographicsItemsDisplay={};
	angular.forEach($scope.demographics,function(val,key){
		$scope.demographicsItemsDisplay[key]=false;
	});
	if(dashboard_pref.toggleDemographicsFilterKey>=0){
		$scope.selectedDemographicsUIkey=dashboard_pref.toggleDemographicsFilterKey;
		$scope.demographicsItemsDisplay[$scope.selectedDemographicsUIkey]=true;
	}
	//============For Loading Demographics End====================//

	
	//==============Params Start===================================//
	params.clientId=$scope.clientId;
	params.productTypes=$scope.productTypes;
	params.surveyTypesModel=$scope.surveyTypesModel;	
	params.demographics=$scope.demographics;
	params.dlaQuery=$localStorage.loginDetails.dlaQuery;
	$scope.selectedSurveyDates=$scope.start_date+" - "+$scope.end_date;	
	//==============Params End===================================//

   //===============================Gridster Config-start=====================================//
	$scope.widgetItems = [];
	if($localStorage.loginDetails.admin && $localStorage.loginDetails.admin == 'superadmin'){
		$scope.widgetItems = [
			{sizeX: 2, sizeY: 2, row: 0,col: 0, id:'container1',title:'Engagement Index'},
			{sizeX: 4, sizeY: 2, row: 0,col: 2, id:'container2',title:'Engagement Index By Demographics'},
			// {sizeX: 6, sizeY: 2, row: 2,col: 0, id:'container3',title:'Yes/No Question Analysis View All'},
			{sizeX: 6, sizeY: 2, row: 4,col: 0, id:'container4',title:'Yes/No Question Analysis'},		
			{sizeX: 6, sizeY: 2, row: 6,col: 0, id:'container5',title:'Grid Analysis'}	
		];
	}else{
		if($localStorage.loginDetails.access.length >0 && $localStorage.loginDetails.access.indexOf('Report')!== -1){
			$scope.widgetItems = [
			{sizeX: 2, sizeY: 2, row: 0,col: 0, id:'container1',title:'Engagement Index'},
			{sizeX: 4, sizeY: 2, row: 0,col: 2, id:'container2',title:'Engagement Index By Demographics'},
			// {sizeX: 6, sizeY: 2, row: 2,col: 0, id:'container3',title:'Yes/No Question Analysis View All'},
			{sizeX: 6, sizeY: 2, row: 4,col: 0, id:'container4',title:'Yes/No Question Analysis'},
			{sizeX: 6, sizeY: 2, row: 6,col: 0, id:'container5',title:'Grid Analysis'}				
		];
		}
	}
	$scope.gridsterOptions = {
		minSizeY: 2,
		columns:6,
		resizable: {
			enabled: false,
			handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
			start: function(event, $element, widget) {},
			resize: function(event, $element, widget) {},
			stop: function(event, $element, widget) {}
		},
		draggable: {
			enabled: true
		},
		margin: [20,20]
	};
	//===============================Gridster Config-End=====================================//

	//===============================Gridster Add and Removing-start=====================================//
	$scope.removedWidgets=[];
	// if(dashboard_pref.yesNoWidgetItems){
	// 	$scope.widgetItems=dashboard_pref.yesNoWidgetItems;
	// }
	if(dashboard_pref.yesNoRemovedWidgets){
		$scope.removedWidgets=dashboard_pref.yesNoRemovedWidgets;
	}
	$scope.logicFn=function () {
		for (var i = 0; i < $scope.removedWidgets.length; i++) {
			for (var j = 0; j < $scope.widgetItems.length; j++) {
				if ($scope.widgetItems[j].id==$scope.removedWidgets[i].id) {
					$scope.widgetItems.splice(j,1);
					$scope.logicFn();
					break;
				}
			}
		}
	}
	$scope.logicFn();
	$scope.removeWidget=function(widget){
		var index=$scope.widgetItems.indexOf(widget);
		$scope.removedWidgets.push($scope.widgetItems[index]);  
		$scope.widgetItems.splice(index,1);
		dashboardPref.yesNoWidgetItems=$scope.widgetItems;
		dashboardPref.yesNoRemovedWidgets=$scope.removedWidgets;
		yesnoService.saveDashboardPreferences(dashboardPref,function(response){
			
		});
	}
	$scope.addWidget=function(value){
		var index=$scope.removedWidgets.indexOf(value);
		$scope.widgetItems.push(value);
		$scope.removedWidgets.splice(index,1);
		dashboardPref.yesNoWidgetItems=$scope.widgetItems;
		dashboardPref.yesNoRemovedWidgets=$scope.removedWidgets;
		yesnoService.saveDashboardPreferences(dashboardPref,function(response){
			
		});
		if(value.id=="container1"){
			$state.transitionTo($state.current, $stateParams, { 
				reload: true, inherit: false, notify: true
			});	
		}
		if(value.id=="container2"){
			$state.transitionTo($state.current, $stateParams, { 
				reload: true, inherit: false, notify: true
			});	
			$scope.handleEngagementRg($scope.engagementRg);
		}
	}
	//===============================Gridster Add and Removing-end=====================================//

	//===============================Load dataset-start===============================//
	$scope.loadDataset=function(){
		//==============Fetch Engagement Data Start================================//
		//console.log("params",JSON.stringify(params));
		yesnoService.fetchEngagementData(params,function(response){	
			var engagementData=response.data.data.engagementData;
			var total=0;
			var noData=0;
			$scope.overallEIScore=0;
			$scope.overallPercent=0;
			//var widgetParams={sizeX: 2, sizeY: 2, row: 0,col: 0, id:'container1',title:'Engagement Index'};
			var surveyTypesEI=["Engagement","Stay","Oa"];
			$scope.noDataFound=false;
			$scope.showEIWidget=true;
			$scope.engagementData={};
			$scope.lineChartData=["Engagement Index"];
			$scope.xLabels=['x', 'Actively Disengaged', 'Opportunity Group', 'Engaged', 'Actively Engaged'];
			var rgiItems=["Actively Disengaged","Opportunity Group","Engaged/Contributor","Actively Engaged"];
			angular.forEach(params.customerSurveys,function(value,key){
				if(surveyTypesEI.indexOf($scope.productTypes[value])<0){
					$scope.showEIWidget=false;
				}
			});
			if(engagementData.length>0){			
				angular.forEach(engagementData,function(v,k){
					total=total+parseInt(v.count);
					if(v._id=="Actively Engaged" || v._id=="Engaged/Contributor"){
						$scope.overallEIScore=$scope.overallEIScore+parseInt(v.count);
					}
				});
				var overallPercent=parseFloat(($scope.overallEIScore/total)*100).toFixed(2);
				overallPercent=Math.round(overallPercent * 100) / 100;
				if(overallPercent>0){
					$scope.overallPercent=Math.round(overallPercent);
				}
				angular.forEach(engagementData,function(v,k){
					$scope.engagementData[v._id]={};
					$scope.engagementData[v._id].eiRgi=v._id;
					$scope.engagementData[v._id].count=parseInt(v.count);
					$scope.engagementData[v._id].total=total;
					$scope.engagementData[v._id].avg=parseFloat(v.count/total).toFixed(4);
					$scope.engagementData[v._id].percent=parseFloat(($scope.engagementData[v._id].avg*100).toFixed(2));
				});
				angular.forEach(rgiItems,function(v,k){
					if($scope.engagementData[v]){
						$scope.lineChartData.push($scope.engagementData[v].percent);
					}else{
						$scope.lineChartData.push(noData)
					}
				});	
			}
			if(engagementData.length>0 && total>params.threshold){
				$scope.generateEIChart();
			}else{
				$scope.noDataFound=true;
			}
			if(!$scope.showEIWidget){
				$scope.forFn=function () {
					for (var i = 0; i < $scope.widgetItems.length; i++) {
						if($scope.widgetItems[i].id=="container1" || $scope.widgetItems[i].id=="container2"){
							$scope.widgetItems.splice(i,1);
							$scope.forFn();
							break;
						}
					}
				}
				$scope.forFn()
				angular.forEach($scope.removedWidgets,function(v,k){
					if(v.id=="container1" || v.id=="container2"){
						$scope.removedWidgets.splice(k,1);
					}
				});
			}	
			
		});
		//==============Fetch Engagement Data End================================//

		//==============Fetch Question Analysis Data Start================================//
		yesnoService.fetchQuestionAnalysis(params,function(response){
			var yesynoQues=response.data.data;
			$scope.yesNoAnalysis=yesynoQues.yesNoQuestion;
			if ($scope.yesNoAnalysis==0) {
				$scope.forFn1=function () {
					for (var i = 0; i < $scope.widgetItems.length; i++) {
						if($scope.widgetItems[i].id=="container3" || $scope.widgetItems[i].id=="container4"){
							$scope.widgetItems.splice(i,1);
							$scope.forFn1();
							break;
						}
					}
				}
				$scope.forFn1();
			}
		});
		//==============Fetch Question Analysis Data End================================//

		//==============Fetch EI Demographics Start================================//
		if(dashboard_pref.engagementRg){
			$scope.handleEngagementRg(dashboard_pref.engagementRg);
		}	
		$scope.gridAnalysisFn();
		//==============Fetch EI Demographics End================================//
	};
	//===============================Load dataset-end===============================//

	//===============================Generate Line Chart-start======================//
	$scope.generateEIChart=function(){
		$("#eiChart").html("");
		var shift = 20;
		var chart = c3.generate({
			bindto: '#eiChart',
			data: {
				x: 'x',
				columns: [$scope.xLabels,$scope.lineChartData],
				labels: {
					format: function(v, id, point, line) {
						if (point === undefined || line === undefined) 
							return;
							var selectElement=d3.selectAll('#eiChart .c3-chart-text').selectAll('#eiChart .c3-text');
							if(selectElement[line]){
								var label = selectElement[line][point];
							}
							if(label){
								console.log("line", line, point, id)
								if (point === 0) {
									if($scope.lineChartData[2]>=v){
										d3.select(label).style('transform', 'translateY(' + shift + 'px)');
									}
								}
								if (point === 1) {
									if($scope.lineChartData[1]>=v && $scope.lineChartData[3]>=v ){
										d3.select(label).style('transform', 'translateY(' + shift + 'px)');
									}
								}
								if (point === 2) {
									if($scope.lineChartData[2]>=v && $scope.lineChartData[4]>=v ){
										d3.select(label).style('transform', 'translateY(' + shift + 'px)');
									}
								}
								if(point === 3){
									if($scope.lineChartData[3]>=v){
										d3.select(label).style('transform', 'translateY(' + shift + 'px)');
									}
								}
								return v+"%";
							}	
						}
					}
				},
				color: {pattern: ['#453c51']},
				axis: {
					y: {label: {text: '% of People',position: 'outer-middle'},
						tick: {format: function (d) { return d+"%"; }}},
					x: {type: 'category',label: {/*text: 'Engagement Index',position: 'outer-middle',*/},height: 50}
				},
				legend: {show: false},
				//tooltip: {show: false}
		});
	}
	//===============================Generate Line Chart-end======================//

	$scope.handleYesnoRg=function (selectdItem) {
		params.yesnoRgs=selectdItem;	   		
		if (selectdItem!='' && selectdItem!=undefined && selectdItem!=null) {
			yesnoService.fetchQuestionAnalysisRgs(params,function(response){
				var rgs=response.data.data;
				$scope.YesNoRgs=rgs.yesNoQuestionRgs;
			});
		}	
	}
	$scope.handleEngagementRg = function(value) {
		dashboardPref.engagementRg=value;
		$scope.engagementRg=value;
		yesnoService.saveDashboardPreferences(dashboardPref,function(response){	
		});
		params.engagementRg = value;
		yesnoService.fetchEngagementRg(params, function(response) {
			$scope.enggamentbarchart(response.data.data)
		});
	}
	$scope.enggamentbarchart = function(datas) {
		if (datas.engagementrg.length>8) {
			var heightLevel=datas.engagementrg.length*60;
			$("#stackedBarchart").height(heightLevel);
			$("#stackedBarchart").css("max-height", heightLevel);

		}else{
			$("#stackedBarchart").height(270);
			$("#stackedBarchart").css("max-height", "270");
		}
		if (datas.engagementrg.length>0) {
		setTimeout(function() {
			var stackedBarchart = c3.generate({
			bindto: "#stackedBarchart",
			data: {
				json: datas.engagementrg,
				// etc etc
				keys: {
					x: "xaxis",
					value: ["Actively Disengaged", "Opportunity Group", "Engaged/Contributor", "Actively Engaged"]
				},
				groups: [
					['Actively Disengaged', 'Opportunity Group', 'Engaged/Contributor', 'Actively Engaged']
				],
				order: null,
				labels: {
		           format: function (v, id, i, j) { return v==null || v<=10?"":v+"%" }
		        },
				type: 'bar'
			},
			axis: {
				rotated: true,
				x: {
					type: 'category',
					/*tick: {
			            multiline: false
			        }
*/				},
				y: {
            		min: 0,
					max: 105,
					tick: {
						format: function(d) { return d + "%"; }
					},
					padding: {top:0, bottom:0}
				}
			},
			color: {
                pattern: ['#e37b0a', '#fac090', '#bee5e7', '#68c8c6']
            }

		});
		}, 500);
		}else{
			$("#stackedBarchart").html("");
			$("#stackedBarchart").append("<h1 class='text-center'>No data found!</h1>")
		}
	}
	$scope.gridAnalysisFn=function () {
		yesnoService.fetchGridAnalysis(params,function(response){
			console.log(response)
			var dataObj=response.data.data;
			$scope.gridAnalysis=dataObj;
			console.log($scope.gridAnalysis)
			if ($scope.gridAnalysis.length==0) {
				console.log($scope.widgetItems)
				for (var i = 0; i < $scope.widgetItems.length; i++) {
					if ($scope.widgetItems[i].id=="container5") {
						$scope.widgetItems.splice(i,1);
						break;
					}
				}
			}
		});
	}
	$scope.generateGraph=function (graphArgs, choiceArr, id) {
		setTimeout(function() {
			if (graphArgs.length>=5) {
				var heightLevel=graphArgs.length*60;
				console.log($("#"+id))
				$("#"+id).height(heightLevel);
				$("#"+id).css("max-height", heightLevel);

			}else{
				$("#"+id).height(270);
				$("#"+id).css("max-height", "270");
			}
			var stackedBarchart = c3.generate({
				bindto: "#"+id,
				data: {
					json: graphArgs,
					keys: {
						x: "xaxis",
						value: choiceArr
					},
					groups: [
						choiceArr
					],
					order: null,
					labels: {
			           format: function (v, id, i, j) { return v==null || v<=10 ?"":v+"%" }
			        },
					type: 'bar'
				},
				axis: {
					rotated: true,
					x: {
						type: 'category',
						// tick: {
			   //              multiline: false
			   //          }
					},
					y: {
						min: 0,
						max: 105,
						tick: {
							format: function(d) { return d + "%"; }
						},
						padding: {top:0, bottom:0}
					}
				},
				color: {
	                 pattern: ['#C7DFD9', '#A8A999', '#EFCA4D', '#659E90', '#7A6B92']
	            }
			});
		}, 500);
	}
	$scope.loadDemographics=function(){
	//==============Filter Demographics Start====================================//
		yesnoService.fetchDemographics(params,function(response){
			var itmOrderby=["demographic"];
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
			$scope.loadDataset();
		});
		//==============Filter Demographics End====================================//
		
	}
	//===========toggle demographics-start========================//
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
   	 //=============toggle demographics-end========================//
	$scope.loadDemographics();
}]);