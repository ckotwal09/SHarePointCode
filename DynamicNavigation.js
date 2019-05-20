            var DynamicNav = "";
            $(document).ready(function () {

                //alert("Hi");
				ShowLoadingScreen();
                $(".o365cs-nav-brandingText").hide();
				$(".wf-o365-gear").hide();
				$(".wf-o365-question").hide();
				$(".ms-cui-topBar2").hide();
				$(".o365cs-nav-brandingText").hide();
				$(".wf-o365-question").hide();
                $pnp.sp.web.lists.getByTitle("Navigation").items.get().then(function (data) {
                    debugger;
                    
                    if (data.length > 0)
                    {
                      //  alert("items Found");
                        for (var i = 0; i < data.length; i++)
                        {

                           AddSubFolders(data[i].Title, data[i].URL, data[i].CssClass);
                        }
                        
                        
                    }
                    
                });
                HideLoadingScreen();
            });

            function AddSubFolders(Level1FolderName, Level1FolderURL, Level1FolderCss)
            {
                debugger;
                $pnp.sp.web.lists.getByTitle("NavigationSubLinks").items.select("Title", "MainFolder/Title", "URL").expand("MainFolder").filter("MainFolder/Title eq '" + Level1FolderName + "'").get().then(function (SubFolderdata) {
                    debugger;
                    DynamicNav="";
                    if (SubFolderdata.length > 0)
                    {


                        DynamicNav = '<li class="gui-folder">' +
							                   ' <a>' +
								                   ' <div class="gui-icon"><i class="' + Level1FolderCss + '"></i></div>' +
								                   ' <span class="title">' + Level1FolderName + '</span>' +
							                   ' </a>'+
                                               '<ul style="display: none;">';
                        console.log("Folder has SubFolders");
                        for (i = 0; i < SubFolderdata.length; i++)
                        {
                            DynamicNav += '<li><a href="' + SubFolderdata[i].URL+ '"><span class="title">' + SubFolderdata[i].Title + '</span></a></li>';
                        }
                        DynamicNav += '</ul></li>';
                        $("#main-menu").append(DynamicNav);
                    }
                    else

                    {
                        DynamicNav = '<li id="MenuSearch" class="">' +
                                              ' <a href="' + Level1FolderURL + '">' +
                                                  ' <div class="gui-icon"><i class="' + Level1FolderCss + '"></i></div>' +
                                                   '<span class="title">' + Level1FolderName + '</span>' +
                                              '</a>' +
                                          ' </li>';
                        $("#main-menu").append(DynamicNav);
                    }
                });

            }
			
			function ShowLoadingScreen()
			{
				$('#LoadingScreen').show();
			}

			function HideLoadingScreen()
			{
				$('#LoadingScreen').delay(900).fadeOut('slow');
			}
