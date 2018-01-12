'use strict';
var spApp = angular.module('spApp');

spApp.controller('takesurveyController', ['envsetting','$scope', '$location', '$http', '$timeout', '$rootScope', '$localStorage', '$anchorScroll','$state','Flash','$window', function(envsetting,$scope, $location, $http, $timeout, $rootScope, $localStorage, $anchorScroll,$state,Flash,$window) {
	$scope.displayContentBlock=true;
    $scope.startTime = new Date().getTime();
    
	if($localStorage.takeSurvey.errorInfo!=""){
		Flash.create('danger',$localStorage.takeSurvey.errorInfo,0, {container: 'flash-fixed-submit',id:'submit_survey'});
		$scope.displayContentBlock=false;
		$('.loader').hide();
	}
	var respondentObj=JSON.parse(JSON.stringify($localStorage.takeSurveyLoginDetails.takesurveyParticipantObj));
	var survey_instance=respondentObj.survey_instance;
    var pctComplete=0;
    /*if ($localStorage.loginDetails!=undefined && $localStorage.loginDetails!=null && $localStorage.loginDetails!="") {
        $scope.loggedInUser=JSON.parse(JSON.stringify($localStorage.loginDetails));
        $scope.callerName = "";
        if($scope.loggedInUser){
             var lastname = "";
              if($scope.loggedInUser.lastname){
                lastname = $scope.loggedInUser.lastname;
              }else{
                if($scope.loggedInUser.custDetails.lastname){
                  lastname = $scope.loggedInUser.custDetails.lastname;
                }
              }
              $scope.callerName = $scope.loggedInUser.firstname+" "+lastname;
        }
    }*/
    $scope.callerName=$localStorage.TAKE_SURVEY_CALLER_NAME;
    $localStorage.TAKE_SURVEY_CALLER_NAME="";
    //console.log('respondentObj',JSON.stringify(respondentObj));
	//console.log('survey_instance from ui',survey_instance);
	if(!survey_instance){
		survey_instance={};
	}
    
	var staticRgs=[];//["generation","state","tenure_groupings","Region","department","job_class"];
    if(respondentObj.metadatas.metaData){
    	for(var z=0;z<respondentObj.metadatas.metaData.length;z++){
    		//redmine #3902 --add or condition for custom report group
    		if(respondentObj.metadatas.metaData[z]["fieldtype"]=='demographic' || 'new'==respondentObj.metadatas.metaData[z]["fieldtype"]){
    			staticRgs.push(respondentObj.metadatas.metaData[z].field);
    		}
    	}
    }
    //console.log('staticRgs',staticRgs);
	var participantReportItems=[];
	var rgitms2insert={};
	angular.forEach(respondentObj,function(val,key){
		if(staticRgs.indexOf(key)!=-1){
			participantReportItems.push(val);
			rgitms2insert[key]=val;
		}
		
	});
	
    //console.log(participantReportItems)
	
    $scope.default_language_key = "en";
    $scope.catvalchange=true;
    $scope.language_key=respondentObj.language[0].lang_code;
    $scope.selectedLanguages=[];
    $scope.categoryTabs = [];
    $scope.selectedLanguage=respondentObj.language[0];
    if($scope.default_language_key!=$scope.language_key){
    	$scope.selectedLanguages.push({name: "English", lang_code: "en"});
    	$scope.selectedLanguages.push(respondentObj.language[0]);
    	//$scope.selectedLanguage=respondentObj.language;
    }
   
    $scope.setLanguageKey=function(item){
       // console.log(item)
    	$scope.language_key=item.lang_code;
        $scope.tabvalue=$scope.categoryTabs[0][$scope.language_key][0] ;
    	
    }
    
    $scope.questions2Save = {};
    $scope.answers = {};
    $scope.oe_ans = {};
    $scope.color = {}
    var clientId=respondentObj.clientId;
    var customer_survey_id=respondentObj.take_survey_id;
    var participant_id=respondentObj._id;
    $scope.userDetails=respondentObj;
    //$scope.callerName = respondentObj.callerName; 
        
    var serverURL = envsetting.client.serverUrl;//$location.protocol() + '://' + $location.host() + ':3010';
    $scope.configObj = {};
    $scope.configObj.fetchCustomerSurveyNRespsonse = serverURL + "/api/takesurvey/fetchCustomerSurveyNRespsonse";
    $scope.configObj.saveResponses = serverURL + "/api/takesurvey/saveResponses";
    $scope.configObj.getClientLogo = serverURL+"/api/editClient/getClientLogo/";
    $scope.surveyObj = {};
    $scope.categoryWithDescription={};
   $scope.demographicResponseAutoMappings={};
    $("body").removeClass("login_bg");
    $scope.getsurveyData=function(from_saveres) {
        $http({
            method: "POST",
            url: $scope.configObj.fetchCustomerSurveyNRespsonse,
            data:{
            	"clientId":clientId,
                "customer_survey_id":customer_survey_id,
                "participant_id":participant_id
            }
        }).then(function success(result) {
            $('.loader').hide();
             $scope.surveyObj= result.data.customer_survey[0];
            if($scope.surveyObj.demographicResponseMappings!=undefined){
                $scope.demographicResponseAutoMappings=$scope.surveyObj.demographicResponseMappings;
            }
           // console.log('$scope.demographicResponseAutoMappings',JSON.stringify($scope.demographicResponseAutoMappings))
            //console.log('$scope.surveyObj',$scope.surveyObj);
            var surveyLangCodes=$scope.surveyObj.language_codes;
			var surveyLangCodesArr=[];
			for(var x=0;x<surveyLangCodes.length;x++){
				surveyLangCodesArr.push(surveyLangCodes[x].lang_code);
			}
					
			if(surveyLangCodesArr.indexOf($scope.language_key)==-1){
				$scope.selectedLanguages=[];
			    $scope.selectedLanguage=$scope.default_language_key;
				$scope.language_key=$scope.default_language_key;
			}
			
            $scope.survey_description = $scope.surveyObj.survey_description;
            $scope.surveyResponse=result.data.responses; 
           // console.log($scope.surveyResponse)
           $scope.count=0;
           var catDupCheckArr=[];
           
           /* angular.forEach($scope.surveyObj.survey_questions, function(value, key) {
        	   for(var x=0;x<value.length;x++){
        		   if(!value[x].category[$scope.language_key][0]){
        			   $scope.language_key=$scope.default_language_key;
                       $scope.selectedLanguages=[];
        			   break;
        		   }
        	   }
           });*/
            angular.forEach($scope.surveyObj.survey_questions, function(value, key) {
            	//console.log(key,value);
                for(var x=0;x<value.length;x++){
                    value[x].category[$scope.language_key][0]=value[x].category[$scope.language_key][0].replace(/&amp;/g, '&');
                	
                	/*if($scope.categoryTabs.indexOf(value[x].category[$scope.language_key][0])==-1){
                		$scope.categoryTabs.push(value[x].category[$scope.language_key][0]);
                	}*/
                    var tmpObj=value[x];
                    if(tmpObj.question_type=='Yes/No'){
                        var newObj={};
                        var j=1;
                        for(var _key in tmpObj.answer_set[$scope.language_key]){
                            newObj[j]=tmpObj.answer_set[$scope.language_key][_key];
                            j++;
                        }
                        tmpObj.answer_set[$scope.language_key]=newObj;
                    }
                        
                    
                    if(tmpObj.question_type=='Ranked'){
                    	var rankObj=[];
                          //console.log(JSON.stringify(tmpObj))
                         
                    	 if($scope.default_language_key!=$scope.language_key){
                             
                    		 angular.forEach(tmpObj.answer_set[$scope.language_key],function(value,key){
                                 var ranktmpObj={};
                         		ranktmpObj["title"]=value;
                         		rankObj.push(ranktmpObj)
                         	});
                         	
                         	tmpObj.answer_set[$scope.language_key]=rankObj;
                    		 
                    	 }
                    	
                    	
                    	 rankObj=[];
                    	 angular.forEach(tmpObj.answer_set[$scope.default_language_key],function(value,key){
                    		var ranktmpObj={};
                          		ranktmpObj["title"]=value;
                                  rankObj.push(ranktmpObj)
                    	 });
                    	
                    	 tmpObj.answer_set[$scope.default_language_key]=rankObj;
                       
                    	
                    }
                   
                    //console.log(tmpObj)
                   	value[x].displayQues=true;
                    	$scope.count+=1;
                        value[x].questionNo=$scope.count;

                    if(catDupCheckArr.indexOf(value[x].category[$scope.language_key][0])==-1 && value[x].displayQues==true){

                        catDupCheckArr.push(value[x].category[$scope.language_key][0]);
                        if($scope.catvalchange){
                            $scope.categoryTabs.push(value[x].category);
                        }
                        angular.forEach(value[x].category,function(v,k){
                            if(k!='category_description'){
                                var descText=value[x].category.category_description[k];
                                if(descText=='Category Description'){
                                    descText="";
                                }
                                $scope.categoryWithDescription[v[0]]=descText;
                                //console.log(v[0],k,value[x].category.category_description)
                            }
                            
                        });
                         //$scope.categoryWithDescription[value[x].category[$scope.language_key][value[x].category[$scope.language_key].length-1]]=tmpObj.category.category_description[$scope.language_key];
                        
                    }
                    //console.log('$scope.categoryWithDescription',$scope.categoryWithDescription)
                    //console.log('configuredRgItems',configuredRgItems)
                   // $scope.categoryWithDescription[tmpObj.category[$scope.language_key][tmpObj.category[$scope.language_key].length-1]]=tmpObj.category.category_description[$scope.language_key];
                    
                    var resAnsObj=$.grep($scope.surveyResponse, function(obj){
                        return obj.localqid === tmpObj.localqid;
                    })[0];
                    if(resAnsObj){
                    	if(value[x].question_type=='Ranked'){
                    		  value[x].response_id=resAnsObj._id;
                              if(resAnsObj.answer[$scope.language_key]){
                                  value[x].answer_set[$scope.language_key]=resAnsObj.answer[$scope.language_key];
                              }
                             if(resAnsObj.answer[$scope.default_language_key]){
                                  value[x].answer_set[$scope.default_language_key]=resAnsObj.answer[$scope.default_language_key];
                              }
                             $scope.answers[tmpObj.localqid]=value[x]; 
                    	}else{
                    		value[x].answer=resAnsObj.answer;
                            value[x].response_id=resAnsObj._id;
                            if (value[x].displayQues==true) {
                                $scope.answers[tmpObj.localqid]=value[x];  
                            }
                    	}
                          
                     }
                }
                
                pctComplete=Math.round((Object.keys($scope.answers).length/$scope.count)*100);
            });
            /*angular.forEach($scope.surveyObj.survey_questions, function(value, key) {
            });*/
            //console.log($scope.surveyObj.survey_questions)  
            if(from_saveres==undefined){
                $scope.category_id=from_saveres;
                if($scope.categoryTabs[0]){
                     $scope.category_id=$scope.categoryTabs[0];
                     $scope.tabvalue=$scope.categoryTabs[0][$scope.language_key][0]
                }
                
            }
            $scope.catvalchange=false;
            $scope.slideload=true;
            $timeout(function() {
                angular.element('.takesurveytab a').click(function(e) {
                    e.preventDefault();
                }); 
            }, 100);
            $timeout(function(){
                $scope.height=angular.element(".category_width")[0].offsetHeight;
                 angular.element(".takesurveytab ").css("height", $scope.height);
            }, 500)
        }, function myError(response) {
            console.log("response.statusText:" + response.statusText);
        });
    }
  $scope.getlogo = function(){
        if(respondentObj.clientId){
            $http({
              method: 'POST',
              url: $scope.configObj.getClientLogo,
              data:JSON.stringify({'clientId':respondentObj.clientId}),
            }).then(function successCallback(response) {
                //console.log('get Image',response.data);
                $scope.clientlogo=response.data.data.clientLogo;
              }, function errorCallback(response) {
                    console.log('logo err', response);
              });
        }else{
            // $scope.clientlogo ='images/sp_logo.png';
        }
    }
    
    if($localStorage.takeSurvey.errorInfo==""){
    	$scope.getsurveyData();
	}
    $scope.getlogo();
    
    
   
     $scope.responseRgMappings={};
    $scope.saveAns = function(questionObj, ansIdx, oe_ans) {
        //console.log(questionObj); 
       // console.log(questionObj, ansIdx)
        var newQuestObj = JSON.parse(JSON.stringify(questionObj));
        if(newQuestObj.question_type == 'Yes/No') {
            newQuestObj.answer = ansIdx;
         }else if(newQuestObj.question_type == 'Single Select') {
        	// console.log('ansIdx',ansIdx)
            newQuestObj.answer = ansIdx;
            }else if (newQuestObj.question_type == 'Matrix') {
            // console.log(questionObj, ansIdx, oe_ans)

            if (newQuestObj.answer==undefined) {
                newQuestObj.answer={};
                newQuestObj.answer[$scope.language_key]={};
                newQuestObj.answer[$scope.language_key][oe_ans]=ansIdx;
                questionObj.answer={};
                questionObj.answer[$scope.language_key]={};
                questionObj.answer[$scope.language_key][oe_ans]=ansIdx;
            }else{
                newQuestObj.answer[$scope.language_key][oe_ans]=ansIdx;
                questionObj.answer[$scope.language_key][oe_ans]=ansIdx;             
            }
        }else if(newQuestObj.question_type=='Demographic'){
            newQuestObj.answer = ansIdx;
        }else {
        	//console.log($("#oe_" + newQuestObj.localqid).length)
            newQuestObj.answer = angular.element("#oe_" + newQuestObj.localqid).val();
        }
        $scope.answers[questionObj.localqid] = newQuestObj;
        pctComplete=Math.round((Object.keys($scope.answers).length/$scope.count)*100);
    }
    $scope.saveRank=function(event,ui,questionObj,ans) {
        var newQuestObj = JSON.parse(JSON.stringify(questionObj));
        var tmpObj={};
        if($scope.default_language_key!=$scope.language_key){
            tmpObj[$scope.language_key]=ans;
            newQuestObj.answer=tmpObj;
        }
        if($scope.default_language_key==$scope.language_key){
            tmpObj[$scope.default_language_key]=ans;
            newQuestObj.answer=tmpObj;
        }
        $scope.answers[questionObj.localqid] = newQuestObj;
        
    }
    
    $scope.saveResponse = function(ind, lastval, currenttab, ques) {
        $scope.categoryTabs.some(function(el, i) {
            if (el[$scope.language_key][0]==currenttab) {
              $scope.curenttabind=i;  
            }
            
        });
    	if(ind!=-1){
            if (Object.keys($scope.surveyObj.survey_questions).length > ind) {
               if($scope.categoryTabs[$scope.curenttabind+1]!=undefined){
					$scope.tabvalue= $scope.categoryTabs[$scope.curenttabind+1][$scope.language_key][0];
					$scope.category_id=$scope.categoryTabs[$scope.curenttabind+1];
					$scope.slickConfig2.method.slickGoTo($scope.curenttabind+1);
					$anchorScroll();
				}
            }
        }
        
        $scope.responseObj = []
         $scope.responseRgMappings={};
        angular.forEach($scope.answers, function(value, key) {
        	//console.log('value.demographicResponseMappings',JSON.stringify(value.demographicResponseMappings));
            if(value.demographicResponseMappings!=undefined){
            	if(value.demographicResponseMappings.rg!=undefined || value.demographicResponseMappings.rg!=null || value.demographicResponseMappings.rg!=""){
            		var demoMapItem=value.demographicResponseMappings.rgItems;
            		//console.log("demoMapItem",JSON.stringify(demoMapItem))
            		if(demoMapItem!=undefined&&Object.keys(demoMapItem).length>0){
            			//console.log('value.answer',value.answer);
            			var _ansText=value.answer_set[$scope.default_language_key][value.answer+""];
            			if(demoMapItem[_ansText]!=undefined){
            				//obj[value.demographicResponseMappings.rg]=demoMapItem[_ansText];
            				rgitms2insert[value.demographicResponseMappings.rg]=demoMapItem[_ansText];
            				$scope.responseRgMappings[value.demographicResponseMappings.rg]=demoMapItem[_ansText];
            			}else{
            				//$scope.responseRgMappings[value.demographicResponseMappings.rg]="";
            			}
            		}
            		
            	}
            }
        	
        });
        console.log('$scope.responseRgMappings',JSON.stringify($scope.responseRgMappings))
        angular.forEach($scope.answers, function(value, key) {
            //console.log("value",JSON.stringify(value.demographicResponseMappings));
           // console.log(value.text[$scope.language_key][value.text[$scope.language_key].length-1],value.answer);  
            var obj={}
            if (value.response_id!=undefined) {
               obj.response_id=value.response_id;
            }
            obj.maxAnswerScale=value.maxAnswerScale;
            obj.clientId=clientId;
            obj.customer_survey_id=  $scope.surveyObj._id;
            obj.participant_id=participant_id;
            obj.customer_id= $scope.surveyObj.customer_id;
            obj.base_question_id= value._id;
            var testArr=obj.base_question_id.split("_");
          
            var baseQuesObj={};
            baseQuesObj.question=value.text;
            baseQuesObj.category=value.category;
            baseQuesObj.baseQuestionId=obj.base_question_id;
            if(value.actionItems){
            	baseQuesObj.actionItems=value.actionItems;
            }else{
                baseQuesObj.actionItems=[];
            }
            
            if(value.ExcludeFromAp==undefined && !value.ExcludeFromAp){
                obj.baseQuesObj=baseQuesObj;
            }
            
            obj.localqid=value.localqid;
            // customer_survey_id= $scope.surveyObj.cusrid;
            obj.survey_name= $scope.surveyObj.survey_name;
            obj.survey_type= $scope.surveyObj.survey_type;
            obj.created= $scope.surveyObj.cdt;
            obj.modified= $scope.surveyObj.mdt;
            //console.log('pctComplete',pctComplete)
           // if(pctComplete>=50){
                obj.completedDate=new Date();
            //}
           // console.log('from brower obj.completedDate',obj.completedDate)
            
            
            
            obj.completedstatus= $scope.surveyObj.status;
            
            if(!isNaN(value.answer)){
                obj.answer= parseInt(value.answer);
            }else{
                obj.answer=value.answer;
            }
            obj.question_type= value.question_type;
            obj.questionText= value.text[$scope.default_language_key][value.text[$scope.default_language_key].length - 1];
            obj.categoryText= value.category[$scope.default_language_key][value.category[$scope.default_language_key].length - 1];
           /* if($scope.default_language_key!=$scope.language_key){
            	obj.langQuestionText= value.text[$scope.language_key][value.text[$scope.language_key].length - 1];
                obj.langCategoryText= value.category[$scope.language_key][value.category[$scope.language_key].length - 1];
            }*/
            // for export json -- start
            obj.QuestionID= value._id;
            obj.CustomerName=respondentObj.clientInfo.name;
            obj.RespondentLastName=respondentObj.lastname;
            obj.RespondentFirstName=respondentObj.firstname;
            obj.employeeid=respondentObj.employeeid;
             if('Ranked'==value.question_type){
            	var arr=[];
            	if(value.answer)
            	for(var i=0;i<value.answer[$scope.language_key].length;i++){
                    if(value.answer[$scope.language_key]){
                        arr.push(value.answer[$scope.language_key][i].title);
                    }
            		
            	}
            	obj.Response=arr;
            }else{
            	obj.Response=value.answer;
            }
            if('Matrix'==value.question_type){
                if(value.answer!=undefined){
                    var testObj=value.answer[$scope.language_key];
                    for(var _matKey in testObj){
                        if(_matKey.indexOf(".")!=-1){
                            var _matval=testObj[_matKey];
                            delete value.answer[$scope.language_key][_matKey];
                            value.answer[$scope.language_key][_matKey.replace(/\./g,'&#46;')]=_matval;
                        }

                    }
                }
                /*console.log("before",oe_ans)
                oe_ans=oe_ans.replace(/\./g,'&#46;');
                console.log("afger",oe_ans)*/
            }
             
            obj.Question= value.text[$scope.default_language_key][value.text[$scope.default_language_key].length - 1];
            obj.Category= value.category[$scope.default_language_key][value.category[$scope.default_language_key].length - 1];
            // for export json -- end
            
            angular.forEach(rgitms2insert,function(rgitm,rg){
            	obj[rg]=rgitm;
            });
            
            
            /*console.log('value.demographicResponseMappings',JSON.stringify(value.demographicResponseMappings));
            if(value.demographicResponseMappings!=undefined){
            	if(value.demographicResponseMappings.rg!=undefined || value.demographicResponseMappings.rg!=null || value.demographicResponseMappings.rg!=""){
            		var demoMapItem=value.demographicResponseMappings.rgItems;
            		console.log("demoMapItem",JSON.stringify(demoMapItem))
            		if(demoMapItem!=undefined&&Object.keys(demoMapItem).length>0){
            			console.log('value.answer',value.answer);
            			var _ansText=value.answer_set[$scope.default_language_key][value.answer+""];
            			if(demoMapItem[_ansText]!=undefined){
            				obj[value.demographicResponseMappings.rg]=demoMapItem[_ansText];
            				$scope.responseRgMappings[value.demographicResponseMappings.rg]=demoMapItem[_ansText];
            			}else{
            				//$scope.responseRgMappings[value.demographicResponseMappings.rg]="";
            			}
            		}
            		
            	}
            }*/
            //console.log('value value',value.includeInDashboard);
             if(value.includeInDashboard!=undefined && !value.includeInDashboard && value.question_type!='Matrix' && value.question_type!='Open Ended' && value.question_type!='Ranked'){
            	obj.excludeFromDashboard=true;
            }
            //{"rg":"generation","rgItems":{"No Answer/Does Not Apply":"Millenials (1980-2000)","Strongly Disagree":"Gen X (1965-1979)","Yes":"Gen X (1965-1979)"}}
            
             if(value.question_type=='Demographic' && $scope.demographicResponseAutoMappings[obj.Question]!=undefined && 
            Object.keys($scope.demographicResponseAutoMappings[obj.Question]).length>0){
                var _rgmapObj=$scope.demographicResponseAutoMappings[obj.Question];
                var _obj=_rgmapObj[value.answer];
                if(_obj!=undefined){
                    obj[_obj[0]]=_obj[1];
                }else{
                    
                    for(var _k2 in _rgmapObj){
                       // console.log('_rgmapObj[_k2][0]',_rgmapObj[_k2][0])
                        delete obj[_rgmapObj[_k2][0]];
                    }
                }
            }
            //demographicResponseMappings
            //console.log("obj",JSON.stringify(obj))
            $scope.responseObj.push(obj);
        });                      
        angular.forEach(ques, function(value, key) {
              //var resArr=Object.values($scope.answers); // Depricated for IE
            var resArr = Object.keys($scope.answers).map(function(e) {
            	return $scope.answers[e]
            })
            var resultFind= $.grep(resArr, function (obj) {
                return obj.localqid==value.localqid;
            })
            if (value.question_type=="Ranked" && value.response_id==undefined && resultFind.length==0) {
                var obj={};
                obj.maxAnswerScale=value.maxAnswerScale;
                obj.clientId=clientId;
                obj.customer_survey_id=  $scope.surveyObj._id;
                obj.participant_id=participant_id;
                obj.customer_id= $scope.surveyObj.customer_id;
                obj.base_question_id= value._id;
                var testArr=obj.base_question_id.split("_");
          
                var baseQuesObj={};
                baseQuesObj.question=value.text;
                baseQuesObj.category=value.category;
                baseQuesObj.baseQuestionId=obj.base_question_id;
                if(value.actionItems){
                    baseQuesObj.actionItems=value.actionItems;
                }else{
                    baseQuesObj.actionItems=[];
                }
                if(value.ExcludeFromAp==undefined && !value.ExcludeFromAp){
                obj.baseQuesObj=baseQuesObj;
                }
                
                obj.localqid=value.localqid;
                // customer_survey_id= $scope.surveyObj.cusrid;
                obj.survey_name= $scope.surveyObj.survey_name;
                obj.survey_type= $scope.surveyObj.survey_type;
                obj.created= $scope.surveyObj.cdt;
                obj.modified= $scope.surveyObj.mdt;
                //console.log('pctComplete',pctComplete)
               // if(pctComplete>=50){
                    obj.completedDate=new Date();
                //}
               // console.log('from brower obj.completedDate',obj.completedDate)                
                obj.completedstatus= $scope.surveyObj.status;   
                var ans={};
                ans[$scope.language_key]=value.answer_set[$scope.language_key];
                value.answer=ans;
                obj.answer=ans;
                obj.question_type= value.question_type;
                obj.questionText= value.text[$scope.default_language_key][value.text[$scope.default_language_key].length - 1];
                obj.categoryText= value.category[$scope.default_language_key][value.category[$scope.default_language_key].length - 1];
                obj.QuestionID= value._id;
                obj.CustomerName=respondentObj.clientInfo.name;
                obj.RespondentLastName=respondentObj.lastname;
                obj.RespondentFirstName=respondentObj.firstname;
                obj.employeeid=respondentObj.employeeid;
                if('Ranked'==value.question_type){
                    var arr=[];
                    if(value.answer)
                    for(var i=0;i<value.answer[$scope.language_key].length;i++){
                        if(value.answer[$scope.language_key]){
                            arr.push(value.answer[$scope.language_key][i].title);
                        }
                        
                    }
                    obj.Response=arr;
                }else{
                    obj.Response=value.answer;
                }
                obj.Question= value.text[$scope.default_language_key][value.text[$scope.default_language_key].length - 1];
                obj.Category= value.category[$scope.default_language_key][value.category[$scope.default_language_key].length - 1];
            // for export json -- end
            
                angular.forEach(rgitms2insert,function(rgitm,rg){
                    obj[rg]=rgitm;
                });
                $scope.responseObj.push(obj);

            }
            //console.log(value.maxAnswerScale, "value.maxAnswerScale")
        });

        if ($scope.responseObj.length!=0) {
            //calculate surveytime
            var stime = $scope.surveyTime()
            
            //console.log($scope.responseObj)
            $http({
                method : "POST",
                url :$scope.configObj.saveResponses,
                data: {
                    'ansObj':$scope.responseObj,
                    'survey_instance':survey_instance,
                    'customer_survey_id':customer_survey_id,
                    'participant_id':participant_id,
                    'pctComplete':pctComplete,
                    'servey_time' : stime,
                    'callerName' : $scope.callerName ,
                    'clientId':clientId,
                    'responseRgMappings':$scope.responseRgMappings,
		    'attemptsUpdate' :lastval
                }
            }).then(function mySucces(response) {
                     $scope.getsurveyData($scope.tabvalue);
                $scope.responseObj = [];
                
                if(!response.data.status){
                    Flash.clear();
                    Flash.create('danger',response.data.msg,0, {container: 'flash-fixed-submit',id:'submit_survey'});
                    $anchorScroll(); 
                    return false;
                }   
                if (lastval) {
                    Flash.clear();
                    Flash.create('success','Thank you for submitting your survey',0, {container: 'flash-fixed-submit',id:'submit_survey'});
                    $anchorScroll(); 
                    $timeout(countUp, 1500);
                    //$state.go('takesurvey-landing')
                }
                
            
                

            }, function myError(response) {
                console.log("saveRespsonses", response)
            });
        }
      
    };

    var countUp = function() {
        $window.close();
    };


      $scope.getUpdatedResponseData=function() {
        $http({
            method: "POST",
            url: $scope.configObj.fetchCustomerSurveyNRespsonse,
            data:{
            	"clientId":clientId,
                "customer_survey_id":customer_survey_id,
                "participant_id":participant_id
            }
        }).then(function success(result) {
            $scope.surveyResponse=result.data.responses; 
           // console.log($scope.surveyResponse)
           $scope.count=0;
           var catDupCheckArr=[];
           
            angular.forEach($scope.surveyObj.survey_questions, function(value, key) {
                
                for(var x=0;x<value.length;x++){
                	
                    var tmpObj=value[x];
                   
                     if(tmpObj.question_type=='Ranked'){
                    	var rankObj=[];
                          //console.log(JSON.stringify(tmpObj))
                         
                    	 if($scope.default_language_key!=$scope.language_key){
                             
                    		 angular.forEach(tmpObj.answer_set[$scope.language_key],function(value,key){
                                 var ranktmpObj={};
                         		ranktmpObj["title"]=value;
                         		rankObj.push(ranktmpObj)
                         	});
                         	
                         	tmpObj.answer_set[$scope.language_key]=rankObj;
                    		 
                    	 }
                    	
                    	
                    	 rankObj=[];
                    	 angular.forEach(tmpObj.answer_set[$scope.default_language_key],function(value,key){
                    		var ranktmpObj={};
                          		ranktmpObj["title"]=value;
                                  rankObj.push(ranktmpObj)
                    	 });
                    	
                    	 tmpObj.answer_set[$scope.default_language_key]=rankObj;
                       
                    	
                    }

                    	value[x].displayQues=true;
                    	$scope.count+=1;
                        value[x].questionNo=$scope.count;

                    //console.log('$scope.categoryWithDescription',$scope.categoryWithDescription)
                    //console.log('configuredRgItems',configuredRgItems)
                   // $scope.categoryWithDescription[tmpObj.category[$scope.language_key][tmpObj.category[$scope.language_key].length-1]]=tmpObj.category.category_description[$scope.language_key];
                    
                    var resAnsObj=$.grep($scope.surveyResponse, function(obj){
                        return obj.localqid === tmpObj.localqid;
                    })[0];
                
                    if(resAnsObj && resAnsObj.answer){
                        //console.log(resAnsObj.answer)
                    	if(value[x].question_type=='Ranked'){
                    	    value[x].response_id=resAnsObj._id;
                    	    if(resAnsObj.answer){
                    	    	 if(resAnsObj.answer[$scope.language_key]){
                                     value[x].answer_set[$scope.language_key]=resAnsObj.answer[$scope.language_key];
                                 }
                                if(resAnsObj.answer[$scope.default_language_key]){
                                     value[x].answer_set[$scope.default_language_key]=resAnsObj.answer[$scope.default_language_key];
                                 }
                                  $scope.answers[tmpObj.localqid]=value[x];
                    	    }
                              
                               //console.log($scope.answers[tmpObj.localqid]);
                    	}else{
                    		value[x].answer=resAnsObj.answer;
                            value[x].response_id=resAnsObj._id;
                            if (value[x].displayQues==true) {
                                $scope.answers[tmpObj.localqid]=value[x];  
                            }
                    	}
                          
                    }
                    
                }
                pctComplete=Math.round((Object.keys($scope.answers).length/$scope.count)*100);
            });
            
            
            $timeout(function() {
                angular.element('.takesurveytab a').click(function(e) {
                    e.preventDefault();
                });
            }, 100);
            $timeout(function(){
                $scope.height=angular.element(".category_width")[0].offsetHeight;
                 angular.element(".takesurveytab ").css("height", $scope.height);
            }, 500)
        }, function myError(response) {
            console.log("response.statusText:" + response.statusText);
        });
    }
    //tabslide
    $scope.slickConfig2 = {
        autoplay: false,
        infinite: false,
        autoplaySpeed: 1000,
        slidesToShow: 6,
        slidesToScroll: 6,
      //  variableWidth:true,
        method: {}
    };
    $scope.tabvalue = 0;
    $scope.tabschange = function(index, category) {
        $scope.tabvalue = index;
        $scope.category_id=category;
       // $scope.saveResponse(-1);
        
    };
    angular.element('.pagination a').click(function(e) {
        e.preventDefault();
    });
    if ($state.current.name='takesurvey') {
        angular.element('.top_menu').hide();
        angular.element('.takesurvey_menu').show();
    } 
    $scope.showdata=function (o1, o2) {
            return angular.equals(o1, o2);
        } 
        $(".takesurvey_menu a, .takesurvey_menu .navbar-brand").click(function(event){
        event.preventDefault();
    });

    $scope.surveyTime = function(){
        $scope.endTime = new Date().getTime();
        var finalTime = $scope.endTime - $scope.startTime ;
        var delta = Math.abs(finalTime) / 1000;
        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        // what's left is seconds
        var seconds = delta % 60;
        return Math.round(hours)+':'+Math.round(minutes)+':'+Math.round(seconds);
    }

}]);
spApp.filter('customFilter', function() {
  return function(input, search) {
    var mainObj={};
    for(var k in input){
        if(input[k].length>0){
            mainObj[k]=input[k];
        }
    }
    return mainObj;
  }
});