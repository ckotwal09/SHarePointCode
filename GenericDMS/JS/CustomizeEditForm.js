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
           
           $("div[title='BU']").children().prop("contenteditable",false);
		$("div[title='BU']").parent().find('img').hide();
	
		$("div[title='Project']").children().prop("contenteditable",false);
		$("div[title='Project']").parent().find('img').hide();
		
		$("div[title='Department-JMC']").children().prop("contenteditable",false);
		$("div[title='Department-JMC']").parent().find('img').hide();
		
		$("select[Title='ContentTypeName']").prop("disabled", "disabled");

			
		});



</script>