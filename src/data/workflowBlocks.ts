export interface BlockData {
  title: string;
  description: string;
  inputs?: {
    name: string;
    type: string;
    description: string;
  }[];
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
      title: "Document Upload",
      description:
        "Triggers when an insurance document is uploaded to the system",
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
      title: "Policy Document Extractor",
      description: "Extracts key information from policy documents",
      inputs: [
        {
          name: "documents",
          type: "array",
          description: "Insurance policy documents",
        },
      ],
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
      title: "Policy Validation Rules",
      description: "Verifies policy data against business rules",
      inputs: [
        {
          name: "policyData",
          type: "object",
          description: "Extracted policy information",
        },
      ],
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
      title: "Update Policy System",
      description:
        "Updates the external policy management system with validated data",
      inputs: [
        {
          name: "validatedPolicy",
          type: "object",
          description: "Validated policy information",
        },
      ],
      outputs: [
        {
          name: "updateResult",
          type: "object",
          description: "Result of policy system update",
        },
      ],
      actions: [
        "Establishing connection to policy management system",
        "Authenticating credentials",
        "Accessing policy records",
        "Locating matching policy by number",
        "Updating carrier information",
        "Updating effective dates",
        "Updating coverage limits",
        "Updating premium information",
        "Committing changes to database",
        "Generating audit trail entry",
      ],
      result: {
        summary: "Policy WC-123456789 successfully updated in system",
        data: {
          policyId: "WC-123456789",
          updateStatus: "Success",
          updatedFields: [
            "Carrier Name",
            "Effective Date",
            "Expiration Date",
            "Premium",
            "Coverage Type",
            "Endorsements",
          ],
          systemResponse: "Policy updated successfully",
          transactionId: "TRX-20240311-78954",
          timestampUTC: "2024-03-11T14:27:33Z",
        },
      },
    },
    {
      title: "Generate Validation Report",
      description: "Creates detailed validation report of policy data quality",
      inputs: [
        {
          name: "validationResults",
          type: "object",
          description: "Results from policy validation process",
        },
      ],
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
      title: "Export Rule Applications",
      description: "Exports rule application data to CSV for analysis",
      inputs: [
        {
          name: "ruleResults",
          type: "array",
          description: "Collection of rule application results",
        },
      ],
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
      title: "Generate Summary Report",
      description: "Creates management summary of processed policies",
      inputs: [
        {
          name: "policyData",
          type: "array",
          description: "Collection of processed policy data",
        },
      ],
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
      title: "Policy Amount Evaluation",
      description:
        "Determines processing path based on policy amount and risk evaluation",
      inputs: [
        {
          name: "policyData",
          type: "object",
          description: "Policy information with premium and coverage details",
        },
      ],
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
          reason:
            "Insurance amount $1,000,000 exceeds automatic approval threshold of $500,000",
          error: "Formula = 1000000 <= 500000 evaluated to Failed",
        },
      },
    },
  ],
  generation: [
    {
      title: "Policy Summary Generator",
      description: "Creates formatted policy summary documents",
      inputs: [
        {
          name: "policyData",
          type: "object",
          description: "Validated policy information",
        },
      ],
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
