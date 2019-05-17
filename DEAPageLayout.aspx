<%@ Page language="C#"   Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=15.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceholderID="PlaceHolderAdditionalPageHead" runat="server">
	<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	<PublishingWebControls:EditModePanel runat="server">
		<!-- Styles for edit mode only-->
		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>

        <SharePointWebControls:CssRegistration name="/_layouts/15/1033/styles/Themable/corev15.css"
			After="<% $SPUrl:~sitecollection/Style Library/assets/css/theme-default/CSSFixer.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:ListProperty Property="Title" runat="server"/> - <SharePointWebControls:FieldValue FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server" />
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderTitleBreadcrumb" runat="server"> <SharePointWebControls:ListSiteMapPath runat="server" SiteMapProviders="CurrentNavigationSwitchableProvider" RenderCurrentNodeAsLink="false" PathSeparator="" CssClass="s4-breadcrumb" NodeStyle-CssClass="s4-breadcrumbNode" CurrentNodeStyle-CssClass="s4-breadcrumbCurrentNode" RootNodeStyle-CssClass="s4-breadcrumbRootNode" NodeImageOffsetX=0 NodeImageOffsetY=289 NodeImageWidth=16 NodeImageHeight=16 NodeImageUrl="/_layouts/15/images/fgimg.png?rev=23" HideInteriorRootNodes="true" SkipLinkText="" /> </asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">
	<SharePointWebControls:ProjectProperty Property="Description" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderBodyRightMargin" runat="server">
	<div height=100% class="ms-pagemargin"><IMG SRC="/_layouts/images/blank.gif" width=10 height=1 alt=""></div>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
<script language="javascript">
$(document).ready(function() {
$(".ms-cui-topBar2").hide();
$(".settings-nav").hide();
});

</script>

    <!-- BEGIN CONTENT-->
	<div id="content">
		<section>
			<%--<div class="section-header">
				<ol class="breadcrumb">
					<li class="active">
                        <SharePointWebControls:FieldValue id="FieldValue1" FieldName="Title" runat="server"/>
					</li>
				</ol>
			</div>--%>
			<div class="section-body contain-lg">
                <div class="row">
                    
                    <%--After Edit option add/update Page Title--%>
                    <div class="row">
                        <div class="col-lg-12">
                            <PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel title-edit">
			                    <SharePointWebControls:TextField runat="server" FieldName="Title"/>
		                    </PublishingWebControls:EditModePanel>
                        </div>
                    </div>
                    
                    <%--Top Header 100%--%>
                    <div class="row">
                        <div class="col-lg-12">
                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_Header%>" ID="Header"/>
                        </div>
                    </div>

                    <%--Left and Right Top section--%>
                    <div class="row">
						<div class="col-lg-6">
                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_TopLeft%>" ID="TopLeftRow" />
						</div>
						<div class="col-lg-6">
                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_TopRight%>" ID="TopRightRow" />
						</div>
					</div>

                    <%--3-Column section--%>
                    <div class="row">
						<div class="col-lg-4">
                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_CenterLeft%>" ID="CenterLeftColumn" />
						</div>
						<div class="col-lg-4">
                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_Center%>" ID="CenterColumn" />
						</div>
						<div class="col-lg-4">
                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_CenterRight%>" ID="CenterRightColumn" />
						</div>
					</div>

                    <%--Left and Right Bottom section--%>
                    <div class="row">
						<div class="col-lg-6">
                            <WebPartPages:WebPartZone runat="server" Title="Bottom Left Row" ID="BottomLeftRow" />
						</div>
						<div class="col-lg-6">
                            <WebPartPages:WebPartZone runat="server" Title="Bottom Right Row" ID="BottomRightRow" />
						</div>
					</div>

                    <%--Bottom 100%--%>
                    <div class="row">
                        <div class="col-lg-12">
                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_Footer%>" ID="Footer"/>
                        </div>
                    </div>

                    <SharePointWebControls:ScriptBlock runat="server">if(typeof(MSOLayout_MakeInvisibleIfEmpty) == "function") {MSOLayout_MakeInvisibleIfEmpty();}</SharePointWebControls:ScriptBlock>
                </div>
            </div><!--end .section-body -->
		</section>
	</div><!--end #content-->
	<!-- END CONTENT -->

</asp:Content>
