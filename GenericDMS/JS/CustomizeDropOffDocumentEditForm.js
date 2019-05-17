<script src="/sites/QMS-GenericDMS/Style Library/assets/js/libs/jquery/jquery-1.11.2.min.js"></script>
<script src="/sites/QMS-GenericDMS/Style%20Library/assets/PnP/fetch.min.js" type="text/javascript"></script>
<script src="/sites/QMS-GenericDMS/Style%20Library/assets/PnP/es6-promise.min.js" type="text/javascript"></script>
<script src="/sites/QMS-GenericDMS/Style%20Library/assets/PnP/pnp.min.js" type="text/javascript"></script>
<script type="text/javascript" src="/sites/QMS-GenericDMS/SiteAssets/JS/jquery.SPServices-2014.02.js"></script>
<script src="/sites/QMS-GenericDMS/Style%20Library/GenericDMS/JS/moment.js">
</script>




<script>
    //Init Promise
    ES6Promise.polyfill();

    //Setup PNP header
    $pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
                //,"X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                //"content-type": "application/json;odata=verbose",
                //"If-Match": "*"
        }
    });
</script>

<script type="text/javascript">
    var BUValue="";
    var ProjectValue="";
    var DepartmentValue="";
    var ContentTypeName="";
    var MetaDataElement;
    var fldValue;
    // = $("input[title*='ColumnConcat']")
    
    $(document).ready(function() {
        debugger;
       fldValue = $("input[title*='ColumnConcat']");
      // document.getElementById("ColumnConcat_67f62936-5777-43ad-b1d8-adb1c9a2807d_$TextField").readOnly=true;
    //  document.getElementById("ColumnConcat_67f62936-5777-43ad-b1d8-adb1c9a2807d_$TextField").style.display="none";
    	$("select[title='ApprovalStatus']").prop("disabled", true);
       $("input[title='ColumnConcat']").closest("tr").hide();
			
		});





    function PreSaveAction() {
    debugger;
    		BUValue="";
   	  		ProjectValue="";
   	  		DepartmentValue="";
		fldValue.val("");
		

         //Only Columns with metaData will have span with this class, once value is resolved
         //Make sure that position is BU,Project and then Department
       MetaDataElement= document.getElementsByClassName("valid-text");
   	   var NoOfMetaDataColumns=MetaDataElement.length;
   	  // /*Testing
   	   // var ContentTypeControl = document.getElementById("ctl00_ctl40_g_b858a8ee_bd81_4414_b6ef_4384b6c1aa31_ctl00_ctl02_ctl00_ctl01_ctl00_ContentTypeChoice");
   	  // var ContentTypeControl = $("#ctl00_ctl40_g_b858a8ee_bd81_4414_b6ef_4384b6c1aa31_ctl00_ctl02_ctl00_ctl01_ctl00_ContentTypeChoice");
        var ContentTypeName ="";
        ContentTypeName = $('#ctl00_ctl40_g_b858a8ee_bd81_4414_b6ef_4384b6c1aa31_ctl00_ctl02_ctl00_ctl01_ctl00_ContentTypeChoice :selected').text(); 
        //Testing Ends */


   	   /*switch(NoOfMetaDataColumns)
   	   {
   	   	case 0:
   	   
   	   	
   	   	break;
   	   	
   	  	case 1:
   	  	
   	   	{
   	   		console.log("1 MetaData entered");
   	   		BUValue=MetaDataElement[0].innerText;
   	   		
   	   	}
   	   	break;
   	   	
		case 2:
   	   	{
   	  		console.log(" 2 MetaData entered");
   	  		BUValue=MetaDataElement[0].innerText;
   	  		ProjectValue=MetaDataElement[1].innerText;
   	  		
   	  	}   	   	break;
   	   	
   	   	case 3:
   	   	{
   	  		console.log(" 3 MetaData entered");
   	  		BUValue=MetaDataElement[0].innerText;
   	  		ProjectValue=MetaDataElement[1].innerText;
   	  		DepartmentValue=MetaDataElement[2].innerText;
   	  		
   	  	}
   	  	   	   	break;
   	   	
   	   	default:
   	   	console.log("Something went wrong");
   	   	break;  	   	
   	   	
   	   	
   	   }*/
   	   {
   	   	BUValue=document.getElementById("BU_$containereditableRegion").getElementsByTagName("span")[0].innerText;
   	   }

   	    if(document.getElementById("Project_$containereditableRegion") != null)
	    {
   	    	if(document.getElementById("Project_$containereditableRegion").getElementsByTagName("span").length>0)
   	   	{
   	   		ProjectValue=document.getElementById("Project_$containereditableRegion").getElementsByTagName("span")[0].innerText;
   	   	}
	    }

   	  if(document.getElementById("JMCDepartment_$containereditableRegion") != null)
	    {
   	    	if(document.getElementById("JMCDepartment_$containereditableRegion").getElementsByTagName("span").length>0)
	   	   {
   	   		DepartmentValue=document.getElementById("JMCDepartment_$containereditableRegion").getElementsByTagName("span")[0].innerText;
   	   	}
	    }

       var ConcatenatedValue=ContentTypeName+"_"+BUValue+"_"+ProjectValue+"_"+DepartmentValue;
       fldValue.val(ConcatenatedValue);
     // fldValue.text(ConcatenatedValue);
       console.log(ConcatenatedValue);
       debugger;
       return true;

    }
</script>