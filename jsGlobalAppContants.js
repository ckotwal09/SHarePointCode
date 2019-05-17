
/******************************************************************/
/*Constants*/
/******************************************************************/

var CurrentDate="";
var CurrentUserName="";
var CurrentUserEmail="";
var Systemdate ="";


/******************************************************************/
/*SAPID Constants*/
/******************************************************************/
var SAPID_WebApp_URL = "http://kalpataru-connect.kalpatarugroup.com/sites/Business-Apps/SAPIDMgmt";
var SAPID_COMMUNICATOR_URL = "http://hydvspsdev01:8010/api/UserInfo";

/******************************************************************/
/*LIST Constants*/
/******************************************************************/
var ConstCategoryMasterList = 'CategoryMaster';
var ConstGradeMasterList = 'GradeMaster';
var ConstFacultyMasterList = 'FacultyMaster';
var ConstProgramMasterList = 'ProgramMaster';
var ConstEligibleRoleMasterList = 'EligibleRoleMaster';
var ConstCPRGFMappingsList = 'CPRGFMappings';

var ConstUserTNIDetailsList = 'UserTNIDetails';
var ConstUserTNIProgramDetailsList = 'UserTNIProgramDetails';

/******************************************************************/
/*Export To Excel Additinal Category Text*/
/******************************************************************/
//var ConstOtherCategoryName = 'Any other Training need(s)';
var ConstOtherCategoryName = 'Please mention any other Program that you want to attend & is not mentioned in the above offerings:';
var ConstApproveRejectCommentCategoryName = 'Reasons for returning form';
//var ConstAnticipatedImpactCategoryName = 'Anticipated Impact';
var ConstAnticipatedImpactCategoryName = 'Any other Training need(s) identified by manager:';


/******************************************************************/
/*Status Constants*/
/******************************************************************/
var ConstDraftStatusID = 1;
var ConstPendingStatusID = 2;
var ConstApprovedStatusID = 3;
var ConstRejectedStatusID = 4;

/******************************************************************/
/*Email Templates Constants*/
/******************************************************************/
var Const_Employee_When_employee_closes_his_TNI = 'Employee - When employee closes his TNI';
var Const_Manager_When_employee_closes_his_TNI = 'Manager - When employee closes his TNI';
var Const_Employee_When_manager_closes_his_TNI = 'Employee - When manager closes his TNI';
var OnRejection = 'OnRejection';

/******************************************************************/
/*Create Logged In User Array for reuse*/
/******************************************************************/

var CurrentUser = new Array();

function GetCurrentUser() {
    
    var userid = _spPageContextInfo.userId;
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";

    var requestHeaders = { "accept": "application/json; odata=verbose" };
    
    $.support.cors=true;

    return $.ajax({
        url: requestUri,
        async: false,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });
}


function GetCurrentUserProps() {
    var userid = _spPageContextInfo.userId;
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";

    var requestHeaders = { "accept": "application/json;odata=verbose" };
    
    $.support.cors=true;

    return $.ajax({
        url: requestUri,
        async: false,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: GetCurrentUserPropsonSuccess,
        error: GetCurrentUserPropsonError 
    });
}

function GetCurrentUserPropsonSuccess(data, request) {
    //CurrentUser = { DisplayName: data.d.Title, Id: data.d.Id, Email:data.d.Email, IsAdminUser:false};
    //LeftNavHelper();
    CurrentUserName=data.d.Title;
    CurrentUserEmail=data.d.Email;
    //alert(data.d.LoginName);
   // return CurrentUser;
}


function GetCurrentUserPropsonError(error)
 {
  
    Console.log("Error ocurred in jsGlobalAppContants.js file while getting current logged in user details.");
    Console.log(error);
}

function LeftNavHelper(){
    
    $pnp.sp.web.siteGroups.getByName('AdminUsers').users.get().then(function(result) {

        var boolAdminFlag = false;

        for (var i = 0; i < result.length; i++) {
            //usersInfo += "Title: " + result[i].Title + " ID:" + result[i].Id + "<br/>";
            if(result[i].Id == CurrentUser.Id)
            {
                boolAdminFlag = true;
                break;
            }
        }

        if(boolAdminFlag){
            CurrentUser.IsAdminUser = true;            
            $('#main-menu #AdminMenu').show();
        }
        else{
            $('#main-menu #AdminMenu').html('');
        }

    }).catch(function(err) {
        alert("Group not found: " + err);
    });
}

function GetUserDetailsByEmailID(email) {    
    return $pnp.sp.web.siteUsers.getByEmail(email).get().then(function(result) {
        return result;
    });
}

function onSuccess(data, request) {
    CurrentUser = { DisplayName: data.d.Title, Id: data.d.Id, Email:data.d.Email, IsAdminUser:false};
    LeftNavHelper();
    return CurrentUser;
}

function onError(error) {
    HideLoadingScreen();
    log.error("Error ocurred in jsGlobalAppContants.js file while getting current logged in user details.");
    log.error(error);
}

function GetUserDetailsbyID(UserId) {
   
   
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + UserId+ ")";

    var requestHeaders = { "accept": "application/json;odata=verbose" };
    
    $.support.cors=true;

    return $.ajax({
        url: requestUri,
        async: false,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccessA,
        error: onErrorA
    });
}

function onSuccessA(data, request) {
    
}

function FormatDate(DateTobeFormatted)
{
   	var d = new Date(DateTobeFormatted);
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var FormatedDate= d.getDate() + "/" + month[d.getMonth()] + "/" + d.getFullYear();
	return FormatedDate;
     
}



function onErrorA(error)
 {
  
    Console.log("Error ocurred in jsGlobalAppContants.js file while getting current logged in user details.");
    Console.log(error);
}



/******************************************************************/
/*Show-Hide Loading screen*/
/******************************************************************/

function ShowLoadingScreen()
{
    $('#LoadingScreen').show();
}

function HideLoadingScreen()
{
    $('#LoadingScreen').delay(900).fadeOut('slow');
}


/******************************************************************/
/*Send Email*/
/******************************************************************/

function sendEmail(from, to, cc, body, subject) {
    
    //Get the relative url of the site
    var siteurl = _spPageContextInfo.webServerRelativeUrl;
    var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";

    return $.ajax({
            contentType: 'application/json',
            url: urlTemplate,
            type: "POST",
            data: JSON.stringify({
                'properties': {
                    '__metadata': {
                        'type': 'SP.Utilities.EmailProperties'
                    },
                    'From': from,
                    'To': {
                        'results': to
                    },
                    'CC': {
                        'results': [cc]
                    },
                    'Body': body,
                    'Subject': subject
                }
            }),
            headers: {
                "Accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
            },
            success: function(data) {
                console.log('Email Sent Successfully');
                return data;
            },
            error: function(err) {
                console.error('Error in sending Email: ' + JSON.stringify(err));
            }
        });
}


//

function GetDepartMentFromSAPIDList(URL) {
  
    var requestUri = URL;

    //var requestHeaders = { "accept": "application/json;odata=verbose" };
    
    $.support.cors=true;

    return $.ajax({
        url: requestUri,
        async: false,
        contentType: "application/json;odata=verbose",
        headers: {
                                                                                    "Accept": "application/json;odata=verbose",
                                                                                    "content-type": "application/json;odata=verbose",
                                                                                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                                                                        },
        success: onSuccessGetDep,
        error: onErrorGetDep
    });
}

function onSuccessGetDep(data, request) {
    return data;
}


function onErrorGetDep(error)
 {
  
    
}

/******************************************************************/
/*Email Template Helper*/
/******************************************************************/

function getEmailTemplateByTitle(Title) {

        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('EmailTemplates')/items?$filter=(Title eq '" + Title + "')";

        return $.ajax({
                        url: url,
                        type: "GET",
                        headers: {
                            "accept": "application/json;odata=verbose",
                        },
                        success: function (results) {
                            return results;
                        },
                        error: function (error) { 
                            console.log("Error in getting EmailTemplates. Title - " + Title); 
                        }
                    });
    }


/******************************************************************/
/*Query String Helper*/
/******************************************************************/

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function GetCurrentDate()
{
   	var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    CurrentDate= d.getDate() + "/" + month[d.getMonth()] + "/" + d.getFullYear();
     
}


/******************************************************************/
/*Validation*/
/******************************************************************/

function ValidateTextBoxes(FieldId) {
    if ($(FieldId).val() == "") {

        return false;

    }

    else

        return true;
}   
  
function ValidateDropdownList(selecteditem)
{
	var SelectedItem = $(selecteditem+ " option:selected").val();
        if (SelectedItem == "Select")
         {
          
          return false;
          
         }
        else
         {
          	return true;
          }
         
}   

function GetQueryString(Key) {


    var querystrng = window.location.search.substring(1);
    var vars = querystrng.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == Key) {
            //   alert(pair[1]);
            return pair[1];
        }
    }
}


function ValidateCheckboxesbyName(checkboxname)
{
	var SelectedCheckboxesCount = 0;
	$.each($("input[name='"+checkboxname+"']:checked"), function () {
                SelectedCheckboxesCount++;
            });
    if (SelectedCheckboxesCount== 0)
    {
    	return false;
    }
    else
    {
    	return true;
    }
}

function GetUserProps(userid ) {
    //var userid = _spPageContextInfo.userId;
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";

    var requestHeaders = { "accept": "application/json;odata=verbose" };
    
    $.support.cors=true;

    return $.ajax({
        url: requestUri,
        async: false,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccessUserProps,
        error: onErrorUserProps
    });
}

function onSuccessUserProps(data, request) {
    //CurrentUser = { DisplayName: data.d.Title, Id: data.d.Id, Email:data.d.Email, IsAdminUser:false};
    //LeftNavHelper();
   // CurrentUserName=data.d.Title;
    UserEmail=data.d.Email;
    //alert(data.d.LoginName);
   // return CurrentUser;
}


function onErrorUserProps(error)
 {
  
    Console.log("Error ocurred in jsGlobalAppContants.js file while getting current logged in user details.");
    Console.log(error);
}
// Convert Grade Into Numeric Eqivalent

function ConvertGradeToNumber(Grade)
{
	var NumericGrade;
	switch (Grade) {
		case "s6":
			NumericGrade= 1;
			break;
		  case "S6":
			NumericGrade= 1;
			break;
			case "s5":
			NumericGrade= 2;
			break;
		  case "S5":
			NumericGrade= 2;
			break;
			case "S4":
			NumericGrade= 3;
			break;
		  case "s4":
			NumericGrade= 3;
			break;
			case "s3":
			NumericGrade= 4;
			break;
		  case "S3":
			NumericGrade= 4;
			break;
			case "s2":
			NumericGrade= 5;
			break;
		  case "S2":
			NumericGrade= 5;
			break;
			case "s1":
			NumericGrade= 6;
			break;
		  case "S1":
			NumericGrade= 6;
			break;
		case "m5":
			NumericGrade= 7;
			break;
		  case "M5":
			NumericGrade= 7;
			break;
			case "m4":
			NumericGrade= 8;
			break;
		  case "M4":
			NumericGrade= 8;
			break;
			case "m3":
			NumericGrade= 9;
			break;
		  case "M3":
			NumericGrade= 9;
			break;
			case "m2":
			NumericGrade= 10;
			break;
		  case "M2":
			NumericGrade= 10;
			break;
			case "m1":
			NumericGrade= 11;
			break;
		  case "M1":
			NumericGrade= 11;
			break;
			case "UC":
			NumericGrade= 12;
			break;
			case "uC":
			NumericGrade= 12;
			break;
		  case "uc":
			NumericGrade= 12;
			break;
			case "Uc":
			NumericGrade= 12;
			break;
		   default:
			NumericGrade= 0;
			
			
	}
	
	return NumericGrade;
     
}



$(document).ready(function()
 {
 	
 	
 Systemdate = new Date();
	
   GetCurrentDate();
   GetCurrentUserProps();
    

  
  
   });
   
