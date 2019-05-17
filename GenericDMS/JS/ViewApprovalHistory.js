var ApprovalHistory="";
$(document).ready(function()
{

		var ItemGUID=getUrlParameter("GUID");
		var IsApproved=getUrlParameter("IsApproved");
		var ListID=getUrlParameter("ListID");//2F397DB1-5D79-4938-B036-17D867F34485
		console.log(ItemGUID);
		if(ListID.length>0)
		{
			ListID=ListID.replace('}', '');
			ListID=ListID.replace('{', '');
			
		}
		GetApprovalHistory(ItemGUID,IsApproved,ListID);
		
});
   
	
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function GetApprovalHistory(ItemGUID,IsApproved,ListID)
{
	if(IsApproved =="1")
	{
		ApprovalHistory="ApprovalHistory";
	}
	else if(IsApproved =="0")
	{
		ApprovalHistory="RejectionHistory";
	}
	if(ApprovalHistory != "" && ListID!="")
	{
		$pnp.sp.web.lists.getByTitle(ApprovalHistory).items.filter("RelatedItemID eq "+ItemGUID+" and LibraryID eq '"+ListID+"'").get().then(function(data)
	{
		debugger;
		console.log(data.length);
		if(data.length>0)
		{
			var ApprovalHistory=data[0].ApprovalHistory;
			console.log(ApprovalHistory);
			var Obj=JSON.parse(ApprovalHistory);
			if(Obj.length> 0)
			{
				for(var i=0;i<Obj.length;i++)
				{
					console.log(Obj[i].AssignedToName);
					$('#ApprovalHistoryTable').append(
						                            '<tr>' +
						                                '<td>'+Obj[i].AssignedToName+'</td>'+
						                                '<td style="display:none;">'+Obj[i].AssignedToEmail+'</td>'+
						                                '<td>'+Obj[i].TaskOutcome+'</td>'+						                                 
						                                 '<td>'+Obj[i].AssignedOn+'</td>'+
						                                   '<td>'+Obj[i].CompletedOn+'</td>'+
						                                '<td>'+Obj[i].Comments+'</td>'+
						                                '<td>'+Obj[i].ApprovalCycle+'</td>'+

						                              '</tr>'
						                                
						                                );
				}
				
				var AllCrsTable= $('#ApprovalHistoryTable').DataTable({
			                    "paging":false,
			                    "info":false,
			                  		                   
			                    searching: false,
			                    dom: 'Bfrtip',
			                    "ordering": true,
			                    "order": [[ 3, "asc" ]]			                   
										                    
			                });	
			}
		}
	});
	}
	
}