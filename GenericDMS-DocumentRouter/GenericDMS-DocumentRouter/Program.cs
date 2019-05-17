using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Collections;
using log4net;
using System.Threading;
using Microsoft.SharePoint.Client;
using System.Net;
using Newtonsoft.Json;

namespace GenericDMS_DocumentRouter
{
    class Program
    {
        public static string DocumentRelateUrl;
        public static string DocumentID;
        public static string LibraryName;
        public static string LibraryID;
        public static string OutPut;
        public static int ApprovalCycle;
        private static readonly ILog Log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public static string SiteCollectionURL = ConfigurationManager.AppSettings["DMS_URL"];
        public static string DropOfLibraryName = ConfigurationManager.AppSettings["DropOfLibraryName"];
        public static string RoutingRuleList = ConfigurationManager.AppSettings["RoutingRuleListName"];
        public static string RejectedDocuments = ConfigurationManager.AppSettings["RejectedDocuments"];
        public static string ApprovalHistory = ConfigurationManager.AppSettings["ApprovalHistory"];
        public static string RejectionHistory = ConfigurationManager.AppSettings["RejectionHistory"];


        public static string ServiceUserName = ConfigurationManager.AppSettings["ServiceUserName"];
        public static string ServiceUserPassword = ConfigurationManager.AppSettings["ServiceUserPassword"];
        public static string Domain = ConfigurationManager.AppSettings["kalpatarugroup"];
        static void Main(string[] args)
        {
            StartRoutingProcess();
        }

        public static void StartRoutingProcess()
        {
            try
            {
                using (ClientContext clientContext = new ClientContext(SiteCollectionURL))
                {

                    //ApprovalCycle=1;
                    clientContext.Credentials = new NetworkCredential(ServiceUserName, ServiceUserPassword, Domain);
                    Web web = clientContext.Web;

                    List docLib = web.Lists.GetByTitle(DropOfLibraryName);
                    clientContext.Load(docLib);
                    clientContext.Load(web);

                    CamlQuery caml = new CamlQuery() { ViewXml = "<View><Query><Where><Or><Eq><FieldRef Name='ApprovalStatus' /><Value Type='Choice'>Approved</Value></Eq><Eq><FieldRef Name='ApprovalStatus' /><Value Type='Choice'>Rejected</Value></Eq></Or></Where></Query></View>" };

                    ListItemCollection items = docLib.GetItems(caml);
                    FieldCollection docfields = docLib.Fields;
                    clientContext.Load(docfields);
                    clientContext.Load(items);
                    clientContext.ExecuteQuery();

                    foreach (ListItem item in items)
                    {
                        bool IsApproved;
                        if (item["ApprovalStatus"].ToString() == "Approved")
                        {
                            IsApproved = true;
                            //   Log.Info("Document "+item["Name"])
                        }
                        else
                        {
                            IsApproved = false;
                        }

                        DocumentRelateUrl = "";
                        LibraryName = "";
                        OutPut = "";
                        LibraryID = "";
                        DocumentID = "";
                        ApprovalCycle = 1;
                        clientContext.Load(item);
                        clientContext.Load(item, i => i.File);
                        clientContext.ExecuteQuery();
                        File CurrentFile = item.File;
                        Log.Info("File Name: " + item.File.Name + " IsApproved: " + IsApproved);

                        FieldUserValue serCreatedBy = item["Author"] as FieldUserValue;
                        FieldUserValue serModifiedBy = item["Editor"] as FieldUserValue;
                        DateTime dateCreatedOn = item.File.TimeCreated.ToLocalTime();
                        DateTime dateLastModifiedOn = item.File.TimeLastModified.ToLocalTime();
                        PropertyValues propertyValues = item.File.Properties;
                        var streamFile = item.File.OpenBinaryStream();

                        // Content Type Name
                        clientContext.Load(item, k => k.ContentType);
                        clientContext.ExecuteQuery();

                        if (IsApproved)
                        {
                            var contentTypeName = item.ContentType.Name;
                            string strDestinationLibraryName = string.Empty;

                            List<string> folderStructure = getFolderSbutFolderStructure(clientContext, clientContext.Web, docfields, item, contentTypeName, out strDestinationLibraryName);

                            string delimiter = "/";
                            string destinationFolderRelativeURL = folderStructure.Aggregate((i, j) => i + delimiter + j);

                            if (!string.IsNullOrEmpty(strDestinationLibraryName))
                            {
                                LibraryName = strDestinationLibraryName;
                                if (LibraryName != string.Empty)
                                {
                                    //
                                    List DestinationLibrary = web.Lists.GetByTitle(LibraryName);
                                    clientContext.Load(DestinationLibrary);
                                    clientContext.ExecuteQuery();
                                    Guid destinationLibid = DestinationLibrary.Id;
                                    LibraryID = destinationLibid.ToString();
                                    clientContext.Load(clientContext.Web);

                                    clientContext.ExecuteQuery();

                                    var folder = CreateFolderIfNotExists(clientContext.Web, strDestinationLibraryName, destinationFolderRelativeURL);
                                    DocumentRelateUrl = folder.ServerRelativeUrl + "/" + CurrentFile.Name;
                                    CurrentFile.MoveTo(DocumentRelateUrl, MoveOperations.Overwrite);
                                    //CurrentFile.CopyTo(folder.ServerRelativeUrl + "/" + CurrentFile.Name, true);

                                    clientContext.ExecuteQuery();
                                    File destinationFile = folder.Files.GetByUrl(DocumentRelateUrl);
                                    clientContext.Load(destinationFile);
                                    clientContext.Load(destinationFile.ListItemAllFields);
                                    clientContext.ExecuteQuery();
                                    ListItem lstItem = destinationFile.ListItemAllFields;
                                    DocumentID = lstItem["ID"].ToString();
                                    // lstItem["Title"] = "test";
                                    lstItem["Modified"] = dateLastModifiedOn;// item.File.TimeLastModified.ToLocalTime();
                                    lstItem["Editor"] = serModifiedBy;
                                    lstItem["Author"] = serCreatedBy;
                                    lstItem["Created"] = dateCreatedOn;// item.File.ModifiedBy;

                                    lstItem.Update();
                                    clientContext.ExecuteQuery();

                                    Log.Info("File moved destination ~ DropOffLocation: " + CurrentFile.ServerRelativeUrl + "~ Destination Library:" + strDestinationLibraryName + "~ Destination Path: " + destinationFolderRelativeURL);

                                    //
                                }


                            }
                        }

                        else
                        {

                            string strDestinationLibraryName = string.Empty;
                            strDestinationLibraryName = RejectedDocuments;
                            if (!string.IsNullOrEmpty(strDestinationLibraryName))
                            {
                                LibraryName = strDestinationLibraryName;
                                if (LibraryName != string.Empty)
                                {
                                    //
                                    List DestinationLibrary = web.Lists.GetByTitle(LibraryName);
                                    clientContext.Load(DestinationLibrary);
                                    clientContext.ExecuteQuery();
                                    var folder = DestinationLibrary.RootFolder;
                                    Guid destinationLibid = DestinationLibrary.Id;
                                    LibraryID = destinationLibid.ToString();
                                    clientContext.Load(folder);
                                    clientContext.ExecuteQuery();
                                    DocumentRelateUrl = folder.ServerRelativeUrl + "/" + CurrentFile.Name;
                                    CurrentFile.MoveTo(DocumentRelateUrl, MoveOperations.Overwrite);
                                    clientContext.Load(clientContext.Web);

                                    clientContext.ExecuteQuery();
                                    File destinationFile = folder.Files.GetByUrl(DocumentRelateUrl);
                                    clientContext.Load(destinationFile);
                                    clientContext.Load(destinationFile.ListItemAllFields);
                                    clientContext.ExecuteQuery();
                                    ListItem lstItem = destinationFile.ListItemAllFields;
                                    DocumentID = lstItem["ID"].ToString();
                                    // lstItem["Title"] = "test";
                                    lstItem["Modified"] = dateLastModifiedOn;// item.File.TimeLastModified.ToLocalTime();
                                    lstItem["Editor"] = serModifiedBy;
                                    lstItem["Author"] = serCreatedBy;
                                    lstItem["Created"] = dateCreatedOn;// item.File.ModifiedBy;

                                    lstItem.Update();
                                    clientContext.ExecuteQuery();

                                    Log.Info("File moved destination Rejected Documents: " + CurrentFile.ServerRelativeUrl + "~ Destination Library:" + strDestinationLibraryName);


                                }


                            }
                        }

                        string ApprovalHistoryListName = ApprovalHistory;
                        if (!IsApproved)
                        {
                            ApprovalHistoryListName = RejectionHistory;
                        }

                        List ApprovalHistoryList = web.Lists.GetByTitle(ApprovalHistoryListName);
                        var ApprovalHistoryListQuery = new CamlQuery() { ViewXml = "<View><RowLimit>1</RowLimit><Query><Where><Eq><FieldRef Name='RelatedDocumentUrl' /><Value Type='Note'>" + DocumentRelateUrl + "</Value></Eq></Where></Query></View>" };
                        var ApprovalHistoryItems = ApprovalHistoryList.GetItems(ApprovalHistoryListQuery);
                        clientContext.Load(ApprovalHistoryItems);
                        clientContext.ExecuteQuery();
                        if (ApprovalHistoryItems.Count >= 1)
                        {
                            foreach (ListItem ApprovalHistoy in ApprovalHistoryItems)
                            {
                                if (ApprovalHistoy["ApprovalCycle"] != null)
                                {
                                    ApprovalCycle = Convert.ToInt16(ApprovalHistoy["ApprovalCycle"]) + 1;
                                }
                            }
                        }
                        getAssociatedTaks(clientContext, CurrentFile.ServerRelativeUrl, Convert.ToString(item.Id), Convert.ToString(clientContext.Web.Id), Convert.ToString(docLib.Id));
                        if (ApprovalHistoryItems.Count >= 1)
                        {
                            foreach (ListItem ApprovalHistoy in ApprovalHistoryItems)
                            {
                                string ApprovalHistory = "";
                                string ApprovalHistoryItemID = "";
                                if (ApprovalHistoy["ApprovalHistory"] != null)
                                {
                                    ApprovalHistory = ApprovalHistoy["ApprovalHistory"].ToString();
                                }
                                if (ApprovalHistoy["ID"] != null)
                                {
                                    ApprovalHistoryItemID = ApprovalHistoy["ID"].ToString();
                                    UpdateApprovalHistoryItem(clientContext, ApprovalHistoryItemID, ApprovalHistory, ApprovalHistoryListName);
                                }

                            }
                        }

                        if (ApprovalHistoryItems.Count < 1)
                        {
                            CreateApprovalHistoryItem(clientContext, ApprovalHistoryListName);
                        }





                    }

                }
            }
            catch (Exception ex)
            {
                Log.Error("Error ocurred", ex);
            }
            Log.Info("Method StartRoutingProcess ended");
        }

        public static void getAssociatedTaks(ClientContext ctx, string documentURL, string ItemID, string WebId, string ListId)
        {

            //ApprovalHistoryList approvalHistoryListobject = new ApprovalHistoryList();
            Web web = ctx.Web;
            List lst = web.Lists.GetByTitle("Tasks");
            //var queryString = string.Format("\"ItemId\":29,\"WebId\":\"162c066b-1ab5-4cf6-baf5-67b7ea0fa09f\",\"ListId\":\"7075391e-bfad-4127-88d6-0b028bcc42b7\"","0","0","0");
            var queryString = string.Format("\"ItemId\":{0},\"WebId\":\"{1}\",\"ListId\":\"{2}\"", ItemID, WebId, ListId);

            var cq = new CamlQuery() { ViewXml = string.Format("<View><Query><Where><Contains><FieldRef Name='RelatedItems' /><Value Type='RelatedItems'>{0}</Value></Contains></Where></Query></View>", queryString) };

            ListItemCollection lic = lst.GetItems(cq);
            List<ApprovalHistory> AppHistoryCollection = new List<ApprovalHistory>();
            ctx.Load(lic, itms => itms.Include(
                                    itm => itm["ID"],
                                    itm => itm["Title"],
                                    itm => itm["TaskOutcome"],
                                    itm => itm["AssignedTo"],
                                    itm => itm["Created"],
                                    itm => itm["Modified"],
                                    itm => itm["Body"]));


            ctx.ExecuteQuery();

            foreach (var item in lic)
            {
                Console.WriteLine("ID:{0}, Title:{1};",
                    item["ID"],
                    item["Title"]);
                ApprovalHistory AppHistory = new ApprovalHistory();
                AppHistory.TaskOutcome = item["TaskOutcome"].ToString();
                AppHistory.AssignedToName = ((Microsoft.SharePoint.Client.FieldUserValue[])item["AssignedTo"])[0].LookupValue;
                AppHistory.AssignedToEmail = ((Microsoft.SharePoint.Client.FieldUserValue[])item["AssignedTo"])[0].Email;
                AppHistory.ApprovalCycle = ApprovalCycle;
                AppHistory.AssignedOn = Convert.ToDateTime(item["Created"]).ToShortDateString();
                AppHistory.CompletedOn = Convert.ToDateTime(item["Modified"]).ToShortDateString();
                string ApproversComments = "";
                if (item["Body"] != null)
                {
                    ApproversComments = item["Body"].ToString();
                }
                AppHistory.Comments = ApproversComments;
                AppHistoryCollection.Add(AppHistory);

            }
            string CurrentDateTime = DateTime.Now.ToString();
            OutPut = JsonConvert.SerializeObject(AppHistoryCollection);
        }

        public static void CreateApprovalHistoryItem(ClientContext ctx, string ApprovalHistoryListName)
        {

            Web web = ctx.Web;
            List lst = web.Lists.GetByTitle(ApprovalHistoryListName);
            ListItemCreationInformation ListItemInfo = new ListItemCreationInformation();
            ListItem oListItem = lst.AddItem(ListItemInfo);
            oListItem["RelatedDocumentUrl"] = DocumentRelateUrl;
            oListItem["LibraryName"] = LibraryName;
            oListItem["LibraryID"] = LibraryID;
            oListItem["ApprovalHistory"] = OutPut;
            oListItem["ApprovalCycle"] = 1;
            oListItem["RelatedItemID"] = DocumentID;
            oListItem.Update();
            ctx.ExecuteQuery();
        }

        public static void UpdateApprovalHistoryItem(ClientContext ctx, string ApprovalHistoryItemID, string ApprovalHistory, string ApprovalHistoryListName)
        {

            Web web = ctx.Web;
            List oList = web.Lists.GetByTitle(ApprovalHistoryListName);
            ListItem oListItem = oList.GetItemById(ApprovalHistoryItemID);

            var NewApprovalHistory = ApprovalHistory.Remove(ApprovalHistory.Length - 1);
            NewApprovalHistory = NewApprovalHistory + ",";
            var NewOutput = OutPut.Substring(1);
            NewApprovalHistory = NewApprovalHistory + NewOutput;
            oListItem["ApprovalHistory"] = NewApprovalHistory;
            oListItem["ApprovalCycle"] = ApprovalCycle;
            oListItem["RelatedItemID"] = DocumentID;
            oListItem.Update();
            ctx.ExecuteQuery();
        }
        public static Folder CreateFolderIfNotExists(Web web, string listTitle, string fullFolderPath)
        {
            if (string.IsNullOrEmpty(fullFolderPath))
                throw new ArgumentNullException("fullFolderPath");
            var list = web.Lists.GetByTitle(listTitle);
            return CreateFolderInternal(web, list.RootFolder, fullFolderPath);
        }

        private static Folder CreateFolderInternal(Web web, Folder parentFolder, string fullFolderPath)
        {
            var folderUrls = fullFolderPath.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            string folderUrl = folderUrls[0];
            var curFolder = parentFolder.Folders.Add(folderUrl);
            web.Context.Load(curFolder);
            web.Context.ExecuteQuery();

            if (folderUrls.Length > 1)
            {
                var folderPath = string.Join("/", folderUrls, 1, folderUrls.Length - 1);
                return CreateFolderInternal(web, curFolder, folderPath);
            }
            return curFolder;
        }
        public static List<string> getFolderSbutFolderStructure(ClientContext clientContext, Web web, FieldCollection docfields, ListItem FileItem, string contentType, out string destinationLibraryName)
        {
            List<string> folderSubfolderArray = new List<string>();
            destinationLibraryName = string.Empty;

            List masterRouterRuleList = web.Lists.GetByTitle(RoutingRuleList);
            clientContext.Load(masterRouterRuleList);

            CamlQuery caml = new CamlQuery() { ViewXml = "<View><Query><Where><Eq><FieldRef Name='ContentType0' /><Value Type='Choice'>" + contentType + "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>" };

            ListItemCollection routeRuleItems = masterRouterRuleList.GetItems(caml);
            clientContext.Load(routeRuleItems);
            clientContext.ExecuteQuery();

            foreach (ListItem routeRuleItem in routeRuleItems)
            {
                clientContext.Load(routeRuleItem);
                clientContext.ExecuteQuery();

                string strRootFolder = Convert.ToString(routeRuleItem["RootFolder"]);
                string SubFolder1 = Convert.ToString(routeRuleItem["SubFolder1"]);
                string SubFolder2 = Convert.ToString(routeRuleItem["SubFolder2"]);
                string SubFolder3 = Convert.ToString(routeRuleItem["SubFolder3"]);
                string SubFolder4 = Convert.ToString(routeRuleItem["SubFolder4"]);
                string SubFolder5 = Convert.ToString(routeRuleItem["SubFolder5"]);
                destinationLibraryName = Convert.ToString(routeRuleItem["DestinationLibraryName"]);

                if (!string.IsNullOrEmpty(strRootFolder))
                {
                    string strValue = 
                        
                        
                        (FileItem, strRootFolder);

                    if (!string.IsNullOrEmpty(strValue))
                        folderSubfolderArray.Add(strValue);
                }

                if (!string.IsNullOrEmpty(SubFolder1))
                {
                    string strValue = getColumnValueByType(FileItem, SubFolder1);

                    if (!string.IsNullOrEmpty(strValue))
                        folderSubfolderArray.Add(strValue);
                }

                if (!string.IsNullOrEmpty(SubFolder2))
                {
                    string strValue = getColumnValueByType(FileItem, SubFolder2);

                    if (!string.IsNullOrEmpty(strValue))
                        folderSubfolderArray.Add(strValue);
                }

                if (!string.IsNullOrEmpty(SubFolder3))
                {
                    string strValue = getColumnValueByType(FileItem, SubFolder3);

                    if (!string.IsNullOrEmpty(strValue))
                        folderSubfolderArray.Add(strValue);
                }

                if (!string.IsNullOrEmpty(SubFolder4))
                {
                    string strValue = getColumnValueByType(FileItem, SubFolder4);

                    if (!string.IsNullOrEmpty(strValue))
                        folderSubfolderArray.Add(strValue);
                }

                if (!string.IsNullOrEmpty(SubFolder5))
                {
                    string strValue = getColumnValueByType(FileItem, SubFolder5);

                    if (!string.IsNullOrEmpty(strValue))
                        folderSubfolderArray.Add(strValue);
                }
            }

            return folderSubfolderArray;
        }

        public static string getColumnValueByType(ListItem FileItem, string columnName)
        {
            string returnValue = string.Empty;

            if (FileItem[columnName].GetType().Name.ToLower().StartsWith("dictionary"))
            {
                returnValue = TaxonomyMetadatExtention.GetTaxonomyFieldValue(FileItem, columnName).Label;
            }
            else if (FileItem[columnName].GetType().Name.ToLower().StartsWith("fieldlookupvalue"))
            {
                FieldLookupValue lookup = FileItem[columnName] as FieldLookupValue;
                returnValue = lookup.LookupValue;
            }
            else if (FileItem[columnName].GetType().Name.ToLower().StartsWith("string"))
            {
                returnValue = Convert.ToString(FileItem[columnName]);
            }

            return returnValue;
        }

        private static void ImplementLoggingFuntion()
        {
            /* We have 5 levels of log message. Let's test all.
             *  FATAL
                ERROR
                WARN
                INFO
                DEBUG
             */
            var secs = 3;
            Log.Fatal("Start log FATAL...");
            Console.WriteLine("Start log FATAL...");
            Thread.Sleep(TimeSpan.FromSeconds(secs)); // Sleep some secs

            Log.Error("Start log ERROR...");
            Console.WriteLine("Start log ERROR...");
            Thread.Sleep(TimeSpan.FromSeconds(secs)); // Sleep some secs

            Log.Warn("Start log WARN...");
            Console.WriteLine("Start log WARN...");
            Thread.Sleep(TimeSpan.FromSeconds(secs)); // Sleep some secs

            Log.Info("Start log INFO...");
            Console.WriteLine("Start log INFO...");
            Thread.Sleep(TimeSpan.FromSeconds(secs)); // Sleep some secs

            Log.Debug("Start log DEBUG...");
            Console.WriteLine("Start log DEBUG...");
            Thread.Sleep(TimeSpan.FromSeconds(secs)); // Sleep some secs

            //Console.WriteLine("Press any key to close the application");
            //Console.ReadKey();
        }
    }
}
