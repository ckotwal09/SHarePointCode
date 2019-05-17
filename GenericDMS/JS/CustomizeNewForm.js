<script src="/sites/QMS-GenericDMS/Style Library/assets/js/libs/jquery/jquery-1.11.2.min.js"></script>
//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js" type="text/javascript"></script>
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
       fldValue1 = $("input[title*='ColumnConcatinate']");
       //document.getElementById("ColumnConcat_2a681276-c8ed-4588-b776-d7df68bb37f3_$TextField").readOnly=true;
          $("input[title='ColumnConcat']").closest("tr").hide();
           $("input[title='ColumnConcatinate']").closest("tr").hide();
			
		});





    function PreSaveAction() {
    debugger;
    		BUValue="";
   	  		ProjectValue="";
   	  		DepartmentValue="";
		fldValue.val("");
		fldValue1.val("");
		fldValue1.text("");
		 var ContentTypeControl = document.getElementById("ContentTypeName_4ec2ba91-4e41-41de-98b8-90c334cbe354_$DropDownChoice");
        var ContentTypeName ="";
        ContentTypeName = ContentTypeControl.selectedOptions[0].text;
		

         //Only Columns with metaData will have span with this class, once value is resolved
         //Make sure that position is BU,Project and then Department
       MetaDataElement= document.getElementsByClassName("valid-text");
   	   var NoOfMetaDataColumns=MetaDataElement.length;
   	   if(document.getElementById("BU_$containereditableRegion").getElementsByTagName("span").length>0)
   	   {
   	   	BUValue=document.getElementById("BU_$containereditableRegion").getElementsByTagName("span")[0].innerText;
   	   }
   	    if(document.getElementById("Project_$containereditableRegion").getElementsByTagName("span").length>0)
   	   {
   	   	ProjectValue=document.getElementById("Project_$containereditableRegion").getElementsByTagName("span")[0].innerText;
   	   }
   	    if(document.getElementById("JMCDepartment_$containereditableRegion").getElementsByTagName("span").length>0)
   	   {
   	   	DepartmentValue=document.getElementById("JMCDepartment_$containereditableRegion").getElementsByTagName("span")[0].innerText;
   	   }


   	 /*  switch(NoOfMetaDataColumns)
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
       var ConcatenatedValue=ContentTypeName+"_"+BUValue+"_"+ProjectValue+"_"+DepartmentValue;
     //  ConcatenatedValue=ConcatenatedValue.trim();
      // ConcatenatedValue=ConcatenatedValue.toLowerCase();
       fldValue.val(ConcatenatedValue);
       fldValue1.val(ConcatenatedValue);
      // fldValue1.text(ConcatenatedValue);
       console.log(ConcatenatedValue);
       debugger;
       return true;

    }
</script>