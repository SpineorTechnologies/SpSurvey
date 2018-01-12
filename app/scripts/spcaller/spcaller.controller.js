'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:UserListCtrl
 * @description
 * # UserListCtrl
 * Controller of the spApp
 */
var rgACIdArr = {};
var rgACvalue = {};
var customerSurveyData = [];
var customerSurveyDataKeyValue = {};
var langDataKeyValue = {};
var tableFieldColumns = [];
var languageDataArr = {};
var js_serverURL = "";
var js_serverURLnew = "";
var js_updateCell = "";
var js_updatRoles = "";
var js_removeurl = "";
var js_updateurl = "";
var js_updateLanguage = "";
var js_updateDla = "";
var js_sendmail = "";
var js_resetLink = "";
var js_clientId = "";
var js_accessArray = []
var js_metadata = {};
var colOrderArr = [];
var js_demographics = {};


//spApp.requires.push('angular-ui-grid');

spApp.controller('spcallerController', function ($scope, $rootScope, $http, urlBuilder, Upload,
		$timeout, $uibModal, $log, $document, $filter, $localStorage, $location,
		envsetting, $window, Flash, $q, participantService, uiGridConstants) {

	// if($localStorage.activeClients){
	//   $scope.activeClients = $localStorage.activeClients;
	// }else if(!$localStorage.activeClients){
	//   $scope.activeClients = false;
	// }else{
	//   $scope.activeClients = true;
	// }

	$scope.activeUserData = "";
	$scope.filterCount = 0;
	$scope.sortCount = 0;
	$scope.popupIsActive = false;
	$localStorage.openedClientPID = "";
	$localStorage.openedClientCID = "";
	$scope.disableNotes = true;
	$localStorage.limitClientOwner = false;
	//on model close
	$('#callerDetail').on('hidden.bs.modal', function (e) {
		$scope.removeActiveUser();
		$scope.error = "";
		$scope.activeUserData = "";
		$scope.popupIsActive = false;
	});
	$("#assignedStatus").on('hidden.bs.modal', function (e) {
		$scope.error = "";
	});

	$("body").on("click",".actionbtn",function(){
		console.log("ok");
	});



	//config
	var serverURL = envsetting.client.serverUrl;
	var serverURLnew = envsetting.client.clientUrl;

	js_serverURL = envsetting.client.serverUrl;
	js_serverURLnew = envsetting.client.clientUrl
	js_demographics = $localStorage.metaDataConstant;
	$('.loader').show();

	$scope.configObj = {};
	$scope.configObj.queryURL = serverURL + "/api/spcaller/";
	$scope.configObj.updateCell = serverURL + "/api/participants/updateCell/";
	$scope.configObj.saveNotesUrl = serverURL + "/api/spcaller/notes/";
	$scope.configObj.saveOwnerUrl = serverURL + "/api/spcaller/owner/";
	$scope.configObj.saveRedflagsUrl = serverURL + "/api/spcaller/saveRedflag/";
	$scope.configObj.saveCallStatusUrl = serverURL + "/api/spcaller/callStatus/";
	$scope.configObj.sendSurvey = serverURL + "/api/spcaller/sendSurvey/";
	$scope.configObj.history=serverURL + "/api/spcaller/history/";
	$scope.configObj.updateCaller=serverURL + "/api/spcaller/updateCaller/";
	$scope.configObj.activeClient = serverURL + "/api/spcaller/activeClient/";
	$scope.configObj.deactiveClient = serverURL + "/api/spcaller/deactiveClient/";

	js_updateCell = serverURL + "/api/participants/updateCell/";

	$scope.clientId = $localStorage.selectedClientid;
	js_clientId = $localStorage.selectedClientid;

	//console.log('$localStorage.selectedClientid',$localStorage.selectedClientid)
	$scope.filterLimit = 5;

	$scope.actions = {};
	$scope.ui = {
			dataPage: {
				recordsPerpage: 10,
				currentPage: 1,
				totalPages: 1,
				totalRecords: 1,
				sort: {},
				search: {}
			}
	};

	$scope.ui.limitPageArray = [5, 10, 50, 100];
	var selectedRow = null;

	$scope.ui.spcallerGridOptions = {       
			enableFiltering: true,     
			useExternalFiltering: false,  //TODO: external filtering is done for some fields in serverside. 
			useExternalSorting: false,
			enableColumnResizing: true,
			cellEditableConditionOnFocus: true,      
			enableGridMenu: true,
			// rowHeight: 48,
			columnDefs: [

			             { name: 'First Name',width:'5%', field: 'firstname', cellEditableCondition: false,cellClass: getCellClass ,cellTemplate: "<div class='username'>{{row.entity.firstname}}</div>"},
			             { name: 'Last name',width:'5%', field: 'lastname', cellEditableCondition: false,cellClass: getCellClass,cellTemplate: "<div class='username'>{{row.entity.lastname}}</div>" },
			             { name: 'Phone',width:'5%', field: 'phone', cellEditableCondition: false,cellClass: getCellClass,
			            	 cellTemplate: '<div class="">{{row.entity.phone}}<i class="fa fa-files-o copytext" title="Copy" aria-hidden="true" ng-click="grid.appScope.copyToClipboard(row.entity.phone)"></i></div>'},
		            	 { name: 'Alt Phone',width:'5%', field: 'alt_phone', cellEditableCondition: false,cellClass: getCellClass,
		            		 cellTemplate: '<div class="">{{row.entity.alt_phone}}<i class="fa fa-files-o copytext" title="Copy" aria-hidden="true" ng-click="grid.appScope.copyToClipboard(row.entity.alt_phone)"></i></div>'},
	            		 { name: 'Email', field: 'email',width:'5%', cellEditableCondition: false,cellClass: getCellClass, 
            			 cellTemplate: '<div class="">{{row.entity.email}}<i class="fa fa-files-o copytext" title="Copy" aria-hidden="true" ng-click="grid.appScope.copyToClipboard(row.entity.email)"></i></div>'},
            			 { name: 'State', field: 'state',width:'4%', cellEditableCondition: false,cellClass: getCellClass },
            			 { name: 'Country', field: 'country',width:'4%',visible: false, cellEditableCondition: false,cellClass: getCellClass },
            			 //{ name: 'Country', field: 'country', width: 120 },  //TODO: what is the column name 
            			 { name: 'Language', field: 'language', width:'4%', cellFilter: 'stringArrayFilter', cellEditableCondition: false, visible: false ,cellClass: getCellClass},  //TODO: what is the column name merge
            			 // { name: 'Timezone', field: 'timezone', width: 120 },  //TODO: what is the column name
            			 //{ name: 'Creation Date', field: 'creationDate', width: 120 },   //TODO: what is the column name
            			 { name: 'Survey', field: 'survey_name', width:'7%',cellClass: getCellClass,cellEditableCondition: false },  //TODO: what is the column name
            			 { name: 'Start Date', visible: false, field: 'survey_cdt', width: "6%",cellEditableCondition: false ,cellClass: getCellClass,cellTemplate: "<div>{{row.entity.survey_cdt | date:'MM-dd-yyyy, H:mm:ss'}}</div>" },  //TODO: what is the column name
            			 { name: 'Status', field: 'callstatus', width: "13%", cellTemplate: '<edit-call-status selected-call-status="row.entity.callstatus" on-call-status-change="grid.appScope.actions.onCallStatusChange(row.entity,newCallStatus,grid.renderContainers.body.visibleRowCache.indexOf(row))" style="width: 100%;display: table;position: relative;"></edit-call-status>',cellClass: getCellClass,
            				 cellEditableCondition: false, enableCellEditOnFocus: true, cellFilter:'mapCallStatus'},
    					 { name: 'Actions', field: 'actionItems', width: "12%", cellEditableCondition: false,cellClass: getCellClass,
    					 cellTemplate: '<div class="ui-grid-cell-contents actionarea">'
    						 // +'<div class="ui-grid-cell-contents"><button type="button" title="History" class="md-button md-icon-button md-small txt_green" ng-click="grid.appScope.history(row.entity)"><i class="fa fa-history" aria-hidden="true"></i></button>''
    						 + '<button type="button" title="Send Survey" class="md-button md-icon-button md-small txt_green actionbtn" ng-click="grid.appScope.sendSurvey(row.entity)"><i class="fa fa-send" aria-hidden="true"></i></button>'
    						 + '<a ng-click="grid.appScope.openSurveyWindow(row.entity.actionItems.takeSurveyUrl,row.entity,grid.renderContainers.body.visibleRowCache.indexOf(row))" target="_blank" class="actionbtn"><button type="button" title="Take Survey" class="md-button md-icon-button md-small txt_green"><i class="fa fa-sticky-note" aria-hidden="true"></i></button></a>'
    						 +'<input class="actionbtn" type="checkbox" title="Red Flag" style="margin: 3px 5px 0;vertical-align: middle;width: 14px;height: 16px;" ng-model="row.entity.isActive" ng-true-value="true" ng-false-value="false" ng-change="grid.appScope.updatedFlag(row.entity)">' 
            						 /*+'<button type="button" title="Red Flag" class="md-button md-icon-button txt_green"><i class="fa fa-flag" aria-hidden="true"></i></button>'
			                 + '<button type="button" title="Call Back" class="md-button md-icon-button txt_green"><i class="fa fa-repeat" aria-hidden="true"></i></button>'
			                 + '<button type="button" title="Confidential" class="md-button md-icon-button txt_green"><i class="fa fa-lock" aria-hidden="true"></i></button>'*/
    						 + '<button type="button" title="Caller Detail" class=" actionbtn md-button md-icon-button md-small txt_green" ng-click="grid.appScope.userDetail(row.entity,grid.renderContainers.body.visibleRowCache.indexOf(row),true)"><i class="fa fa-user" aria-hidden="true"></i></button>'
    						 + '</div></div>' },

						 { name: 'Caller', field: 'caller_name', width:'9%',visible: false, cellEditableCondition: false,cellClass: getCellClass  }, 
						 { name: 'Attempts', field: 'attempt',type:'number', width:'6%',cellEditableCondition: false,cellClass: getCellClass, cellTemplate: "<div style='text-align: center'>{{row.entity.attempt}}</div>"}, 
						 { name: 'Last Called', field: 'last_call_timestamp', width: "7%", cellEditableCondition: false,cellClass: getCellClass}, 

						 { name: 'Notes', field: 'notes',width: "10%", enableCellEdit:true,enableCellEditOnFocus:true, cellClass: getCellClass,
            							 // cellTemplate: '<button class="md-icon-button md-button txt_green" title="Notes" data-target="#notesPopup" data-toggle="modal" data-id="{{row.entity.survey_instanceId}}"><i class="fa fa-comment panel_icons"></i></button>' },          
						 cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" ng-model="row.entity.notes"></div>' },          
						 { name: 'Owner', field: 'owner',width: "10%", enableCellEdit:true,enableCellEditOnFocus:true, cellClass: getCellClass,
						 cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" ng-model="row.entity.owner"></div>' },           
						 // cellTemplate: '<button class="md-icon-button md-button txt_green" title="Notes" data-target="#notesPopup" data-toggle="modal" data-id="{{row.entity.survey_instanceId}}"><i class="fa fa-comment panel_icons"></i></button>' },          
						 { name: 'Assigned Date', field: 'assigned_date', width:'4%',cellClass: getCellClass,cellEditableCondition: false },  //TODO: what is the column name               
						 { name: 'Assigned Time', field: 'assigned_time', width:'4%',cellClass: getCellClass,cellEditableCondition: false }  //TODO: what is the column name

						 ],     
							 onRegisterApi: function( gridApi ) {
								 $scope.gridApiData = gridApi;
								 $scope.ui.spcallerGridApi = gridApi;

								 gridApi.core.on.columnVisibilityChanged( $scope, function (column) {
									 $localStorage.columnState = $scope.ui.spcallerGridOptions.columnDefs;
								 });
								 initColumnState();

								 //add caller column if user have calleradmin permissions
								 if($localStorage.role == "calleradmin"){
									 $scope.ui.spcallerGridOptions.columnDefs.unshift({name: 'Client', field: 'client',width:'4%'});
								 }

								 //filter if user search then it happen from all data otherwise  only from active status
								 gridApi.core.on.filterChanged($scope, function (data) {
									 var grid = this.grid;
									 $scope.filterData(grid.columns);
								 });

								 gridApi.core.on.sortChanged($scope, function (data) {
									 var grid = this.grid;
									 //console.log(grid.columns);
									 $scope.sortData(grid.columns);
								 });

								 // var countError = function() {
								 //   console.log(gridApi);
								 //   $scope.ui.spcallerGridOptions.selection.selectRow($scope.ui.spcallerGridOptions.data[1]);
								 // }
								 // $timeout(countError, 6000);
								 //TODO: enable below lines for external filtering/sorting
								 // $scope.ui.spcallerGridApi.core.on.sortChanged($scope, $scope.actions.sortChanged );
								 // $scope.actions.sortChanged($scope.ui.spcallerGridApi.grid, [ $scope.ui.spcallerGridOptions.columnDefs[1] ] );
								 // $scope.ui.spcallerGridApi.core.on.filterChanged( $scope, $scope.actions.filterChanged);
								 gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
									 if(colDef.field == "callstatus"){
										 var callerId=rowEntity.spcallerId!=null&&rowEntity.spcallerId!=undefined&&rowEntity.spcallerId!=''?rowEntity.spcallerId:'';
										 var caller_name=rowEntity.caller_name!=null&&rowEntity.caller_name!=undefined&&rowEntity.caller_name!=''?rowEntity.caller_name:'';
										 if(newValue!=oldValue  && rowEntity.pctComplete<100){
											 $scope.actions.updateCallStatus(rowEntity.customer_survey_id,rowEntity.participant_id, newValue,rowEntity.clientId,callerId,rowEntity.isActive,caller_name);
											 //$scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
											 $scope.$apply();
										 }else{
											 $scope.actions.loadData();
										 }
									 }else if (colDef.field=="owner") {
										 if(newValue!=oldValue){
											 $scope.saveOwner(rowEntity, newValue)
											 $scope.$apply();
										 }
									 }else if (colDef.field=="notes") {
										 if(newValue!=oldValue){
											 $scope.saveNotes(rowEntity, newValue)
											 $scope.$apply();
										 }
									 }else if(colDef.field == 'email' || colDef.field == 'phone' || colDef.field == 'alt_phone'){
										 if(newValue != oldValue && newValue !=""){
											 $scope.saveEmailPhone(rowEntity,colDef.field,newValue);
											 $scope.$apply();
										 }else if(newValue == ""){
											 return false;
										 }
									 }
								 });

								 gridApi.cellNav.on.navigate($scope, function(selected) {
									 if ('.ui-grid-cell-focus ') {
										 //console.log('test ',selected.row.uid);
										 selectedRow = selected.row.uid;
										 gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
									 }
								 });

							 }
	};

	//set the state of column according to user selection
	function initColumnState() {
		if($localStorage.columnState){
			for (var i = 0; i < $localStorage.columnState.length; i++) {
				if($localStorage.columnState[i].visible ||  $localStorage.columnState[i].visible == undefined){
					$scope.ui.spcallerGridOptions.columnDefs[i].visible = true;
				}else{
					$scope.ui.spcallerGridOptions.columnDefs[i].visible = false;
				}
			}
		}
	};

	function parentCallback(){
	  alert("popup is closed");
	}

	//open survey window
	$scope.openSurveyWindow=function(url,data,rowID){
		$scope.activeUserData = data;
		$scope.currentRowId = rowID;
		//url = url+'&caller='+getCallerId();
		//$window.open(url, '_blank');
		//have to divide this URL becasue IE doesn't accept long URL, so pass the token as storage variable
		var splitUrl = url.split('&c=');
		$localStorage.surveyAuthToken = splitUrl[1];
		//console.log('$localStorage.loginDetails',JSON.stringify($localStorage.loginDetails));
		if($localStorage.loginDetails!=undefined && $localStorage.loginDetails!=null && $localStorage.loginDetails!="") {
			var lastname = "";
			if($localStorage.loginDetails.lastname){
				lastname = $localStorage.loginDetails.lastname;
			}else{
				if($localStorage.loginDetails.custDetails!=undefined){
					if($localStorage.loginDetails.custDetails.lastname){
						lastname = $localStorage.loginDetails.custDetails.lastname;
					}
				}
			}
			splitUrl[0]+=("&caller_name="+$localStorage.loginDetails.firstname+" "+lastname);
		}

		//console.log(JSON.stringify(splitUrl[0]));
		var parentWindow = $window.open(splitUrl[0], "Take Survey", "width=1000,height=600,left=100,top=200,scrollbars=yes");
		parentWindow.onbeforeunload = function(){
			console.log("Testing after survey window closed");

			$localStorage.surveyAuthToken = '';
			//loadData(); 
			$scope.history($scope.activeUserData);
		}
	}



	$scope.copyToClipboard = function (value) {
		if(value){
			var copyElement = document.createElement("textarea");
			copyElement.textContent = value;
			var body = document.getElementsByTagName('body')[0];
			body.appendChild(copyElement);
			copyElement.select();
			document.execCommand('copy');
			body.removeChild(copyElement);
			$scope.toast = "Copied";
			var countUp = function() {
				$scope.toast="";
			}
			$timeout(countUp, 1500);
		}
	}



	//update the email phone and alt phone
	$scope.saveEmailPhone = function(rowEntity,field,newValue){

		if(newValue !=''){
			if(field == "email"){
				var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if(!regex.test(newValue)){
					$scope.error = "Please add valid email address";
					return false;
				}

			}
			else if(newValue !=""){
				if(field == "phone" || field == "alt_phone"){
					var phone_number = /^[0-9+\(\)#\.\s\/ext-]+$/;

					if(!phone_number.test(newValue)){
						$scope.error = "Please add correct phone number."; 
						return false;
					}
					
					if(rowEntity.attempt == 0){
						$scope.alldata[$scope.currentRowId].callstatus = "Open";
						$scope.callerDetailData.callstatus = "Open";
						$scope.statusName = "Open";
					}
				}
			}
		}
		$scope.error = "";
		$scope.callerDetailData[field] = newValue;

		var callerId=rowEntity.spcallerId!=null&&rowEntity.spcallerId!=undefined&&rowEntity.spcallerId!=''?rowEntity.spcallerId:'';
		$scope.actions.updateCallerData(rowEntity.customer_survey_id,rowEntity.participant_id,newValue,rowEntity.clientId,callerId,rowEntity.isActive,field);       

		$(".editable").removeClass("active");
		//update status if both phone numbers are empty

		if((field == "phone" || field == "alt_phone") && newValue == ""){
			if(field == "phone"){
				if(rowEntity.alt_phone == ""){
					$scope.actions.onCallStatusChange(rowEntity,"Unreachable");
					$scope.callerDetailData.callstatus = "Unreachable";
				}
			}
			if(field == "alt_phone"){
				if(rowEntity.phone == ""){
					$scope.actions.onCallStatusChange(rowEntity,"Unreachable");
					$scope.callerDetailData.callstatus = "Unreachable";
				}
			}
		}

	}
	//on poup open
	$scope.userDetail = function(rowEntity,rowId,popup ){
		$scope.currentRowId = rowId;
		$scope.popupIsActive = true;
		$scope.historyData = "";
		//popup = popup || true;
		if(popup){
			$('#callerDetail').modal('show');  
		}
		$scope.error = "";
		$scope.permission = false;
		$scope.activeUserData = rowEntity;
		$scope.activeRowId = rowId;

		$http.post($scope.configObj.activeClient,{participant_id:rowEntity.participant_id,clientId:rowEntity.clientId,currentUser:$localStorage.loginDetails.participantId})
		.then(function(result){
			if(result.data.status){
				$scope.permission = true;
				$(".editable").removeClass("active");
				$scope.callerDetailData = rowEntity;
				$scope.useremail = rowEntity.email;
				$scope.userphone = rowEntity.phone;
				$scope.useraltphone = rowEntity.alt_phone;
				$scope.usernotes = "";
				$scope.userowner = rowEntity.userowner;
				$scope.statusName = rowEntity.callstatus;
				$localStorage.openedClientPID = rowEntity.participant_id;
				$localStorage.openedClientCID = rowEntity.clientId;
				$scope.history(rowEntity,"updateTrue");
			}else{
				$scope.permission = false;
				$scope.error = result.data.msg;
				return false;       
			}

		});
		//console.log(popup,"popup");
		if(popup){ 
			//console.log("in again");
			$scope.updateGridData();        
			$scope.visibleRowCount = $scope.gridApiData.core.getVisibleRows($scope.gridApiData.grid).length;
		}
		//console.log("issue",popup,$scope.filtersEnable,$scope.sortEnable);
	}
	// if filter enable then we need to get all visible rows 
	// so when caller click the next button in popup then we can show next record according to filter data
	$scope.updateGridData = function(){
		//console.log("working");
		//if($scope.filtersEnable || $scope.sortEnable){
			//console.log("in");
			var grid = $scope.ui.spcallerGridApi.grid;
			$scope.filtersRows = [];
			var visibleRows = $scope.gridApiData.core.getVisibleRows($scope.gridApiData.grid);
			setTimeout(function(){
				
				visibleRows.forEach(function (items,index,array){
					$scope.filtersRows.push(items.entity);
				});    

				$scope.alldata = "";
				$scope.alldata = $scope.filtersRows; 
			},1000);
		//}
	}

	//user popup carousal
	$scope.userDetailCarousal = function(which){
		$scope.historyData = "";
		$scope.removeActiveUser();

		$scope.nowVisibleRows = $scope.gridApiData.core.getVisibleRows($scope.gridApiData.grid).length;
		//console.log($scope.nowVisibleRows ,$scope.alldata.length ,"countVisible");

		if($scope.nowVisibleRows == ($scope.visibleRowCount -1)){
			$scope.activeRowId = $scope.activeRowId;
			$scope.visibleRowCount = $scope.nowVisibleRows;
		}
		//console.log($scope.nowVisibleRows ,$scope.visibleRowCount ,"countVisible after");

		var allrecords = $scope.alldata.length - 1;
		if(allrecords > -1 ){

			if($scope.activeRowId == allrecords){
				$scope.permission = false;
				$scope.error = " No Record found for this client.";
				return false;
			}else{
				$scope.activeRowId = $scope.activeRowId+1;
			}

			// console.log($scope.activeRowId,"rowid");    
			// console.log($scope.alldata.length,"total Length");

			var rowEntity = $scope.alldata[$scope.activeRowId];
			$scope.userDetail(rowEntity,$scope.activeRowId,false);
		}else{
			$scope.permission = false;
			$scope.error = " No Record found for this client.";
		}
		$scope.disableNotes = true;
		// $scope.activeUserData = rowEntity;
		// $scope.history(rowEntity);
	}

	//remove active
	$scope.removeActiveUser = function(){
		if($localStorage.openedClientPID && $localStorage.openedClientCID){

			$http.post($scope.configObj.deactiveClient,{participant_id:$localStorage.openedClientPID,clientId:$localStorage.openedClientCID})
			.then(function(result){

			});
			$localStorage.openedClientPID = "";
			$localStorage.openedClientCID = "";
		}  

	}

	//on status change in popup
	$scope.changeStatus = function(rowEntity,newValue){
		if(newValue){
			if(rowEntity.pctComplete<100){
				$scope.statusName = newValue;
				$scope.historyRefreshClient = rowEntity;
				$scope.historyRefreshEnable = true;
				$scope.actions.onCallStatusChange(rowEntity,newValue,$scope.currentRowId);
				$scope.disableNotes= false;
			}else{
				//console.log(newValue,oldValue,"else");
				//$scope.statusName = oldValue;
			}
		}
	}


	//assign call when status select as assign
	$scope.assignCall = function(){
		var assignNotes = $scope.assignedNotes ? $scope.assignedNotes : "";
		var assignedDate = $scope.assignedDate;
		var assignedTime = $scope.assignedTime;

		var CurrentTime = new Date().getTime();
		var newTime = new Date($scope.assignedDate +' '+ $scope.assignedTime).getTime();
		if(CurrentTime > newTime){
			$scope.error = "Please add future time."; 
			return false;
		}

		if(assignedDate && assignedTime){
			$scope.error = "";
			var newCallStatus = "Assigned";
			var rowEntity = $scope.newCallStatusAssigned;
			var callerId=rowEntity.spcallerId!=null&&rowEntity.spcallerId!=undefined&&rowEntity.spcallerId!=''?rowEntity.spcallerId:'';
			var caller_name=rowEntity.caller_name!=null&&rowEntity.caller_name!=undefined&&rowEntity.caller_name!=''?rowEntity.caller_name:'';
			$scope.actions.updateCallStatus(rowEntity.customer_survey_id,rowEntity.participant_id, newCallStatus,rowEntity.clientId,callerId,rowEntity.isActive,caller_name,assignNotes,assignedDate,assignedTime);
		}else{
			$scope.error = "All fields are required."; 
		}
	}

	var typingTimer;
	var doneTypingInterval = 1000;	

	//filter completed and open clients
	$scope.filterData = function(allColumns){
		var checkFilter = false;
		clearTimeout(typingTimer);
		//console.log(allColumns);
		//$scope.filtersEnable = false;

		allColumns.forEach(function (column,index,array){
			if(column.filters[0].term){
				checkFilter = true;
				$scope.filterCount++;
				return false;  
			}else{
				//checkFilter = false;
			}
		});

		if(checkFilter && $scope.filterCount == 1){
			$scope.ui.spcallerGridOptions.data = $scope.allClientsData;
			$scope.filtersEnable = true;
		}else if(!checkFilter){
			$scope.ui.spcallerGridOptions.data = $scope.activeClientData;
			$scope.updateGridData();
			
			$scope.filterCount = 0;
			$scope.filtersEnable = false;
		}


		clearTimeout(typingTimer);
		typingTimer = setTimeout(function(){
			$scope.updateGridData() ;
		},doneTypingInterval);
		

	}


	//filter completed and open clients
	$scope.sortData = function(allColumns){
		var checkSort = false;

		allColumns.forEach(function (column,index,array){
			if(column.sort.direction){
				checkSort = true;
				$scope.sortCount++;
				return false;  
			}
		});

		if(checkSort && $scope.sortCount == 1){
			$scope.sortEnable = true;
		}else if(!checkSort){
			$scope.sortEnable = false;
			$scope.sortCount = 0;
		}
	}

	//to update the uigrid data
	$scope.allDataUpdate = function(data,rowId,filterReset){
		// console.log(filterReset,"filterReset");
		// console.log($scope.alldata[rowId],"seklctedrow");
		//$scope.alldata[rowId].callstatus = data.callstatus;
		
		angular.forEach($scope.alldata, function(column1, key1) {
			if(data.customer_survey_id == column1.customer_survey_id  && data.participant_id == column1.participant_id){
				$scope.alldata[key1].callstatus = data.callstatus; 
				$scope.alldata[key1].attempt = data.attempt;
			}
		});
		$scope.ui.spcallerGridOptions.data = $scope.alldata;//result.data.data;

		angular.forEach($scope.allClientsData, function(column, key) {
			if(data.customer_survey_id == column.customer_survey_id  && data.participant_id == column.participant_id){
				$scope.allClientsData[key].callstatus = data.callstatus; 
				$scope.allClientsData[key].attempt = data.attempt;
			}
		});

		angular.forEach($scope.activeClientData, function(column, key) {
			if(data.customer_survey_id == column.customer_survey_id  && data.participant_id == column.participant_id){
				$scope.activeClientData[key].callstatus = data.callstatus;
				$scope.activeClientData[key].attempt = data.attempt; 
				//console.log(column,"column",data);
			}
		});

		//if(!filterReset){
			$scope.activeClientData = [];
			$scope.allClientsData.forEach(function (items,index,array){
				if(items.callstatus){
					if(!items.attempt){
						items.attempt = 0; 
					}
					if(items.callstatus =='Open' || items.callstatus =='Busy' || items.callstatus =='Left Message' || items.callstatus == ""){
						$scope.activeClientData.push(items);
					}
				}
			});           
			
			$scope.activeClientData = $scope.activeClientData;
			//console.log($scope.activeClientData.length,"after filterupdate");
			$scope.ui.spcallerGridOptions.data = $scope.activeClientData;//result.data.data;
			$scope.customFilterAfterReload();
		//}
	}

	//when filter is enable and data relaod from DB
	//then we need filtered data(which was before reload) in grid
	$scope.customFilterAfterReload = function(){
		if($scope.filtersEnable){
			$scope.ui.spcallerGridOptions.data = $scope.allClientsData;
			var allColumns = $scope.ui.spcallerGridApi.grid.columns;
			
			angular.forEach(allColumns, function(column, key) {
				if(column && column.filters && column.filters.length > 0 && column.filters[0].term){
					$scope.ui.spcallerGridApi.grid.columns[key].filters[0] = {
							term: column.filters[0].term
					};
				}
			});
			
		}
		$scope.updateGridData();

	}



	$scope.highlightRow = function(){

	}

	$scope.editField = function(field){
		$("."+field).addClass("active");
	}


	function getCellClass(grid, row) {
		return row.uid === selectedRow ? 'highlight' : '';
	}

	$scope.ui.dataPage.recCurrentIndex = function(){
		return (($scope.ui.dataPage.currentPage - 1) * $scope.ui.dataPage.recordsPerpage) + 1;
	}
	$scope.updatedFlag=function(data){
		var callerId=data.spcallerId!=null&&data.spcallerId!=undefined&&data.spcallerId!=''?data.spcallerId:'';
		var caller_name=data.caller_name!=null&&data.caller_name!=undefined&&data.caller_name!=''?data.caller_name:'';
		$http.put($scope.configObj.saveRedflagsUrl, {customer_survey_id: data.customer_survey_id,participant_id:data.participant_id,clientId:data.clientId,updatedbyId:$localStorage.loginDetails.clientId,redFlag:data.isActive,callerId:callerId,caller_name:caller_name})
		.then(function(result){
			//$scope.actions.loadData();
		});
	}
	$scope.ui.dataPage.recLastIndex = function(){
		var lastIdx = $scope.ui.dataPage.recCurrentIndex() + $scope.ui.dataPage.recordsPerpage - 1;

		if (lastIdx > $scope.ui.dataPage.totalPages) lastIdx = $scope.total;

		return lastIdx;
	}

	$scope.actions.onCallStatusChange = function(rowEntity, newCallStatus,rowId){

		if(!$scope.popupIsActive && $scope.filtersEnable){
			$scope.updateGridData();
		}
		$scope.currentRowId = rowId;
		$scope.historyRefreshClient = rowEntity;
		if(rowEntity.pctComplete<100){
			if(newCallStatus == "Assigned"){
				$scope.newCallStatusAssigned = rowEntity;
				$('#assignedStatus').modal('show'); 
				$( ".datepicker" ).datepicker({ minDate: 0});
				$('#timepicker').timepicker();
				return false;
			}
			var callerId=rowEntity.spcallerId!=null&&rowEntity.spcallerId!=undefined&&rowEntity.spcallerId!=''?rowEntity.spcallerId:'';
			var caller_name=rowEntity.caller_name!=null&&rowEntity.caller_name!=undefined&&rowEntity.caller_name!=''?rowEntity.caller_name:'';

			$scope.actions.updateCallStatus(rowEntity.customer_survey_id,rowEntity.participant_id, newCallStatus,rowEntity.clientId,callerId,rowEntity.isActive,caller_name);
			//$scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
			// $scope.$apply();
		}
	}

	$scope.actions.filterChanged = function (grid, sortColumns) {   
		var grid = $scope.ui.spcallerGridApi.grid;
		var newSearch;
		$scope.ui.dataPage.search = [];

		angular.forEach(grid.columns, function(column, key) {
			if(column && column.filters && column.filters.length > 0 && column.filters[0].term){
				newSearch = {};
				newSearch.field = column.field;
				newSearch.value = column.filters[0].term;
				$scope.ui.dataPage.search.push(newSearch);
			}
		});

		loadData();
	}

	$scope.actions.sortChanged = function (grid, sortColumns) {   
		$scope.ui.dataPage.sort = {};
		if (sortColumns.length > 0) {
			$scope.ui.dataPage.sort[sortColumns[0].field] = 
				(sortColumns[0].sort && sortColumns[0].sort.direction === uiGridConstants.ASC) ? 1 : -1; 
		} 

		loadData();
	};

	$scope.actions.onNoOfRecordsChange = function(){
		$scope.ui.dataPage.currentPage = 1;
		loadData();
	};

	$scope.actions.onPageChanged = function(){
		loadData();
	};

	$scope.actions.loadData = function(){
		loadData();
	};

	$scope.actions.updateCallStatus = function(customer_survey_id,participant_id, callStatus,clientid,callerId,redFlag,caller_name,assignNotes,assignedDate,assignedTime) {

		assignNotes = assignNotes || "";
		assignedDate = assignedDate || "";
		assignedTime = assignedTime || "";
		$http.put($scope.configObj.saveCallStatusUrl, {customer_survey_id: customer_survey_id,participant_id:participant_id,callStatus:callStatus,clientId:clientid,updatedbyId:$localStorage.loginDetails.clientId,callerId:callerId,redFlag:redFlag,caller_name:caller_name,assignedTime:assignedTime,assignNotes:assignNotes,assignedDate:assignedDate})
		.then(function(result){
			//reset the assigned popup
			$('#assignedStatus').modal('hide'); 
			$scope.assignedNotes = "";
			$scope.assignedDate = "";
			//reload data
			//$scope.actions.loadData();

			//if($scope.historyRefreshEnable){
			$scope.history($scope.historyRefreshClient,false,true);
			//	$scope.historyRefreshEnable = false;
			//}
		});
	};

	//update phone alt phone and email
	$scope.actions.updateCallerData = function(customer_survey_id,participant_id, newValue,clientid,callerId,redFlag,column) {
		$http.put($scope.configObj.updateCaller, {customer_survey_id: customer_survey_id,participant_id:participant_id,value:newValue,clientId:clientid,updatedbyId:$localStorage.loginDetails.clientId,callerId:callerId,redFlag:redFlag,column:column})
		.then(function(result){
			//$scope.actions.loadData();
			if(result.data.nModified){
				if($scope.activeRowId || $scope.activeRowId == 0){
					$scope.alldata[$scope.activeRowId][column] = newValue;
					$scope.ui.spcallerGridOptions.data = $scope.alldata;//result.data.data;
				}
			}else{
				$scope.error = "The information can't update to database.";
			}
		});
	};


	$scope.actions.openNotesPopup = function(rowEntity){
		var parentElem = undefined;
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'notesPopup.html',
			controller: 'NotesPopupCtrl',
			controllerAs: '$ctrl',
			size: 'sm',
			appendTo: parentElem,
			resolve: {
				data: function () {
					return rowEntity;
				}
			}
		});

		modalInstance.result.then(function (data) {
			$http.put($scope.configObj.saveNotesUrl, {customer_survey_id: data.customer_survey_id,participant_id:data.participant_id, notes: data.notes,clientId:data.clientId,updatedbyId:$localStorage.loginDetails.clientId,callstatus:data.callstatus,redFlag:data.isActive})
			.then(function(result){
				$scope.actions.loadData();
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	$scope.saveNotes=function (data, nv) {
		var callerId=data.spcallerId!=null&&data.spcallerId!=undefined&&data.spcallerId!=''?data.spcallerId:'';
		var caller_name=data.caller_name!=null&&data.caller_name!=undefined&&data.caller_name!=''?data.caller_name:'';

		$http.put($scope.configObj.saveNotesUrl, {customer_survey_id: data.customer_survey_id,participant_id:data.participant_id, notes: nv,clientId:data.clientId,updatedbyId:$localStorage.loginDetails.clientId,callstatus:data.callstatus,redFlag:data.isActive,caller_name:caller_name,callerId:callerId})
		.then(function(result){
			if($scope.popupIsActive){
				$scope.alldata[$scope.activeRowId].notes = nv;
				$scope.history(data);
				$("#userNotes").val("");
			} 

			$scope.ui.spcallerGridOptions.data = $scope.alldata;//result.data.data;
			//$scope.actions.loadData();

		});
		$(".editable").removeClass("active");
		$scope.disableNotes = true
	}
	//save the owner of client
	$scope.saveOwner=function (data, nv) {
		var callerId=data.spcallerId!=null&&data.spcallerId!=undefined&&data.spcallerId!=''?data.spcallerId:'';
		var caller_name=data.caller_name!=null&&data.caller_name!=undefined&&data.caller_name!=''?data.caller_name:'';

		$http.put($scope.configObj.saveOwnerUrl, {customer_survey_id: data.customer_survey_id,participant_id:data.participant_id, owner: nv,clientId:data.clientId,updatedbyId:$localStorage.loginDetails.clientId,callstatus:data.callstatus,redFlag:data.isActive,caller_name:caller_name,callerId:callerId})
		.then(function(result){
			if($scope.popupIsActive){
				$scope.alldata[$scope.activeRowId].owner = nv;
				$scope.history(data);
			}
			//$scope.ui.spcallerGridOptions.data = $scope.alldata;//result.data.data;
			//$scope.actions.loadData();
		});
		$(".editable").removeClass("active");
	}
	$scope.sendSurvey=function (action) {
		if(action.pctComplete < 100){
			$http.post($scope.configObj.sendSurvey, action).then(function (res) {
				//console.log("res ",res);
				if(res.data.type){
					Flash.create('success',res.data.message,2000, {container: 'flash-fixed-submit',id:'spcallerMessage'});
				}else{
					Flash.create('danger',res.data.message,2000, {container: 'flash-fixed-submit',id:'spcallerMessage'});
				}
			});
		}else{
			//do Nothing
		}
	}
	$scope.history=function (action,updateTrue,fileterReset) {
		var updateTrueStatus = updateTrue || false;
		var filterStatus = fileterReset || false;
		var historyParams={};
		historyParams.firstname=action.firstname?action.firstname:'';
		historyParams.lastname=action.lastname?action.lastname:'';
		historyParams.survey_name=action.survey_name;
		historyParams.caller_name=action.caller_name;
		historyParams.participant_id=action.participant_id;
		historyParams.customer_survey_id=action.customer_survey_id;

		$http.post($scope.configObj.history, historyParams).then(function (res) {
			// console.log(res)
			//$('#history').modal('show');  
			$scope.historyData=res.data.data;


			//update attemts in popup
			//in popup when Caller take survey then user status needs to update
			//console.log($scope.alldata.length,"len",$scope.currentRowId);
			if($scope.popupIsActive){	
				if($scope.historyData.length){
					$scope.callerDetailData.attempt = res.data.data.length;
					var updatePopupFields = $scope.historyData[0];
					$scope.statusName = updatePopupFields.callstatus;
					$scope.callerDetailData.spcallerId = updatePopupFields._id;
					$scope.callerDetailData.callstatus = updatePopupFields.callstatus;
					$scope.callerDetailData.last_call_timestamp =updatePopupFields.cdt.replace(/T/, ' ').replace(/\..+/, ''); 
				}
			}
			//to update the queue data
			
			if(!updateTrueStatus){

				var updatePopupFields = $scope.historyData[0];
				
				$scope.allDataUpdate(updatePopupFields,$scope.currentRowId,fileterReset);				
				
			}	
			

		});
	}

	$scope.convertDate=function(val){
		if(val){
			return val.replace(/T/, ' ').replace(/\..+/, '');
		}else{
			return false;
		}
	}



	var getCallerId = function (){
		var lastname = "";
		if($localStorage.loginDetails.lastname){
			lastname = $localStorage.loginDetails.lastname;
		}else{
			if($localStorage.loginDetails.custDetails.lastname){
				lastname = $localStorage.loginDetails.lastname;
			}
		}
		console.log($localStorage.loginDetails.clientName +' '+lastname);

		return $localStorage.loginDetails.clientName +' '+lastname;
	}
	// get client Id 
	var getClientId = function () {
		return $localStorage.selectedClientid;
	};

	function loadData(){
		//get the limitted data for calleradmin
		var limit = 500000;
		if(!$localStorage.limitClientOwner && $localStorage.role == "calleradmin"){
			limit = 2500;
			//$localStorage.limitClientOwner = true;
		}

		
		//remove the cuurent user if any exist
		if($localStorage.openedClientPID && $localStorage.openedClientCID){
			$scope.removeActiveUser();
		}
		var params = {
				page: $scope.ui.dataPage.currentPage,
				limit: $scope.ui.dataPage.recordsPerpage,
				sort: $scope.ui.dataPage.sort,
				search: JSON.stringify($scope.ui.dataPage.search),
				loginUserName:$localStorage.loginDetails.firstname+" "+$localStorage.loginDetails.lastname,
				participantId:$localStorage.loginDetails.participantId,
				clientId:$localStorage.selectedClientid,
				token:$localStorage.token,
				adminType:$localStorage.role,
				limit:limit
		};

		$http.get($scope.configObj.queryURL, {params: params})
		.then(function(result){

			var data = $.grep( result.data.data, function(e){ 
				return e.participantStatus != 'inactive'; 
			});

			//filter the data by status
			$scope.activeClientData = [];
			data.forEach(function (items,index,array){
				if(items.callstatus){
					if(!items.attempt){
						items.attempt = 0; 
					}
					if(items.callstatus =='Open' || items.callstatus =='Busy' || items.callstatus =='Left Message' || items.callstatus == ""){
						$scope.activeClientData.push(items);
					}
				}
			});           
			$scope.allClientsData = data;
			$scope.alldata = $scope.activeClientData;
			$scope.ui.spcallerGridOptions.data = $scope.activeClientData;//result.data.data;
			$scope.customFilterAfterReload();

			if(!$localStorage.limitClientOwner && $localStorage.role == "calleradmin"){
				$(".loader").hide();
				$localStorage.limitClientOwner = true;
				loadData();
			}

			/* $scope.ui.dataPage.totalPages = result.data.pages;
          $scope.ui.dataPage.totalRecords = result.data.total;*/
		});

	}

	function activate(){
		loadData();
	}

	activate();

}).factory('urlBuilder', function ($httpParamSerializer) {
	function buildUrl(url, params) {
		var serializedParams = $httpParamSerializer(params);

		if (serializedParams.length > 0) {
			url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
		}

		return url;
	}

	return buildUrl;
})
.filter('mapCallStatus', function() {
	var callStatusHash = {
			"Assigned":'Assigned' ,
			"Busy":'Busy' ,
			"Completed":'Completed' ,
			"Left Message":'Left Message' ,
			"Max Attempts":'Max Attempts' ,
			"Open":'Open' ,
			"Refused":'Refused' ,
			"Unreachable":'Unreachable' ,
			"Do Not Call":'Do Not Call' 
	};

	return function(input) {
		// console.log(input, "input")
		if (!input){
			return callStatusHash['open'];
		} else {
			return callStatusHash[input];
		}
	};
})
.filter('stringArrayFilter', function() {
	return function(data) {
		return _.pluck(data,'name').join(", ");
	};
});

spApp.controller('NotesPopupCtrl', function ($uibModalInstance, data, $http) {
	var $ctrl = this;

	$ctrl.actions = {};

	$ctrl.ui = {data: data};  

	$ctrl.actions.saveNotes = function () {
		$uibModalInstance.close($ctrl.ui.data);
	};

	$ctrl.actions.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});


spApp.directive('editCallStatus', function () {  
	var cellTemplate =
		'<div style="width: 100%;">' +    
		'<div class="btn-group" style="margin-top: 0px !important; width:73%;" uib-dropdown dropdown-append-to-body="true">' +
		'  <button id="split-button" type="button" class="btn btn-sm" style="padding:10px 0; overflow:hidden; float:left; text-align:left; width:70%" uib-dropdown-toggle >{{selectedCallStatus|mapCallStatus}}</button>' +
		'  <button type="button" style="width:10%;float:right;" class="btn btn-sm" uib-dropdown-toggle> '+
		'	<span class="caret"></span> ' +
		'	<span class="sr-only">Split button!</span>' +
		'  </button>' +
		'  <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="split-button"> ' +
		' <li ng-repeat="choice in callStatusModal">' +
		' <a href ng-click="actions.onOptionsSelect(choice.id)">{{choice.desc}}</a>' +
		' </li>                                ' +
		'  </ul>  ' +
		'</div> ' +
		'</div>';

	return {
		template: cellTemplate,
		restrict: 'E',
		scope: {
			selectedCallStatus:'=selectedCallStatus',
			onCallStatusChange: '&onCallStatusChange',

		},
		controller: function ($scope) {
			$scope.actions = {};

			$scope.callStatusModal = [
			                          { id: 'Assigned', desc: 'Assigned' },
			                          { id: 'Busy', desc: 'Busy' },
			                          { id: 'Completed', desc: 'Completed' },
			                          { id: 'Left Message', desc: 'Left Message' },
			                          { id: 'Max Attempts', desc: 'Max Attempts' },
			                          { id: 'Open', desc: 'Open' },
			                          { id: 'Refused', desc: 'Refused' },
			                          { id: 'Unreachable', desc: 'Unreachable' },
			                          { id: 'Do Not Call', desc: 'Do Not Call' }
			                          ];

			$scope.actions.onOptionsSelect = function(callStatus){
				$scope.onCallStatusChange({newCallStatus: callStatus});
			}
		}
	};
});


