using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GenericDMS_DocumentRouter
{
    class ApprovalHistoryList
    {
         public List<ApprovalHistory> ApprovalHistoryListObj { get; set; }
        public string CurrentDate { get; set; }
    }
    class ApprovalHistory
    {
        public string AssignedToName { get; set; }
        public string AssignedToEmail { get; set; }
        public string TaskOutcome { get; set; }

        public int ApprovalCycle { get; set; }
        public string AssignedOn { get; set; }
        public string CompletedOn { get; set; }
        public string Comments { get; set; }
        // public string Status { get; set; }
        //  public string AssignedTo { get; set; }
    }
}
