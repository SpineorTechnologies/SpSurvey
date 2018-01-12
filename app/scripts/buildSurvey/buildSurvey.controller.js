'use strict';
/**
 * @ngdoc function
 * @name spApp.controller:buildSurveyController
 * @description
 * # buildSurveyController
 * Controller of the spApp
 */

var dispArr={};
//var nodeuri='http://192.168.1.5:3000';

//var nodeuri='http://localhost:3000';
var spApp=angular.module('spApp');
spApp.controller('buildSurveyController', ['$stateParams','$state','orderByFilter','$filter','envsetting','loginService','$scope','$location','$http','$timeout','$rootScope','$localStorage','Flash', function($stateParams,$state,orderBy,$filter,envsetting,loginService,$scope,$location,$http,$timeout,$rootScope,$localStorage,Flash) {
	$scope.reportGroupMappings={};
	
Flash.clear();	
if($localStorage.metaDataConstant){
	for(var z=0;z<$localStorage.metaDataConstant.length;z++){
		if($localStorage.metaDataConstant[z]["fieldtype"]=='demographic' || $localStorage.metaDataConstant[z]["fieldtype"]=='new'){
			$scope.reportGroupMappings[$localStorage.metaDataConstant[z].field]=$localStorage.metaDataConstant[z].reportGroupItems;
		}
	}
}

var defaultTemplates={
 "Engagement" : "Engagement", 
 "Exit" :"Exit",
 "New Hire":"New Hire",
  "Oa":"Oa",
  "Stay":"Stay"
};

	//process demo mapping -- start
	$scope.demoMappingAnsChoices=[];
	$scope.includeInDashboardModel={};
	var glbl_demographics = JSON.parse(localStorage.getItem('ngStorage-metaDataConstant'));
	var newFilters=[];
	var glbl_rg2rgi={};
	$scope.demoMappingRgs=[];
	$scope.selectedDemoMappingRgs={};
	$scope.selectedDemoMappingRgItems={};
	$scope.selectedDemoMappingRgItem={};
	$scope.selectedDemoMappingRgItemsYN={};
	$scope.selectedDemoMappingRgItemYN={};
	$scope.demoMappingRgItems={};
	
    if(glbl_demographics.length>0){
		for(var i=0;i<glbl_demographics.length;i++){
			if(glbl_demographics[i].fieldtype && glbl_demographics[i].fieldtype.length>0 && glbl_demographics[i].fieldtype=='demographic' || glbl_demographics[i].fieldtype=='new'){
				if(glbl_demographics[i].reportGroupItems!=undefined){
					glbl_demographics[i].reportGroupItems.unshift("");
				}
				glbl_rg2rgi[glbl_demographics[i].field]=glbl_demographics[i].reportGroupItems;
				var newobj={};
				newobj.field=glbl_demographics[i].field;
				newobj.displayName=glbl_demographics[i].displayName;
				$scope.demoMappingRgs.push(newobj);
			}
		}
	}
	//process demo mapping -- end
	$scope.reportGroupMappingModel={};

	
	//Category slide -start
	$scope.slides2Scroll=4;
	$scope.currentIndex=0; 
	//Category slide -end
	// language variable --start
	$scope.default_language_key='en';
	$scope.language_key='en';
	$scope.language_codes={};
	// language variable --end
	//message tab --start
	 $scope.email_subject={};
	 $scope.email_greet={};
	 $scope.email_url={};
	 $scope.sms_greet={};
	 $scope.sms_url={};
	 
	 
	 $scope.email_body={};
	    
	 $scope.sms_body={};
	 $scope.email_greet[$scope.default_language_key]="Hi";
	 $scope.email_url[$scope.default_language_key]="Please click on the link";
	 $scope.email_subject[$scope.default_language_key]="";
	 $scope.email_body[$scope.default_language_key]="I created a new survey on strategic programs.\nThanks for participating";
	 
	 $scope.sms_greet[$scope.default_language_key]="Hi ";
	 $scope.sms_url[$scope.default_language_key]="Please click on the link";
	 $scope.sms_body[$scope.default_language_key]="I created a new survey on strategic programs.\nThanks for participating";
	//message tab --end
		var serverURL= envsetting.client.serverUrl;//$location.protocol() + '://'+ $location.host() +':3010';
	
		$scope.configObj = {};
		$scope.configObj.loadSurveyTemplates = serverURL+"/api/surveys/loadSurveyTemplates/";
		$scope.configObj.saveCustomerSurvey = serverURL+"/api/surveys/saveCustomerSurvey/";
		$scope.configObj.sendSurveysToParticipants = serverURL+"/api/surveys/sendSurveysToParticipants/";
		$scope.configObj.fetchResponsesByQuestion = serverURL+"/api/surveys/fetchResponsesByQuestion/";
		$scope.configObj.fetchResponsesByCategory= serverURL+"/api/surveys/fetchResponsesByCategory/";
	/*For Dynamic url Generation END*/
	$scope.searchQuestNCatObj={};	
	$scope.category_description={};	
	$scope.questions2Save = {};
	$scope.answers2Save={};
	$scope.subQuest2Save={};
	$scope.rankedAns2Save={};
	$scope.editedCategoryNames={};
	/*$scope.questions2SaveMulti = {};
	$scope.answers2SaveMulti={}*/
	$scope.showAnswerset={};
	$scope.TEMPLATE_QUESTIONS=[];
	// $scope.clientId=$localStorage.loginDetails.clientId+"";
	$scope.clientId=$localStorage.selectedClientid +'';
	$scope.survey_name="";
	$scope.survey_description="";
	$scope.survey_type_id="";
	$scope.product_type_id="";
	$scope.categoryBySurveyType={};
	var newResponseData={};
    var initData={};
    var newQuesIdx=0;
    var newCatIdx=0;
    var questions4Search={};
    var categoryOrderTemplates={};
	$scope.saveFromTabNavigate="";
    $scope.product_types={};
	$rootScope.USER_PREFERENCES={};
	$scope.survey_id="";
	$scope.answer_sets={};
	$scope.subquestionsave={};
	$scope.saveDisplay='true';
	$scope.toggleDistributesms=$localStorage.loginDetails.smsEnable+'';
	//console.log("$localStorage.loginDetails",$localStorage.loginDetails);
	if(!$rootScope.USER_PREFERENCES.BUILD_SURVEY){
		$rootScope.USER_PREFERENCES.BUILD_SURVEY={};
		$rootScope.USER_PREFERENCES.BUILD_SURVEY['preferred_language']='en';
    }
	
	
	$scope.setPlaceHolder2=function(defaultText){
		if(!spApp.formatStr($scope.survey_name.trim())){
			$scope.survey_name="";
		}
	}
	
	$scope.setSurveyDescPlaceHolder=function(defaultText){
		if(!spApp.formatStr($scope.survey_description.trim())){
			$scope.survey_description="";
		}
	}
	angular.element('.loader').show();
	$scope.demoReportGroup=[];
	$scope.demoReportGroupItems={};
	$scope.selectedDemoReportGroupItems=[];
	$scope.selectedRg="";
	$scope.selectedRgItm="";
	$scope.responseDemographicMappings={};
	$scope.initResponseRgmappings=function(){
		for(var z=0;z<$localStorage.metaDataConstant.length;z++){
			if($localStorage.metaDataConstant[z]["fieldtype"]=='demographic'){
				var rg=$localStorage.metaDataConstant[z]["displayName"];
				$scope.demoReportGroup.push(rg);
				var rgitems=$localStorage.metaDataConstant[z]["reportGroupItems"];
				$scope.demoReportGroupItems[rg]=rgitems;
			}
		}
	}
	
	$scope.initResponseRgmappings();
	$http({
		method : "POST",
		url : $scope.configObj.loadSurveyTemplates
	    }).then(function mySucces(response) {
	    	$scope.categoryTabs=[];
	    	
	    	$scope.initEditData();
	    	
	    	newResponseData=JSON.parse(JSON.stringify(response.data));
	    	//multi language --start
	    	$scope.product_types=response.data['product_types'];
	    	
	    	$scope.language_codes=response.data['language_codes'];
	    	$scope.answer_sets=response.data['answer_sets'];
	    	
	    	//autocomplete set init value--start
	    	var lang_ac_default_id=$.grep($scope.language_codes, function(obj){
	            return obj.lang_code === $scope.default_language_key;
	    	})[0]._id;
	    	if(!$scope.tags){
	    		
	    		$scope.tags=[{_id:lang_ac_default_id,
					lang_code:"en",
					name:"English",
					active:true}]; 
	    	}
	    	
	    	//autocomplete set init value--end
	    	
	    	//autocomplete start
	    	$scope.loadLanguages = function($query) {
	    		var languages = response.data['language_codes'];
	    	      return languages.filter(function(language) {
	    	    	  return language.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
	    	     });
	    	 };
  			$scope.languages=response.data['language_codes'];
			  for(var z=0;z<$scope.tags.length;z++){
				  var srchObj=$.grep($scope.language_codes, function(obj){
	            		return obj.lang_code === $scope.tags[z].lang_code;
				  })[0];
				  if(srchObj){
					  var index= $scope.language_codes.indexOf(srchObj);
					  $scope.language_codes.splice(index,1);
				  }
				  
			  }
			  
			$scope.showsurveyname=true;
			$scope.showSelectedLangs="yes";
			$scope.mandatoryMessage="";
			$scope.displayname=function(tabname){
				$scope.mandatoryMessage="";	
				Flash.clear();
				if($scope.emptyCatFound){
					$scope.mandatoryMessage="Category name cannot be empty";
				}
					
				if (tabname=='distribute') {
					$scope.showSelectedLangs="no";
					var emptySubArr=[];
					angular.forEach($scope.tags,function(value,key){
						if(!$scope.email_subject[value.lang_code]){
							emptySubArr.push(value.lang_code);
						}
					});	
					if(emptySubArr.length>0 && tabname=='distribute'){
						$scope.mandatoryMessage="Email subject cannot be blank"
					}
				}else{
					$scope.showSelectedLangs="yes";
				}
					$scope.showsurveyname=true;
					if ($scope.survey_name==''){
						$scope.mandatoryMessage="Please enter the Survey Name"
					}else if ($scope.product_type_id=='Survey'){
						$scope.mandatoryMessage="Please enter the Survey Type"
					}else{
						var quesfound=false;
						angular.forEach($scope.categoryTabs,function(value,key){
								if($scope.categoryBySurveyType[value.category_id].length>0){
									quesfound=true;		
								}
						});
						if(!quesfound){
							$scope.mandatoryMessage="Please select questions";
						}
					}	
									
					
					if($scope.mandatoryMessage && tabname!='design'){
						angular.element('#validationsurveyname').modal('show');
					}else{
						$scope.showsurveyname='';
						$scope.saveFromTabNavigate="yes";
						$scope.saveCustomerSurvey();	 
				 	if (tabname=='message') {
						Flash.clear();
		                var build_survey_container = angular.element( ".content_block" );
		                var window_height= angular.element(window).height();
		                var build_survey_container_position = build_survey_container.offset();
		                var content_blockheight = angular.element(window).height() - build_survey_container_position.top;
		               // angular.element(".build_survey_cnt").height(content_blockheight);	
		                //angular.element(".build_survey_cnt").height(content_blockheight+50);
		                $timeout(function(){
		                	// var w1=angular.element(window).height();
		                	// if($('.message_inner').height()>angular.element(window).height()){
		                	// 	w1=$('.message_inner').height();
		                	// }
		                	// var tmp=w1+$('.message_inner').offset().top;
		                	// console.log('tmp',tmp)
		                	//angular.element(".build_survey_cnt").height('90%');
		                	angular.element(".build_survey_cnt").height(content_blockheight+480);
		                },0)
		                angular.element(".build_survey_lft").css("width", "0px");
		                angular.element("#expand_btn").css("display", "none");
		                angular.element(".build_survey_rgt").css("width", "100%");
						$scope.distributestorage=$localStorage.SURVEY_OBJ2EDIT.distribute; 
				 	}else if (tabname=='distribute') {
						 	$scope.enableSendSurvey=false;
						 if(angular.element("#distribute_startDate").val() && angular.element("#distribute_endDate").val()){
							 $scope.enableSendSurvey=true;
						 }
						var build_survey_container = angular.element( ".content_block" );
		                var window_height= angular.element(window).height();
		                var build_survey_container_position = build_survey_container.offset();
		                var content_blockheight = angular.element(window).height() - build_survey_container_position.top;
				 		angular.element(".build_survey_cnt").height(content_blockheight+350);
	                    angular.element(".build_survey_lft").css("width", "0px");
	                    angular.element("#expand_btn").css("display", "none");
	                    angular.element(".build_survey_rgt").css("width", "100%");
				 	}else{
						  Flash.clear();
						  $scope.showsurveyname=true;
					 }
					}
					
				 
			 } 

			  //autocomplete-end
	    	//multi language --end	
			$scope.TEMPLATE_QUESTIONS=newResponseData["base_questions"];
	    	initData=spApp.prepareDataSet(newResponseData,$scope.default_language_key,newCatIdx);
	    	$scope.answer_sets=newResponseData['answer_sets'];
	    	categoryOrderTemplates=newResponseData['categoryOrderTemplates'];
	    	questions4Search=initData["questions4Search"];
			$scope.rows=newResponseData['rows'];
	    	$scope.surveyTypes=initData['surveyTypes'];
	    	$scope.categories=initData['categories'];
			$scope.categoryOrderProperty='name.'+$scope.default_language_key+'[0]';
			$scope.categories=orderBy($scope.categories,$scope.categoryOrderProperty,false,true);
	    	$scope.categoryKeyValue=initData['categoryKeyValue'];
	    	$scope.surveyTypesKeyValue=initData['surveyTypesKeyValue'];
	    	
			//editcat --start
			angular.forEach($scope.categoryKeyValue,function(value,key){
				angular.forEach(value,function(value2,key2){
					if($scope.editedCategoryNames[key+"\t"+key2]){
						$scope.editedCategoryNames[key+"\t"+key2]=value2[value2.length-1];
					}
	    		});
			});
			//editcat --end
	    	angular.forEach(initData['category_description'],function(value,key){
	    		angular.forEach(value,function(value2,key2){
	    			$scope.category_description[key+"\t"+key2]=value2;	
	    		});
			});
	    	
	    	angular.element('.loader').hide();
			$scope.loadfun();
		}, function myError(response) {
			angular.element('.loader').hide();
		       console.log("response.statusText:"+response.statusText);
		});
		//search -start
	
	
	$scope.initEditData=function(){
		if(Object.keys($localStorage.SURVEY_OBJ2EDIT).length>0 && $localStorage.SURVEY_OBJ2EDIT && $localStorage.SURVEY_OBJ2EDIT._id){
			$scope.rankedAns2Save={};
			if($localStorage.SURVEY_OBJ2EDIT.lastInsertIndex!=undefined){
				newQuesIdx=$localStorage.SURVEY_OBJ2EDIT.lastInsertIndex;
			}
			
    		if($localStorage.SURVEY_OBJ2EDIT.message){
    			
    			$scope.email_greet=$localStorage.SURVEY_OBJ2EDIT.message.email_greet;
    			$scope.email_url=$localStorage.SURVEY_OBJ2EDIT.message.email_url;
    			$scope.sms_greet=$localStorage.SURVEY_OBJ2EDIT.message.sms_greet;
    			$scope.sms_url=$localStorage.SURVEY_OBJ2EDIT.message.sms_url;
    			
    			$scope.email_subject=$localStorage.SURVEY_OBJ2EDIT.message.email_subject;
	    		$scope.email_body=$localStorage.SURVEY_OBJ2EDIT.message.email_body;
	    		$scope.sms_body=$localStorage.SURVEY_OBJ2EDIT.message.sms_body;
    		}else{
    			$localStorage.SURVEY_OBJ2EDIT.message={};
    			$localStorage.SURVEY_OBJ2EDIT.message.email_greet=$scope.email_greet;
    			$localStorage.SURVEY_OBJ2EDIT.message.email_url=$scope.email_url;
    			$localStorage.SURVEY_OBJ2EDIT.message.sms_greet=$scope.sms_greet;
    			$localStorage.SURVEY_OBJ2EDIT.message.sms_url=$scope.sms_url;
    			
    			
    			$localStorage.SURVEY_OBJ2EDIT.message.email_subject=$scope.email_subject;
	    		$localStorage.SURVEY_OBJ2EDIT.message.email_body=$scope.email_body;
	    		$localStorage.SURVEY_OBJ2EDIT.message.sms_body=$scope.sms_body;
	    		
	    		
    			
    		}
    		
    		$scope.categoryBySurveyType={};
    		$scope.survey_id=$localStorage.SURVEY_OBJ2EDIT._id;
    		$scope.survey_description=$localStorage.SURVEY_OBJ2EDIT.survey_description;
			$scope.product_type_id=$localStorage.SURVEY_OBJ2EDIT.survey_type;
			$scope.survey_type_id=$localStorage.SURVEY_OBJ2EDIT.survey_type;
			$scope.survey_name=$localStorage.SURVEY_OBJ2EDIT.survey_name;
			$scope.tags=$localStorage.SURVEY_OBJ2EDIT.language_codes;
			angular.forEach($localStorage.SURVEY_OBJ2EDIT.language_codes,function(value,key){
				if(value.lang_code=="en"){
					value.active=true;
				}else{
				value.active="";
				}
			});
			$scope.Questions=[]
			$scope.categoryTabs=[];
			var surveyQues=$localStorage.SURVEY_OBJ2EDIT.survey_questions;
			
			angular.forEach(surveyQues,function(value,key){
				var quesObj2edit=JSON.parse(JSON.stringify(value));
				
				var catId="_catId"+(++newCatIdx);
				var tmpObj={};
				tmpObj.category_id=catId;
				var catDesc=quesObj2edit[0].category.category_description;
				angular.forEach(catDesc,function(value,key){
					$scope.category_description[catId+"\t"+key]=value;
				});
				angular.forEach(quesObj2edit[0].category,function(value,key){
					$scope.editedCategoryNames[catId+"\t"+key]=value[0];
				});									
				tmpObj.name=quesObj2edit[0].category;					
				$scope.categoryBySurveyType[catId]=quesObj2edit;
				$scope.categoryTabs.push(tmpObj);
				
				for(var q=0;q<quesObj2edit.length;q++){
					//console.log('quesObj2edit',JSON.stringify(quesObj2edit[q].demographicResponseMappings))
					if(quesObj2edit[q].reportGroupMappings){
						$scope.reportGroupMappingModel[quesObj2edit[q]._id+"\t"+catId]=quesObj2edit[q].reportGroupMappings;
					}
					
					//process demo mapping -- start
					if(quesObj2edit[q].includeInDashboard==undefined){
						$scope.includeInDashboardModel[quesObj2edit[q]._id+"\t"+catId+"\t"+$scope.default_language_key]=true;
					}else if(quesObj2edit[q].includeInDashboard){
						$scope.includeInDashboardModel[quesObj2edit[q]._id+"\t"+catId+"\t"+$scope.default_language_key]=true;
					}else{
						$scope.includeInDashboardModel[quesObj2edit[q]._id+"\t"+catId+"\t"+$scope.default_language_key]=false;
					}
					if(quesObj2edit[q].question_type=="Yes/No"){
					//console.log(JSON.stringify(quesObj2edit[q]))
					}
					
					if(quesObj2edit[q].demographicResponseMappings!=undefined){
						var demographicResponseMappingsObj=quesObj2edit[q].demographicResponseMappings;
						if(demographicResponseMappingsObj.rg!=undefined){
							$scope.selectedDemoMappingRgs[quesObj2edit[q]._id+"\t"+$scope.default_language_key]=demographicResponseMappingsObj.rg;
							if(quesObj2edit[q].question_type=="Single Select"){		
								for(var _rgItemKey in demographicResponseMappingsObj.rgItems){
									var _rgitemidxitems=quesObj2edit[q].answer_set[$scope.default_language_key];
									var _rgitemidx="";
									var _jkey="";
									var _rgitemidxitemsArray = $.map(_rgitemidxitems, function(value, index) {
									    return [value];
									});

									for(var jkey in _rgitemidxitems){
										if(_rgitemidxitems[jkey]==_rgItemKey){
											_rgitemidx=jkey;
											_jkey=jkey;
											break;
										}
									}
//									console.log(_jkey,'test_rgitemidx',_rgitemidx);
									/*for(var jk=0;jk<_rgitemidxitemsArray.length;jk++){
										if(_rgitemidxitemsArray[jk]==_rgItemKey){
											_rgitemidx=jk+'';
											_jkey=jk+'';
											break;
										}
									}*/
//									//console.log(_jkey,'_rgitemidx',_rgitemidx);
									/*console.log('demographicResponseMappingsObj.rgItems',JSON.stringify(demographicResponseMappingsObj.rgItems))
									console.log('quesObj2edit[q].answer_set[$scope.default_lanquesObj2edit[q]._id+"\t"+_rgitemidx+"\t"+$scope.default_language_keyguage_key]',JSON.stringify(quesObj2edit[q].answer_set[$scope.default_language_key]))
									console.log('demographicResponseMappingsObj.rg',demographicResponseMappingsObj.rg,_rgitemidx,_rgItemKey,demographicResponseMappingsObj.rgItems[_rgItemKey])
									console.log(quesObj2edit[q]._id+"\t"+_rgitemidx+"\t"+$scope.default_language_key)*/
				  					if(_rgitemidx!=""){
				  						$scope.selectedDemoMappingRgItem[quesObj2edit[q]._id+"\t"+_rgitemidx+"\t"+$scope.default_language_key]=demographicResponseMappingsObj.rgItems[_rgItemKey]
				  						$scope.selectedDemoMappingRgItems[quesObj2edit[q]._id+"\t"+_jkey+"\t"+$scope.default_language_key]=demographicResponseMappingsObj.rgItems[_rgItemKey];
//				  						console.log('$scope.selectedDemoMappingRgItems',JSON.stringify($scope.selectedDemoMappingRgItems))
				  					}
								}
						}else if(quesObj2edit[q].question_type=="Yes/No"){
							for(var _rgItemKey in demographicResponseMappingsObj.rgItems){
									var _rgitemidxitems=quesObj2edit[q].answer_set[$scope.default_language_key];
									var _rgitemidx="";
									var _jkey="";
									var _jkeycount=1;
									for(var jkey in _rgitemidxitems){
										if(_rgitemidxitems[jkey]==_rgItemKey){
											_rgitemidx=jkey;
											_jkey=jkey;
											break;
										}
										++_jkeycount;
									}
									/*console.log('demographicResponseMappingsObj.rgItems',JSON.stringify(demographicResponseMappingsObj.rgItems))
									console.log('quesObj2edit[q].answer_set[$scope.default_lanquesObj2edit[q]._id+"\t"+_rgitemidx+"\t"+$scope.default_language_keyguage_key]',JSON.stringify(quesObj2edit[q].answer_set[$scope.default_language_key]))
									console.log('demographicResponseMappingsObj.rg',demographicResponseMappingsObj.rg,_rgitemidx,_rgItemKey,demographicResponseMappingsObj.rgItems[_rgItemKey])
									console.log(quesObj2edit[q]._id+"\t"+_rgitemidx+"\t"+$scope.default_language_key)*/
				  					if(_rgitemidx!=""){
				  						$scope.selectedDemoMappingRgItemYN[quesObj2edit[q]._id+"\t"+_jkeycount+"\t"+$scope.default_language_key]=demographicResponseMappingsObj.rgItems[_rgItemKey]
				  						$scope.selectedDemoMappingRgItemsYN[quesObj2edit[q]._id+"\t"+_jkey+"\t"+$scope.default_language_key]=demographicResponseMappingsObj.rgItems[_rgItemKey];
				  						//console.log('$scope.selectedDemoMappingRgItemsYN',JSON.stringify($scope.selectedDemoMappingRgItemsYN))
										// console.log('$scope.selectedDemoMappingRgItemYN',JSON.stringify($scope.selectedDemoMappingRgItemYN))
				  					}
								}	

						}
							
					}
						
					}
					//process demo mapping -- start
					
					
					
				}
				
			});
			
			
			//console.log('$scope.categoryTabs[0])',$scope.categoryTabs[0])
		if($scope.categoryTabs[0]){
				$scope.category_id=$scope.categoryTabs[0].category_id;
				$scope.dispQuesByCat(0,$scope.categoryTabs[0]);
    		}

		}
	}
		$scope.srchResultsArr=[];
		
		$scope.searchTemplateQuestions=function(){
			$scope.srchResultsArr=[];
			angular.forEach(questions4Search,function(val,key){
				var srchidx=key.toLowerCase().indexOf($scope.search_text.toLowerCase());
				if(srchidx>=0){
					$scope.srchResultsArr.push(val);
				}
			});
			
		}
		$scope.searchTemplateQuestions2=function(){
			$scope.srchResultsArr=$.grep($scope.TEMPLATE_QUESTIONS, function(obj){
				var tmpStr="";
				if(obj.text[$scope.language_key]){
					tmpStr=obj.text[$scope.language_key][obj.text[$scope.language_key].length-1];
				}
				tmpStr=tmpStr.trim();
				if(!tmpStr){
					return false;
				}
				var srchidx=tmpStr.toLowerCase().indexOf($scope.search_text.toLowerCase());
				
				if(srchidx>=0){
					return true;
				}else{
					return false;
				}
	    	});
		}
		$scope.appendSearchQuestions=function(){
			
			if(!$scope.category_id){
				Flash.clear();
				Flash.create('danger','Create a Category to Add Questions',4000, {container: 'flash-fixed-Question',id:'search_flash'}); 
				return;
			}
			if($scope.default_language_key==$scope.language_key){
				var existingQuesArr=[];
				var questionFound=false;
				var questionFoundInEdited=false;
				var droppedQuesText=$scope.droppedSearchQuestion.text[$scope.default_language_key][$scope.droppedSearchQuestion.text[$scope.default_language_key].length-1].trim();
				//angular.forEach($scope.categoryTabs,function(catObj,key){
				for(var dupkey in $scope.categoryTabs){
					var tmpArr=[];
					var catObj=$scope.categoryTabs[dupkey];
					var questByCatObj4search=$scope.categoryBySurveyType[catObj.category_id];
					if (questByCatObj4search!=undefined && questByCatObj4search!=null) {
						for(var x=0;x<questByCatObj4search.length;x++){
							var txt=questByCatObj4search[x]["text"][$scope.language_key][questByCatObj4search[x]["text"][$scope.language_key].length-1];
							var editedQues2=spApp.formatStr(txt);
							if(editedQues2.toLowerCase()==droppedQuesText.toLowerCase()){
								Flash.clear();
								Flash.create('danger','Question Already Exists',4000, {container: 'flash-fixed-Question',id:'question_flash'});
								questionFound=true;
								break;
							}
						}
					}
					if(questionFound){
						break;
					}
				}
				
				for(var x=0;x<$scope.Questions.length;x++){
					var existingQuestion=$scope.Questions[x];
					var existingQuesText=existingQuestion.text[$scope.default_language_key][existingQuestion.text[$scope.default_language_key].length-1].trim();
					if($scope.questions2Save[existingQuestion._id+'\t'+existingQuestion.category_id+'\t'+$scope.default_language_key]){
						var editedQues=spApp.formatStr($scope.questions2Save[existingQuestion._id+'\t'+existingQuestion.category_id+'\t'+$scope.default_language_key]);
						existingQuesText=editedQues;
					}
					if(existingQuesText==droppedQuesText){
						Flash.clear();
						Flash.create('danger','Question Already Exists',4000, {container: 'flash-fixed-Question',id:'question_flash'});
						questionFound=true;
						break;
					}
				}
				
				if(!questionFound){
					var newQues=JSON.parse(JSON.stringify($scope.droppedSearchQuestion));
					//console.log('$scope.droppedSearchQuestion',JSON.stringify($scope.droppedSearchQuestion))
					newQues._id="newques_"+(++newQuesIdx)+"_"+$scope.category_id;
					if($scope.droppedSearchQuestion.base_question_id){
						newQues._id=$scope.droppedSearchQuestion.base_question_id;
					}
					if($scope.category_id && $scope.category_id.indexOf("_newcat_")==-1){
						//console.log('$scope.category',$scope.categoryBySurveyType[$scope.category_id]);
						if($scope.categoryBySurveyType[$scope.category_id][0]){
							newQues.category=JSON.parse(JSON.stringify($scope.categoryBySurveyType[$scope.category_id][0].category));
						}
						
					}else{
						if($scope.categoryTabs){
							for(var z=0;z<$scope.categoryTabs.length;z++){
								var obj=$scope.categoryTabs[z];
								if(obj){
									if(obj.category_id==$scope.category_id){
										newQues.category=obj.name;
										break;
									}
								}
								
							}
						}
						
					}
					$scope.Questions.push(newQues);
					$("#ques_block").animate({ scrollTop: $('#ques_block').prop("scrollHeight")}, 1000); 
				}
			}
		}
		//search-end
		
		//change answer items w.r.t to answer set --start
			$scope.setAnswerScale=function(item){
				angular.forEach($scope.answer_sets,function(value,key){
				  	if(value._id=item._id){				  		
				  	}
				});
			}		
		//change answer items w.r.t to answer set --start
		//change data w.r.t to langauge code --start
		$scope.setLanguageKey=function(item,obj){
			//#3132 -- start
			$scope.search_text="";
			//#3132 -- end
			//console.log(item);
			angular.forEach($scope.tags,function(value,key){
				if(item==value){
					if(item.active==true){
						$scope.language_key=item.lang_code;	
						//item.active="";
						// $scope.tags[0].active=true;
						// $scope.language_key=$scope.tags[0].lang_code;
						// console.log($scope.language_key);
					}
					else{
						item.active=true;
						$scope.language_key=item.lang_code;					
						}
				}
				else{
					value.active="";
				}	
				});
				//$scope.language_key=item.lang_code;
			
			//message tab --start
			
			if(!$scope.email_greet[$scope.language_key]){
				$scope.email_greet[$scope.language_key]="";
			}
			if(!$scope.email_url[$scope.language_key]){
				$scope.email_url[$scope.language_key]="";
			}
			if(!$scope.sms_greet[$scope.language_key]){
				$scope.sms_greet[$scope.language_key]="";
			}
			if(!$scope.sms_url[$scope.language_key]){
				$scope.sms_url[$scope.language_key]="";
			}
			
			if(!$scope.email_subject[$scope.language_key]){
				$scope.email_subject[$scope.language_key]="";
			}
			if(!$scope.email_body[$scope.language_key]){
				$scope.email_body[$scope.language_key]="";
			}
			if(!$scope.sms_body[$scope.language_key]){
				$scope.sms_body[$scope.language_key]="";
			}
			//message tab --end
			
			var quesByCatArr=$scope.categoryBySurveyType[$scope.category_id];

			angular.forEach($scope.questions2Save, function(value, key) {	
				var arr=key.split("\t");
				var x=0;
				var obj2edit={};
				for(;x<quesByCatArr.length;x++){
					if(quesByCatArr[x]._id ==arr[0]){
						obj2edit=quesByCatArr[x];
						break;
					}
				}
				if(obj2edit.text){
					if(obj2edit.text[arr[2]]){
						obj2edit.text[arr[2]][obj2edit.text[arr[2]].length-1]=spApp.formatStr(value);
					}else{
						var tmparr=[];
						obj2edit.text[arr[2]]=tmparr;
						obj2edit.text[arr[2]][0]=spApp.formatStr(value);
					}
					
				}
				
			});
			
		
			angular.forEach($scope.answers2Save, function(value, key) {
				var ansText=$scope.answers2Save[key];
				//console.log('ansText',ansText)
				var arr=key.split("\t");
				var ansObj2edit={};
				for(var x=0;x<quesByCatArr.length;x++){
					if(quesByCatArr[x]._id ==arr[0]){
						ansObj2edit=quesByCatArr[x];
						break;
					}
				}
				var ans_index=arr[1];
				if(ansObj2edit._id==arr[0]){
					if(ansObj2edit.answer_set[arr[3]]){
						ansObj2edit.answer_set[arr[3]][ans_index]=spApp.formatStr(ansText);
					}else{
						ansObj2edit.answer_set[arr[3]]={};
						ansObj2edit.answer_set[arr[3]][ans_index]=spApp.formatStr(ansText);
					}
					
				}
			});	
			angular.forEach($scope.subquestionsave, function(value, key) {
			//console.log("inside save sub qurestion for loop",value, key)
				var subText=$scope.subquestionsave[key];
					// /console.log("sdxf",subText)
				var arr=key.split("\t");
				var subObj2edit={};
				for(var x=0;x<quesByCatArr.length;x++){
					if(quesByCatArr[x]._id ==arr[0]){
						
						subObj2edit=quesByCatArr[x];
						break;
				//	console.log("inside save sub qurestion for loop",subObj2edit)
					}
				}
				var sub_index=arr[1];
				if(subObj2edit._id==arr[0]){
				//	console.log("inside save sub qurestion if",subObj2edit)
					if(subObj2edit.rows[arr[3]]){
						subObj2edit.rows[arr[3]][sub_index]=spApp.formatStr(subText);
					}else{
						subObj2edit.rows[arr[3]]={};
						subObj2edit.rows[arr[3]][sub_index]=spApp.formatStr(subText);
					}
				}
				
			});
			$scope.Questions=[];
			$timeout(function(){
				$scope.Questions=$scope.categoryBySurveyType[$scope.category_id];
				if(!$scope.category_description[$scope.category_id+'\t'+$scope.language_key]){
					$scope.category_description[$scope.category_id+'\t'+$scope.language_key]="Category Description";
				}
				//editcat --start
				angular.forEach($scope.editedCategoryNames,function(val,key){
				var keyArr=key.split("\t");
				//console.log($scope.editedCategoryNames[keyArr[0]+"\t"+$scope.language_key]);
				if(!$scope.editedCategoryNames[keyArr[0]+"\t"+$scope.language_key]){
					$scope.editedCategoryNames[keyArr[0]+"\t"+$scope.language_key]="";
					//$scope.editedCategoryNames[keyArr[0]+"\t"+$scope.language_key]=$scope.editedCategoryNames[keyArr[0]+"\t"+$scope.default_language_key];
				}
				});
				//editcat --end
					
			},0);
			
		}
		//change data w.r.t to langauge code --end
		//format survey name-start
		$scope.nameformat = function(text, size) {
	    	return spApp.formatStr(text);
		};
		//format survey name-end
		$scope.js_updateQuery=function(){
			 var  questionsFilterQuery ="";
			 var result = $('#builder').queryBuilder('getMongo');
			if(result) {
	  			var out = JSON.stringify(result, null, 2);
				questionsFilterQuery =JSON.stringify(JSON.parse(out.replace('$and', '\/$and').replace('$or', '\/$or')));
				$scope.reportGroupMappingModel[$scope.selectedQueryBuilderQid+"\t"+$scope.category_id]=questionsFilterQuery;
			}
			/*function addslashes(string) {
		    	return string.replace('$and', '\/$and').
		        	replace('$or', '\/$or');
			}
	  		function removeslashes(string) {
		    	return string.replace("/$and", "$and").
		        	replace("/$or", "$or");
			}*/
			$scope.selectedQueryBuilderQid="";
			Flash.clear();
			Flash.create('success','Question Filter Saved Successfully', 2000, {container: 'questionFilterFlash'});
			//console.log(JSON.stringify($scope.reportGroupMappingModel))
		};
		
		//process demo mapping -- start
		$scope.processDemoMapping=function(_quesObj,_key,catid,qtext){
			/*console.log('_quesObj',JSON.stringify(_quesObj));
			console.log("_key",_key)
			console.log('$scope.selectedDemoMappingRgItem',JSON.stringify($scope.selectedDemoMappingRgItem))*/
			$scope.demoMappingRgItems=[];
			if($scope.selectedDemoMappingRgs[_key]!=undefined){
				$scope.handleDemoRGSelection(_quesObj,_key);
				
			}else{
				$scope.demoMappingRgItems=[];
				$scope.demoMappingAnsChoices=[];
			}
			
				
			
		};
		$scope.processDemoMappingSubmit=function(){
			
			
			//console.log(JSON.stringify($scope.includeInDashboardModel));
		};
		$scope.handleDemoRGItemSelection=function(_quesObj,_choice,idx){
			//console.log('_choice',JSON.stringify(_choice));
			var _choiceArr=_choice.key.split("\t");
			var demoCatid=_quesObj.category_id;
			if(demoCatid==undefined){
				demoCatid="";
			}
			
			$scope.selectedDemoMappingRgItems[_quesObj._id+'\t'+_choiceArr[1]+'\t'+$scope.default_language_key]=$scope.selectedDemoMappingRgItem[_quesObj._id+'\t'+idx+'\t'+$scope.default_language_key];
//			console.log('$scope.selectedDemoMappingRgItem',JSON.stringify($scope.selectedDemoMappingRgItem));
			//console.log('$scope.selectedDemoMappingRgItems',JSON.stringify($scope.selectedDemoMappingRgItems));
		}
		$scope.handleDemoRGItemSelectionYN=function(_quesObj,_choice,idx){
			//console.log('_choice',JSON.stringify(_choice));
			var _choiceArr=_choice.key.split("\t");
			var demoCatid=_quesObj.category_id;
			if(demoCatid==undefined){
				demoCatid="";
			}
			
			$scope.selectedDemoMappingRgItemsYN[_quesObj._id+'\t'+_choiceArr[1]+'\t'+$scope.default_language_key]=$scope.selectedDemoMappingRgItemYN[_quesObj._id+'\t'+idx+'\t'+$scope.default_language_key];
			//console.log('$scope.selectedDemoMappingRgItem',JSON.stringify($scope.selectedDemoMappingRgItemYN));
			//console.log('$scope.selectedDemoMappingRgItems',JSON.stringify($scope.selectedDemoMappingRgItemsYN));
		}
		
		
		$scope.processDemoMappingCancel=function(_ques,_key){
			/*delete $scope.selectedDemoMappingRgs[_key];
			
			var id2del=[];
			for(var ky in $scope.selectedDemoMappingRgItem){
				if(_ques!=undefined && ky.indexOf(_ques._id)!=-1){
					id2del.push(ky);
				}
				
			}
			for(var ii=0;ii<id2del.length;ii++){
				delete $scope.selectedDemoMappingRgItem[id2del[ii]];
			}*/
			
		};
		//var prev_rg="";
		$scope.handleDemoRGSelection=function(_quesObj,_key){
			var demoCatid=_quesObj.category_id;
			if(demoCatid==undefined){
				demoCatid="";
			}
			/*
			if(prev_rg==""){
				prev_rg=$scope.selectedDemoMappingRgs[_key]+"_"+_quesObj._id;
			}
			if(prev_rg!=($scope.selectedDemoMappingRgs[_key]+"_"+_quesObj._id)){
				//$scope.selectedDemoMappingRgItems={};
				//$scope.selectedDemoMappingRgItems={};
			   prev_rg=$scope.selectedDemoMappingRgs[_key]+"_"+_quesObj._id
			}*/
			
			$scope.demoMappingRgItems=glbl_rg2rgi[$scope.selectedDemoMappingRgs[_key]];
			$scope.demoMappingAnsChoices=[];
			for(var key in _quesObj.answer_set[$scope.default_language_key]){
			   var _answerObj=$scope.answers2Save[_quesObj._id+'\t'+key+'\t'+demoCatid+'\t'+$scope.default_language_key];
			   var _newobj={};
			   _newobj.key=_quesObj._id+'\t'+key+'\t'+demoCatid+'\t'+$scope.default_language_key;
			   _newobj.value=_answerObj;
			   $scope.demoMappingAnsChoices.push(_newobj);
					
		  }
		}
		//process demo mapping -- end
$scope.selectedQueryBuilderQid="";
	$scope.js_dlaQuerybuilder=function(qid,catid,qtext){
		$scope.selectedQueryBuilderQid=qid;
  			var compid=qid+"\t"+catid;
  			var js_dlacompid=compid;
			var field=$scope.reportGroupMappingModel[compid];
			var tmp_outQurery="";
  			var js_selectedFieldObj={};
  			if(field!=undefined && Object.keys(field).length>0){
    			js_selectedFieldObj=field;
  			}
   			var queryBuider = {
			  fieldId:qid,
			  firstName:"",//field.firstname,
			  lastName:""//field.lastname
	 		 };
    		var titleText=qtext;//field.firstname+" "+field.lastname+" (DLA)";
	  		$("#queryBuiderModalTitle").text(titleText);
			  //console.log('field.queryDla',Object.keys(field).length);
	  		if(field && Object.keys(field).length>0){
		  		var str = JSON.parse(field);
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
    	if(tmp_outQurery && tmp_outQurery.length>2){
      		$('#builder').queryBuilder('setRulesFromMongo', JSON.parse(tmp_outQurery));
    	}else{
      		$('#builder').queryBuilder('reset');
    	}
     
}

		//deleteQuestion -- start
		$scope.deleteQuestion = function(question_index,Question) {
			
				$http({
			        method : "POST",
			        url :$scope.configObj.fetchResponsesByQuestion,
			        data:{"question_type":Question.question_type,
			        	  "questionText":Question.text[$scope.default_language_key][Question.text[$scope.default_language_key].length-1],
			        	  "categoryText":Question.category[$scope.default_language_key][Question.category[$scope.default_language_key].length-1],
			        	  "customer_survey_id":$localStorage.SURVEY_OBJ2EDIT._id
			        	}
			    }).then(function mySucces(response) {
					if(response.data.data.length>0){
						$scope.deletemsg="Response(s) found, are you sure you want to delete this question?"
					}else{
						
						$scope.deletemsg="Do you really want to delete this question?"
					}
					/*
			    	if(response.data.data.length>0){
			    		if(confirm('Response(s) found. Delete Question?')){
			    			$scope.Questions.splice(question_index, 1);
			    		}
			    	}else{
						delete $scope.searchQuestNCatObj[Question._id];	
			    		$scope.Questions.splice(question_index, 1);
			    	}*/
			    	
						    	
			    }, function myError(response) {
			    });
			
		}
		$scope.removeConfirmedQuestion=function(question_index,Question){
			angular.element('.modal-backdrop').css('display', 'none');
			 $('body').removeClass('modal-open');
			if($localStorage.SURVEY_OBJ2EDIT._id){
				delete $scope.searchQuestNCatObj[Question._id];	
				$scope.Questions.splice(question_index, 1);
			}else{
				delete $scope.searchQuestNCatObj[Question._id];	
			    $scope.Questions.splice(question_index, 1);
			}

		}
			$scope.deleteQuestionOLD = function(question_index,Question) {
			if($localStorage.SURVEY_OBJ2EDIT._id){
				$http({
			        method : "POST",
			        url :$scope.configObj.fetchResponsesByQuestion,
			        data:{"question_type":Question.question_type,
			        	  "questionText":Question.text[$scope.default_language_key][Question.text[$scope.default_language_key].length-1],
			        	  "categoryText":Question.category[$scope.default_language_key][Question.category[$scope.default_language_key].length-1],
			        	  "customer_survey_id":$localStorage.SURVEY_OBJ2EDIT._id
			        	}
			    }).then(function mySucces(response) {
					//console.log("response in deleting",response);
			    	if(response.data.data.length>0){
			    		if(confirm('Response(s) found. Delete Question?')){
			    			$scope.Questions.splice(question_index, 1);
			    		}
			    	}else{
						delete $scope.searchQuestNCatObj[Question._id];	
			    		$scope.Questions.splice(question_index, 1);
			    	}
			    	
						    	
			    }, function myError(response) {
			    });
			}else{
				delete $scope.searchQuestNCatObj[Question._id];	
				$scope.Questions.splice(question_index, 1);
			}
		}
		//deleteQuestion -- end
		//opacity for answer choice-start
		 $scope.getval = function(item, itemval) {
		 $scope.main = item;
		 $scope.color = 1 / itemval.length;
			 };
		//opacity for answer choice-end 

	    $scope.template_name="";		
		//Change Questions data w.r.t to questions template -- start
		$scope.getQuestions=function(event,ui){
			$scope.emptyCatFound=false;
			if($scope.droppedData._id){
				return;
			}
			angular.element('.loader').show();
			$scope.currentIndex=0;
			var params={};
			params["base_questions"]=JSON.parse(JSON.stringify(newResponseData['base_questions']));
			params["language_key"]=$scope.default_language_key;
			params["clientId"]=$scope.clientId;
			if($scope.droppedData.survey_type_id==$scope.template_name){
			
				$timeout(function(){
					angular.element('.loader').hide();
				},100);
				return;
			}
			
			
			if($scope.droppedData.survey_type_id){

				var catOrderingArr=categoryOrderTemplates[$scope.droppedData.survey_type_id];
				$scope.searchQuestNCatObj={};	
				$scope.survey_type_id=$scope.droppedData.survey_type_id;
				$scope.questions2Save = {};
				$scope.answers2Save={};
				$scope.subQuest2Save={};
				$scope.Questions=[];
				var existingCategories=[];
				var existingCatDesc={};
				var existingCategoryNames={};
				var existingcategoryBySurveyType={};
				for(var j=0;j<$scope.categoryTabs.length;j++){
					var existingObj=$scope.categoryTabs[j];
					if(existingObj.category_id.indexOf("_new")!=-1){
						var quesObj= $scope.categoryBySurveyType[existingObj.category_id]
						existingCatDesc[existingObj.category_id+"\t"+$scope.language_key]=$scope.category_description[existingObj.category_id+"\t"+$scope.language_key];
						existingCategoryNames[existingObj.category_id+"\t"+$scope.language_key]=$scope.editedCategoryNames[existingObj.category_id+"\t"+$scope.language_key];
						existingcategoryBySurveyType[existingObj.category_id]=quesObj;
						existingCategories.push(existingObj);
					}
				}

				//$scope.existingCatTabs=[];
				//$scope.existingCatTabs=$scope.categoryTabs;
				$scope.categoryTabs=[];
				$scope.category_description={};
				$scope.editedCategoryNames={};
		
				//$scope.survey_name=($scope.surveyTypesKeyValue[$scope.survey_type_id][$scope.language_key][0])+" Survey";
				params["survey_type_id"]=$scope.survey_type_id;
				var surveyDataset=spApp.prepareSurveyTemplateDataSet(params);
				//console.log(" surveyDataset", surveyDataset);
				//if("Stay"==$scope.droppedData.survey_type_id){
					var orderProperty="questionOrder";
					angular.forEach(surveyDataset["categoryBySurveyType"],function(v,k){
							
						surveyDataset["categoryBySurveyType"][k]=orderBy(surveyDataset["categoryBySurveyType"][k],orderProperty);
						for(var it=0;it<surveyDataset["categoryBySurveyType"][k].length;it++){
							// 	console.log(surveyDataset["categoryBySurveyType"][k][it]);
						}

					});	

				//}
				$scope.categoryBySurveyType=surveyDataset["categoryBySurveyType"];
				//console.log("$scope.categoryBySurveyType",$scope.categoryBySurveyType);
				//console.log("$scope.droppedData",JSON.stringify($scope.categoryBySurveyType));
				angular.forEach($scope.categoryBySurveyType, function(value, key) {
					for(var i=0;i<value.length;i++){
						var tmpltObj=value[i];
						//editcat --start
						angular.forEach(tmpltObj.category,function(val3,key3){
							$scope.editedCategoryNames[tmpltObj.category_id+"\t"+key3]=val3[val3.length-1];
						});
						//editcat --end
						//console.log(tmpltObj.category_id,JSON.stringify(tmpltObj.category))
						angular.forEach(tmpltObj.category.category_description,function(value2,key2){
			    			$scope.category_description[key+"\t"+key2]=value2;	
			    		});
					}
				});
				
				if(catOrderingArr!=undefined && catOrderingArr.length>0){
					var orderCatObj={};
					angular.forEach($scope.categoryBySurveyType, function(value, key) {
						var tmpObj={};
						tmpObj.category_id=key;
						tmpObj.name=$scope.categoryKeyValue[key];
						orderCatObj[tmpObj.name[$scope.default_language_key][0]]=tmpObj;
					});
					for(var it=0;it<catOrderingArr.length;++it){
						//console.log(orderCatObj[catOrderingArr[it]])
						if(orderCatObj[catOrderingArr[it]]){
							$scope.categoryTabs.push(orderCatObj[catOrderingArr[it]]);
						}
						
					}
				}else{
					angular.forEach($scope.categoryBySurveyType, function(value, key) {
						
						var tmpObj={};
						tmpObj.category_id=key;
						tmpObj.name=$scope.categoryKeyValue[key];
						$scope.categoryTabs.push(tmpObj);
						
					});	
				}
				var tmpltName={};
				var survey_typ={};
				var surveyTypeId="";
				
				if($scope.categoryTabs){
					tmpltName=$scope.categoryBySurveyType[$scope.categoryTabs[0].category_id][0].template_name;
					survey_typ=$scope.categoryBySurveyType[$scope.categoryTabs[0].category_id][0].survey_type;
					surveyTypeId=$scope.categoryBySurveyType[$scope.categoryTabs[0].category_id][0].survey_type_id;
				}
				
				for(var j=0;j<existingCategories.length;j++){
					var _obj=existingCategories[j];
					$scope.category_description[_obj.category_idcatId+"\t"+$scope.language_key]=existingCatDesc[_obj.category_idcatId+"\t"+$scope.language_key];
					$scope.editedCategoryNames[_obj.category_id+"\t"+$scope.language_key]=existingCategoryNames[_obj.category_id+"\t"+$scope.language_key];
					var _obj2=existingcategoryBySurveyType[_obj.category_id];
					
					for(var z=0;z<_obj2.length;z++){
						_obj2[z].template_name=tmpltName;
						_obj2[z].survey_type_id=survey_typ;
						_obj2[z].survey_type=surveyTypeId;
					}
					
					$scope.categoryBySurveyType[_obj.category_id]=_obj2;
					
					$scope.categoryTabs.unshift(_obj);
				}
			
				if($scope.categoryTabs){
					
					if($scope.categoryBySurveyType[$scope.categoryTabs[0].category_id][0]){
						$scope.template_name=$scope.categoryBySurveyType[$scope.categoryTabs[0].category_id][0].template_name[$scope.default_language_key][0];
						$scope.product_type_id=defaultTemplates[$scope.categoryBySurveyType[$scope.categoryTabs[0].category_id][0].template_name[$scope.default_language_key][0]];
						$scope.survey_type_id=$scope.product_type_id;
					}else{
						$scope.template_name=tmpltName[$scope.default_language_key][0];
						$scope.product_type_id=$scope.template_name;//defaultTemplates[$scope.categoryBySurveyType[$scope.categoryTabs[0].category_id][0].template_name[$scope.default_language_key][0]];
						$scope.survey_type_id=$scope.product_type_id;
					}
						
					$scope.dispQuesByCat(0,$scope.categoryTabs[0]);
				}
				
				$scope.loadfun();
				$timeout(function(){
					angular.element('.loader').hide();
				},100);
				
			}	

			if($scope.droppedData.category_id){
				var displayCat=true;
				if($scope.language_key!=$scope.default_language_key){
					angular.element('.loader').hide();
					return;
				}
				angular.forEach($scope.categoryTabs, function(value) {
					//#3278-start
					if(value.name[$scope.language_key]==$scope.droppedData.name[$scope.language_key][0]){
						displayCat=false;
					}
					//#3278-end
					/*if(value.category_id==$scope.droppedData.category_id){
						displayCat=false;
					}*/

				});
				
				if(!displayCat){
					$timeout(function(){
						angular.element('.loader').hide();
					},100);
					return;
				}
				
				$scope.category_id=$scope.droppedData.category_id;
				params["survey_type_id"]=$scope.survey_type_id;
				params["category_id"]=$scope.droppedData.category_id;
				params["questions4Search"]=JSON.parse(JSON.stringify(newResponseData['questions4Search']));
				//console.log(params["BaseQuestions"])
				params['scope_categories']=$scope.categories;
				var categoryDataset=spApp.prepareCategoryTemplateDataSet(params);
				$scope.insertData=categoryDataset["surveyDataset"];
				$scope.categoryBySurveyType[$scope.category_id]=categoryDataset["categoryBySurveyType"][$scope.category_id];
				//console.log('$scope.categoryBySurveyType',JSON.stringify($scope.categoryBySurveyType));
				//editcat --start
				angular.forEach($scope.categoryKeyValue[$scope.category_id],function(val,key){
					$scope.editedCategoryNames[$scope.category_id+'\t'+key]=val;	
				});
				//editcat --end			
				var tmpObj={};
				tmpObj.category_id=$scope.category_id;
				tmpObj.name=$scope.categoryKeyValue[$scope.category_id];
				tmpObj.cat_description=$scope.category_description[$scope.category_id];
				$scope.categoryTabs.push(tmpObj);
				$scope.dispQuesByCat($scope.categoryTabs.length-1,tmpObj);	
				$scope.loadfun($scope.categoryTabs.length-$scope.slides2Scroll);	
				$timeout(function(){
					angular.element('.loader').hide();
				},100);
				
			}
			
			
		}

		// $scope.wrapTextInDiv=function(obj,id){
		// 	var text=spApp.formatStr($scope.editedCategoryNames[$scope.category_id+'\t'+$scope.language_key]);
		// 	if(text.length>10){
		// 		var element = angular.element( document.querySelector( '#'+id ) );
				
		// 		Flash.clear();
		// 		Flash.create('danger','Category Name Should Not Exceed 100 Characters',4000, {container: 'flash-fixed-Question',id:'question_flash'});
		// 		return;
		// 	}else{
		// 		//element.removeClass('enableOverflow');
		// 	}
		// 	console.log($scope.editedCategoryNames[$scope.category_id+'\t'+$scope.language_key].length)
		// }
		//Change Questions data w.r.t to questions template -- end
		//category tab close -- start
		$scope.closeCatID="";
		$scope.closeCatIndex="";
		
		$scope.confirmCloseCat=function(index,catId){
			$scope.deleteCatMsg="Are you sure you want to delete this category?";
			//console.log("$localStorage.SURVEY_OBJ2EDIT._id",$localStorage.SURVEY_OBJ2EDIT._id,"$scope.categoryBySurveyType[catId]",$scope.categoryBySurveyType[catId]);
			var query2check={};
			for(var z=0;z<$scope.categoryBySurveyType[catId].length;z++){
				var dataObj=$scope.categoryBySurveyType[catId][z];
				var categoryText=dataObj.category[$scope.default_language_key][dataObj.category[$scope.default_language_key].length-1];
				query2check={"customer_survey_id":$localStorage.SURVEY_OBJ2EDIT._id,"question_type":dataObj.question_type,"categoryText":categoryText};
				break;
			}
			if($localStorage.SURVEY_OBJ2EDIT._id){
				$http({
			        method : "POST",
			        url :$scope.configObj.fetchResponsesByCategory,
			        data:{"query2check":query2check
			        	}
			    }).then(function mySucces(response) {
					$scope.closeCatID=catId;
					$scope.closeCatIndex=index;
			    	if(response.data.type){
						//console.log("response found");
			    		$scope.deleteCatMsg="Response(s) found, are you sure you want to delete this category?";
			    	}else{
						//console.log("no response found");
			    		$scope.deleteCatMsg="Are you sure you want to delete this category?";
			    	}	    	
			    }, function myError(response) {
			    });
			}else{
				$scope.closeCatID=catId;
				$scope.closeCatIndex=index;
			}
		}
		$scope.closeCat=function(){
			var ix=$scope.closeCatIndex;
			var cat_id=$scope.closeCatID;
			//angular.element('.loader').show();
			//console.log('deletedix',ix,'deletedCatId',cat_id,'$scope.categoryTabs.length',$scope.categoryTabs.length);
			if($("#"+cat_id).hasClass("active")){
				if(ix==0){
					$scope.categoryTabs.splice(0,1);
					if($scope.categoryTabs.length==0){
						$scope.Questions=[];
						$scope.template_name="";
						$("#catDesc_"+cat_id).text('');
					}else{
						$scope.dispQuesByCat(1,$scope.categoryTabs[0]);
						$scope.loadfun();
					}
				
				}else if(($scope.categoryTabs.length-1)==ix){
					$scope.categoryTabs.splice(ix,1);
					$scope.dispQuesByCat(ix-1,$scope.categoryTabs[ix-1]);
					//$scope.loadfun($scope.categoryTabs.length-$scope.slides2Scroll);
					$scope.loadfun();
				}else{
					
					$scope.categoryTabs.splice(ix,1);
					$scope.dispQuesByCat(1,$scope.categoryTabs[ix]);
					$scope.loadfun();
				}
			}else{
				$scope.categoryTabs.splice(ix,1);
				$scope.loadfun();
			}
			
			//$("#catDesc_"+cat_id).text('');
			delete $scope.category_description[cat_id+'\t'+$scope.language_key];
				//angular.element('.loader').hide();
				if($scope.categoryTabs.length==0){
					$scope.category_id="";
				}
				
						
		}
		//category tab close -- end
		
		//answer set display-start #2908
		 $scope.isDropUp = false;
		 $scope.toggleDropUpLang=function($event) {
			var dropdownContainer = $event.currentTarget;
			var position = dropdownContainer.getBoundingClientRect().top;
			var buttonHeight = dropdownContainer.getBoundingClientRect().height;
			var dropdownMenu = $(dropdownContainer).find('.dropdown-menu');
			var menuHeight = dropdownMenu.outerHeight();
			var $win = $('#ques_block');
			//alert($win.offset().top+'Position: ' + position + '. MenuHeight: ' + menuHeight + '. WinHeight: ' + $win.height() + '. ButtonHeight: ' + buttonHeight + '. WindowHeight - Position: ' + ($win.height() - position) + '. ButtonHeight + MenuHeight: ' + (buttonHeight + menuHeight));
			//console.log(position,$win.offset().top);
			if ( (position-$win.offset().top   > (buttonHeight + menuHeight))) {
			$scope.isDropUp = true;
			}
			else  {
			$scope.isDropUp = false;
			}

		}
		//answer set display-end
		//category dispQuesByCat -- start
		$scope.catCurrIndex=0;
		$scope.dispQuesByCat=function(index,item){	
			$scope.catCurrIndex=index;
			$("#tmp").find("div").removeClass("active");
			//$scope.activeclass=item.category_id;
			$scope.category_id=item.category_id;
			//console.log('$scope.category_id',$scope.category_id,'$scope.language_key',$scope.language_key,$scope.category_description[$scope.category_id+'\t'+$scope.language_key]);
			if(!$scope.category_description[$scope.category_id+'\t'+$scope.language_key]){
				$scope.category_description[$scope.category_id+'\t'+$scope.language_key]='Category Description';
			}
			var quesByCatArr=$scope.categoryBySurveyType[$scope.category_id];
			//console.log("quesByCatArr",quesByCatArr);
			//if(quesByCatArr){
				angular.forEach($scope.questions2Save, function(value, key) {	
				//console.log("$scope.questions2Save",$scope.questions2Save)
				var arr=key.split("\t");
				var x=0;
				var obj2edit={};
				
				for(;x<quesByCatArr.length;x++){
					if(quesByCatArr[x]._id ==arr[0]){
						obj2edit=quesByCatArr[x];
						break;
					}
				}
				if(obj2edit.text){
					if(obj2edit.text[arr[2]]){
						obj2edit.text[arr[2]][obj2edit.text[arr[2]].length-1]=spApp.formatStr(value);
					}else{
						var tmparr=[];
						obj2edit.text[arr[2]]=tmparr;
						obj2edit.text[arr[2]][0]=spApp.formatStr(value);
					}
					
				}
			});
			angular.forEach($scope.questions2Save, function(value, key) {	
				var arr=key.split("\t");
				var x=0;
				var obj2edit={};
				
				for(;x<quesByCatArr.length;x++){
					if(quesByCatArr[x]._id ==arr[0]){
						obj2edit=quesByCatArr[x];
						break;
					}
				}
				if(obj2edit.text){
					if(obj2edit.text[arr[2]]){
						obj2edit.text[arr[2]][obj2edit.text[arr[2]].length-1]=spApp.formatStr(value);
					}else{
						var tmparr=[];
						obj2edit.text[arr[2]]=tmparr;
						obj2edit.text[arr[2]][0]=spApp.formatStr(value);
					}
					
				}
			});
			angular.forEach($scope.answers2Save, function(value, key) {
				var ansText=$scope.answers2Save[key];
				var arr=key.split("\t");
				var ansObj2edit={};
				for(var x=0;x<quesByCatArr.length;x++){
					if(quesByCatArr[x]._id ==arr[0]){
						ansObj2edit=quesByCatArr[x];
						break;
					}
				}
				var ans_index=arr[1];
				if(ansObj2edit._id==arr[0]){
					if(ansObj2edit.answer_set[arr[3]]){
						ansObj2edit.answer_set[arr[3]][ans_index]=spApp.formatStr(ansText);
					}else{
						ansObj2edit.answer_set[arr[3]]={};
						ansObj2edit.answer_set[arr[3]][ans_index]=spApp.formatStr(ansText);
					}
				}
				
			});
			//}
			angular.forEach($scope.subquestionsave, function(value, key) {

				var subText=$scope.subquestionsave[key];
				var arr=key.split("\t");
				var subObj2edit={};
				for(var x=0;x<quesByCatArr.length;x++){
					if(quesByCatArr[x]._id ==arr[0]){
						subObj2edit=quesByCatArr[x];
						break;
					}
				}
				var sub_index=arr[1];
				if(subObj2edit._id==arr[0]){
					if(subObj2edit.rows[arr[3]]){
						subObj2edit.rows[arr[3]][sub_index]=spApp.formatStr(subText);
					}else{
						subObj2edit.rows[arr[3]]={};
						subObj2edit.rows[arr[3]][sub_index]=spApp.formatStr(subText);
					}
				}
				//console.log('subObj2edit',subObj2edit.rows)
				
				// var arr=key.split("\t");
				// var subObj2edit={};
				// for(var x=0;x<quesByCatArr.length;x++){
				// 	if(quesByCatArr[x]._id ==arr[0]){
				// 		subObj2edit=quesByCatArr[x];
				// 		break;
				// 	}
				// }
				// var sub_index=arr[1];
				// if(subObj2edit._id==arr[0]){
				// 	if(subObj2edit.rows[arr[1]]){
				// 		if(subObj2edit.rows[$scope.language_key]){
				// 			subObj2edit.rows[$scope.language_key][sub_index]=spApp.formatStr(subText);
				// 		}
				// 	}else{
				// 		subObj2edit.rows[$scope.language_key][arr[1]]={};
				// 		subObj2edit.rows[$scope.language_key][sub_index]=spApp.formatStr(subText);
				// 	}
				// }
			});
			$scope.Questions=[];
			$timeout(function(){
				$scope.Questions=$scope.categoryBySurveyType[$scope.category_id];
				//console.log(JSON.stringify($scope.Questions));
			},0);
			// $timeout(function(){
			// 	$("#"+item.category_id).addClass("active");
			// },2000)
		}				
//category dispQuesByCat -- end
		
	
//adding new question-start
		$scope.addQuestion=function(){
		$scope.saveDisplay='false';
		$scope.newQuestion="true";
			
		}
	$scope.val='';
	//#3175 -- start
	$scope.rankedAnswerScaleModel={};
	//#3175 -- end
		var new_question_type="";
		$scope.singleSelectAns=function(val){
			$scope.val=val;
			new_question_type=val;
			//#3198 -- start
			$scope.answer_scaleModel={};
			$scope.openEnded="";
			$scope.singleSelect="";
			$scope.ranked="";
			$scope.yesNo="";
			$scope.matrix="";
			$scope.demographic="";
			//#3198 -- end
			if(val=='Single Select'){
				$scope.singleSelect="true";
				$scope.openEnded="";
				$scope.yesNo="";
				$scope.matrix="";
				$scope.ranked="";
				$scope.demographic="";
				//$scope.answer_scaleModel=["No Answer/Does not apply","Strongly Disagree","Disagree","Somewhat Agree / Somewhat Disagree","Agree","Strongly Agree"];
				$scope.answer_scaleModel={
					"0":"No Answer/Does not apply",
					"1":"Strongly Disagree",
					"2":"Disagree",
					"3":"Somewhat Agree / Somewhat Disagree",
					"4":"Agree",
					"5":"Strongly Agree"
				}
			}else if(val=='Ranked'){
				$scope.ranked="true";
				$scope.openEnded="";
				$scope.singleSelect="";
				$scope.yesNo="";
				$scope.matrix="";
				$scope.demographic="";
				$scope.answer_scaleModel={
					"0":"No Answer",
					"1":"Onboarding",
					"2":"Culture",
					"3":"Leadership",
					"4":"Workload"
				}//["No Answer","Onboarding","Culture","Leadership","Workload"];
			}else if(val=='Yes/No'){
				$scope.ranked="";
				$scope.openEnded="";
				$scope.singleSelect="";
				$scope.yesNo="true";
				$scope.matrix="";
			$scope.demographic="";
				$scope.answer_scaleModel=["Yes","No"];
				}else if(val=='Matrix'){
				$scope.matrix="true";
				$scope.ranked="";
				$scope.openEnded="";
				$scope.singleSelect="";
				$scope.yesNo="";
				$scope.demographic="";
				$scope.answer_scaleModel={
						"1":"No impact",
						"2":"Some impact",
						"3":"Strong impact",
						"4":"Main reason for leaving"
					}
					
				}
				
				else if(val=='Demographic'){
				$scope.demographic="true";
				$scope.ranked="";
				$scope.openEnded="";
				$scope.singleSelect="";
				$scope.yesNo="";
				$scope.answer_scaleModel={
						"1":"No impact",
						"2":"Some impact",
						"3":"Strong impact",
						"4":"Main reason for leaving"
					}
				}
				else{
				$scope.yesNo="";
				$scope.ranked="";
				$scope.openEnded="true";
				$scope.singleSelect="";
				$scope.matrix="";
			}

		}	
			
		$scope.addNewChoice=function(item, itemval){
			 //$scope.answer_scaleModel.push("");
			 var sortArr=[];
			 angular.forEach($scope.answer_scaleModel,function(v,k){
				 sortArr.push(parseInt(k));
			 });
			 sortArr.sort();
			 var maxidx=sortArr[sortArr.length-1];
			 ++maxidx;
			 $scope.answer_scaleModel[maxidx+""]="";
		}
		
		$scope.removeChoice = function(choice_index) {
			delete $scope.answer_scaleModel[choice_index];
			var newArr=[];
			for(var key in $scope.answer_scaleModel){
				newArr.push($scope.answer_scaleModel[key]);
			}
			var newObj={};
			var it=1;
			if(newArr.indexOf("No Answer/Does not apply")!=-1){
				it=0;
			}
			if(newArr.indexOf("No Answer")!=-1){
				it=0;
			}
			for(var x=0;x<newArr.length;x++){
				newObj[it+""]=newArr[x];
				++it;
			}
			$scope.answer_scaleModel=newObj;
			//console.log(choice_index, $scope.answer_scaleModel)
  		};
		  $scope.subQuestionText="";
        $scope.addSubQuestion=function(){
      		  $scope.subQuestion=true                
            }
        $scope.closeNewSubQuestion=function(){
            $scope.subQuestionText="";
            $scope.subQuestion="";
        }
		 $scope.closeNewSubQuestion2=function(idx){
			$scope.matrixRow[$scope.language_key].splice(idx,1);
        }
	    $scope.matrixRow={};
              $scope.matrixQuestion=function(){         
             if(!$scope.matrixRow[$scope.language_key]){
                 $scope.matrixRow[$scope.language_key]=[];
             }
             //duplicate check-start
              var tmparr=[];
              tmparr=$scope.matrixRow[$scope.language_key];
                var uniqueNames = [];
                $.each(tmparr, function(i, el){
                    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                    else{
                        $scope.matrixRow[$scope.language_key][i]=''
                        Flash.clear();
                        Flash.create('danger','Sub Question Already Exists',4000, {container: 'flash-fixed-Question',id:'question_flash'});
                        return
                    }    
                });    
                 //duplicate check-end
                 $scope.matrixRow[$scope.language_key].push("");
                
        }   
 

		$scope.saveNewQuestion=function(){
			var duplicateQuestFound=false;
			var question2test=spApp.formatStr($scope.newQuestionText.toLowerCase());
//			console.log("$scope.categoryTabs", $scope.categoryTabs)
			var cattabs=$scope.categoryTabs;
			for(var dupkey in $scope.categoryTabs){
//				console.log("dupkey", dupkey)
				var tmpArr=[];
				var catObj=$scope.categoryTabs[dupkey];
				var questByCatObj4search=$scope.categoryBySurveyType[catObj.category_id];
				if (questByCatObj4search!=undefined && questByCatObj4search!=null) {
					for(var x=0;x<questByCatObj4search.length;x++){
						var txt=questByCatObj4search[x]["text"][$scope.language_key][questByCatObj4search[x]["text"][$scope.language_key].length-1];
						var editedQues2=spApp.formatStr(txt.toLowerCase());
						if(editedQues2==question2test){
							Flash.clear();
							Flash.create('danger','Question Already Exists',4000, {container: 'flash-fixed-Question',id:'question_flash'});
							duplicateQuestFound=true;
							break;
						}
					}
				}
				if(duplicateQuestFound){
					break;
				}
			}
			
			/*var questByCatObj=$scope.categoryBySurveyType[$scope.category_id];
				for(var x=0;x<questByCatObj.length;x++){
								var obj=JSON.parse(JSON.stringify(questByCatObj[x]));
								var tmpStr="";
								if(obj.text[$scope.language_key]){
									tmpStr=obj.text[$scope.language_key][obj.text[$scope.language_key].length-1];
								}
								tmpStr=spApp.formatStr(tmpStr.trim());
								var question2test=spApp.formatStr($scope.newQuestionText.toLowerCase());
								
								if((tmpStr.toLowerCase().trim()==question2test)){
									duplicateQuestFound=true;
									break;
								}
							}*/		

			if(duplicateQuestFound){
				Flash.clear();
				Flash.create('danger','Question Already Exists',4000, {container: 'flash-fixed-Question',id:'question_flash'});
				return;
			}

			var ansLangObj={};
			var ansIndexObj={};
			//#3175 -- start
			//console.log('$scope.answer_scaleModel',$scope.answer_scaleModel)
			if(new_question_type=='Yes/No'){
				ansIndexObj["Yes"]="Yes";
				ansIndexObj["No"]="No";
			}else if(new_question_type=='Ranked'){
				// console.log('rankedAnswerScaleModel',$scope.rankedAnswerScaleModel);
				// console.log('$scope.answer_scaleModel',$scope.answer_scaleModel);
				angular.forEach($scope.answer_scaleModel,function(value,key){
					if(value){
						ansIndexObj[value]=$scope.answer_scaleModel[key];
						//console.log(value,$scope.answer_scaleModel[key])
					}
				
				});

			}else{
				angular.forEach($scope.answer_scaleModel,function(value,key){
					if(value){
						ansIndexObj[key]=value;
					}
				
				});
			}
			//#3175 -- end

			ansLangObj[$scope.language_key]=ansIndexObj;
			var new_id="newques_"+newQuesIdx+"_"+$scope.category_id;
			var newQuestionTextObj={};
			if($scope.category_id && $scope.category_id.indexOf("_newcat_")==-1){
				if(!$scope.categoryBySurveyType[$scope.category_id][0]){
					for(var z=0;z<$scope.categoryTabs.length;z++){
						var obj=$scope.categoryTabs[z];
						if(obj.category_id==$scope.category_id){
							newQuestionTextObj.category=obj.name;
							break;
						}
					}
					
				}else{
				newQuestionTextObj.category=JSON.parse(JSON.stringify($scope.categoryBySurveyType[$scope.category_id][0].category));
				}				
			}else{
				for(var z=0;z<$scope.categoryTabs.length;z++){
					var obj=$scope.categoryTabs[z];
					if(obj.category_id==$scope.category_id){
						newQuestionTextObj.category=obj.name;
						break;
					}
				}
			}	

			newQuestionTextObj["_id"]=new_id;
			newQuestionTextObj["question_type"]=new_question_type;
			var newTextArr=[];
			newTextArr.push($scope.newQuestionText);
			var tmpObj={};
			tmpObj[$scope.language_key]=newTextArr;
			newQuestionTextObj["text"]=tmpObj;
			if(new_question_type=="Single Select" || new_question_type=="Ranked"  || new_question_type=="Yes/No"||new_question_type=="Demographic" ){
				newQuestionTextObj["answer_set"]=ansLangObj;
			}
			else if(new_question_type=='Matrix'){
                newQuestionTextObj["answer_set"]=ansLangObj;
                newQuestionTextObj["rows"]=$scope.matrixRow;    
				if($scope.matrixRow[$scope.language_key]==undefined||$scope.matrixRow[$scope.language_key]==''){
                Flash.create('danger','please add sub question',2000, {container: 'flash-fixed-Category',id:'category_flash'});    
                return
                } 

			}

		if($scope.Questions.length>=0){
			newQuestionTextObj.category_id=$scope.category_id;
		}
		
		//$scope.Questions.unshift(newQuestionTextObj);
		$scope.Questions.push(newQuestionTextObj);
		$("#ques_block").animate({ scrollTop: $('#ques_block').prop("scrollHeight")}, 1000); 
		//console.log('$scope.Questions',$scope.Questions);
		++newQuesIdx;
		$scope.newQuestion="";
		$scope.matrixRow={};
       

		$scope.closeNewQuestion();
		}
			$scope.closeNewQuestion=function(){
			$scope.answer_scaleModel="";
			$scope.newQuestion="";
			$scope.newQuestionText="";
			new_question_type="";
			$scope.singleSelect="";
			$scope.openEnded="";
			$scope.ranked="";
			$scope.val="";
			$scope.matrix="";
			$scope.matrixRow={};
			$scope.saveDisplay='true';
			}
			//adding new question-end


		
		//addCategory --start
		$scope.new_category_name="";
		$scope.clearCat=function(){
			$scope.new_category_name="";
		}
		$scope.emptyCatFound=false;
		$scope.checkDistinctCustomizedCat=function(item,compidx){
			
			var addedCatText=$scope.editedCategoryNames[item.category_id+'\t'+$scope.language_key];//item.name[$scope.default_language_key][0].trim();
			if(addedCatText){
				addedCatText.trim();
			}
			if(!addedCatText){
				$scope.emptyCatFound=true;
				Flash.clear();
				Flash.create('danger','Category cannot be empty',2000, {container: 'flash-fixed-Category',id:'category_flash'});
				$timeout(function(){
					$("#editedCat"+compidx).focus();
				},0);
				
			}else{
				$scope.emptyCatFound=false;
			}
			if(!$scope.emptyCatFound){
				var tmpArr=[];
				for(var ky in $scope.editedCategoryNames){
						var kyArr=ky.split("\t");
						if(kyArr[0]!=item.category_id){
							if($scope.editedCategoryNames[ky]!=undefined){
								tmpArr.push($scope.editedCategoryNames[ky].toLowerCase());
							}
						}
				}
				if(tmpArr.indexOf(addedCatText.toLowerCase())!=-1){
					Flash.clear();
					Flash.create('danger','Category Already Exists',2000, {container: 'flash-fixed-Category',id:'category_flash'});
					$scope.editedCategoryNames[item.category_id+'\t'+$scope.language_key]="";
					$timeout(function(){
						$("#editedCat"+compidx).focus();
					},0);

				}
			}
		}
					
			
		$scope.addCategory=function(){
			var categoryFound=false;
			var categoryFoundInEdited=false;
			var addedCatText=$scope.new_category_name;
				for(var x=0;x<$scope.categoryTabs.length;x++){
					var existingCat=$scope.categoryTabs[x];
					var existingCatText=existingCat.name[$scope.default_language_key][0].trim();
					if(existingCatText.toLowerCase()==addedCatText.toLowerCase()){
						Flash.clear();
						Flash.create('danger','Category Already Exists',4000, {container: 'flash-fixed-Category',id:'category_flash'});
						categoryFound=true;
						break;
					}
				}
			if(!$scope.new_category_name || categoryFound==true){
				return;
			}
			var tmpObj={};
			tmpObj.category_id="_newcat_"+newCatIdx;
			tmpObj.name={};
			
			var tmpArr=[];
			tmpArr.push($scope.new_category_name);
			tmpObj.name[$scope.language_key]=tmpArr;
			$scope.categoryTabs.push(tmpObj);
			//editcat --start
			$scope.editedCategoryNames[tmpObj.category_id+'\t'+$scope.language_key]=$scope.new_category_name;
			//editcat --end
			++newCatIdx;
			$scope.new_category_name="";
			$scope.Questions=[];
			$scope.categoryBySurveyType[tmpObj.category_id]=[];
			$timeout(function(){
				$scope.dispQuesByCat($scope.categoryTabs.length-1,tmpObj);
				// $scope.loadfun($scope.categoryTabs.length-$scope.slides2Scroll);
				$scope.loadfun($scope.categoryTabs.length);
				//$scope.loadfun(0);
			},0);
			//console.log('$scope.categoryTab',$scope.categoryTabs);
		
		}
		//addcategory() --end
		
		
		$scope.setSurveyType=function(item){
			$scope.survey_type_id=item;
			$scope.product_type_id=item;
		}

		//dropdown for language selection-start
			$scope.pushRemovedTag=function(tag){
				if(tag.active==true){
					tag.active="";
					$scope.tags[0].active=true;
					$scope.language_key=$scope.tags[0].lang_code;
				}
				//console.log(tag);
				$scope.languages.push(tag);
			}
			 $scope.pushLanguage=function(lang){
				  $scope.tags.push(lang);
				  angular.forEach($scope.languages,function(value,key){
					 angular.forEach($scope.tags,function(value1,key1){
				       if(value._id==value1._id){
						   $scope.languages.splice(key,1);
					   }
			         });
			      });
			 }
			 $scope.pushLanguageDropDown=function(tag){
				 angular.forEach($scope.languages,function(value,key){
					 angular.forEach($scope.tags,function(value1,key1){
				       if(value._id==value1._id){
						   $scope.languages.splice(key,1);
					   }
			         });
			      });
			 }
		//dropdown for language selection -end		
		$scope.toggleAnswerset=function(item){
			if($scope.showAnswerset[item._id]){
				$scope.showAnswerset[item._id]=false;
			}else{
				$scope.showAnswerset[item._id]=true;
			}
			
		}
		$scope.sortableOptions = {
				'ui-floating': 'auto',
				 disabled: false
		}
		//dragNdrop reorder --start
		$scope.enableSort=function(){
			$scope.sortableOptions.disabled = false;
		}	
		var trackSort='';
		$scope.enableSort2=function(event,elemId){
			if(trackSort){
				trackSort='';
			}else{
				$scope.sortableOptions.disabled=false;
				$timeout(function(){
					$("#"+elemId).find("li div").css({'border':''});
					$("#"+elemId).find("li div").blur();
				},0);
			}
		}		
		$scope.disableSort=function(event){
			trackSort='disablesort';
			$scope.sortableOptions.disabled = true;
			$timeout(function(){
				 $(event.target).focus();
			},0);
			
		}	 
		$scope.moveQuesToCat=function(ques_move_id,cat_move_id){
			var qid=ques_move_id
			var cat_id=cat_move_id;
			var activeidx=0;
			var tmpObj={};
			for(var x=0;x<$scope.categoryTabs.length;x++){
				var obj=$scope.categoryTabs[x];
				if(obj.category_id==cat_id){
					tmpObj=obj;
					activeidx=x;
					break;
				}				
			}
			for(var x=0;x<$scope.Questions.length;x++){
				var obj=$scope.Questions[x];
				if(obj._id==qid){
					obj.category_id=cat_id;
					obj.category=tmpObj.name;
					if($scope.categoryBySurveyType[cat_id].length>0){
						$scope.categoryBySurveyType[cat_id].push(obj);
						$("#ques_block").animate({ scrollTop: $('#ques_block').prop("scrollHeight")}, 1000);
					}else if($scope.categoryBySurveyType[cat_id].length==0){
						$scope.categoryBySurveyType[cat_id].push(obj);
					}
					
					$scope.Questions.splice(x, 1);
					break;
				}
			}
			
		}
		 $scope.save=function(){    
            if ($scope.survey_name==''|| $scope.survey_name==undefined||$scope.categoryTabs.length<=0){
                    $scope.saveFromTabNavigate="no";
					Flash.clear();
                    Flash.create('danger','Please enter survey name or enter categories',2000, {container: 'flash-fixed-save',id:'save_survey'});    
                }
                    else{
                        $scope.saveFromTabNavigate="yes";
                        Flash.clear();
                        Flash.create('success','changes saved Successfully',2000, {container: 'flash-fixed-save',id:'save_survey'});
						$timeout(function(){
							$scope.saveCustomerSurvey();   
						},2000);
                       
                    }
                        
        }

		$scope.saveCustomerSurvey=function(){
			angular.element('.loader').show();
			if($scope.categoryTabs.length>0){
				
				$scope.processCustomerSurvey();
			}else{
				angular.element('.loader').hide();
			}
			
		}
		$scope.saveCustomerSurveyFromDistribute=function(){
			$scope.enableSendSurvey=true;
			angular.element('.loader').show();
			if($scope.categoryTabs.length>0){
				$scope.processCustomerSurvey();
			}else{
				angular.element('.loader').hide();
			}
			
		}

		$scope.processCustomerSurvey=function(){

			var surveyObj={};						
			
			surveyObj.survey_url=$localStorage.SURVEY_OBJ2EDIT.survey_url;
			surveyObj.clientId=$scope.clientId;
			//#446 --start
			surveyObj.customerName=$localStorage.loginDetails.clientName
			//#446 --end
			surveyObj.survey_name=spApp.formatStr($scope.survey_name);
			surveyObj.survey_type=$scope.product_type_id;
			surveyObj.survey_description=spApp.formatStr($scope.survey_description);
			if($localStorage.SURVEY_OBJ2EDIT.start_date){
				surveyObj.start_date=$localStorage.SURVEY_OBJ2EDIT.start_date;
			}else{
				surveyObj.start_date="";
			}
			if($localStorage.SURVEY_OBJ2EDIT.end_date){
				surveyObj.end_date=$localStorage.SURVEY_OBJ2EDIT.end_date;
			}else{
				surveyObj.end_date="";
			}				
			//surveyObj.status="Open";
			surveyObj.status=spApp.getSurveyStatus(surveyObj.start_date,surveyObj.end_date,$filter('date')(new Date(), "MM/dd/yyyy"));
			surveyObj.distribute=$localStorage.SURVEY_OBJ2EDIT.distribute;
			//message tab --start
			var messageTabObj={};
			messageTabObj.email_greet=spApp.formatStr1($scope.email_greet);
			messageTabObj.email_url=spApp.formatStr1($scope.email_url);
			messageTabObj.sms_greet=spApp.formatStr1($scope.sms_greet);
			messageTabObj.sms_url=spApp.formatStr1($scope.sms_url);
			messageTabObj.email_subject=spApp.formatStr1($scope.email_subject);
			messageTabObj.email_body=spApp.formatStr1($scope.email_body);
			messageTabObj.sms_body=spApp.formatStr1($scope.sms_body);
			surveyObj.message=messageTabObj;
			//message tab --end
			
			surveyObj.language_codes=$scope.tags;
			surveyObj.clientName=$localStorage.loginDetails.clientName;
			if($localStorage.loginDetails.firstname){
				surveyObj.firstname=$localStorage.loginDetails.firstname;
			}else{
				surveyObj.firstname="";
			}
			if($localStorage.loginDetails.lastname){
				surveyObj.lastname=$localStorage.loginDetails.lastname;
			}else{
				surveyObj.lastname="";
			}
			
			var tmpObj={};
			tmpObj.category_id=$scope.category_id;
			tmpObj.name=$scope.categoryKeyValue[$scope.category_id];
			$scope.dispQuesByCat($scope.category_id,tmpObj);
			
			var fmtQuest2Save={};
			var qidCount=0;
			var answerScales2order=[];
			//console.log('$scope.selectedDemoMappingRgItems',JSON.stringify($scope.selectedDemoMappingRgItems));
			//console.log('$scope.answers2Save',$scope.answers2Save)
			angular.forEach($scope.categoryTabs,function(catObj,key){
				
				var tmpArr=[];
				var questByCatObj=$scope.categoryBySurveyType[catObj.category_id];
				
				for(var x=0;x<questByCatObj.length;x++){

					var tmp=JSON.parse(JSON.stringify(questByCatObj[x]));
					//console.log('tmp',JSON.stringify(tmp))
					var insertData={};
					var editedCategoryText="";
					if($scope.includeInDashboardModel[tmp._id+"\t"+catObj.category_id+'\t'+$scope.default_language_key]==undefined){
						insertData.includeInDashboard=true;
					}else if($scope.includeInDashboardModel[tmp._id+"\t"+catObj.category_id+'\t'+$scope.default_language_key]){
						insertData.includeInDashboard=true;
					}else{
						insertData.includeInDashboard=false;
					}
					if($scope.reportGroupMappingModel[tmp._id+"\t"+catObj.category_id]){
						insertData.reportGroupMappings=$scope.reportGroupMappingModel[tmp._id+"\t"+catObj.category_id];
					}
					if(tmp.question_type=="Single Select"){
					
						var _mapObj={};
						//console.log('$scope.answers2Save',$scope.answers2Save)
						
						angular.forEach($scope.answers2Save,function(v,k){
							var kArr=k.split("\t");	
							var _tmpKey=tmp._id+"\t"+kArr[1]+'\t'+$scope.default_language_key
							//console.log(_tmpKey)
							
							/*if($scope.selectedDemoMappingRgItems[_tmpKey]!=undefined){
								
								for(var ans_key in tmp.answer_set[$scope.default_language_key]){
									
									if(v==tmp.answer_set[$scope.default_language_key][ans_key]){
										_mapObj[v]=$scope.selectedDemoMappingRgItems[_tmpKey];
									}
								}
							}*/
							//if(k.indexOf(tmp.localqid)!=-1){
							
							
								if(!isNaN(kArr[1])){
									var kidx=parseInt(kArr[1]);
									if(answerScales2order.indexOf(kidx)==-1){
										answerScales2order.push(kidx);										
									}
								}
							//}
						});
						//console.log('tmp.answer_set',tmp.answer_set[$scope.default_language_key])
						for(var ans_key in tmp.answer_set[$scope.default_language_key]){
							var _tmpKey=tmp._id+"\t"+ans_key+'\t'+$scope.default_language_key;
							var ansVal=tmp.answer_set[$scope.default_language_key][ans_key];
							if($scope.selectedDemoMappingRgItems[_tmpKey]!=undefined){
								if(ansVal==tmp.answer_set[$scope.default_language_key][ans_key]){
									_mapObj[ansVal]=$scope.selectedDemoMappingRgItems[_tmpKey];
								}
							}
						}
						
						if(Object.keys(_mapObj).length>0){
							
							var demoRgselected=$scope.selectedDemoMappingRgs[tmp._id+'\t'+$scope.default_language_key]
							if(demoRgselected!=undefined){
								var _demoMapObj={};
								_demoMapObj.rg=demoRgselected;
								_demoMapObj.rgItems=_mapObj;
								insertData.demographicResponseMappings=_demoMapObj;
							}
							
						}else{
							insertData.demographicResponseMappings={};
						}
						
						var maxAnswerScales2order=[];
					 	for(var _key in tmp.answer_set[$scope.default_language_key]){
					 		if(!isNaN(_key)){
					 			maxAnswerScales2order.push(parseInt(_key));
					 		}
					 	}
					 	maxAnswerScales2order.sort(sortNumber);
					 	insertData.maxAnswerScale=maxAnswerScales2order[maxAnswerScales2order.length-1];
					}else if(tmp.question_type=="Yes/No"){
						
						//console.log('tmp',JSON.stringify(tmp))
						if(tmp.answer_set==undefined){
							tmp.answer_set={"en":{"1":"Yes","2":"No"},"es":{"1":"sí","2":"no"}};
						}
						
						var _ynAns=tmp.answer_set[$scope.default_language_key];
						var _mapObjYN={};
						for(var _ynKey in _ynAns){
							
							var _ynstr=tmp._id+"\t"+_ynKey+"\t"+$scope.default_language_key;
							if($scope.selectedDemoMappingRgItemsYN[_ynstr]!=undefined){
								_mapObjYN[ _ynAns[_ynKey]]=$scope.selectedDemoMappingRgItemsYN[_ynstr];
							}
						}
						//console.log('$scope.selectedDemoMappingRgItems',JSON.stringify($scope.selectedDemoMappingRgItems))
						if(Object.keys(_mapObjYN).length>0){
							var demoRgselected=$scope.selectedDemoMappingRgs[tmp._id+'\t'+$scope.default_language_key]
							if(demoRgselected!=undefined){
								var _demoMapObj={};
								_demoMapObj.rg=demoRgselected;
								_demoMapObj.rgItems=_mapObjYN;
								insertData.demographicResponseMappings=_demoMapObj;
							}
							
						}else{
							insertData.demographicResponseMappings={};
						}
					}

					
					//console.log('tmp',tmp)
					//console.log('tmp._id',tmp._id,'catObj.category_id',catObj.category_id,tmp.text[$scope.default_language_key]);
					
					
					 if(tmp._id.indexOf("newques_")!=-1){
						 insertData._id=tmp._id;//'_'+new Date().getTime()+x+"_"+catObj.category_id;
						 questByCatObj[x]._id=insertData._id;
						 $scope.categoryBySurveyType[catObj.category_id][x].base_question_id=insertData._id;
						 $scope.categoryBySurveyType[catObj.category_id][x].localqid=insertData._id;
					 }else{
						 //insertData._id=tmp._id;
						 insertData._id=tmp.base_question_id;
					 }

					insertData.base_question_id=insertData._id;	
					insertData.localqid=insertData._id;
					if(tmp.rows){
						insertData.rows=tmp.rows;
					}	
					insertData.template_name=tmp.template_name;
					insertData.product_type=$scope.survey_type_id;
					insertData.question_type=tmp.question_type;
					
					
					//console.log('tmp',tmp);
					if(tmp.ExcludeFromAp!=undefined && tmp.ExcludeFromAp){
						insertData.ExcludeFromAp=true;
					}
					//editcat --start
					//console.log("from processcust $scope.editedCategoryNames",$scope.editedCategoryNames);
					var hldrObj2={};
					angular.forEach($scope.editedCategoryNames,function(value,key){
						var catdesArr=key.split("\t");
						if(catdesArr[0]==catObj.category_id){
							var arr=[];
							arr.push(spApp.formatStr(value));
							hldrObj2[catdesArr[1]]=arr;
						}
					});
					//console.log(hldrObj2);
					tmp.category=hldrObj2;
					//editcat --end
					insertData.category=tmp.category;
					if(tmp.actionItems){
						insertData.actionItems=tmp.actionItems;
					}
					
					var hldrObj={};
					angular.forEach($scope.category_description,function(value,key){
						
						var catdesArr=key.split("\t");
						
						if(catdesArr[0]==catObj.category_id){
							hldrObj[catdesArr[1]]=spApp.formatStr(value);
						}
					});
					insertData.category['category_description']=hldrObj;

					

					insertData.text=tmp.text;
					insertData.answer_set=tmp.answer_set;
					insertData.rows=tmp.rows;
					
					//report group mapping --start
					var rgitmMappingArr=[];
					var reportGroupMappings={};
					// angular.forEach($scope.reportGroupMappingModel,function(value,key){
					// 	var rgKeyArr=key.split("\t");
					// 	/*for(var q=0;q<rgKeyArr.length;q++){
					// 		console.log('rgKeyArr['+q+']='+rgKeyArr[q]);
					// 	}*/
						
					// 	var quesid=rgKeyArr[0];
					// 	var rg=rgKeyArr[1];
					// 	var rgItmIdx=rgKeyArr[2];
					// 	if(!reportGroupMappings[rg]){
					// 		reportGroupMappings[rg]=[];
					// 	}
					// 	if(insertData._id==quesid){	
					// 		if(value){
					// 			reportGroupMappings[rg].push($scope.reportGroupMappings[rg][rgItmIdx])
					// 		}
					// 		//console.log('isselected',value,$scope.reportGroupMappings[rg][rgItmIdx]);
					// 	}
					// });
					
					
					//console.log(insertData._id,JSON.stringify(reportGroupMappings));
					//report group mapping --end
					tmpArr.push(insertData);
					if(editedCategoryText){
						fmtQuest2Save[editedCategoryText]=tmpArr;
					}else{
						fmtQuest2Save[catObj.name[$scope.default_language_key]]=tmpArr;
					}
					
					++qidCount;
				}
				
				
			});
			surveyObj.lastInsertIndex=newQuesIdx;
			surveyObj.survey_questions=fmtQuest2Save;
			//console.log('answerScales2order',answerScales2order);
			if(answerScales2order && answerScales2order.length>0){
				answerScales2order.sort(sortNumber);
			 	surveyObj.minScale=answerScales2order[0];
			 	surveyObj.maxScale=answerScales2order[answerScales2order.length-1];
			}else{
				surveyObj.minScale=0;
			 	surveyObj.maxScale=0;
			}
			 
			 var pKey="";
			 //console.log('$localStorage.SURVEY_OBJ2EDIT._id',$localStorage.SURVEY_OBJ2EDIT._id)
			 if($localStorage.SURVEY_OBJ2EDIT._id){
			  	pKey=$localStorage.SURVEY_OBJ2EDIT._id;
				  surveyObj.musrid=$localStorage.loginDetails.participantId;
				  surveyObj.mdt=new Date();
			  }else{
				  surveyObj.cusrid=$localStorage.loginDetails.participantId;
				  surveyObj.cdt=new Date();
				  surveyObj.mdt=new Date();
			  }
			$http({
		        method : "POST",
		        url :$scope.configObj.saveCustomerSurvey,
		        data:{"surveyObj":surveyObj,"pKey":pKey}
		    }).then(function mySucces(response) {
				// alert("Your survey has been saved!");
				angular.element('.loader').hide();
				if(response.status==200){
					Flash.clear();
					if(!$scope.saveFromTabNavigate){
						Flash.create('success','Survey Saved Successfuly',0, {container: 'flash-fixed-save',id:'save_survey'});
					}
					$scope.saveFromTabNavigate="";
				}
				//console.log('from save customser surey  success',response.data.lastInsertId);
				
				$scope.demoMappingAnsChoices=[];
				//$scope.includeInDashboardModel={};
				var glbl_demographics = JSON.parse(localStorage.getItem('ngStorage-metaDataConstant'));
				var newFilters=[];
				var glbl_rg2rgi={};
		
			    $localStorage.SURVEY_OBJ2EDIT={};
			    $localStorage.SURVEY_OBJ2EDIT=response.data.customer_survey_doc[0];
			    //$scope.initEditData();
			    //console.log('response.data.customer_survey_doc[0]',response.data.customer_survey_doc[0])
			    
			    
			   /* $state.transitionTo($state.current, $stateParams, { 
			 		 reload: true, inherit: false, notify: true
					});*/
				
				//console.log('response.data.customer_survey_doc',JSON.stringify(response.data.customer_survey_doc))
				$location.path("/buildSurvey");
				/*if(!$localStorage.SURVEY_OBJ2EDIT._id){
					$localStorage.SURVEY_OBJ2EDIT={};
					$("#distribute_surveyUrl").val("");
					$("#distribute_startDate").val("");
					$("#distribute_endDate").val("");
					$("#catDesc_"+$scope.category_id).text("");
		    		$scope.resetSurveyData();
				}*/
				
				$timeout(function(){
					angular.element('.loader').hide();
				},0);		    	
		    }, function myError(response) {
				Flash.clear();
				Flash.create('danger','Unable to save your survey',2000, {container: 'flash-fixed-save',id:'save_survey'});
		    });	
			//$scope.showsurveyname=true;					

		}
		
		function sortNumber(a,b) {
		    return a - b;
		}
		
		$scope.resetSurveyData=function(){
			$scope.category_description[$scope.category_id+'\t'+$scope.language_key]="";
			$scope.category_description={};
			$scope.survey_url="";
			$scope.categoryBySurveyType={};
			$scope.product_type_id="Survey ";
			$scope.survey_type_id="";
			$scope.survey_description="";
			$scope.Questions=[];
			$scope.categoryTabs=[];
			$scope.survey_name="";
	    	$localStorage.SURVEY_OBJ2EDIT={};
	    	
		}
		$scope.gotoMySurvey=function(){			
			$location.path("/mySurvey");
		}
		$scope.prev=function () {
			if($("#catSlidePrev").hasClass("disable")){
				return false;
			}
	        $scope.dragconfig.method.slickPrev();
	    }
	    $scope.nextslide=function () {
			if($("#catSlideNext").hasClass("disable")){
				return false;
			}
	    	$scope.dragconfig.method.slickNext();
	    }  
		//sliding the category tabs-start 
		$scope.loadfun=function (passing) {
			$scope.dragconfig={};
			$scope.loadslider=false;
			$timeout(function() {
				$scope.loadslider=true;
				$scope.dragconfig={
					 draggable: false,
				accessibility:false,
				autoplay: false,
				infinite: false,
				autoplaySpeed: 1000,
				//variableWidth: true,
			    slidesToShow: 4,
        		slidesToScroll: $scope.slides2Scroll,
				prevArrow: false,
				nextArrow: false,
				method: {},
				event: {
				afterChange: function (event, slick, currentSlide, nextSlide) {
				  $scope.currentIndex = currentSlide; 
				}           
			}
		}
	}, 0);
			$timeout(function(){       
					// $scope.height=angular.element(".position-inherit")[0].offsetHeight;
					// angular.element(".list-category").css("height", $scope.height);                                                                
				if(passing!=undefined){
					$scope.dragconfig.method.slickGoTo(passing);
					// $scope.height=angular.element(".position-inherit")[0].offsetHeight;
					// angular.element(".list-category").css("height", $scope.height);
				}                                                                         
	}, 500)
}
  		//sliding the category tabs-end
		
		// reorder categories start
		$scope.reorderCategories=function () {
			$('#reorderCategories').modal('show');
		}
		$scope.saveReorderCategories=function (event,ui,reorderlist) {
			//console.log(reorderlist);
			$scope.loadfun();
			$scope.dispQuesByCat(0,$scope.categoryTabs[0]);

		}
		// reorder categories end

		//sendSurveysToParticipants --start
		$scope.sendSurveysToParticipants=function(){
			console.log('$localStorage.SURVEY_OBJ2EDIT.distribute.channel.email.email_select ',$localStorage.SURVEY_OBJ2EDIT.distribute.channel.email.email_select)
			if($localStorage.SURVEY_OBJ2EDIT.distribute.channel.email.email_select){
				angular.element('.loader').show();
				$http({
					method : "POST",
					url :$scope.configObj.sendSurveysToParticipants,
					data:{
						"language_key":$scope.language_key,
						"customer_survey_id":$localStorage.SURVEY_OBJ2EDIT._id,
						"survey_name":spApp.formatStr($scope.survey_name),
						"customerName":$localStorage.loginDetails.clientName,
						"clientId":$scope.clientId,
						"distribute":$localStorage.SURVEY_OBJ2EDIT.distribute,
						"message":$localStorage.SURVEY_OBJ2EDIT.message
					}
				}).then(function mySucces(response) {
					//console.log('response.data.data',response.data.data);
					var flashMsg="";
					var flashType="";
					//console.log('response.data.data.message2displa',response.data.data.message2displa)
					if(response.data.data.message2display){
						flashMsg=response.data.data.message2display;
						flashType=response.data.data.flashType
					}

					angular.element('.loader').hide();
					Flash.clear();
					Flash.create(flashType,flashMsg,0, {container: 'flash-fixed-send',id:'send_survey'});
				}, function myError(response) {
					console.log("error",response);
					angular.element('.loader').hide();
					Flash.clear();
					Flash.create('danger',flashMsg,0, {container: 'flash-fixed-send',id:'send_survey'});
				});
				//alert("Survey has been sent");
				angular.element('.loader').hide();
			}else{
				Flash.create('danger','Email Not Enabled To Send The Survey To Participants',0, {container: 'flash-fixed-send',id:'send_survey'});
			}
		}
		//sendSurveysToParticipants --end
		var duplicateQuestFound=false;
		$scope.checkDistinctCustomizedQuestion=function(item,qid){
			duplicateQuestFound=false;
			var questByCatObj=$scope.categoryBySurveyType[$scope.category_id];
			for(var x=0;x<questByCatObj.length;x++){
				var obj=JSON.parse(JSON.stringify(questByCatObj[x]));
				var tmpStr="";
				if(obj.text[$scope.language_key]){
					tmpStr=obj.text[$scope.language_key][obj.text[$scope.language_key].length-1];
				}
				tmpStr=spApp.formatStr(tmpStr.trim());
				var question2test=spApp.formatStr(item.toLowerCase());
				
				
				//console.log('obj._id=',obj._id,'qid=',qid,'question2test=',question2test,'existing quest=',tmpStr)
			
				if((tmpStr.toLowerCase().trim()==question2test)&& obj._id!=qid){
					duplicateQuestFound=true;
					//console.log('obj._id=',obj._id,'qid=',qid,'question2test=',question2test,'existing quest=',tmpStr)
					break;
				}
			}
			//console.log('duplicateQuestFound',duplicateQuestFound)
			if(duplicateQuestFound){
				Flash.clear();
				Flash.create('danger','Question Already Exists',4000, {container: 'flash-fixed-Question',id:'question_flash'});
			}
		}
		
		

	}]).filter('isValidObject', function(){
    return function(obj){
      return !(obj === undefined || obj === null || Object.keys(obj).length === 0);
    }
	}).directive('contenteditable', ['$timeout',function() {
	    return {
	        require: '?ngModel',
	        scope: {
	        },
	        link: function(scope, element, attrs, ctrl) { 
	        	
	        	element.bind('keyup keydown', function(e) {
                    /* if(e.which === 13) {
                          e.preventDefault();
                         }else{
                           //console.log(element.html().length)
                           if (e.which != 8 && element.html().length>=300) {
                              e.preventDefault();
                           }else{
                              scope.$apply(function() {
                              setTimeout(function(){
								if(ctrl){
									ctrl.$setViewValue(element.html());
									}
                    		  }, 0); 
                                });
                        }                                              
                  }*/
				  //console.log(e.which != 8 && element.html().length>=attrs.udfmaxlength)
				  
				   if (e.which != 8 && element.html().length>=attrs.udfmaxlength) {
                              e.preventDefault();
                           }else{
                              scope.$apply(function() {
                              setTimeout(function(){
								if(ctrl){
									ctrl.$setViewValue(element.html());
									}
                     }, 0); 
                     }); 
				   }
				});

	              element.bind('drop', function(e) {
	            	 e.preventDefault();
	            }); 
	            element.bind('paste', function(e) {
	                scope.$apply(function() {
	                	setTimeout(function(){
	                		if(ctrl){
		                		ctrl.$setViewValue(element.html());
		                	}
	                	}, 0); 
	                });  
	            });
	            
	            if(ctrl){
	            	ctrl.$render = function() {
		                element.html(ctrl.$viewValue);
		            };
	            }
	            
	            scope.$on('$destroy', function() {
	            	
	                element.unbind('blur');
	                element.unbind('paste');
	                element.unbind('focus');
	            });
	        }
	    };
	}]);
	
spApp.prepareCategoryTemplateDataSet=function(params){
	var resObj={};
	var baseQuestions=params["questions4Search"];
	var language_key=params["language_key"];
	var clientId=params["clientId"];
	var category_id=params["category_id"];
	var resObj={};
	var base_questions=params["base_questions"];
	var categoryBySurveyType={};
	var insertData=[];
	resObj["categoryBySurveyType"]=categoryBySurveyType;
	resObj["insertData"]=insertData;
	var scope_categories=params['scope_categories'];
	var catIds={};
	for(var x=0;x<scope_categories.length;x++){
		var catObj=scope_categories[x].name;
		var catText=catObj[language_key][catObj[language_key].length-1]
		catIds[catText]=scope_categories[x].category_id;
	}
	var categories={};
	angular.forEach(baseQuestions, function(value, key){
		var ques_text='';
		
		if(value.text[language_key]){
			ques_text=value.text[language_key][value.text[language_key].length-1].trim();
		}
		if(ques_text){
			var categoryText=value.category[language_key][value.category[language_key].length-1];
			//value.base_question_id=value._id;
		
			categoryText=categoryText.trim();
			if(!categories[categoryText]){
				categories[categoryText]=[];
			}
			categories[categoryText].push(value);
		}
	});
	//console.log('categories',categories)
	angular.forEach(categories, function(value, key) {
		for(var x=0;x<value.length;x++){
			value[x].category_id=catIds[key];
		}
	});
	angular.forEach(categories, function(value, key){
		if(category_id==catIds[key])
		categoryBySurveyType[catIds[key]]=value;
	});
	
	resObj["categoryBySurveyType"]=categoryBySurveyType;
	resObj["insertData"]=insertData;
	return resObj;
	
	/*var language_key=params["language_key"];
	var clientId=params["clientId"];
	var survey_name=params["survey_name"];
	var category_id=params["category_id"];
	var survey_type_id=params["survey_type_id"];
	var categoryBySurveyType={};
	var insertData=[];
	var quesArr=[];
	for(var x=0;x<base_questions.length;x++){
		var baseObj=base_questions[x];
		if(baseObj.category_id==category_id){
			baseObj.survey_type_id=survey_type_id;
			quesArr.push(baseObj);
			categoryBySurveyType[category_id]=quesArr;
		}
	}

	resObj["categoryBySurveyType"]=categoryBySurveyType;
	resObj["insertData"]=insertData;
	
	return resObj;*/
}
spApp.prepareSurveyTemplateDataSet=function(params){
	
	var resObj={};
	var base_questions=params["base_questions"];
	var language_key=params["language_key"];
	var survey_type_id=params["survey_type_id"];
	var clientId=params["clientId"];
	var survey_name=params["survey_name"];
	var categoryBySurveyType={};
	var insertData=[];
	var quesArr=[];
	for(var x=0;x<base_questions.length;x++){
		var baseObj=base_questions[x];
		//console.log(JSON.stringify(baseObj));
		if(baseObj.survey_type_id==survey_type_id){
			if(!categoryBySurveyType[baseObj.category_id]){
				quesArr=[];
			}
			
			if(categoryBySurveyType[baseObj.category_id]){
				quesArr=categoryBySurveyType[baseObj.category_id];
			}
			quesArr.push(baseObj);
			categoryBySurveyType[baseObj.category_id]=quesArr;
		}
		
	}
	
	resObj["categoryBySurveyType"]=categoryBySurveyType;
	//resObj["insertData"]=insertData;
	
	return resObj;
}
spApp.prepareDataSet=function(data,language_key,newCatIdx){
	var resObj={};
	var base_questions=data['base_questions'];
	var surveyCount={};
	var categoryCount={};
	var categories={};
	var categoryIDs={};
	var questionsBySurvey={};
	var questionsByCategory={};
	var tmpArr1=[];
	var tmpArr2=[];
	
	var surveyTypesFiltered=[];
	var surveyTypesKeyValue={};
	var categoryKeyValue={};
	var categoriesFiltered=[];
	
	var baseQuestionsByIds={};
	var baseQuestionsFiltered=[];
	var category_description={};
	var trackquesTxt=0;
	var questions4Search={};
	var base_questions4Search=data['questions4Search'];
	angular.forEach(base_questions4Search, function(value, key){
		
		var ques_text='';
		
		if(value.text[language_key]){
			ques_text=value.text[language_key][value.text[language_key].length-1].trim();
		}
		if(ques_text){
			questions4Search[ques_text]=value;
			var categoryText=value.category[language_key][value.category[language_key].length-1];
			categoryText=categoryText.trim();
			if(!categories[categoryText]){
				categories[categoryText]=[];
			}
			categories[categoryText].push(value);
			
		}
	});
	//console.log(categories);
	angular.forEach(base_questions, function(value, key){
		var ques_text='';
		if(value.text[language_key]){
			ques_text=value.text[language_key][value.text[language_key].length-1].trim();
			
		}
		if(ques_text){
			//questions4Search[ques_text]=value;
			var template_name=value.template_name[language_key][value.template_name[language_key].length-1];
			var survey_template_id = template_name;//template_name.replace(/ /g, "");
			value.survey_type_id=survey_template_id;
			/*var categoryText=value.category[language_key][value.category[language_key].length-1];
			categoryText=categoryText.trim();
			if(!categories[categoryText]){
				tmpArr1=[];
			}
			tmpArr1.push(value);
			categories[categoryText]=tmpArr1;*/
		}
	});
	
	angular.forEach(categories, function(value, key) {
		var catId="_catId"+(++newCatIdx);
		categoryIDs[key]=catId;
	});
	var categoryQuestions={};
	var categoryKeyValue2={}
	angular.forEach(categories, function(value, key) {
		for(var x=0;x<value.length;x++){
			value[x].category_id=categoryIDs[key];
		}
		
		var tmpObj={};
		tmpObj.category=value[0].category;
		tmpObj.quesCount=value.length;
		categoryKeyValue[categoryIDs[key]]=tmpObj;
		categoryKeyValue2[categoryIDs[key]]=value[0].category;
	});
	//console.log('categoryKeyValue',categoryKeyValue)

	angular.forEach(base_questions, function(value, key){
		var ques_text='';
		if(value.text[language_key]){
			ques_text=value.text[language_key][value.text[language_key].length-1];
		}
		if(ques_text){
			var categoryText=value.category[language_key][value.category[language_key].length-1].trim();
			value.category_id=categoryIDs[categoryText];
		}
	});
	angular.forEach(base_questions, function(value, key) {
		//console.log(value)
		var ques_text='';
		if(value.text[language_key]){
			ques_text=value.text[language_key][value.text[language_key].length-1].trim();
		}
		if(ques_text){
			var template_id=value.survey_type_id;
			if(surveyCount[template_id]){
				surveyCount[template_id]=surveyCount[template_id]+1;
			}else{
				surveyCount[template_id]=1;
			}
			
			if(categoryCount[value.category_id]){
				categoryCount[value.category_id]=categoryCount[value.category_id]+1;
			}else{
				categoryCount[value.category_id]=1;
			}
			if(!questionsByCategory[value.category_id]){
				questionsByCategory[value.category_id]=[];
			}
			questionsByCategory[value.category_id].push(value);
			
			//questionsByCategory[value.category_id]=tmpArr1;
			//categoryKeyValue[value.category_id]=value.category;
			category_description[value.category_id]=value.category.category_description;
			surveyTypesKeyValue[template_id]=value.template_name;
			if(!questionsBySurvey[template_id]){
				tmpArr2=[];
			}
			tmpArr2.push(value);
			questionsBySurvey[template_id]=tmpArr2;
			baseQuestionsByIds[value._id]=value;
			baseQuestionsFiltered.push(value);
		}
		
	});
	
	angular.forEach(surveyTypesKeyValue, function(value, key) {
		var obj={};
		obj.survey_type_id=key;
		obj.name=value;
		if(surveyCount[key]){
			obj.count=surveyCount[key];
			surveyTypesFiltered.push(obj);
			
		}else{
			obj.count=0;
		}
	});
	
	angular.forEach(categoryKeyValue, function(value, key) {
		if(value.quesCount>0){
			var obj={};
			obj.category_id=key;
			obj.name=value.category;
			obj.count=value.quesCount;
			categoriesFiltered.push(obj);
		}
	});
	
	resObj['surveyCount']=surveyCount;
	resObj['categoryCount']=categoryCount;
	resObj['questionsBySurvey']=questionsBySurvey;
	resObj['questionsByCategory']=questionsByCategory;
	resObj['surveyTypes']=surveyTypesFiltered;
	resObj['categories']=categoriesFiltered;
	resObj['surveyTypesKeyValue']=surveyTypesKeyValue;
	resObj['categoryKeyValue']=categoryKeyValue2;
	resObj['base_questions']=baseQuestionsFiltered;
	resObj["updatedCatIdx"]=newCatIdx;
	resObj["category_description"]=category_description;
	resObj["questions4Search"]=questions4Search;
	
	return resObj;
}	
spApp.formatStr = function(text, size) {
    text = String(text).trim();
    text = String(text).replace(/<div>/g, '\n');
    text = String(text).replace(/<[^>]+>/gm, '');
    text = String(text).replace(/&nbsp;/gi, '');
	text = String(text).replace(/&lt;/gi, '<');
    text = String(text).replace(/&gt;/gi, '>');
    text = String(text).replace(/\t+/g, "");
    //text=String(text).replace(/\n/gm, '');
    text = text.replace(/\n+/g, '\n');
    text = String(text).trim();
    if(text=="<br>"){
    	text="";
    }
    return text;
};
spApp.formatStr1 = function(dataArr) {
	angular.forEach(dataArr,function(value,key){
		 value = spApp.formatStr(value);
		 dataArr[key]=value;
	});
	return dataArr;
}
spApp.getSurveyStatus=function(start_date,end_date,date2compare){
	var dateArr=[];
	var surveyStartDate;
	var surveyEndDate;
	var today;
	var status;
	//console.log('start_date',start_date);
	//console.log('end_date',end_date)
	
	if(start_date!='' && end_date!=''){
		dateArr=start_date.split("/");
		
		surveyStartDate=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
		surveyStartDate.setHours(0,0,0,0);
		surveyStartDate=surveyStartDate.getTime();
		
		dateArr=end_date.split("/");
		surveyEndDate=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
		surveyEndDate.setHours(0,0,0,0);
		surveyEndDate=surveyEndDate.getTime();
		
		dateArr=date2compare.split("/");
		today=new Date(dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]);
		today.setHours(0,0,0,0);
		today=today.getTime();
		
		
		//console.log('surveyStartDate',surveyStartDate,'surveyEndDate',surveyEndDate,'today',today);
		//console.log('(surveyStartDate>today)',(surveyStartDate>today))
		if(surveyStartDate>today){
			status='Draft';
		}else if((surveyStartDate<=today && today<=surveyEndDate)){
			//console.log("open","surveyEndDate",surveyEndDate,"today",today);
			status='Open';
		}else if(surveyEndDate<today){
			//console.log("closed","surveyEndDate",surveyEndDate,"today",today);
			status='Closed';
		}
		//console.log('status',status)
		return status;
	}	
}