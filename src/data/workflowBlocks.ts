export interface BlockData {
  title: string;
  description: string;
  inputs?: {
    [key: string]: {
      type: string;
      description: string;
      default?: string | number | boolean | string[] | Record<string, unknown>;
      language?: string;
      properties?: {
        [key: string]: {
          type: string;
          description: string;
          default?: string | number | boolean | string[];
        };
      };
      items?: Array<{
        name?: string;
        type: string;
        description?: string;
        formula?: string;
        prompt?: string;
        url?: string;
        target?: string;
        value?: string;
      }>;
    };
  };
  outputs?: {
    name: string;
    type: string;
    description: string;
  }[];
  actions?: string[]; // For running state messages
  result?: {
    summary: string;
    data?: Record<string, unknown>; // Replacing 'any' with a more specific type
  };
}

export const workflowBlocks: Record<string, BlockData[]> = {
  trigger: [
    {
      title: "Monitor Email Inbox",
      description:
        "Receive policy endorsement requests from endorse-address@foundation.foundation.email and extract attached PDF documents",
      inputs: {
        email: {
          type: "string",
          description: "Email address to monitor",
          default: "endorse-address@foundation.foundation.email",
        },
        api: {
          type: "code",
          description: "API configuration for programmatic triggers",
          language: "bash",
          default: `curl --location --request POST "https://api.tryfoundation.ai/v1/task"
-F "files=@/Users/path-to-file/example-email.pdf; filename=example-email.pdf"
-F "metadata=' {
    "workflow_id": "6229835b-f61e-4c81-9e9f-40c4ef38b5fd",
    "task_id": "Some unique task id",
    "files": [
        {
            "model": "Email",
            "name": "example-email.pdf"
        }
    ]
}'"`,
        },
      },
      outputs: [
        {
          name: "document",
          type: "object",
          description: "Uploaded document metadata and content",
        },
      ],
      actions: [
        "Receiving uploaded file",
        "Validating file format",
        "Scanning for malware",
        "Categorizing document type",
        "Preparing for extraction",
        "Sending to processing queue",
      ],
      result: {
        summary:
          "Insurance policy document 'WC-12345678' received and queued for processing",
        data: {
          documentId: "DOC-87654321",
          filename: "Chelsea_Florist_Policy_2024.pdf",
          documentType: "Insurance Policy",
          pageCount: 12,
          uploadedBy: "jamie.cuffe@pas.com",
          timestamp: "2024-01-15T09:32:47Z",
        },
      },
    },
  ],
  extraction: [
    {
      title: "Parse Address Change",
      description:
        "Extract insured name, old address, and new address from the endorsement request email. Identify if this is an address change, additional insured, or other type of endorsement",
      inputs: {
        fields: {
          type: "object",
          description: "Fields to extract from the document",
          properties: {
            Insured_Name: {
              type: "string",
              description: "Name of the insured entity",
            },
            New_Address_City: {
              type: "string",
              description: "New city for address change",
            },
            Old_Address: {
              type: "string",
              description: "Previous address",
            },
            Endorsement_type: {
              type: "string",
              description:
                "Options are additional_insured, address_change or other",
            },
          },
        },
      },
      outputs: [
        {
          name: "policyData",
          type: "object",
          description: "Structured policy information",
        },
      ],
      actions: [
        "Analyzing document structure",
        "Identifying policy sections",
        "Extracting policy number",
        "Extracting insured business details",
        "Extracting carrier information",
        "Extracting policy period dates",
        "Extracting premium amount",
        "Extracting coverage details",
        "Extracting employee classification",
        "Extracting endorsements",
        "Validating extracted information",
      ],
      result: {
        summary:
          "Successfully extracted data from Chelsea Florist policy document",
        data: {
          policyNumber: "WC-123456789",
          insuredBusiness: "Chelsea Florist",
          carrier: "Garden State Insurance Co.",
          policyPeriod: "January 1, 2024 - December 31, 2024",
          premium: "$6,000",
          employeeClassification: {
            florist: 1,
            cashier: 1,
            deliveryDriver: 1,
          },
          coverageLimits: {
            bodilyInjuryByAccident: "$100,000 per accident",
            bodilyInjuryByDisease: "$100,000 per employee",
            totalAggregate: "$500,000",
          },
          endorsements: [
            "Waiver of Subrogation: Included",
            "Voluntary Compensation: Included",
          ],
          effectiveDate: 1672531200,
          expirationDate: 1704067200,
        },
      },
    },
  ],
  rules: [
    {
      title: "Check Endorsement Rules",
      description:
        "Verify if the address change is valid by checking: 1) effective date is before 2025, 2) new address is different from old address, 3) address format is valid, 4) requires underwriter approval if over $500k",
      inputs: {
        rules: {
          type: "array",
          description: "List of rules to validate against",
          items: [
            {
              name: "Check date",
              type: "condition",
              description:
                "If the effective date of change listed is before 2025 pass otherwise fail",
            },
            {
              name: "Formula rule 2",
              type: "formula",
              formula: "=Date( @Email.Insured_Name ) > 2025",
            },
            {
              name: "Prompt rule 3",
              type: "prompt",
              prompt:
                "@Email.New_Address_City is different from @Email.Old_Address",
            },
            {
              name: "User Approval Rule 4",
              type: "user",
              description: "Requires manual user approval",
            },
          ],
        },
      },
      outputs: [
        {
          name: "validationResults",
          type: "object",
          description: "Validation results with status for each rule",
        },
      ],
      actions: [
        "Checking policy number format",
        "Validating carrier name against database",
        "Verifying coverage limits against minimums",
        "Checking policy dates are valid",
        "Verifying premium calculation",
        "Checking address format compliance",
        "Validating zip code",
        "Verifying beneficiary information",
        "Checking insurance amount against limits",
        "Validating endorsements",
        "Generating validation report",
      ],
      result: {
        summary: "6 rules passed, 1 failed, 1 pending manual review",
        data: {
          passedRules: 6,
          failedRules: 1,
          pendingRules: 1,
          totalRules: 8,
          details: [
            {
              rule: "Policy number format",
              status: "passed",
              message: "WC-123456789 matches required format",
            },
            {
              rule: "Carrier verification",
              status: "passed",
              message: "Garden State Insurance Co. is a verified carrier",
            },
            {
              rule: "Coverage limits",
              status: "passed",
              message: "Coverage limits meet minimum requirements",
            },
            {
              rule: "Policy dates",
              status: "passed",
              message: "Policy period is valid and current",
            },
            {
              rule: "Address verification",
              status: "passed",
              message:
                "The legal residence address is a standard street address",
            },
            {
              rule: "Beneficiary verification",
              status: "passed",
              message: "At least one beneficiary is specified",
            },
            {
              rule: "Insurance amount",
              status: "failed",
              message:
                "High insurance amount: $1,000,000 exceeds maximum $500,000",
            },
            {
              rule: "PO Box verification",
              status: "pending",
              message: "Manual review required for possible PO Box address",
            },
          ],
          errorMessages: ["Formula = 1000000 <= 500000 evaluated to Failed"],
        },
      },
    },
  ],
  action: [
    {
      title: "Submit to Policy System",
      description:
        "Log into forms.fillout.com, navigate to the endorsement form, enter the extracted address details, and submit the changes for processing",
      inputs: {
        steps: {
          type: "array",
          description: "Sequence of steps to execute",
          items: [
            {
              type: "navigate",
              url: "https://forms.fillout.com/t/JppEmAGZYdy",
              description: "Navigate to policy system",
            },
            {
              type: "click",
              target: "log in",
              description: "Click login button",
            },
            {
              type: "type",
              value: "username jamie",
              description: "Enter username",
            },
            {
              type: "type",
              value: "password password",
              description: "Enter password",
            },
            {
              type: "click",
              target: "Go button",
              description: "Click Go button",
            },
            {
              type: "click",
              target: "submit",
              description: "Submit form",
            },
          ],
        },
      },
      outputs: [
        {
          name: "updateResult",
          type: "object",
          description: "Result of policy system update",
        },
      ],
      actions: [
        "Navigating to policy system",
        "Logging in with credentials",
        "Searching for policy number",
        "Clicking Oracle Policies and continue",
        "Clicking search",
        "Selecting policy from search results",
        "Entering updated information",
        "Clicking submit",
        "Confirming changes",
        "Generating confirmation report",
      ],
      result: {
        summary: "Policy WC-123456789 successfully updated in system",
        data: {
          policyId: "WC-123456789",
          updateStatus: "Success",
          actionSteps: [
            {
              name: "Navigate to policy portal",
              url: "https://forms.fillout.com/t/42Mu9wkXsus",
              completed: true,
            },
            {
              name: "Log in to system",
              credentials: "jamie.cuffe@pas.com",
              completed: true,
            },
            {
              name: "Search for policy",
              query: "@Application.Advisor_Entity",
              completed: true,
            },
            {
              name: "Update policy details",
              fields: ["Premium", "Coverage Type", "Endorsements"],
              completed: true,
            },
            {
              name: "Submit changes",
              confirmation: "TRX-20240311-78954",
              completed: true,
            },
          ],
          systemResponse: "Policy updated successfully",
          transactionId: "TRX-20240311-78954",
          timestampUTC: "2024-03-11T14:27:33Z",
        },
      },
    },
    {
      title: "Send Email Notification",
      description:
        "Generate and send confirmation email to the policyholder with details of the address change and any additional requirements or next steps",
      inputs: {
        notification: {
          type: "object",
          description: "Email notification configuration",
          properties: {
            recipient: {
              type: "string",
              description: "Email address of the policyholder",
              default: "info@chelseaflorist.com",
            },
            template: {
              type: "string",
              description: "Email template to use",
              default: "policy_update_notification.html",
            },
            attachments: {
              type: "array",
              description: "Files to attach to the email",
              default: ["Chelsea_Florist_Policy_Summary.pdf"],
            },
          },
        },
      },
      outputs: [
        {
          name: "notificationResult",
          type: "object",
          description: "Result of notification delivery",
        },
      ],
      actions: [
        "Generating email template",
        "Adding policy information",
        "Attaching policy summary PDF",
        "Adding agent contact details",
        "Sending email to policyholder",
        "Recording delivery status",
        "Logging notification in CRM",
      ],
      result: {
        summary: "Policy update notification sent to policyholder",
        data: {
          recipient: "info@chelseaflorist.com",
          subject: "Your Workers Comp Policy WC-123456789 Has Been Updated",
          sentTimestamp: "2024-03-11T15:32:18Z",
          deliveryStatus: "Delivered",
          openedTimestamp: "2024-03-11T16:45:22Z",
          actionSteps: [
            {
              name: "Generate email content",
              template: "policy_update_notification.html",
              completed: true,
            },
            {
              name: "Prepare attachments",
              files: ["Chelsea_Florist_Policy_Summary.pdf"],
              completed: true,
            },
            {
              name: "Send notification",
              channel: "email",
              status: "successful",
              completed: true,
            },
            {
              name: "Record in customer activity log",
              system: "CRM",
              recordId: "ACT-43981",
              completed: true,
            },
          ],
          messageId: "msg_2342678@notifications.insure.com",
          error: null,
        },
      },
    },
    {
      title: "Process Policy Changes",
      description:
        "Update policy records in core system, recalculate premiums if needed, generate endorsement documents, and notify broker of changes",
      inputs: {
        policyUpdate: {
          type: "object",
          description: "Policy update configuration",
          properties: {
            policyNumber: {
              type: "string",
              description: "Policy number to update",
            },
            updateType: {
              type: "string",
              description: "Type of policy modification",
            },
            effectiveDate: {
              type: "string",
              description: "When changes take effect",
            },
          },
        },
      },
      outputs: [
        {
          name: "processingResult",
          type: "object",
          description: "Results from processing pipeline",
        },
      ],
      actions: [
        "Accessing policy management system",
        "Validating update request",
        "Applying policy changes",
        "Recalculating premiums",
        "Updating billing information",
        "Generating revised documents",
        "Notifying stakeholders",
        "Scheduling follow-up activities",
      ],
      result: {
        summary: "Successfully processed Chelsea Florist policy update",
        data: {
          policyNumber: "WC-123456789",
          updateType: "Policy Modification",
          effectiveDate: "2024-04-01",
          actionSteps: [
            {
              name: "Validate request",
              authority: "Underwriter #42",
              status: "Approved",
              completed: true,
            },
            {
              name: "Update policy record",
              system: "PolicyCore",
              changeId: "CHG-28754",
              completed: true,
            },
            {
              name: "Update billing system",
              system: "BillingCenter",
              transactionId: "BIL-76542",
              completed: true,
            },
            {
              name: "Generate endorsement document",
              documentId: "END-23451",
              completed: true,
            },
            {
              name: "Notify broker",
              recipientId: "BRK-3421",
              completed: true,
            },
          ],
          processingTime: "4.3 minutes",
          completedTimestamp: "2024-03-11T10:45:22Z",
          status: "Complete",
        },
      },
    },
    {
      title: "Create Rules Report",
      description:
        "Generate a detailed PDF report showing which business rules passed or failed, with specific reasons and recommendations for any failures",
      inputs: {
        report: {
          type: "object",
          description: "Report configuration",
          properties: {
            format: {
              type: "string",
              description: "Report format",
              default: "PDF",
            },
            includeDetails: {
              type: "boolean",
              description: "Include detailed rule evaluations",
              default: true,
            },
          },
        },
      },
      outputs: [
        {
          name: "report",
          type: "file",
          description: "PDF validation report",
        },
      ],
      actions: [
        "Collecting validation results",
        "Formatting report structure",
        "Categorizing rules by status",
        "Adding details for failed validations",
        "Generating error explanations",
        "Adding compliance recommendations",
        "Creating executive summary",
        "Adding timestamp and signatures",
        "Generating PDF document",
        "Storing report in document management system",
      ],
      result: {
        summary: "Generated data validation report for Chelsea Florist policy",
        data: {
          reportId: "RPT-24-10589",
          policyNumber: "WC-123456789",
          validationScore: "75%",
          criticalIssues: 1,
          warnings: 2,
          recommendations: 3,
          reportDate: "2024-03-11",
          fileName: "validation_WC-123456789_20240311.pdf",
          fileSize: "842KB",
          errorSummary:
            "High insurance amount exceeds threshold: Formula = 1000000 <= 500000 evaluated to Failed",
        },
      },
    },
    {
      title: "Export Rules Data",
      description:
        "Create a CSV file containing all rule evaluations from March 1-11, including pass/fail status, error messages, and validation scores",
      inputs: {
        export: {
          type: "object",
          description: "Export configuration",
          properties: {
            startDate: {
              type: "string",
              description: "Start date for export range",
              default: "2024-03-01",
            },
            endDate: {
              type: "string",
              description: "End date for export range",
              default: "2024-03-11",
            },
            format: {
              type: "string",
              description: "Export format",
              default: "CSV",
            },
          },
        },
      },
      outputs: [
        {
          name: "exportFile",
          type: "file",
          description: "CSV export file with rule application data",
        },
      ],
      actions: [
        "Gathering rule application data",
        "Formatting column headers",
        "Transforming rule results to tabular format",
        "Adding metadata columns",
        "Adding timestamp information",
        "Including validation scores",
        "Filtering by date range",
        "Adding error messages for failed rules",
        "Generating CSV file",
        "Compressing export file",
      ],
      result: {
        summary: "Exported rule applications for 35 policies to CSV",
        data: {
          exportFile: "rule_applications_March2024.csv",
          recordCount: 35,
          ruleCount: 8,
          periodCovered: "March 1-11, 2024",
          totalRuleApplications: 280,
          passRate: "82%",
          failRate: "15%",
          pendingRate: "3%",
          commonErrors: [
            "Insurance amount exceeded threshold (15 occurrences)",
            "Missing beneficiary information (8 occurrences)",
            "Invalid PO Box address (6 occurrences)",
          ],
          exportTimestamp: "2024-03-11T16:45:22Z",
          error: null,
        },
      },
    },
    {
      title: "Generate Status Report",
      description:
        "Create a management summary showing policy processing metrics, including success rate, processing time, and common issues found",
      inputs: {
        summary: {
          type: "object",
          description: "Summary report configuration",
          properties: {
            metrics: {
              type: "array",
              description: "Metrics to include in report",
              default: [
                "Success Rate",
                "Processing Time",
                "Common Issues",
                "Carrier Performance",
              ],
            },
            format: {
              type: "string",
              description: "Report format",
              default: "PDF",
            },
          },
        },
      },
      outputs: [
        {
          name: "summaryReport",
          type: "file",
          description: "PDF summary report",
        },
      ],
      actions: [
        "Collecting policy processing statistics",
        "Analyzing validation trends",
        "Identifying common failure patterns",
        "Calculating processing efficiency metrics",
        "Generating executive dashboard",
        "Creating policy status breakdown",
        "Adding carrier performance metrics",
        "Generating trend visualizations",
        "Compiling recommendations",
        "Creating PDF report",
      ],
      result: {
        summary: "Generated processing summary report for March 11 batch",
        data: {
          reportName: "Policy_Processing_Summary_March11.pdf",
          processingDate: "2024-03-11",
          policiesProcessed: 42,
          successRate: "85%",
          averageProcessingTime: "4.3 minutes",
          commonIssues: [
            "High insurance amounts requiring manual review",
            "Missing beneficiary information",
            "Address validation issues",
          ],
          topCarriers: [
            "Garden State Insurance Co.",
            "LPL Insurance Associates, Inc.",
            "Foundation Insurance Group",
          ],
          reportSize: "2.4MB",
          pageCount: 15,
          error: null,
        },
      },
    },
  ],
  condition: [
    {
      title: "Route by Amount",
      description:
        "Check if policy amount exceeds $500,000 or risk score is above 75 - if yes, route to underwriter for manual review, otherwise proceed with automatic processing",
      inputs: {
        thresholds: {
          type: "object",
          description: "Threshold values for routing decisions",
          properties: {
            maxAutoApprovalAmount: {
              type: "number",
              description: "Maximum amount for automatic approval",
              default: 500000,
            },
            riskScoreThreshold: {
              type: "number",
              description: "Risk score threshold for manual review",
              default: 75,
            },
          },
        },
      },
      outputs: [
        {
          name: "processingPath",
          type: "string",
          description: "Determined processing path",
        },
      ],
      actions: [
        "Analyzing policy premium",
        "Checking coverage limits",
        "Evaluating business type risk factor",
        "Checking employee classification",
        "Calculating risk score",
        "Determining approval authority level",
        "Checking for manual review triggers",
        "Deciding processing path",
      ],
      result: {
        summary:
          "High insurance amount detected, routing for manual underwriter review",
        data: {
          premium: "$6,000",
          coverageAmount: "$1,000,000",
          thresholdExceeded: true,
          riskScore: 72,
          businessType: "Retail - Florist",
          employeeCount: 3,
          processingPath: "manual-underwriter-review",
          passedRules: 2,
          failedRules: 1,
          totalRules: 3,
          details: [
            {
              rule: "Premium Range Check",
              status: "passed",
              message: "Premium amount $6,000 is within acceptable range",
            },
            {
              rule: "Business Type Risk",
              status: "passed",
              message: "Retail - Florist is a low-risk business type",
            },
            {
              rule: "Coverage Amount Limit",
              status: "failed",
              message:
                "Coverage amount $1,000,000 exceeds maximum limit of $500,000",
            },
          ],
          reason:
            "Insurance amount $1,000,000 exceeds automatic approval threshold of $500,000",
          error: "Formula = 1000000 <= 500000 evaluated to Failed",
        },
      },
    },
  ],
  generation: [
    {
      title: "Create Change Summary",
      description:
        "Generate a PDF document summarizing all policy changes made, including old vs new values, effective dates, and approval details",
      inputs: {
        template: {
          type: "object",
          description: "Document template configuration",
          properties: {
            sections: {
              type: "array",
              description: "Sections to include in summary",
              default: [
                "Policy Information",
                "Insured Details",
                "Coverage Summary",
                "Employee Classification",
                "Endorsements",
                "Premium Breakdown",
                "Contact Information",
              ],
            },
            format: {
              type: "string",
              description: "Output format",
              default: "PDF",
            },
          },
        },
      },
      outputs: [
        {
          name: "summaryDocument",
          type: "file",
          description: "Formatted policy summary document",
        },
      ],
      actions: [
        "Retrieving policy template",
        "Formatting insured business details",
        "Formatting carrier information",
        "Adding policy period details",
        "Formatting coverage limits",
        "Adding employee classification breakdown",
        "Formatting endorsements section",
        "Generating premium breakdown",
        "Applying document styling",
        "Creating PDF document",
        "Adding digital signature",
        "Archiving document copy",
      ],
      result: {
        summary: "Generated policy summary document for Chelsea Florist",
        data: {
          documentName: "Chelsea_Florist_Policy_Summary.pdf",
          documentSize: "1.2MB",
          pageCount: 8,
          sections: [
            "Policy Information",
            "Insured Details",
            "Coverage Summary",
            "Employee Classification",
            "Endorsements",
            "Premium Breakdown",
            "Contact Information",
          ],
          generatedTimestamp: "2024-03-11T15:42:18Z",
          error: null,
        },
      },
    },
  ],
};
