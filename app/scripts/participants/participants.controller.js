'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:UserListCtrl
 * @description
 * # UserListCtrl
 * Controller of the spApp
 */
var rgACIdArr={};
var rgACvalue={};
var customerSurveyData=[];
var customerSurveyDataKeyValue={};
var langDataKeyValue={};
var tableFieldColumns=[];
var languageDataArr={};
var js_serverURL="";
var js_serverURLnew="";
var js_updateCell="";
var js_updatRoles="";
var js_removeurl="";
var js_updateurl="";
var js_updateLanguage="";
var js_updateDla="";
var js_sendmail="";
var js_resetLink="";
var js_clientId="";
var js_clientname="";
var js_accessArray=[]
var js_metadata={};
var colOrderArr=[];
var js_demographics = {};
var js_Scope_data = [];

spApp.controller('ParticipantsCtrl', function ($scope, $rootScope, $http, urlBuilder, Upload, $timeout, $uibModal, $log, $document, $filter, httpMetaData, $localStorage, $location, envsetting, $window, Flash, $q, getAssignSurveyData,participantService) {

  //config
//  console.log('envsetting');
//  console.dir(envsetting);

  //var dynimicLocation = $location.protocol() + '://' + $location.host() + ':' + $location.port();
  var serverURL = envsetting.client.serverUrl;//$location.protocol() + '://' + $location.host() + ':3010';
  //var serverURLnew = $location.protocol() + '://' + $location.host() + ':9000';
  var serverURLnew = envsetting.client.clientUrl;//$location.protocol() + '://' + $location.host() + ':8008';
  
  js_serverURL=envsetting.client.serverUrl;
  js_serverURLnew=envsetting.client.clientUrl
  js_demographics = $localStorage.metaDataConstant;
  $('.loader').show();

  //config object
  /*
   * To be moved to service
   * */
  $scope.configObj = {};
  $scope.configObj.page = 1;
  $scope.limitpage = [5, 10, 50, 100];
  $scope.configObj.limit = $scope.limitpage[2];
  $scope.configObj.queryURL = serverURL + "/api/participants/query/";
  $scope.configObj.updateCell = serverURL + "/api/participants/updateCell/";
  
  js_updateCell = serverURL + "/api/participants/updateCell/";
  js_updatRoles= serverURL + "/api/participants/updateRole/";
  js_updateLanguage=serverURL + "/api/participants/updateLanguage/";
  js_removeurl=serverURL + "/api/participants/deleteParticipant/";
  js_updateurl=serverURL + "/api/participants/updateCell/";
  js_updateDla=serverURL + "/api/participants/updateDla/";
  js_sendmail=serverURL + "/api/email/sendemail/";

  js_resetLink=serverURLnew + "/#/resetPassword";
  $scope.configObj.updatRoles = serverURL + "/api/participants/updateRole/";
  
  
  $scope.configObj.uploadCsv = serverURL + "/api/participants/uploadCsv/";
  $scope.configObj.uploadXls = serverURL + "/api/participants/uploadXls/";
  $scope.configObj.downloadXlsTelmpate = serverURL + "/api/participants/downloadXlsTelmpate/";
  $scope.configObj.downloadDLAXlsmTelmpate = serverURL + "/api/participants/downloadDLAXlsmTelmpate/";
  $scope.configObj.downloadXlsTelmpateFile = serverURL + "/api/participants/download";
  $scope.configObj.metaDataSave = serverURL + "/api/metaData/metaDataSave/";
  $scope.configObj.metaDataGet = serverURL + "/api/metaData/getMetadatByClientId";
  $scope.configObj.conversions = serverURL + "/api/participants/conversions";
  $scope.configObj.crateParticipant = serverURL + "/api/participants/create";
  $scope.configObj.resetLink = serverURLnew + "/#/resetPassword";
  $scope.configObj.sendemail = serverURL + "/api/email/sendemail/";
  $scope.configObj.loadCustomerSurveys = serverURL + "/api/surveys/loadCustomerSurveys/";
  $scope.configObj.updateDla = serverURL + "/api/participants/updateDla/";
  $scope.configObj.removePartcipants = serverURL + "/api/participants/removePartcipants/";
  $scope.configObj.getMetadata = serverURL+"/api/editClient/getMetadata/";
  $scope.configObj.updateParticipantStatus = serverURL + "/api/participants/updateParticipantStatus/";
  $scope.configObj.getLanguages = serverURL + "/api/surveys/fetchLanguageCodes/";
  $scope.configObj.checkEmployeeId = serverURL + "/api/participants/checkEmployeeId/";
  $scope.configObj.checkDlaIds = serverURL + "/api/participants/checkDlaIds/";
  $scope.configObj.removeDemogrphicVal = serverURL + "/api/participants/removeDemogrphicVal/";

  $scope.clientId = $localStorage.selectedClientid;
  js_clientId=$localStorage.selectedClientid;
  js_clientname=$localStorage.selectedClientname;
  //console.log('$localStorage.selectedClientid',$localStorage.selectedClientid)
  $scope.filterLimit = 5;
 
  $scope.metaDataConstant = [
    {
      "field": "employeeid",
      "displayName": "Employee ID",
      "search": "",
      "sort": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "display": true,
      "dataType":"integer"
    },
    {
      "field": "firstname",
      "displayName": "First Name",
      "search": "",
      "sort": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "display": true,
      "dataType":"string"
    },
    {
      "field": "lastname",
      "displayName": "Last Name",
      "search": "",
      "sort": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "display": true,
      "dataType":"string"
    },
    {
      "field": "email",
      "displayName": "Email",
      "search": "",
      "sort": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "display": true,
      "dataType":"string"
    },
    {
      "field": "phone",
      "displayName": "Phone",
      "search": "",
      "sort": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "display": true,
      "dataType":"string"
    },
    {
      "field": "alt_phone",
      "displayName": "Alt Phone",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true,
      "dataType":"string"
    },
    {
      "field": "assigned_survey",
      "displayName": "Assigned Survey",
      "search": "",
      "sort": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "display": true,
      "dataType":"string"
    },
    {
      "field": "generation",
      "displayName": "Generation",
      "fieldtype": "demographic",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true,
      "dataType":"string",
      "reportGroupItems": ["Millenials (1980-2000)",
        "Gen X (1965-1979)",
        "Baby Boomers (1946-1964)",
        "Traditionalists (1925-1945)",
        "Gen Z/Boomlets",
        "Unknown"
      ]
    },
      {
      "field": "state",
      "displayName": "State",
      "fieldtype": "demographic",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true,
      "dataType":"string",
      "reportGroupItems": [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersy",
        "new mexico",
        "new york",
        "north California",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "Wast virginia",
        "Wisconsin",
        "wyoming",
        "Non-US",
        "All others",
        "unknown"
        ]
       },
    {
      "field": "tenure_groupings",
      "displayName": "Tenure Groupings",
      "fieldtype": "demographic",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true,
      "dataType":"string",
      "reportGroupItems": ["Less than 3 months",
        "3 months - less than 6 months",
        "6 months - less than 1 year",
        "1 year - less than 3 years",
        "3 years - less than 5 years",
        "5 years - less than 10 years",
        "10 years - less than 15 years",
        "15 years or more",
        "Unknown"
      ]
    },
    {
      "field": "Region",
      "displayName": "region",
      "fieldtype": "demographic",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true,
      "dataType":"string",
      "reportGroupItems": ["South",
        "West",
        "Northeast",
        "Midwest",
        "Non-US"
      ]
    },
    {
      "field": "department",
      "displayName": "Department",
      "fieldtype": "demographic",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true,
      "dataType":"string",
      "reportGroupItems": ["Administration",
        "Administrative Support",
        "Support Services",
        "zUnknown"]

    },
    {
      "field": "job_class",
      "displayName": "Job class",
      "fieldtype": "demographic",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true,
      "dataType":"string",
      "reportGroupItems": [
        "Nursing Support",
        "Management & Leadership",
        "Technical/Technicians",
        "Professional",
        "Therapists",
        "Nursing",
        "Administrative/Clerical",
        "All Others",
        "Service",
        "Practitioners",
        "Pharmacist",
        "Medical Assistant",
        "Unknown"
      ]
    },
    {
      "field": "access",
      "accessArraynew": [
        "Design",
        "Audience",
        "Report",
        "Action Planning",
        "Compliance",
        "Spcaller"

      ],
      "displayName": "Roles",
      "search": "",
      "sort": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "display": true
  },{
        "field": "language",
        "reportGroupItems": [
			"Spanish",
			"Simplified Chinese",
			"Japanese",
			"Mandarin",
			"Korean",
			"German",
			"Danish",
			"Ukrainian",
			"Turkish",
			"French",
			"English"
        ],
        "displayName": "Language",
        "search": "",
        "sort": "",
        "fieldtype": "languageList",
        "displaytype": "",
        "template": "",
        "display": true    
      },
    {
      "field": "settings",
      "displayName": "Data Level Access",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true
    },
    {
      "field": "status",
      "displayName": "Active",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true
    },
    {
      "field": "actions",
      "displayName": "Actions",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true
    },
    {
      "field": "skip",
      "displayName": "",
      "fieldtype": "default",
      "displaytype": "",
      "template": "",
      "sort": "",
      "search": "",
      "display": true
    }
  ];
//  $scope.metaDataConstant = $scope.metaDataConstant;

  function mapServey(assignSurveyData1) {
    customerSurveyData=[];
    var newAssignSurveyData = [];
    if (assignSurveyData1.length > 0) {
      assignSurveyData1.map(function (assignSurvey, index) {
        //console.log(":assignSurvey._id", assignSurvey);
         customerSurveyData.push(assignSurvey.survey_name);
         customerSurveyDataKeyValue[assignSurvey.survey_name]=assignSurvey._id;
        newAssignSurveyData.push({'id': assignSurvey._id, "survey_name": assignSurvey.survey_name});
      });
    }
    return newAssignSurveyData;
  }
//function insert survey data into survey instance -- start 
  $scope.mapParticipants2SurveyInstance=function(rowData){
      $http({
            method: 'POST',
            url: serverURL + "/api/participants/mapParticipantToSurveyInstance/",
             data:{
                "params":rowData
            }
          }).then(function (data) {
//              console.log('cheguvera',rowData);
          });
  }
  //function insert survey data into survey instance -- end

  $scope.afterSelectItem = function (item) {

    // perform operation on this item before selecting it.
  }


  //Assign Survey Data
  $scope.assignSurveyData = {};
  $scope.assignSurveyData = mapServey(getAssignSurveyData.data.surveyList);
  $scope.getAssignSurveyData = function (clientId) {
    $http({
      method: 'POST',
      url: serverURL + "/api/surveys/loadCustomerSurveys/",
      data: {clientId: clientId}
    })
      .then(function (data) {
//        console.log("getCustomerSurveysData", data.data);
        $scope.assignSurveyData = {};
        if (data.data.surveyList) $scope.assignSurveyData = mapServey(data.data.surveyList);
        // return data;
      });
  }

  $scope.afterSelectItem = function (item, id) {
//	  console.log('assigned_survey',item);
    var rowData = $scope.findFieldValuefromData(id);
    $scope.updateInlieEdit(rowData.assigned_survey, 'assigned_survey', id,'string','reportGroupItems');
    var mapSurveyInstanceAddData = {};
    mapSurveyInstanceAddData['clientId']=rowData.clientId;
    mapSurveyInstanceAddData['participant_id']=rowData._id;
    mapSurveyInstanceAddData['customer_survey_id']=item.id;
    mapSurveyInstanceAddData['survey_name']=item.survey_name;
    mapSurveyInstanceAddData['action']='addItem';
    $scope.mapParticipants2SurveyInstance(mapSurveyInstanceAddData);
  };
  $scope.afterRemoveItem = function (item, id) {
    var rowData = $scope.findFieldValuefromData(id);
    $scope.updateInlieEdit(rowData.assigned_survey, 'assigned_survey', id,'string', 'reportGroupItems');
    var mapSurveyInstanceRemoveData = {};
    mapSurveyInstanceRemoveData['clientId']=rowData.clientId;
    mapSurveyInstanceRemoveData['participant_id']=rowData._id;
    mapSurveyInstanceRemoveData['customer_survey_id']=item.id;
    mapSurveyInstanceRemoveData['survey_name']=item.survey_name;
    mapSurveyInstanceRemoveData['action']= 'removeItem';
    $scope.mapParticipants2SurveyInstance(mapSurveyInstanceRemoveData);
  };

  $scope.afterSelectItem1 = function (item, id, data) {
//	  console.log('assigned_survey',item);
    var rowData = $scope.findFieldValuefromData(id);
    $scope.updateInlieEdit(data, 'assigned_survey', id,'string','reportGroupItems');
    var mapSurveyInstanceAddData = {};
    mapSurveyInstanceAddData['clientId']=rowData.clientId;
    mapSurveyInstanceAddData['participant_id']=rowData._id;
    mapSurveyInstanceAddData['customer_survey_id']=item.id;
    mapSurveyInstanceAddData['survey_name']=item.survey_name;
    mapSurveyInstanceAddData['action']='addItem';
    $scope.mapParticipants2SurveyInstance(mapSurveyInstanceAddData);
  };
  
  $scope.afterRemoveItem1 = function (item, id, data) {
    var rowData = $scope.findFieldValuefromData(id);
    $scope.updateInlieEdit(data, 'assigned_survey', id,'string', 'reportGroupItems');
    var mapSurveyInstanceRemoveData = {};
    mapSurveyInstanceRemoveData['clientId']=rowData.clientId;
    mapSurveyInstanceRemoveData['participant_id']=rowData._id;
    mapSurveyInstanceRemoveData['customer_survey_id']=item.id;
    mapSurveyInstanceRemoveData['survey_name']=item.survey_name;
    mapSurveyInstanceRemoveData['action']= 'removeItem';
    $scope.mapParticipants2SurveyInstance(mapSurveyInstanceRemoveData);
  };  
    //updateInlieEdit(item,column.field,field._id,'reportGroupItems')

  var setClientId = function (clientId) {
    $scope.clientId = "" + clientId + "";
    $localStorage.selectedClientid = "" + clientId + "";

  };

//  console.dir($localStorage);
  angular.element("th#settings").width("60px");
  angular.element(".participants").addClass('active');

  //file upload functionality
  /*
   * Uploads Excel File
   *
   * */
  //Trigger file upload
  //var isDLaUpload = false;
  $scope.triggerUploadFile = function () {
	  //isDLaUpload = dlaUpload;
    var clientId = getClientId();
    if (clientId != "") {
      angular.element('#uploadExcelFile').trigger('click');
      $scope.runCallBack = true;

    }
    else   Flash.create("danger", "Please Select a Customer"); 
    $scope.runCallBack = false;
  };


  $scope.uploadExcelFile = function (file) {
	  $('.loader').show();
	  if(file.name){
		  var fileName = file.name;
		  var validFormats = ['xlsx', 'xls','xlsm'];
		  var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

		  if(validFormats.indexOf(ext)==-1){
			  // Flash.create("danger", "File is not a Vaild Format");
        alertMessage('File is not a Vaild Format', 'danger');
        $('.loader').hide();
			  return;
		  }  
	  }
    $scope.clientId = getClientId();
    if ($scope.clientId == "undefine" || $scope.clientId == "") {
      $scope.successAlert("Please Select a client", "error");
      $('.loader').hide();
      return;
    } else {
      //$('.loader').show();
      file.upload = Upload.upload({
        url: $scope.configObj.uploadXls,
        data: {file: file, "clientId": $scope.clientId, 'assignSurveyData': $scope.assignSurveyData}
        //  ,headers:"application/json"
      });

      file.upload.then(function (resp) {
//			  $scope.runCallBack = true;
    	  if(resp.data.result && resp.data.result=='error'){
    		  Flash.create("error",resp.data.error);
    	  }else if (resp.data.uploadedresult=='error') {
          $('.loader').hide();
          alertMessage("File not Uploaded !"+ resp.data.error,'danger','2000');
              // Flash.create("error",resp.data.error);
        }else{
    		  $window.scrollTo(0, 0);
    		  //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    		  // Flash.create("info", "File uploaded SucessFully!  Updated: " + resp.data.updated + "      Created: " + resp.data.created + "     	Invalid: " + resp.data.invalid  + "     	Duplicated: " + resp.data.duplicate);
          var file_upload_count=resp.data.updated+resp.data.created+resp.data.duplicate;
          $localStorage.FILE_UPLOAD_MESSAGE="File uploaded SucessFully!  Updated: " + resp.data.updated + "      Created: " + resp.data.created + "     	Invalid: " + resp.data.invalid  + "     	Duplicated: " + resp.data.duplicate;
          var file_upload_timeout=1000;
          if(file_upload_count<=500){
            file_upload_timeout=2000;
          } else if(file_upload_count<=1000){
            file_upload_timeout=5000;
          }
         
          //alertMessage("File uploaded SucessFully!  Updated: " + resp.data.updated + "      Created: " + resp.data.created + "     	Invalid: " + resp.data.invalid  + "     	Duplicated: " + resp.data.duplicate, 'info')

          $timeout(function (){
           window.location.reload();
            //$scope.queryBuilder_v1("");
          },file_upload_timeout);
    		  

    	  }

      }, function (resp) {
        console.log('Error status: ' + resp.status);

      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    }
  };
  if($localStorage.FILE_UPLOAD_MESSAGE){
    alertMessage($localStorage.FILE_UPLOAD_MESSAGE,'info','7000');
    $localStorage.FILE_UPLOAD_MESSAGE="";
  }

  // get meta data
  (httpMetaData.data) ? $scope.columns = httpMetaData.data.metaData : $scope.columns = $scope.metaDataConstant;
  (httpMetaData.data) ? $scope.metadataId = httpMetaData.data._id : $scope.metadataId = "";
  //setting clientId from local storage
  $scope.cilentId = $localStorage.selectedClientid;
  if ($scope.clientId == "undefine") $scope.clientId = "";


  //setting columns for admin


  //fetching client change event and updating new metadata. "clientChangeEvent"
  $rootScope.$on('clientChangeEvent', function (event, data) {
	  $scope.clientId = "" + data + "";
	  $localStorage.selectedClientid = "" + data + "";
    js_clientId="" + data + "";
	  setClientId(data);
	  $scope.getAssignSurveyData($scope.clientId);

	  $http({
		  method: 'POST',
		  url: serverURL + '/api/metadata/getMetadatByClientId',
		  data: {clientId: $scope.clientId}
	  }).then(function (data) {
//		  console.log("data.data", data.data);
		  //$scope.columns = data.data.metaData;
		  (data.data) ? $scope.columns = data.data.metaData : $scope.columns = $scope.metaDataConstant;
		  (data.data) ? $scope.metadataId = data.data._id : $scope.metadataId = "";
//		  console.log('$scope.metadataId data', $scope.metadataId);

	  });

	  //resetting the user-list
	  $scope.queryBuilder_v1("reset");

	  ///Conversion   demographics functionality
	  $scope.demographicsArray = [];
	  $scope.columns.map(function (column) {
		  if (column.fieldtype == "demographic" || column.fieldtype == "new") $scope.demographicsArray.push(column);
	  });

	  setTimeout(function(){
		  $('#myTable').dragtable('destroy');
		  $scope.dragTableInstance('clientChangeEvent');
	  },900);

  });


  /*
   * metadata Save functions
   * @ requird clientId
   *
   * */
  //metadata save function
  $scope.metaDataSave = function (clientId, metadataId, columns,isNewcolumn) {
    //for to remove the sort option save on metadata save
	  $scope.columns.map(function (column, index) {
		  if (column.sort !='' ) {
			  $scope.columns[index]['sort']='';
		  }
		  if(columns.search!=''){
			  $scope.columns[index]['search']='';
		  }
	  });
   var postData = {"clientId": clientId, "metadataId": $scope.metadataId, "metaData": $scope.columns};
    $http.post($scope.configObj.metaDataSave, {
      data: postData
    }).then(function (response) {
    	if(isNewcolumn){
    		$http({
    			method: 'POST',
    			url: $scope.configObj.getMetadata,
    			data:{'clientId':$localStorage.selectedClientid}
    		}).then(function successCallback(response) {
    			$localStorage.metaDataConstant = response.data.data;
    			js_metadata=response.data.data;
          $('#builder').queryBuilder('destroy');
          $scope.queryBuilder_v1("reset");
    		}, function errorCallback(response) {
    			// called asynchronously if an error occurs
    			// or server returns response with an error status.
    		});
    	}else{
    		
    		 $('#builder').queryBuilder('destroy');
             $scope.queryBuilder_v1("reset");
    	}
    	
//      console.dir(response);
    });
  };

//Demographic Array conversion
  $scope.demographicsSelectedTypeArray = ["map", "format", "range"];
//  console.dir($scope.demographicsArray);
  $scope.demographic = {"selected": ""};

  /*
   * save conversion to database and apply conversion logic to participants collection
   *
   * */
  $scope.saveConversions = function () {
	  //work in progress
//	  console.dir($scope.demographic.selected)
	  if ($scope.demographic.selected.hasOwnProperty('conversions')) {
		  $scope.columns.map(function (column, index) {
			  if (column.field == $scope.demographic.selected.field) {
				  if ($scope.columns[index]['conversions']) {
					  $scope.columns[index]['conversions'] = $scope.demographic.selected.conversions;
				  } else {
//					  console.log("$scope.columns[index]", $scope.columns[index]);
					  $scope.columns[index]['conversions'] = {};
					  $scope.columns[index]['conversions'] = $scope.demographic.selected.conversions;
				  }
			  }
		  });
//		  console.log('saveConversions--$scope.columns', $scope.columns);
		  var clientId = '';
		  if ($scope.clientId == "") clientId = $localStorage.selectedClientid;
		  else clientId = $scope.clientId;
		  //save the metadata
		  $scope.metaDataSave(clientId, $scope.metadataId, $scope.columns,false);
		  //if($scope.demographic.selected.conversions.length=='undefined')alert("$scope.demographic.selected.conversions.length=='undefined'") ;
		  $http.post($scope.configObj.conversions, {
			  data: {
				  "clientId": clientId,
				  "conversions": $scope.demographic.selected.conversions,
				  "field": $scope.demographic.selected.field
			  }
		  }).then(function (response) {
//			  console.dir(response);
			  $timeout($scope.queryBuilder_v1('reset'), 50000);
			  $scope.queryBuilder_v1('reset');
		  });
	  }
  };


  /*
   * Conversion function to populate conversion in popup/modal
   * @ field -required
   * */
  $scope.conversions = function (field) {
    $scope.demographicsArray = [];
    $scope.columns.map(function (column) {
      if (column.fieldtype == "demographic" || column.fieldtype == "new") {
        $scope.demographicsArray.push(column);
        if (column.field == field) {
          $scope.demographic.selected = column;
//          console.dir("$scope.demographic.selected");
//          console.dir($scope.demographic.selected);
        }
      }
    });
    angular.element('#conversions').modal('show');
  };


  $scope.addConversion = function () {
    var conv = {
      "from": "",
      "to": "",
      "type": "map"
    };
    if ($scope.demographic.selected.conversions) {
      $scope.demographic.selected.conversions.push(conv);
//      console.dir('$scope.demographic.selected.conversions');
//      console.dir($scope.demographic.selected.conversions);
    } else {
      $scope.demographic.selected.conversions = [];
      $scope.demographic.selected['conversions'].push(conv);
    }
  };
  //dragable

  /*
   * add Column functionality
   *
   *
   * */
 
//delete column
  $scope.deleteColumn = function (index,field){
    $('.loader').show(); 
	  $http({
	        method: 'POST',
	        url: $scope.configObj.checkDlaIds,
	        data:{'clientId':$scope.clientId,'field':field+'"'}
	      }).then(function (data) { 
//	    	  console.log(data);
	    	  if(data.data.length>0) {
	    		  //Flash.create("info", "Please remove the mapped DLA"); 
                  alertMessage('Please remove the mapped DLA', 'info', 2000); 
                    $('.loader').hide();
                  } else {
                    $http({
	    		        method: 'POST',
	    		        url: $scope.configObj.removeDemogrphicVal,
	    		        data:{'clientId':$scope.clientId,'field':field}
	    		         }).then(function (data) {
	    		    	  $scope.columns.splice(index, 1);
	    	    		  $scope.metaDataSave(getClientId(), '', $scope.columns,true);
	    	    		  //Flash.create("info", "Column Deleted");
                  alertMessage('Column Deleted', 'info', 2000);
                  //$('#myTable').colResizable({disable:true}) 
	    	    		  $scope.queryBuilder_v1("Column Deleted");
	    	    		  $('#myTable').floatThead('reflow');
                   $window.scrollTo(0, 0);
	    		      })
	    		     		  
	    	  }
	    	});
  }   
      $("#field").keypress(function(event){
          var ew = event.which;
          if(ew == 8 ||ew == 45 ||ew== 95 ||ew== 0)
              return true;
          if((48 <= ew && ew <= 57)||(65 <= ew && ew <= 90)|| (97 <= ew && ew <= 122))
              return true;
          return false;
      }); 
  $scope.newfield = {field: '', displayName: ''};
  if($localStorage.userPage!=undefined){ $scope.limit=$localStorage.userPage; $scope.recordsPerpage=$localStorage.userPage; }
  else { $scope.recordsPerpage=$scope.limitpage[2]; }
  $scope.addColumn = function (isValid) {
	  if (isValid) { 
		  var newTemp = null;
		  var newField = null;

		  $.each($scope.columns, function(index, value) {
			  if (newTemp == null && value.displayName.toLowerCase() == $scope.newfield.displayName.toLowerCase()) {
				  newTemp = index;
				  return false;
			  }
		  });
		  $.each($scope.columns, function(index, value) { 
			  if (newField == null && value.field.toLowerCase() == $scope.newfield.field.toLowerCase()) {
				  newField = index;
				  return false;
			  }
		  });
		  if(newTemp  || newField){
			  $window.scrollTo(0, 0);
			  Flash.create('danger','column already exist', 2000, {container: 'add-column'});
			  return;
		  }
		  var newField = {
				  field: $scope.newfield.field,
				  displayName: $scope.newfield.displayName,
				  search: "",
				  sort: "",
				  fieldtype: "new",
				  displaytype: "",
				  template: "",
				  display: true,
				  dataType:$scope.newfield.dataType
		  };
		  $scope.columns1 = [];
		  angular.copy($scope.columns, $scope.columns1);
		  $scope.columns1.splice($scope.columns1.length - 4, 0, newField);
		  angular.copy($scope.columns1, $scope.columns);
		  $scope.metaDataSave(getClientId(), '', $scope.columns,true);
		  $window.scrollTo(0, 0);
		  Flash.create('success','column added sucessfully', 2000, {container: 'add-column'});
       if (!$('.floatThead-container').hasClass('floated')) {
        $('#myTable').dragtable('destroy');
      }
       $scope.queryBuilder_v1("");
		  setTimeout(function () {
			  $scope.dragTableInstance();
			  $("#myModal").modal('hide');
			  $('#myTable').floatThead('reflow');
        /*$('#myTable').colResizable({
          disable:true
        })
        $('#myTable').colResizable({
          resizeMode:'overflow',
          liveDrag:true,
          headerOnly:true,
          partialRefresh:true,
          onDrag:function () {
            $("#myTable").floatThead('destroy');
          },
          onResize:function () {
            $('#myTable').floatThead({
              position :'absolute',
              copyTableClass:true
            });
          }
        }); */	 
       }, 900);
	  }
	  $scope.newfield.field="";
	  $scope.newfield.displayName="";
    $scope.newfield.dataType='string'; 
  };

  // $scope.accessArray = ['Design', 'Audience', 'Report', 'Analyze', 'Action Planning', 'Compliance'];
  $scope.accessArray = ['Design', 'Users', 'Report','Action Planning', 'Compliance','Spcaller'];
  js_accessArray=['Design', 'Users', 'Report', 'Action Planning', 'Compliance','Spcaller'];
  // $scope.accessArray = ['Design', 'Users', 'Report','Action Planning', 'Compliance'];
  // js_accessArray=['Design', 'Users', 'Report', 'Action Planning', 'Compliance'];
  Array.prototype.clean = function(deleteValue) {
	  for (var i = 0; i < this.length; i++) {
		  if (this[i] == deleteValue) {         
			  this.splice(i, 1);
			  i--;
		  }
	  }
	  return this;
  };
  $scope.assignAccess= function(accessArray){
	  accessArray.clean("");
	  return accessArray.toString();
  }

  $scope.runQueryBuilder_v1 = function (action) {
	  if ($scope.runCallBack != false) {
		  //alert(action)
		  $scope.queryBuilder_v1(action);
	  }

  };

  /*
   * queryBuilder_v1 for all fetching of data
   * it incorporate and build json
   * adds sorting, paging and  search logic
   * @ options have
   *@ action refers to
   * */
  $scope.queryBuilder_v1 = function (action) {
	 // $scope.filterLimit =5;
   	tableFieldColumns=[];
    $('.loader').show();
        $(".mdtTableContainer").scrollTop(0);
    ///console.log($scope.columns.length, '$scope.columns.length');
    var search = [], sort = [], limit, page, pages;

  var search = [], sort = [], limit, page, pages;
	  for(var i=0;i< $scope.columns.length; i++){
		  tableFieldColumns.push($scope.columns[i].field);
		  if($scope.columns[i].sort && $scope.columns[i].sort != "") {
			  var key=$scope.columns[i].field;
			  var val=$scope.columns[i].sort;
//			  sort = [];
			  sort.push({field: key, value: val});
		  }
		  if($scope.columns[i].search != ""){
			  var key=$scope.columns[i].field;
			  var val=$scope.columns[i].search;
			  search.push({field: key, value: val});
		  }
	  }
	  
	  if(action=="search"||action=="reset"){
		  $scope.page=$scope.configObj.page;
	      $scope.limit=$scope.configObj.limit;
	  }else if(action=="addParticipants"){
		 // sort=[];
		  //sort.push({"field":"employeeid","value":1});
	  }else{
	      $scope.page=$scope.pagination.currentPage;
	  }
    if($localStorage.userPage!=undefined){ $scope.limit=$localStorage.userPage; }
    ///console.dir(search);
    ///console.dir(sort);
    var dlaQuery = '';
    if($localStorage.loginDetails.dlaQuery){
     dlaQuery=  $localStorage.participantsDlaQuery;

     //dlaQuery=dlaQuery.replace("/$and", "$and").replace("/$or", "$or");
    }
    //console.log(JSON.stringify(dlaQuery));
    var postData = {
      data: {
        "clientId": $scope.clientId,
         "dlaQuery":dlaQuery,
        "limit": $scope.limit, "page": $scope.page,
        "search": search,
        "sort": sort
        , headers: {
          "Content-Type": "application/json"
        }
      }
    };
//    console.log(JSON.stringify(postData));
    // callling the service later replace by factory
    $http.post($scope.configObj.queryURL, postData).then(function (response) {
      $('.loader').hide();
//    	console.log(response,'response');
    var statusLength=0;
//    console.log( response.data);

      $scope.data = response.data.docs;
      js_Scope_data = $scope.data; 
      $scope.createTableDom();
      
      $scope.total = response.data.total;
      $scope.limit = response.data.limit;
      $scope.pages = response.data.pages;
      $scope.page = response.data.page;
      angular.element("#pagination").removeClass('pagination');
      $scope.recCurrentIndex = (($scope.page - 1) * $scope.limit) + 1;
      $scope.recLastIndex = $scope.recCurrentIndex + $scope.limit - 1;
      if ($scope.recLastIndex > $scope.total) $scope.recLastIndex = $scope.total;

      $scope.pagination = {"currentPage": $scope.page};
      $scope.dataMapping($scope.data, $scope.columns)
//      $scope.apllyContextMenu();
      angular.forEach($scope.data, function (field) {
    	  field.status=='inactive'?statusLength++:'';
      });
      if(response.data.docs.length==statusLength){
    	  $scope.makeAllActive = false;
//    	  console.log($scope.Status);
    	  if(!$scope.Status){
    		  $scope.Status = true
    	  }
      }
 
setTimeout(function() {
           $('#myTable').floatThead({
            position: 'absolute',
            copyTableClass: true
        });
        /*  if(action!='search'){
             $('#myTable').colResizable({
                resizeMode: 'overflow',
                liveDrag: true,
                headerOnly:true,
                partialRefresh:true,
                onDrag: function() {
                    $("#myTable").floatThead('destroy');
                    // $('#myTable').dragtable('destroy');
                },
                onResize: function() {
                  $('#myTable').dragtable('destroy');
                  $scope.dragTableInstance();
                    setTimeout(function() {                  
                        $('#myTable').floatThead({
                          position: 'absolute',
                          copyTableClass: true
                      });
                    }, 900);               
                }
            });
          } */
      }, 500); 
 

    });


  };

  $scope.js_addParticipants=function(){

	  var obj=$scope.data[$scope.data.length-1];
	  var str="";
	  str+="<tr id='tr"+obj._id+"' emp-status='empty'>";
	  for(var z=0;z<colOrderArr.length;z++){
		  var colObj=colOrderArr[z];
		  var key=colObj.field;
		  var fieldtype=colObj.fieldtype;

		  //console.log(JSON.stringify(colObj))

		  var inlinestyle="";
		  if(key =='actions' || key =='settings'){
			  inlinestyle=" style='text-align:center'";
		  }
		  if(colObj.display){
			  str+="<td "+inlinestyle+">";


			  if(key=='skip'){
			  }else if(key =='status' &&  colObj.display){
				  var statusVal=obj[key];
				  var dataVal=key+"\t"+obj._id+"\t"+statusVal;
				  str+="<div class='togglebutton switchmarginl38'>";
				  str+="<label>";
				  str+="<input style='opacity:1' type='checkbox' class='statusUpdateClass'";
				  str+=" data-val='"+obj._id+"'";
				  if(statusVal=='active') str+=" checked ";
				  str+=" onclick='status_update(\""+obj._id+"\")'";
				  str+="/>";
				  str+="</label>";
				  str+="</div>";

			  }else if(key =='actions' &&  colObj.display){
				  var suveyAssigned=0;
				  if(obj["assigned_survey"] && obj["assigned_survey"].length>0){
					  suveyAssigned=obj["assigned_survey"].length
				  }
				  var dataVal=key+"\t"+obj._id+"\t"+suveyAssigned;
				  str+="<div class='deleteClm'>";
				  str+="<button type='button'";
				  str+=" data-val='"+dataVal+"'"; 
				  str+="  class='md-button md-icon-button ' ";
				  str+=" onclick='js_removeRow(\""+dataVal+"\")' >";
				  str+=" <i class='material-icons txt_green'>delete</i></button>";
				  str+="</div>";

			  }else if(key =='settings' ){
				  var disabled="disabled";
				  var dataVal=key+"\t"+obj._id+"\t"+suveyAssigned;
				  str+="<button";
				  str+=" disabled type='button'";
				  str+=" data-val='"+JSON.stringify(obj)+"'";
				  str+=" "+disabled;
				  str+=" data-toggle='modal'";
				  str+=" id='"+key+"__"+obj._id+"'";
				  str+=" onclick=\'js_dlaQuerybuilder(\""+obj._id+"\",\""+key+"\")\'";
				  str+=" data-target='#queryBuider'";
				  str+=" style='text-align:center' class='md-button md-icon-button ng-scope uneditable '>";
				  str+="<i class='material-icons txt_green'>settings</i>";
				  str+="</button>";

			  }else if(key =='access' &&  colObj.display){
				  var td_val="";
				  var ass_survey=[];
				  for(var it=0;it<obj.access.length;it++){
					  td_val+=obj.access[it]+",";
				  } 
				  var compid=key+"__"+obj._id;
				  str+="<input  ";
				  str+=" onmouseover='initAccess(\""+compid+"\")' ";
				  str+=" onfocus='initAccess(\""+compid+"\")' ";
				  str+=" onblur='handleAccess(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\")' ";
				  str+=" type='text' id='"+key+"__"+obj._id+"'";
				  str+=" data-val='"+obj._id+"'";
				  str+=" prevVal='"+td_val+"'";
				  str+=" value='"+td_val+"'";
				  str+="  size='27'>";
				  //setTimeout(function(){ initAccess(compid); }, 1000); 
			  }else if(key =='language'){
				  var tdVal=obj.language[0].name;
				  //console.log(tdVal);
				  if(tdVal==undefined || tdVal==null){
					  tdVal='';
				  }
				  var id=key+"__"+obj._id;

				  str+="<input  type='text' id='"+id+"'";
				  str+=" data-val='"+obj._id+"'";
				  str+=" onmouseover='initLanguage(\""+id+"\")' ";
				  str+=" onfocus='initLanguage(\""+id+"\")' ";
				  str+=" onblur='handleLanguageSelection(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+id+"\")' ";
				  str+=" prevVal='"+tdVal+"'";
				  str+=" value='"+tdVal+"'";
				  str+=" size='27'>";
				  //setTimeout(function(){ initLanguage(id); }, 1000);

			  }else if(fieldtype =='demographic'){
				  var tdVal=obj[key];
				  //console.log(tdVal);
				  if(tdVal==undefined || tdVal==null){
					  tdVal='';
				  }
				  if(rgACIdArr[key]==undefined){
					  rgACIdArr[key]=[]; 
				  }
				  var id=key+"__"+obj._id;
				  rgACIdArr[key].push(id);
				  str+="<input type='text' id='"+id+"'";
				  str+=" data-val='"+obj._id+"'";
				  str+=" onmouseover='initReportGroups(\""+id+"\")' ";
				  str+=" onfocus='initReportGroups(\""+id+"\")' ";
				  str+=" onblur='handleReportGroups(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+id+"\",\""+fieldtype+"\")' ";
				  str+=" prevVal='"+tdVal+"'";
				  str+=" value='"+tdVal+"'";
				  str+=" size='27'>";
				  //setTimeout(function(){ initReportGroups(id); }, 1000);
			  }else if(key=='assigned_survey'){
				  /*var tdVal=obj[key];
			  if(tdVal==undefined || tdVal==null){
				  tdVal=[];
			  }*/
				  var tdVal="";
				  var ass_survey=[];
				  angular.forEach(obj.assigned_survey,function(v,k){
					  ass_survey.push(v.survey_name);
					  tdVal+=v.survey_name+",";
				  });

				  var compid=key+"__"+obj._id;
				  str+="<input class='uneditable' disabled";
				  str+=" onmouseover='initAssignedSurvey(\""+compid+"\")' ";
				  str+=" onfocus='initAssignedSurvey(\""+compid+"\")' ";
				  str+=" onblur='handleAssignedSurvey(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\")' ";
				  str+=" type='text' id='"+key+"__"+obj._id+"'";
				  str+=" data-val='"+obj._id+"'";
				  str+=" prevVal='"+tdVal+"'";
				  str+=" value='"+ass_survey+"'";
				  str+="  size='27'>";
				  //setTimeout(function(){ initAssignedSurvey(compid); }, 1000);
			  }else if(fieldtype =='new'){ 
				  var tdVal=obj[key];
				  if(tdVal==undefined || tdVal==null){
					  tdVal="";
				  }
				  //console.log('tdVal',tdVal)
				  var dataVal=obj._id;
				  var compid=key+"__"+obj._id;
				  var size=" onkeypress=\"this.style.width = ((this.value.length + 1) * 8) + 'px';\"";

				  if(colObj.dataType!='date'){
					  str+="<input data-val='"+dataVal+"' class='sampleinput' type='text' prevVal='"+tdVal+"' value='"+tdVal+"' placeHolder='Empty Field' id='"+compid+"'";
					  str+="onblur='handleOnchange(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\",\""+fieldtype+"\")' ";
					  str+="onfocus='this.style.border=\"1px solid #999\"'";
					  str+="onblur='this.style.border=\"#fff\"'";
					  str+="style='border:0px;padding:5px;'";
					  str+="/>"
				  }else{
					  str+="<input data-val='"+dataVal+"' class='datepicker' type='text' value='"+tdVal+"' prevVal='"+tdVal+"' placeHolder='Select Date' id='"+compid+"'";
					  str+="onchange='handleOnchange(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\",\""+fieldtype+"\")' ";
					  str+="onfocus='this.style.border=\"1px solid #999\"'";
					  str+="onblur='this.style.border=\"#fff\"'";
					  str+="style='border:0px;padding:5px;'";
					  str+="/>"
						  setTimeout(function(){
							  $( ".datepicker" ).datepicker();
						  },0)
				  }

			  }else{ 

				  var tdVal=obj[key];
				  if(tdVal==undefined || tdVal==null){
					  tdVal="";
				  }
				  var dataVal=obj._id;//JSON.stringify(obj);//key+"\t"+obj._id+"\t"+colObj.dataType;
				  var compid=key+"__"+obj._id;
				  var size=" onkeypress=\"this.style.width = ((this.value.length + 1) * 8) + 'px';\"";
				  //newValue,column.field,field._id,column.dataType
				  str+="<input data-val='"+dataVal+"' class='sampleinput' type='text' preVal='"+tdVal+"' value='"+tdVal+"' placeHolder='Empty Field' id='"+compid+"'";
				  //str+=size;
				  //str+=" size='"+tdVal.length+"'";
				  str+="onblur='handleOnchange(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\",\""+fieldtype+"\")' ";
				  str+="onfocus='this.style.border=\"1px solid #999\"'";
				  str+="onblur='this.style.border=\"#fff\"'";
				  str+="style='border:0px;padding:5px;'";
				  str+="/>"
			  }
			  str+="</td>";
		  }else{
			  //do nothing
		  } 
	  }
	  str+="</tr>";
	  //console.log('str',str)
	  $('#myTable tr').eq(1).after(str); 

	  $scope.recLastIndex ++;
	  $scope.total ++;
  }

 $scope.createTableDom=function(){
	 
	  
	  $('#myTable tr:gt(1)').remove();
//	  for(var x=0;x<$scope.data.length;x++){
//    	  var obj=$scope.data[x];
//    	  $('#tr'+obj._id).remove();
//    	  console.log($('#tr'+obj._id))
//	  }
	  
	  colOrderArr=[];
     
      for(var x=0;x<$scope.columns.length;x++){
    	  /*if($scope.columns[x].fieldtype=='new'){
    		  console.log($scope.columns[x])
    	  }*/
    	  //console.log($scope.columns[x]);
    	 colOrderArr.push($scope.columns[x]);
    	 if($scope.columns[x].reportGroupItems!=undefined){
    		 rgACvalue[$scope.columns[x].field]=$scope.columns[x].reportGroupItems;
    	 }
      }
      //var rows = $("#myTable").children('tbody').children('tr');
      
      
      var assignSurveyIds=[];
      for(var x=0;x<$scope.data.length;x++){
    	  var obj=$scope.data[x];
    	  //console.log(obj);
    	  //console.log('obj',JSON.stringify(obj))
    	  var str="";
    	  str+="<tr id='tr"+obj._id+"'>";
    	  for(var z=0;z<colOrderArr.length;z++){
    		  var colObj=colOrderArr[z];
    		  var key=colObj.field;
    		  var fieldtype=colObj.fieldtype;
    		  
    		  //console.log(JSON.stringify(colObj))
    		  
    		  var inlinestyle="";
    		  if(key =='actions' || key =='settings'){
    			  inlinestyle=" style='text-align:center'";
    		  }
    		  if(colObj.display){
    			  str+="<td "+inlinestyle+">";
    			  if(key=='skip'){
    			  }else if(key =='status'){
    				  var statusVal=obj[key];
    				  var dataVal=key+"\t"+obj._id+"\t"+statusVal;
    				  str+="<div class='togglebutton switchmarginl38'>";
    				  str+="<label>";
    				  str+="<input style='opacity:1' type='checkbox' class='statusUpdateClass'";
    				  str+=" data-val='"+obj._id+"'";
    				  str+=" onclick='status_update(\""+obj._id+"\")'";
    				  if(statusVal=='active') str+=" checked ";
    				  str+="/>";
    				  str+="</label>";
    				  str+="</div>";

    			  }else if(key =='actions'){
    				  var suveyAssigned=0;
    				  if(obj["assigned_survey"] && obj["assigned_survey"].length>0){
    					  suveyAssigned=obj["assigned_survey"].length
    				  }
    				  var dataVal=key+"\t"+obj._id+"\t"+suveyAssigned;
    				  str+="<div class='deleteClm'>";
    				  str+="<button type='button'";
    				  str+=" data-val='"+dataVal+"'";
    				  str+="  class='md-button md-icon-button' ";
    				  str+=" onclick='js_removeRow(\""+dataVal+"\")' >";
    				  str+=" <i class='material-icons txt_green'>delete</i></button>";
    				  str+="</div>";

    			  }else if(key =='settings' ){

    				  var disabled="";
    				  var disabledClass="";
    				  if(obj["access"]!=undefined && obj["access"].length==0){
    					  disabled="disabled";
    					  disabledClass="uneditable";
    				  }
    				  var dataVal=key+"\t"+obj._id+"\t"+suveyAssigned;
    				  str+="<button";
    				  str+=" type='button'";
    				  str+=" data-val='"+JSON.stringify(obj)+"'";
    				  str+=" "+disabled;
    				  str+=" data-toggle='modal'";
    				  str+=" id='"+key+"__"+obj._id+"'";

    				  str+=" onclick=\'js_dlaQuerybuilder(\""+obj._id+"\",\""+key+"\")\'";
    				  str+=" data-target='#queryBuider'";
    				  str+=" style='text-align:center' class='md-button md-icon-button "+disabledClass+" ng-scope '>";
    				  str+="<i class='material-icons txt_green'>settings</i>";
    				  str+="</button>";

    			  }else if(key =='access' &&  colObj.display){
    				  var td_val="";

    				  for(var it=0;it<obj.access.length;it++){
    					  td_val+=obj.access[it]+",";
    				  } 
    				  var compid=key+"__"+obj._id;
    				  str+="<input  ";
    				  str+=" onmouseover='initAccess(\""+compid+"\")' ";
    				  str+=" onfocus='initAccess(\""+compid+"\")' ";
    				  str+="onblur='handleAccess(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\")' ";
    				  str+=" type='text' id='"+key+"__"+obj._id+"'";
    				  str+=" data-val='"+obj._id+"'";
    				  str+=" value='"+td_val+"'";
    				  str+=" preVal='"+td_val+"'";
    				  str+="  size='27'>";
    				  //setTimeout(function(){ initAccess(compid); }, 1000);
    			  }else if(key =='language'){
    				  var tdVal=obj.language[0].name;
    				  //console.log(tdVal);
    				  if(tdVal==undefined || tdVal==null){
    					  tdVal='';
    				  }
    				  var id=key+"__"+obj._id;

    				  str+="<input  type='text' id='"+id+"'";
    				  str+=" data-val='"+obj._id+"'";
    				  str+=" prevVal='"+tdVal+"'";
    				  str+=" onmouseover='initLanguage(\""+id+"\")' ";
    				  str+=" onfocus='initLanguage(\""+id+"\")' ";
    				  str+=" onblur='handleLanguageSelection(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+id+"\")' ";
    				  str+=" value='"+tdVal+"'";
    				  str+=" size='27'>";
    				  //setTimeout(function(){ initLanguage(id); }, 1000);
    			  }else if(fieldtype =='demographic'){
    				  var tdVal=obj[key];
    				  //console.log(tdVal);
    				  if(tdVal==undefined || tdVal==null){
    					  tdVal='';
    				  }

    				  if(rgACIdArr[key]==undefined){
    					  rgACIdArr[key]=[]; 
    				  }
    				  var id=key+"__"+obj._id;
    				  rgACIdArr[key].push(id);
    				  str+="<input type='text' id='"+id+"'";
    				  str+=" data-val='"+obj._id+"'";
    				  str+=" prevVal='"+tdVal+"'";
    				  str+=" onmouseover='initReportGroups(\""+id+"\")' ";
    				  str+=" onfocus='initReportGroups(\""+id+"\")' ";
    				  str+=" onblur='handleReportGroups(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+id+"\",\""+fieldtype+"\")' ";
    				  str+=" value='"+tdVal+"'";
    				  str+=" size='27'>";
    				  //setTimeout(function(){ initReportGroups(id); }, 1000);
    			  }else if(key=='assigned_survey'){
    				  /*var tdVal=obj[key];
    			  if(tdVal==undefined || tdVal==null){
    				  tdVal=[];
    			  }*/
    				  var tdVal="";
    				  var disabled="";
    				  var disabledClass="";
    				  // console.log(obj)
    				  if(obj["employeeid"]=="" || obj["email"]=="" || obj["email"]==undefined){
    					  disabled="disabled";
    					  disabledClass="uneditable";
    				  }
    				  var ass_survey=[];
    				  angular.forEach(obj.assigned_survey,function(v,k){

    					  ass_survey.push(v.survey_name);
    					  tdVal+=v.survey_name+",";
    				  });

    				  var compid=key+"__"+obj._id;
    				  str+="<input class='"+disabledClass+"' ";
    				  str+=" "+disabled;
    				  str+=" onmouseover='initAssignedSurvey(\""+compid+"\")' ";
    				  str+=" onfocus='initAssignedSurvey(\""+compid+"\")' ";
    				  str+="onblur='handleAssignedSurvey(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\",\""+fieldtype+"\")' ";
    				  //str+=" onfocus='initAssignedSurvey(\""+compid+"\")' ";
    				  str+=" type='text' id='"+key+"__"+obj._id+"'";
    				  str+=" prevVal='"+tdVal+"'";
    				  str+=" data-val='"+obj._id+"'";
    				  //str+=" onclick='status_update(\""+obj._id+"\")'";
    				  str+=" value='"+tdVal+"'";
    				  str+="  size='27'>";
    				  //setTimeout(function(){ initAssignedSurvey(compid); }, 1000);
    				  //console.log(key+"_"+obj._id)
    			  }else if(fieldtype =='new'){ 
    				  var tdVal=obj[key];
    				  if(tdVal==undefined || tdVal==null){
    					  tdVal="";
    				  }



    				  var dataVal=obj._id;//JSON.stringify(obj);//key+"\t"+obj._id+"\t"+colObj.dataType;
    				  var compid=key+"__"+obj._id;
    				  var size=" onkeypress=\"this.style.width = ((this.value.length + 1) * 8) + 'px';\"";
    				  //newValue,column.field,field._id,column.dataType
    				  if(colObj.dataType!='date'){ 
    					  str+="<input data-val='"+dataVal+"' prevVal='"+tdVal+"' class='sampleinput' type='text' value='"+tdVal+"' placeHolder='Empty Field' id='"+compid+"'";
    					  //str+=size;
    					  //str+=" size='"+tdVal.length+"'";
    					  str+="onblur='handleOnchange(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\",\""+fieldtype+"\")' ";
    					  str+="onfocus='this.style.border=\"1px solid #999\"'";
    					  str+="onblur='this.style.border=\"#fff\"'";
    					  str+="style='border:0px;padding:5px;'";
    					  str+="/>"
    				  }
    				  else{
    					  str+="<input data-val='"+dataVal+"' prevVal='"+tdVal+"' class='datepicker' type='text' value='"+tdVal+"' placeHolder='Select Date' id='"+compid+"'";
    					  //str+=size;
    					  //str+=" size='"+tdVal.length+"'";
    					  str+="onchange='handleOnchange(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\",\""+fieldtype+"\")' ";
    					  str+="onfocus='this.style.border=\"1px solid #999\"'";
    					  str+="onblur='this.style.border=\"#fff\"'";
    					  str+="style='border:0px;padding:5px;'";
    					  str+="/>" 
    						  setTimeout(function(){
    							  $( ".datepicker" ).datepicker();
    						  },0)
    				  } 
    			  }else{ 

    				  var tdVal=obj[key];
    				  if(tdVal==undefined || tdVal==null){
    					  tdVal="";
    				  }


    				  var dataVal=obj._id;//JSON.stringify(obj);//key+"\t"+obj._id+"\t"+colObj.dataType;
    				  var compid=key+"__"+obj._id;
    				  var size=" onkeypress=\"this.style.width = ((this.value.length + 1) * 8) + 'px';\"";
    				  //newValue,column.field,field._id,column.dataType
    				  str+="<input data-val='"+dataVal+"' prevVal='"+tdVal+"' class='sampleinput' type='text' value='"+tdVal+"' placeHolder='Empty Field' id='"+compid+"'";
    				  //str+=size;
    				  //str+=" size='"+tdVal.length+"'";
    				  str+="onblur='handleOnchange(\""+obj._id+"\",\""+key+"\",\""+tdVal+"\",\""+compid+"\",\""+fieldtype+"\")' ";
    				  str+="onfocus='this.style.border=\"1px solid #999\"'";
    				  str+="onblur='this.style.border=\"#fff\"'";
    				  str+="style='border:0px;padding:5px;'";
    				  str+="/>"
    			  }
    			  str+="</td>";
    		  }else{
            //do nothing
          }
    	  }
    	  str+="</tr>";
    	  $("#myTable").children('tbody').append(str);
    	  
    	  if(x==$scope.data.length-1){
    		$timeout(function (){
    			$('.loader').hide();
    		},100)  
    	  }
    	  
    	  
      }
      
      
      if($scope.data.length==0){
    	  $('.loader').hide();
      }
      
    //console.log('rgACIdArr',rgACIdArr)
     
      
      	  
  
 };    
 
 $scope.stopLoader = function () {
	  setTimeout(function() { $(".loader").css("display", "none");}, 2500);
  }
  

  
  /*
   * downloadXls for all fetching of data
   * it incorporate and build json
   * adds sorting, paging and  search logic
   * @ options have
   *@ action refers to
   * */

  $scope.downloadXls = function (action) {
    $scope.runCallBack = false;
    var clientId = getClientId();
    if (clientId == "") {
      Flash.create("danger", "Please Select a Customer");
      return true;
    }

    
    ///console.log($scope.columns.length, '$scope.columns.length');
    var search = [], sort = [], limit, page, pages;

    for (var i = 0; i < $scope.columns.length; i++) {
      ///console.log($scope.columns[i]);
      //sort Array
      if ($scope.columns[i].sort != "") {
        var key = $scope.columns[i].field, val = $scope.columns[i].sort;
        //sort.push({key: val});
        sort.push({field: key, value: val});
      }
      //search array
      if ($scope.columns[i].search != "") {
        var key = $scope.columns[i].field, val = $scope.columns[i].search;
        // search.push({key: val});
        search.push({field: key, value: val});

      }

    }
    ///console.dir($scope.columns);
    ///console.dir('$scope.columns');
    if (action == "search" || action == "reset") {
      $scope.page = $scope.configObj.page;
      $scope.limit = $scope.configObj.limit;
    } else {
      $scope.page = $scope.pagination.currentPage;
    };
    var postData = {
	      			data: {
	      				"clientId": $scope.clientId,
	      				"limit": $scope.limit, "page": $scope.page,
	      				"search": search,
	      				"sort": sort,
	      				"jsonData": $scope.data,
	      				"metaData": $scope.columns,
	      				"queryDla": $localStorage.participantsDlaQuery
	      				, headers: {
	      					"Content-Type": "application/json"
	      				}
	      			}
	      	};
      
    if(action){
    	// callling the service later replace by factory
    	$http.post($scope.configObj.downloadXlsTelmpate, postData).then(function (data) {

    		$scope.downloadFileName = data.data.fileName;
    		$scope.date = new Date();
    		$scope.formattedDate =   $filter('date')($scope.date, "dd-MM-yyyy");
    		$scope.dataJson = data.data.dataJson;
    		var myJsonString = $scope.dataJson;

    		$http.get($scope.configObj.downloadXlsTelmpateFile + "?fileName=" + $scope.downloadFileName, {responseType: 'arraybuffer'}).then(function (data) {
    			$scope.clientname = $localStorage.selectedClientname;
    			var blob = new Blob([data.data],
    					{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    			saveAs(blob,  $scope.clientname + "_user_" +  $scope.formattedDate + ".xlsx");
    			$('#downloadOptions').modal('hide');
    		});
    	});
    }else{

    	$http.post($scope.configObj.downloadDLAXlsmTelmpate, postData).then(function (data) {

    		$scope.downloadFileName = data.data.fileName;
    		$scope.date = new Date();
    		$scope.formattedDate =   $filter('date')($scope.date, "dd-MM-yyyy");
    		$scope.dataJson = data.data.dataJson;
    		var myJsonString = $scope.dataJson;

    		$http.get($scope.configObj.downloadXlsTelmpateFile + "?fileName=" + $scope.downloadFileName, {responseType: 'arraybuffer'}).then(function (data) {
    			$scope.clientname = $localStorage.selectedClientname;
    			var blob = new Blob([data.data],
    					{type: 'application/vnd.ms-excel.sheet.macroEnabled.main+xml'});
    			saveAs(blob,  $scope.clientname + "_user_" +  $scope.formattedDate + ".xlsm");
    			$('#downloadOptions').modal('hide');
    		});
    	});
    }


  };


  /*
   * data mapping function
   * @required columns and to be maaped to mapping(array)
   *
   * */
  $scope.dataMapping = function (dataset, mapping) {
    var dataArray = new Array();
    var rObj = [];
    var reformattedArray = dataset.map(function (obj, i, array) {
      rObj[i] = [];
      for (var j = 0; j < mapping.length; j++) {
        rObj[i][mapping[j].field] = obj[mapping[j].field];
      }
      return rObj;
    });
    //console.dir(reformattedArray);
  };
  //$scope.data = response.data.docs;
  $scope.queryBuilder_v1("reset");
var sortOldindex ='';
var sortValue ='';
  $scope.toggleSort = function (index) {
//	  console.log(sortOldindex,sortOldindex !='', sortOldindex!=index)
	  if(angular.isNumber(sortOldindex)&& sortOldindex!=index){
		  console.log('sortValue',sortValue);
		  $scope.columns[sortOldindex].sort = '';
		  $scope.columns[index].sort = sortValue;
	  }
	  console.log(index,'toggleSort',sortOldindex,sortValue);
    switch ($scope.columns[index].sort) {
      case "":
        $scope.columns[index].sort = -1;
        sortOldindex = index;
        sortValue=-1;
        break;
      case 1:
        $scope.columns[index].sort = -1;
        sortOldindex = index;
        sortValue=-1;
        break;
      case -1:
        $scope.columns[index].sort = 1;
        sortOldindex = index;
        sortValue=1;
        break;
    }
   // console.log($scope.columns[index]);
    $scope.queryBuilder_v1('sort');
  };


  /*
   * clear all filters (sort)
   *
   * */
  $scope.clearSort = function (clearAll) {
    for (var i = 0; i < $scope.columns.length; i++) {
      $scope.columns[i].sort = "";
      if (clearAll != "clearAll") $scope.queryBuilder_v1("reset");
    }
  };


  /*
   * clear all filters (search)
   *
   * */
  $scope.clearSearch = function (clearAll) {
    for (var i = 0; i < $scope.columns.length; i++) {
      $scope.columns[i].search = "";
      if (clearAll != "clearAll") $scope.queryBuilder_v1("search");
    }

  };

  /*
   * clear all filters (search and sort)
   *
   * */
  $scope.clearAll = function () {
    $scope.clearSort("clearAll")
    $scope.clearSearch("clearAll");
    $scope.queryBuilder_v1("search");
  };

  $scope.pageChanged = function () {
	$window.scrollTo(0, 0);
    $scope.queryBuilder_v1('pageChanged');
    $scope.showingPages = $scope.page;
    $scope.recCurrentIndex = (($scope.page - 1) * $scope.limit) + 1;
    $scope.recLastIndex = $scope.recCurrentIndex + $scope.limit - 1;
    if ($scope.recLastIndex > $scope.total) $scope.recLastIndex = $scope.total;

  };
  $scope.recordvalchange=function (getval) {
    $scope.limit=getval;
    $scope.configObj.limit=getval;
    $localStorage.userPage=getval;
    $scope.pagination.currentPage = 1;
    $scope.pageChanged();
  }
  $scope.getLanguage = function(){
	  $http.post($scope.configObj.getLanguages, {
			 data:''
		 }).then(function (response) {
			 $scope.languageArray=response.data.data;
			 languageDataArr=response.data.data;
			 
		 });

  }
  
  $scope.getLanguage();
  
//paging varibles
  $scope.showingPages = $scope.page;
  $scope.recCurrentIndex = (($scope.page - 1) * $scope.limit) + 1;

  $scope.recLastIndex = (($scope.page - 1) * $scope.limit) + $scope.page * $scope.limit;


  $scope.searchChange = function (index, val) {
    //searchChange
    ///console.log("searchChange", index);
    $scope.queryBuilder_v1("search");

  }
  $scope.getLocation = function (val) {
    return $http.post($scope.configObj.queryURL, {
        data: {
          "limit": "5", "page": "1", "search": [{"field": "firstname", "value": val}]
          , headers: {
            "Content-Type": "application/json"
          }
        }
      }
    ).then(function (response) {
      $scope.data = response.data.docs;
      js_Scope_data = $scope.data;
    });

  };

  $scope.toggleDropdown = function () {
    // $event.preventDefault();
    //$event.stopPropagation();//
    // $scope.status.isopen = !$scope.status.isopen;
    ///console.log("ddd");

  };
  $scope.getRowIndex=function(colId){
	  var index='';
	  for (var i = 0; i < $scope.data.length ; i++) {
	        if ($scope.data[i]._id === colId) {
	             return index =i;
	        }
	 }
  }
  
  var sendMail=true;
  var oldParticipant = '';  
   $scope.stopClose = function (field) {
	  if(oldParticipant==''||oldParticipant!=field._id){
		  oldParticipant =field._id 
		  sendMail=true;
	  }
    var index=$scope.getRowIndex(field._id);
    var url = $scope.configObj.updatRoles;
    $http({
		method: 'POST',
		url: url,
		data:$scope.data[index]
	}).then(function successCallback(response) {
		if((!field.usertoken || field.usertoken=='') && email && sendMail ){
//    		console.log('Mail Trigger call testStopclose');
    			sendMail = false;
    		   $scope.sendEmailFunction(field.email);
    	 }
	}, function errorCallback(response) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
	});

  };
  $scope.updateInlieEditEmail = function (newValue, field, id) {
    $scope.runCallBack = false;
    var rowData = $scope.findFieldValuefromData(id);
      if (rowData['employeeid'] && rowData['employeeid'] == "") {
    	  $window.scrollTo(0, 0);
      Flash.create("danger", "Employee ID Required   ");

    }else {
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  if (validateEmail(newValue)) {
    $("#" + id + "_email").css("color", "#212121");
    $http.post($scope.configObj.updateCell, {_id: id, field: field, newValue: newValue}).then(function (response) {
      //console.log(response);
      Flash.create("success", "Email Updated sucessfully");
      $window.scrollTo(0, 0);
      $scope.sendEmailFunction(newValue);
    });
  } else {
    $("#" + id + "_email").css("color", "#FF0000");
    Flash.create("danger", "Invalid Email : " + newValue);
    $window.scrollTo(0, 0);
    $scope.runCallBack = false;

  }
}

  };
  $scope.findFieldValuefromData = function (id) {

    var data = $scope.data;
    var result = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i]['_id'] == id) {
        result = data[i];
      }
    }
//    console.log(' findFieldValuefromData result', result);
//    console.log(' findFieldValuefromData _id', id)
    return result;
  };


  $scope.updateInlieEdit = function (newValue, field, id,columnType,reportGroupItems) {
//	  console.log(newValue);
//	  console.log(field);
    $scope.runCallBack = false;
    var reportGroupItemsVar = (reportGroupItems) ? reportGroupItems : "";
    var rowData = $scope.findFieldValuefromData(id);
//    console.log('rowData', rowData)

      function saveData() {
      var url = $scope.configObj.updateCell;
      if(columnType=='integer' || $scope.newfield.dataType=='integer'){
      	newValue = newValue.toString();
      }

     $http.post(url, {_id: id, field: field, newValue: newValue,clientId:$localStorage.selectedClientid}).then(function (response) {
//        console.log(response);
        if (response.data.result == false) {
          if (field == 'employeeid') {
        $("#" + id ).css("color", "#FF0000");
            Flash.create("danger", "Duplicate  Employee ID,Employee ID must be unique ");
            $window.scrollTo(0, 0);
          } else {
            $("#" + id).css("color", "#FF0000");
            Flash.create("danger", "Required Employee ID ");
            $window.scrollTo(0, 0);
          }
        }
        else $("#" + id).css("color", "#04b109");
        Flash.create("success", "Data Updated ");
        $window.scrollTo(0, 0);
        
      })
      ;
    }
    if (field == "email") {
      if (rowData['employeeid'] != "") {
        $scope.updateInlieEditEmail(newValue, field, id)
      } else {
        Flash.create("danger", "Required Employee ID ");
        $window.scrollTo(0, 0);
      }
    }
    if (field == "language") {
    	 $.each($scope.languageArray, function(index, value) {
//    		 console.log(typeof(newValue))
			  if (newValue== value.name) {
				   newValue = [{
						 'lang_code': value.lang_code,
						 'name': value.name
				  }]
			  }
		  });
        }

    if (field != "email" && field != "employeeid") {
      if (rowData['employeeid'] == "") {
        Flash.create("danger", "Required Employee ID ");
        $window.scrollTo(0, 0);
      } else {
        saveData();
      }
    }
    if (field == "employeeid") {
      if (newValue == "") {
        Flash.create("danger", "Required Employee ID ");
        $window.scrollTo(0, 0);
      } else {

        saveData();
      }
    }

  };
  $scope.sendEmailFunction = function (email) {
    $scope.runCallBack = false;
    var clientdata = {
      'receiver': email,
      'subject': 'Reg:Generate Password',
      'resetlink': $scope.configObj.resetLink,
      'mailBody1': 'We have updated our password storage systems to be more secure and more efficient.',
      'mailBody2': 'Please click the link below to Generate your password so you can login in the future.'
    };


    $http({
      method: 'POST',
      url: $scope.configObj.sendemail,
      data: clientdata
    }).then(function successCallback(response) {
    	console.log('participant Email response',response);
    	if(response.data.type){
    		var updateIndex= $scope.getRowIndex(response.data.updatedParticipant._id);
    		$scope.data[updateIndex].usertoken = response.data.updatedParticipant.usertoken;
    		$scope.runCallBack = false;
    		Flash.create("success", "Email Sent sucessfully");
    		 $window.scrollTo(0, 0);
    	}


    }, function errorCallback(response) {


      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });


  }


// for checkbox
// return type true or false
  $scope.checboxField = function (checkBoxExp) {
//    console.log("checkBoxExp", checkBoxExp);

    if (checkBoxExp == "active" || checkBoxExp == "ACTIVE" || checkBoxExp == "Active") {
      return true;
    } else {
      return false;
    }
  }

// update checkbox field

 $scope.makeAllActive = true;
 $scope.showAllColumns = true;
 $scope.Status=true;
 $scope.updatechecboxFieldAll = function (checkBoxExp, _id) {
	 if ($scope.makeAllActive) {
		 $scope.makeAllActive = false;
	 } else {
		 $scope.makeAllActive = true;
	 }
	 $(".statusUpdateClass").prop("checked", $scope.Status);
	 angular.forEach($scope.data, function (field) {
		 field.status=$scope.makeAllActive?'active':'inactive';
		 $scope.Status =  $scope.makeAllActive;
	 });


	 $http.post($scope.configObj.updateParticipantStatus, {
		 data: {'clientId':$localStorage.selectedClientid,'status':$scope.Status?'active':'inactive'}
	 }).then(function (response) {
		$scope.queryBuilder_v1("");
		 	
		 Flash.create("success", "Status Updated ");
		 $window.scrollTo(0, 0);
	 });

 } 
 
 $scope.updatechecboxField = function(newValue,id){
		$scope.updateInlieEdit(newValue, "status", id);
		for (var i in $scope.data) {
		     if ($scope.data[i]._id == id) {
		    	 $scope.data[i].status = newValue;
		        break; //Stop this loop, we found it!
		     }
		   }
}
 
$scope.showHideColumsClickHandler = function (col,newValue){
	 $.each($scope.columns, function(index, value) { 
		  if (value.field.toLowerCase() == col.field.toLowerCase()) {
			  $scope.columns[index].display = newValue;
			$scope.metaDataSave(getClientId(), '', $scope.columns,true);
			  return ;
		  }
	  });
}

$('#myTable').on("floatThead", function(e, isFloated, $floatContainer){
    if(isFloated){
        $floatContainer.addClass("floated"); // the div containing the table containing the thead
        $(this).addClass("floated"); // $table
        $('#myTable').dragtable('destroy');
    } else {
        $floatContainer.removeClass("floated");
        $(this).removeClass("floated");
        $scope.dragTableInstance(); 
    }
}); 
//to be converted to directive
  $scope.dragTableInstance = function () {
    $('#myTable').dragtable({
      dragaccept: '.accept',
      dragHandle: '.dragHandleCol',
      maxMovingRows:1,
      persistState: function (table) {
        var newOrder = [];
        table.el.find('th').each(function (i) {
          if (this.id != '') {
            newOrder.push(this.id);
            table.sortOrder[this.id] = i;
          }
        });
//        console.dir(table.sortOrder);

        $scope.newColumns = [];
        for (var i = 0; i < newOrder.length; i++) {
          var sortIndex = table.sortOrder[$scope.columns[i].field];
          $scope.newColumns[sortIndex] = $scope.columns[i];
        }
        //angular.copy($scope.newColumns, $scope.columns);
        $scope.$apply(function () {
          angular.copy($scope.newColumns, $scope.columns);
          // $scope.data=$scope.data;
          $(function () {
          });
        });
        $scope.metaDataSave(getClientId(), '', $scope.columns,false);

        $('#myTable').dragtable('destroy');
        // $('#myTable').colResizable({disable:true})
        setTimeout(function () {
          //  $('#myTable').dragtable('destroy');
          //  $('#myTable').dragtable();
          //    $("#myTable").colResizable({partialRefresh: 1});
          /* $('#myTable').colResizable({
              resizeMode:'overflow',
              liveDrag:true,
              headerOnly:true,
              partialRefresh:true,
              onDrag:function () {
                $("#myTable").floatThead('destroy');
              },
              onResize:function () {
                $('#myTable').floatThead({
                  position :'absolute',
                  copyTableClass:true
                });
              }
               });*/
          $scope.dragTableInstance();
        }, 900);
          },
        beforeStart: function() {
          $('#myTable').floatThead('destroy');
        },
        beforeStop:function () {
          $('#myTable').floatThead({
            position :'absolute',
            copyTableClass:true
          });

          // setTimeout(function() {
          //   $("#myTable").colResizable({partialRefresh: 1});
          // }, 900);
      }
    });
      }

  $scope.getRowLanguage=function(colId){
	  var index='';
	  for (var i = 0; i < $scope.languageArray.length ; i++) {
	        if ($scope.languageArray[i].name === colId) {
	             return index =i;
	        }
	 }
  }

  $(document).ready(function () {
    $scope.dragTableInstance();	  
    
  $(document).on('focus click', ".statusUpdateClass",function(event){
	  	var docId=$(event.target).attr("data-val");
	  	//console.log(docId);
	  	if($(event.target).prop('checked')){
	  		 $(event.target).prop('checked', true);
	          //$(event.target).val(true);
	          $scope.updatechecboxField('active',docId);
	      }else{
	          $(event.target).prop('checked', false);
	          //$(event.target).val(false);
	          $scope.updatechecboxField('inactive',docId);
	      }
	  	//console.log('$scope.participantStatusUpdate arg',arg);
	  	//$scope.participantStatusUpdate();
  });

  $(".statusUpdateClass").on("click", function(event){
  	var docId=$(event.target).attr("data-val");
  //	console.log(docId);
  	if($(event.target).prop('checked')){
  		 $(event.target).prop('checked', true);
          //$(event.target).val(true);
          $scope.updatechecboxField('active',docId);
      }else{
          $(event.target).prop('checked', false);
          //$(event.target).val(false);
          $scope.updatechecboxField('inactive',docId);
      }
  	//console.log('$scope.participantStatusUpdate arg',arg);
  	//$scope.participantStatusUpdate();
  });

  $(".statusUpdateClass").bind("click", function(event){
	  	var docId=$(event.target).attr("data-val");
	  	console.log(docId);
	  	if($(event.target).prop('checked')){
	  		 $(event.target).prop('checked', true);
	          //$(event.target).val(true);
	          $scope.updatechecboxField('active',docId);
	      }else{
	          $(event.target).prop('checked', false);
	          //$(event.target).val(false);
	          $scope.updatechecboxField('inactive',docId);
	      }
	  	//console.log('$scope.participantStatusUpdate arg',arg);
	  	//$scope.participantStatusUpdate();
	  });
  
    $(function () {
      //      $("#myTable").colResizable({resizeMode:'overflow'});
      //$("#myTable").colResizable();
      });
  });
  
  $scope.removeParticipantRow = function(){
	  console.log('from $scope.removeParticipantRow');
	 
};


  /*flashmessages
   *
   * */
  $scope.successAlert = function (message, type) {
    if (!type) type = 'success';
    // var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    //var id = Flash.create('success', message, 0, {class: 'custom-class', id: 'custom-id'}, true);
    Flash.create(type, message, 0, {container: 'flash-fixed'});
    // First argument (string) is the type of the flash alert.
    // Second argument (string) is the message displays in the flash alert (HTML is ok).
    // Third argument (number, optional) is the duration of showing the flash. 0 to not automatically hide flash (user needs to click the cross on top-right corner).
    // Fourth argument (object, optional) is the custom class and id to be added for the flash message created.
    // Fifth argument (boolean, optional) is the visibility of close button for this flash.
    // Returns the unique id of flash message that can be used to call Flash.dismiss(id); to dismiss the flash message.
  };

  /**/

////////////////////////////////////////////////////////////////////////////////////////////
//query builder code
  $scope.jQueryBuilder = function (field) {
//	  console.log('Test Field',field);
	  $scope.queryBuider = {
			  fieldId:field._id,
			  firstName:field.firstname,
			  lastName:field.lastname
	  };
    	  var titleText=field.firstname+" "+field.lastname+" (DLA)";
	  $("#queryBuiderModalTitle").text(titleText)
	 // $('#queryBuider'+field._id).modal('show');
	 // console.log('$scope.queryBuider',$scope.queryBuider)
	 //$scope.myScopeObject.index =index; 
	  var outQurery ="";
    	  //field.queryDla=removeslashes(field.queryDla);
	  if(field.queryDla){
//		  console.log(field.queryDla);
		  var str = JSON.parse(field.queryDla);
		  outQurery= JSON.stringify(str).replace("/$and", "$and").replace("/$or", "$or");
//		  console.log(outQurery);
	  }
	  var demographics = $localStorage.metaDataConstant;
	 var newFilters=[];
/*	 newFilters.push(
			  {id:'surveytype',
				  label:'Survey Type',
				  type:'string',
				  input:'select',
				  values:[
					  'Stop',
					  'OA',
					  'Engagement'
					  ]
			  });*/
	  if(demographics.length>0){
		  for(var i=0;i<demographics.length;i++){
			  if(demographics[i].fieldtype && demographics[i].fieldtype.length>0 && demographics[i].fieldtype=='demographic' || demographics[i].fieldtype=='new'){
				  var objFilter = new Object();
				  if(demographics[i].reportGroupItems && demographics[i].reportGroupItems.length>0){
					  objFilter.id= demographics[i].field;
					  objFilter.label = demographics[i].displayName;
					  objFilter.type=demographics[i].dataType;
					  objFilter.input= 'select';
					  objFilter.multiple= true;
					  objFilter.values= demographics[i].reportGroupItems; 
            objFilter.operators=[ 'in', 'not_in'];
				  }else{
					  objFilter.id= demographics[i].field;
					  objFilter.label = demographics[i].displayName;
					  objFilter.type=demographics[i].dataType;
             objFilter.operators= [ 'in', 'not_in'];
				  }
				  if( objFilter){
					  newFilters.push(objFilter)
				  }
			  }
		  }
	  }
//	  console.log(newFilters);
	  $('#builder').queryBuilder({
		  	  
		  filters: newFilters

		});
	  var  mongo_import_export ="";
	  $scope.updateQuery = function () {
		  var result = $('#builder').queryBuilder('getMongo');
		  if (!$.isEmptyObject(result)) {
			  var out = JSON.stringify(result, null, 2);
			  // out = escape(out);
			  mongo_import_export =JSON.parse(addslashes(out));
			  $http({
				  method: 'POST',
				  url: $scope.configObj.updateDla,
				  data:JSON.stringify({_id: field._id,queryDla:JSON.stringify(mongo_import_export)})
			  }).then(function successCallback(response) {
				  Flash.create('success','DLA Saved Successfuly', 2000, {container: 'queryBuilder-Flash'});
				  $window.scrollTo(0, 0);
				  field.queryDla = JSON.stringify(mongo_import_export);
			  }, function errorCallback(response) {
				  // called asynchronously if an error occurs
				  // or server returns response with an error status.
			  });

		  }else{
			  $http({
				  method: 'POST',
				  url: $scope.configObj.updateDla,
				  data:JSON.stringify({_id: field._id,queryDla:''})
			  }).then(function successCallback(response) {
				  Flash.create('success','DLA Saved Successfuly', 2000, {container: 'queryBuilder-Flash'});
				  $window.scrollTo(0, 0);
				  field.queryDla = JSON.stringify(mongo_import_export);
			  }, function errorCallback(response) {
				  // called asynchronously if an error occurs
				  // or server returns response with an error status.
			  });
		  }
	  }
	  function addslashes(string) {
		    return string.replace('$and', '\/$and').
		        replace('$or', '\/$or');
		}
	  function removeslashes(string) {
		    return string.replace("/$and", "$and").
		        replace("/$or", "$or");
		}
	  $('#builder').queryBuilder('reset');
	  if(outQurery && outQurery.length>0){
		  buildQuery(outQurery);
	  }
	  function buildQuery(queryInput) {
		  $('#builder').queryBuilder('setRulesFromMongo', JSON.parse(queryInput));
		};
	  
  // $("#queryBuider").modal('show');

  }

///////////////////////////////////////////////////////////////////////////////////////////

////contexmenu
  /*$scope.apllyContextMenu = function () {
    $(".context").contextmenu({
      target: '#context-menu',
      before: function (e, context) {
        // addParticipant()
        console.log($(e.target).text());
        // execute code before context menu if shown
      },
      onItem: function (context, e) {
        alert($(e.target).html());
      }
    });
  }*/
//Add Participant 
       $scope.addParticipant = function () {
    		//Check Empty Record
    		$http({
    	        method: 'POST',
    	        url: $scope.configObj.checkEmployeeId,
    	        data:JSON.stringify({'clientId':$scope.clientId})
    	      }).then(function (data) {
    	        //console.log("true",data.data.employeeid)
    	         $scope.checkEmployee=data;
    	         if(data.data.employeeid!='' && data.data.employeeid) {
    	        	 var addPaticiantRowSave = {};
    	             /*for (var key in $scope.data[1]) {
    	               addPaticiantRowSave[key] = '';
    	             }*/
                   addPaticiantRowSave['email'] = "";
    	             addPaticiantRowSave['employeeid'] = "";
    	             addPaticiantRowSave['firstname'] = "";
    	             addPaticiantRowSave['lastname'] = "";
    	             addPaticiantRowSave['status'] = "active";
    	             addPaticiantRowSave['language'] = [{
    	             'lang_code': 'en',
    	             'name': 'English'
    	             }];
                  // console.log($localStorage.loginDetails.dlaQuery)
                    if($localStorage.loginDetails.dlaQuery!=undefined && $localStorage.loginDetails.dlaQuery !=null){
                     angular.forEach($localStorage.loginDetails.dlaQuery, function (val, key) {
                      angular.forEach(val, function (vala, keya) {
                        angular.forEach(vala, function (vala1, keya1) {
//                        	console.log(keya1,'  keya')
                         if(angular.isArray(vala)){
                        		 angular.forEach(vala1, function (vala2, keya2) {
                                   addPaticiantRowSave[keya1]=vala2[0];
                                 });
                        	}else{
                            angular.forEach(vala1, function (val, key1) {
                             if (angular.isArray(val)) {
                            	 if(key1=='$in'){
                            		 addPaticiantRowSave[keya1]=val[0];
                            	 }else{
                            		 addPaticiantRowSave[keya1]='';
                            	 }
//                                 console.log(val[0], key1)
                             }else{
                              angular.forEach(val, function (v1, k1) {
                                angular.forEach(v1, function (v2, k2) {
                                if(k2=="$in"){
                                	addPaticiantRowSave[k1]=v2[0];
                                }else{
                                	addPaticiantRowSave[k1]='';
                                }
                                })
                              })
                             }
                            });
                        		
                        	}
                        });
                      });
                    });
                  }
                   
    	             addPaticiantRowSave['access'] = []; 
                    addPaticiantRowSave['assigned_survey'] = []; 
    	             delete addPaticiantRowSave._id;
    	             delete addPaticiantRowSave.__v;
    	             addPaticiantRowSave.clientId = getClientId(); 
    	             addPaticiantRowSave.cdt=new Date();
    	             addPaticiantRowSave.mdt=new Date();
//    	             console.log("getClientId",getClientId)
    	               $http({
    	               method: 'POST',
    	               url: $scope.configObj.crateParticipant,
    	               data: addPaticiantRowSave
    	             }).then(function (data) {
    	            	 $window.scrollTo(0, 0);
    	               $scope.data.push(data.data)
    	               $scope.js_addParticipants();
    	              // $scope.queryBuilder_v1("add client");
    	                 });
    	         } else {
                 alertMessage('Please enter employee id for existing participants', 'danger', 2000); 
    	        	 //Flash.create("danger", "Please enter employee id for existing participants");
    	        	 $window.scrollTo(0, 0);
    	         }
    	          });
    			var tableHeight = angular.element('.mdtTableContainer').height();
    	              tableHeight += 50;  
    	              
    	              setTimeout(function(){
    	            	  if($("#paginateDiv").length){
    	    	        	$window.scrollTo(0,$("#paginateDiv").position().top);
    	            	  }
    	    	            	   //console.log($("#paginateDiv").position().top);
                             //$scope.queryBuilder_v1('addParticipants');
    	    	        },500);
    	       }; 

 angular.element(document).on('click','.deleteClm button',function(){
     $scope.queryBuilder_v1('pageChanged');
  }); 
// Remove Participant
$scope.removeRow = function(field){		
  if(field[2]=='' || field[2]=='0'){
	  var index=$scope.getRowIndex(field[1]);
	  $scope.data.splice( index, 1 );	
	  Flash.create("success", "participant deleted");
	  $window.scrollTo(0, 0);

 $http({
				  method: 'POST',
				  url: $scope.configObj.removePartcipants,
				  data:JSON.stringify({_id: field[1]})
			  }).then(function successCallback(response) {
				 
			  }, function errorCallback(response) {

			  });


  }
  else{
      Flash.create("danger", "survey is mapped hence cannot be deleted");
      $window.scrollTo(0, 0);
  }
	};
  
// get client Id
  var getClientId = function () {
    return $localStorage.selectedClientid;
  };


}).factory('urlBuilder', function ($httpParamSerializer) {
  function buildUrl(url, params) {
    var serializedParams = $httpParamSerializer(params);

    if (serializedParams.length > 0) {
      url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
    }

    return url;
  }

  return buildUrl;
});

angular.module('spApp').directive('search', function () {
  return function ($scope, element) {
    element.bind("keyup", function (event) {
      var val = element.val();
      var index = element.id;
      if (val.length > 1) {
        $scope.searchChange(index, val);
      }
    });
  };
});

angular.module('spApp').directive('myDirective', function (httpPostFactory, $localStorage, Flash) {
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, element, attr) {

      element.bind('change', function () {
        var formData = new FormData();
        formData.append('file', element[0].files[0]);
        formData.append('clientId', $localStorage.selectedClientid);
        //httpPostFactory('http://localhost:3010/api/participants/uploadXls/', formData, function (callback) {
          httpPostFactory(serverURL+'/api/participants/uploadXls/', formData, function (callback) {
          // recieve image name to use in a ng-src
          Flash.create("info", "File uploaded SucessFully!");
          $window.scrollTo(0, 0);
//          console.log(callback);
        });
      });

    }
  };
});

angular.module('spApp').factory('httpPostFactory', function ($http) {
  return function (file, data, callback) {
    $http({
      url: file,
      method: "POST",
      data: data,
      headers: {'Content-Type': undefined}
    }).success(function (response) {
      callback(response);
    });
  };
});


function disableAssignedSurvey(docid){
	$("#assigned_survey__"+docid).attr("disabled","true");
	$("#assigned_survey__"+docid).addClass("uneditable");
	window.scrollTo(0, 0);
}

function enableAssignedSurvey(docid){
	$("#assigned_survey__"+docid).removeAttr("disabled");
	$("#assigned_survey__"+docid).removeClass("uneditable");
	window.scrollTo(0, 0);
}

function handleOnchange(id,field,newValue,compid,fieldtype){
	// console.log(id,field,newValue)
	newValue=$("#"+compid).val();
	
	var prevVal=$("#"+compid).attr("prevVal");
	//console.log('newValue',newValue,'prevVal',prevVal);
  	if(newValue==prevVal){
  		return;
  	}
  	
	//var obj=document.getElementById(compid);
	var emp_status=$("#tr"+id).attr("emp-status");
	if(field=='employeeid'&& newValue.trim()==""){
		alertMessage('Employee ID is required','danger');
		$("#tr"+id).attr("emp-status","empty");
		disableAssignedSurvey(id);
		return;
	}
	
	if(field!='employeeid' && emp_status!=undefined && emp_status!=''){
		if(emp_status=='duplicate'){
			alertMessage('Employee ID exist','danger');
		}else if(emp_status=='empty'){
			alertMessage('Employee ID is required','danger');
		}
		window.scrollTo(0, 0);		
	}else{
		
		//disable survey --start
		var emailVal=$("#email__"+id).val().trim();
		var empidVal=$("#employeeid__"+id).val().trim();
		if(empidVal!="" && js_validateEmail(emailVal)){
			enableAssignedSurvey(id);
		}else{
			disableAssignedSurvey(id);
		}
		//disable survey --end
		
		if(field=='email' && emailVal!="" && !js_validateEmail(newValue)){
			alertMessage('Invalid email','danger');
			window.scrollTo(0, 0);
			return;
		}
		
		
		$.ajax({
			url : js_updateCell,		
				data : {_id: id, field: field, newValue: newValue,clientId:js_clientId,fieldtype:fieldtype}
			,
			type : "post",
			dataType : "json",
			success : function(data1) {
				if(field=='employeeid'){
					if(!data1.result){
						//$("#"+compid).val(obj.defaultValue);
						$("#tr"+id).attr("emp-status","duplicate");
						alertMessage('Employee ID exist','danger');	
					}else{
						//obj.defaultValue=newValue;
						$("#tr"+id).attr("emp-status","");
						$("#"+compid).attr("prevVal",newValue);
						alertMessage('Data updated','success');
					}
				}else{
					$("#"+compid).attr("prevVal",newValue);
					alertMessage('Data updated','success');
				}
	    
			},
			error : function(request, status, errorThrown) {
				console.log(request, status);
			}

		});
		
	}
	
	
}

function handleReportGroups(id,field,newValue,compid,fieldtype){
	//console.log('field',field,'fieldtype',fieldtype)
	newValue=$("#"+compid).val();
	var prevVal=$("#"+compid).attr("prevVal");
	//console.log('newValue',newValue,'prevVal',prevVal);
  	
  	if(newValue==prevVal){
  		return;
  	}
//	console.log(id,field,newValue, compid)
	var comparevalue=false;
	//console.log(rgACvalue[field])
	var emp_status=$("#tr"+id).attr("emp-status");
	for(var x=0;x<=rgACvalue[field].length;x++){
		if(rgACvalue[field][x]==newValue){
			comparevalue=true;
			break;
		}
	}
	if(comparevalue==false){
		newValue='';
		$("#"+compid).val('');
	}
	if(field!='employeeid' && emp_status!=undefined && emp_status!=''){
		if(emp_status=='duplicate'){
			alertMessage('Employee ID exist','danger');
			window.scrollTo(0, 0);
		}else if(emp_status=='empty'){
			alertMessage('Employee ID is required','danger');
			window.scrollTo(0, 0);
		}
				
	}else{
		$.ajax({
			url : js_updateCell,		
				data : {_id: id, field: field, newValue: newValue,fieldtype:fieldtype}
			,
			type : "post",
			dataType : "json",
			success : function(data1) {
				//console.log('success',data1);
				$("#"+compid).attr("prevVal",newValue)
				alertMessage('Data updated','success');
				window.scrollTo(0, 0);
			},
			error : function(request, status, errorThrown) {
				console.log(request, status);
			}

		});
	}
	
}
 function getRowData(colId){
	  var index='';
	  for (var i = 0; i < js_Scope_data.length ; i++) {
	        if (js_Scope_data[i]._id === colId) {
	             return index =js_Scope_data[i];
	        }
	 }
}

function handleAssignedSurvey(id,field,newValue,compid){
	newValue=$("#"+compid).val();
	var prevVal=$("#"+compid).attr("prevVal");
	//console.log('newValue',newValue,'prevVal',prevVal);
  	if(newValue==prevVal){
  		return;
  	}
  	
	var emp_status=$("#tr"+id).attr("emp-status");
	if(field!='employeeid' && emp_status!=undefined && emp_status!=''){
		if(emp_status=='duplicate'){
			alertMessage('Employee ID exist','danger');
		}else if(emp_status=='empty'){
			alertMessage('Employee ID is required','danger');
		}
		window.scrollTo(0, 0);
		return;
	}
	var surveyArr=[];
	if(newValue!=undefined && newValue!=""){
		if(newValue.indexOf(",")==-1){
			newValue=newValue+",";
		}
		surveyArr=newValue.split(",");
	}
	var surveysMapped={};
//	console.log('customerSurveyDataKeyValue',customerSurveyDataKeyValue)
	for(var z=0;z<surveyArr.length;z++){
		var surveyName=surveyArr[z];
		if(surveyName!=undefined && surveyName!=null && surveyName.trim()!=""){
			if(customerSurveyDataKeyValue[surveyName.trim()]!=undefined){
				surveysMapped[customerSurveyDataKeyValue[surveyName.trim()]]=surveyName.trim();
				//console.log(surveyArr[z])
			}
		}
	}
	var displayStr="";
	for(var key in surveysMapped){
		displayStr+=(surveysMapped[key]+",");
	}
	//$("#"+compid).val(displayStr)
	//console.log("surveysMapped",surveysMapped);

	var surveyParams={};
    surveyParams.clientId=js_clientId;
    surveyParams.clientname=js_clientname;
    surveyParams.participant_id=id;
    surveyParams.participantInfo=getRowData(id);
    surveyParams.surveyData=surveysMapped;
    
    
    $.ajax({
		url : js_serverURL + "/api/participants/mapParticipantToSurveyInstance/",		
		//data : {clientId: js_clientId, participant_id: id, "surveysMapped": tmp},
		data : {
			data : JSON.stringify(surveyParams)
		},
		type : "post",
		dataType : "json",
		success : function(data1) {
			$("#"+compid).val(data1);
			$("#"+compid).attr("prevVal",data1);
			// console.log('handleAssignedSurvey','success',data1);
			alertMessage('Data updated','success');
			window.scrollTo(0, 0);
		},
		error : function(request, status, errorThrown) {
			console.log(errorThrown);
		}

	});
}


function initReportGroups(compid) {
    var rgKey = compid.substring(0, compid.indexOf("__"));
    if (rgACvalue[rgKey] != undefined) {
        $("#" + compid).autocomplete({
                source: rgACvalue[rgKey],
                minLength: 0,
                select: function(event, ui) {
                    //           console.log(ui,'moses');
                    $(this).val(ui.item.value);
                    $(this).trigger('change');
                }
            })
            .focus(function() {
                $(this).autocomplete("search");
            })
            .keyup(function() {
                if (event.keyCode === $.ui.keyCode.TAB) $(this).autocomplete("search");
                //$(this).autocomplete("search");
            });
    }
}

var languageData=[];
function initLanguage(compid){
 if($( "#"+compid ).attr("class")!=undefined && $("#"+compid).attr("class").indexOf('ui-autocomplete-input')>0) return;
	if(languageData.length==0){
		for(var key in languageDataArr){
			languageData.push(languageDataArr[key].name)
			langDataKeyValue[languageDataArr[key].name]=languageDataArr[key].lang_code;
		}
	}
	 $( "#"+compid ).autocomplete({
     	  source: languageData,
 minLength:0,
         select: function( event, ui ) {
//        	 console.log(ui,'carthi');
        	 $(this).val(ui.item.value);
             $(this).trigger('change');
          } 
	 })
   .focus(function () {
            $(this).autocomplete("search");})
            .keyup(function () {
           if (event.keyCode === $.ui.keyCode.TAB) $(this).autocomplete("search");});
}


function handleLanguageSelection(id,field,newValue,compid){
	newValue=$("#"+compid).val();
	//console.log('newValue',newValue)
	var prevVal=$("#"+compid).attr("prevVal");
	//console.log('newValue',newValue,'prevVal',prevVal);
  	if(newValue==prevVal){
  		return;
  	}
	var emp_status=$("#tr"+id).attr("emp-status");
	if(field!='employeeid' && emp_status!=undefined && emp_status!=''){
		if(emp_status=='duplicate'){
			alertMessage('Employee ID exist','danger');
		}else if(emp_status=='empty'){
			alertMessage('Employee ID is required','danger');
		}
		window.scrollTo(0, 0);
		return;
	}
	var langArr=[];
	if(newValue!=undefined && newValue!=""){
		if(newValue.indexOf(",")==-1){
			newValue=newValue+",";
		}
		langArr=newValue.split(",");
	}
	//console.log("langArr",langArr)
	//console.log('langDataKeyValue', langDataKeyValue)
	var langMapped=[];
	for(var z=0;z<langArr.length;z++){
		var langName=langArr[z];
		if(langName!=undefined && langName!=null && langName.trim()!=""){
			if(langDataKeyValue[langName.trim()]!=undefined){
				var obj={'lang_code': langDataKeyValue[langName.trim()], "name": langName.trim()}
				langMapped.push(obj);
			}
		}
	}
	
	
	//console.log("langMapped",langMapped);
	if(langMapped.length==0){
		var obj={'lang_code': 'en', "name": "English"}
		langMapped.push(obj)
	}
	var displayStr="";
	for(var x=0;x<langMapped.length;x++){
		displayStr=langMapped[x]["name"];
	}
	
	$("#"+compid).val(displayStr);
	var dataObj={};
	dataObj["langMapped"]=langMapped;
	dataObj["id"]=id;
	//console.log('JSON.stringify(dataObj)',JSON.stringify(dataObj))
	$.ajax({
		url : js_updateLanguage,	
		data : {
			data : JSON.stringify(dataObj)
		},
		type : "post",
		dataType : "json",
		success : function(data1) {
			$("#"+compid).attr("prevVal",displayStr)
		alertMessage('Data updated','success');
		},
		error : function(request, status, errorThrown) {
			console.log(request, status);
		}

	});
	
	 
}


function handleAccess(id,field,newValue,compid){
	newValue=$("#"+compid).val();
	
	var prevVal=$("#"+compid).attr("prevVal");
	//console.log('newValue',newValue,'prevVal',prevVal);
  	if(newValue==prevVal){
  		return;
  	}
	var emp_status=$("#tr"+id).attr("emp-status");
	if(field!='employeeid' && emp_status!=undefined && emp_status!=''){
		if(emp_status=='duplicate'){
			alertMessage('Employee ID exist','danger');
		}else if(emp_status=='empty'){
			alertMessage('Employee ID is required','danger');
		}
		window.scrollTo(0, 0);
		return;
	}
	
	var surveyArr=[];
	if(newValue!=undefined && newValue!=""){
		if(newValue.indexOf(",")==-1){
			newValue=newValue.trim()+",";
		}
		surveyArr=newValue.split(",");
	}

	var insertArr=[];
	for(var x=0;x<surveyArr.length;x++){
		var tmpobj=surveyArr[x].trim();
		if(js_accessArray.indexOf(tmpobj)!=-1){
			insertArr.push(tmpobj);
		}
	}
	if(insertArr.length==0){
		$("#settings__"+id).attr("disabled","true");
		$("#settings__"+id).addClass("uneditable");
	}else{
		$("#settings__"+id).removeAttr("disabled");
		$("#settings__"+id).removeClass("uneditable");
	}
	var dataObj={};
	dataObj["access"]=insertArr;
	dataObj["id"]=id;
	$("#"+compid).val(insertArr);
	//console.log('JSON.stringify(dataObj)',JSON.stringify(dataObj))
	$.ajax({
		url : js_updatRoles,	
		data : {
			data : JSON.stringify(dataObj)
		},
		type : "post",
		dataType : "json",
		success : function(data1) {
			$("#"+compid).attr("prevVal",insertArr);
			alertMessage('Data updated','success');
			
      if (data1.value.usertoken==undefined && data1.value.email!=undefined) {
        var clientdata = {
        	'participantId':data1.value._id,
            'receiver': data1.value.email,
            'subject': 'Reg:Generate Password',
            'resetlink': js_resetLink,
            'mailBody1': 'We have updated our password storage systems to be more secure and more efficient.',
            'mailBody2': 'Please click the link below to Generate your password so you can login in the future.'
        };        
        $.ajax({
          url:js_sendmail,
          data:clientdata,
          type:'post',
          dataType:'json',
          success:function (data) {
            // alertMessage('Email Sent sucessfully','success');
            // window.scrollTo(0, 0);
          },
          error:function (data) {
            console.log('mail cannot be sended');
          }
        })
      }
		},
		error : function(request, status, errorThrown) {
			console.log(request, status);
		}

	});
 
}



function initAccess(compid){
	if($( "#"+compid ).attr("class")!=undefined && $("#"+compid).attr("class").indexOf('ui-autocomplete-input')>0) return; 
	 $( "#"+compid)
    // don't navigate away from the field on tab when selecting an item
    .on( "keydown", function( event ) {
      if ( event.keyCode === $.ui.keyCode.TAB &&
          $( this ).autocomplete( "instance" ).menu.active ) {
        event.preventDefault();
      }
    })
    .autocomplete({
      minLength: 0,
      source: function( request, response ) {
        // delegate back to autocomplete, but extract the last term
        response( $.ui.autocomplete.filter(
        		js_accessArray, request.term.split( /,\s*/ ).pop() ) );
      },
      focus: function() {
        // prevent value inserted on focus
        return false;
      },
      select: function( event, ui ) {
        var terms =this.value.split( /,\s*/ ); 
        // remove the current input
        terms.pop();
        // add the selected item
        if(terms.indexOf(ui.item.value)==-1){
          terms.push( ui.item.value );
        }
        // add placeholder to get the comma-and-space at the end
        terms.push( "" );
        this.value = terms.join( ", " );
          $(this).trigger('change');
        return false;
      }
   })
    .focus(function () {
      $(this).autocomplete("search");
    }).keyup(function () {
     if (event.keyCode === $.ui.keyCode.TAB) $(this).autocomplete("search");
    });
}
function js_removeRow(param){
	var paramArr=param.split("\t");
	var id=paramArr[1];
	var surveyMappedCount=paramArr[2];
	
	 //console.log('js_removeurl',js_removeurl)
	$.ajax({
		url : js_removeurl,	
		 data:{_id: id,clientId:js_clientId},
		type : "post",
		dataType : "json",
		success : function(data1) {
    
      if(Object.keys(data1).length==0){
        alertMessage('Participant deleted sucessfully','success');
        $("#tr"+id).remove();
      }else{
        alertMessage('Survey(s) Mapped to this participant','danger');
        window.scrollTo(0, 0);
      }
			
			//window.location.reload();
	//console.log('success',data1)
		},
		error : function(request, status, errorThrown) {
			console.log(errorThrown);
		}

	});
}


function initAssignedSurvey(compid){
	if($( "#"+compid ).attr("class")!=undefined && $("#"+compid).attr("class").indexOf('ui-autocomplete-input')>0) return; 
	 $( "#"+compid)
     // don't navigate away from the field on tab when selecting an item
     .on( "keydown", function( event ) {
       if ( event.keyCode === $.ui.keyCode.TAB &&
           $( this ).autocomplete( "instance" ).menu.active ) {
         event.preventDefault();
       }
     })
     .autocomplete({
       minLength: 0,
       source: function( request, response ) {
         // delegate back to autocomplete, but extract the last term
         response( $.ui.autocomplete.filter(
       		  customerSurveyData, request.term.split( /,\s*/ ).pop() ) );
       },
       focus: function() {
         // prevent value inserted on focus
         return false;
       },
       select: function( event, ui ) {
         var terms =this.value.split( /,\s*/ ); 
         // remove the current input
         terms.pop();
         // add the selected item
         if(terms.indexOf(ui.item.value)==-1){
           terms.push( ui.item.value );
         }
         // add placeholder to get the comma-and-space at the end
         terms.push( "" );
         this.value = terms.join( ", " );
      
         return false;
       }
         }).focus(function () {
            $(this).autocomplete("search");
           }).keyup(function () {
            if (event.keyCode === $.ui.keyCode.TAB) $(this).autocomplete("search");
           });
}

function status_update(param){ 
	var id=param,
		activeVal;
	 //console.log('js_removeurl',js_removeurl)
	if($(this).prop('checked')){
		 activeVal='active';
      } else {
          activeVal='inactive';;
     }
	 
	 $.ajax({
		url : js_updateurl,	
		data:{_id: id,field: 'status', newValue: activeVal},
		type : "post",
		dataType : "json",
		success : function(data1) {
			alertMessage('Status Updated', 'success'); 
		},
		error : function(request, status, errorThrown) {  
			alertMessage('Error', 'danger'); 
		}
     });
}
function alertMessage(content, type, time) {
  if(time==undefined){
    var timeout=2000;
  }else{
    var timeout=time;
  }
  $('.flash_alert').show();
  var message=content.charAt(0).toUpperCase() + content.substr(1);
  $('.dinamicText').text(message);
  $('#alertType').addClass('alert-'+type);  
  setTimeout(function() {
    $('.flash_alert').hide();
    $('#alertType').removeClass('alert-'+type); 
  }, timeout);
};
function alertMessagePopup(content, type, time) {
  if(time==undefined){
    var timeout=2000;
  }else{
    var timeout=time;
  }
  $('.flash_alert1').show();
  var message=content.charAt(0).toUpperCase() + content.substr(1);
  $('.dinamicText').text(message);
  $('#alertType1').addClass('alert-'+type);  
  setTimeout(function() {
    $('.flash_alert1').hide();
    $('#alertType').removeClass('alert-'+type); 
  }, timeout);
}; 
var tmp_outQurery="";
var js_selectedFieldObj={};
var js_dlacompid="";
function js_dlaQuerybuilder(compid,key){
  //compid=key+"__"+compid;
  js_dlacompid=key+"__"+compid;;
  var field=getRowData(compid);
//  console.log(field);
  tmp_outQurery="";
  js_selectedFieldObj={};
  if(field!=undefined && Object.keys(field).length>0){
    js_selectedFieldObj=field;
  }
  
  
   var queryBuider = {
			  fieldId:field._id,
			  firstName:field.firstname,
			  lastName:field.lastname
	  };
    var titleText=field.firstname+" "+field.lastname+" (DLA)";
	  $("#queryBuiderModalTitle").text(titleText);
	  //console.log('field.queryDla',field.queryDla)
	  if(field.queryDla){
		  var str = JSON.parse(field.queryDla);
		  tmp_outQurery= JSON.stringify(str).replace("/$and", "$and").replace("/$or", "$or");
	  }
	  var demographics = JSON.parse(localStorage.getItem('ngStorage-metaDataConstant'));
	  var newFilters=[];
    if(demographics.length>0){
		  for(var i=0;i<demographics.length;i++){
			  if(demographics[i].fieldtype && demographics[i].fieldtype.length>0 && demographics[i].fieldtype=='demographic' || demographics[i].fieldtype=='new'){
				  var objFilter = new Object();
				  if(demographics[i].reportGroupItems && demographics[i].reportGroupItems.length>0){
					  objFilter.id= demographics[i].field;
					  objFilter.label = demographics[i].displayName;
					  objFilter.type=demographics[i].dataType;
					  objFilter.input= 'select';
					  objFilter.multiple= true;
					  objFilter.values= demographics[i].reportGroupItems; 
            objFilter.operators=[ 'in', 'not_in'];
				  }else{
					  objFilter.id= demographics[i].field;
					  objFilter.label = demographics[i].displayName;
					  objFilter.type=demographics[i].dataType;
             objFilter.operators= [ 'in', 'not_in'];
				  }
				  if( objFilter){
					  newFilters.push(objFilter)
				  }
			  }
		  }
	  }
    $('#builder').queryBuilder({
		  filters: newFilters
		});
    if(tmp_outQurery!=null && tmp_outQurery!=""){
      //console.log('tmp_outQurery',tmp_outQurery)
      $('#builder').queryBuilder('setRulesFromMongo', JSON.parse(tmp_outQurery));
    }else{
      $('#builder').queryBuilder('reset');
    }
     
}

function js_updateQuery(){
   var  mongo_import_export ="";
 // console.log('js_dlacompid',js_dlacompid)
   var result = $('#builder').queryBuilder('getMongo');
  //console.log('result',result)
 // if(tmp_outQurery="" && tmp_outQurery.length>0){
       //$('#builder').queryBuilder('setRulesFromMongo', JSON.parse(tmp_outQurery));
	 //}
   //console.log('tmp_outQurery',tmp_outQurery)
  //console.log('Object.keys(result).length',Object.keys(result).length);
  if (Object.keys(result).length>0) {
	  var out = JSON.stringify(result, null, 2);
		mongo_import_export =JSON.parse(out.replace('$and', '\/$and').replace('$or', '\/$or'));
    //console.log('mongo_import_export',mongo_import_export)
    var dataObj={};
    dataObj["_id"]=js_selectedFieldObj._id;
    dataObj["queryDla"]=mongo_import_export;
    
    	//console.log(dataObj);
    	$.ajax({
		    url : js_updateDla,	
        data:{_id: js_selectedFieldObj._id,queryDla:JSON.stringify(mongo_import_export)},
		    type : "post",
		    //dataType : "json",
		    success : function(data1) {
		      window.scrollTo(0, 0);
          //console.log('data1',data1)
          js_selectedFieldObj.queryDla = data1;
          $("#"+js_dlacompid).attr("data-val",JSON.stringify(js_selectedFieldObj));
          alertMessagePopup('DLA saved successfully', 'success'); 
			    //console.log('success',data1)
	    	},
		    error : function(request, status, errorThrown) {
			  console.log(errorThrown);
		}

	  });
   
  }else{
    	$.ajax({
		    url : js_updateDla,	
        data:{_id: js_selectedFieldObj._id,queryDla:''},
		    type : "post",
		    //dataType : "json",
		    success : function(data1) {
		      window.scrollTo(0, 0);
          //console.log('data1',data1)
          js_selectedFieldObj.queryDla = data1;
          $("#"+js_dlacompid).attr("data-val",JSON.stringify(js_selectedFieldObj));
          alertMessagePopup('DLA saved successfully', 'success'); 
	    	},
		    error : function(request, status, errorThrown) {
			  console.log(errorThrown);
		}

	  });
   
  }
  //$('#builder').queryBuilder('reset');
}
function js_addslashes(string) {
		    return string.replace('$and', '\/$and').
		        replace('$or', '\/$or');
}
function js_removeslashes(string) {
		    return string.replace("/$and", "$and").replace("/$or", "$or");
}
	  
function js_buildQuery(queryInput) {
		  $('#builder').queryBuilder('setRulesFromMongo', JSON.parse(queryInput));
}
function js_validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }