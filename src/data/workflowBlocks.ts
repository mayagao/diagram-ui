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
    data?: any;
  };
}

export const workflowBlocks: Record<string, BlockData[]> = {
  trigger: [
    {
      title: "Email Receiver",
      description: "Triggers when an email arrives from clients",
      outputs: [
        {
          name: "email",
          type: "object",
          description: "Parsed email with headers and body",
        },
      ],
      actions: [
        "Checking inbox for new messages",
        "Validating sender addresses",
        "Processing email attachments",
      ],
      result: {
        summary: "Email from ashley@aptia.com received",
        data: {
          from: "ashley@aptia.com",
          subject: "Plan attributes xyz",
          attachments: 4,
        },
      },
    },
    {
      title: "Schedule Monthly",
      description: "Runs on the 1st of each month",
      outputs: [
        {
          name: "timestamp",
          type: "date",
          description: "Execution timestamp",
        },
      ],
      actions: [
        "Checking calendar",
        "Validating execution window",
        "Initializing scheduler",
      ],
      result: {
        summary: "Triggered on schedule: March 1, 2023",
        data: {
          timestamp: "2023-03-01T08:00:00Z",
          execution: "monthly",
        },
      },
    },
    {
      title: "Form Submission",
      description: "Activates when insurance form is submitted",
      outputs: [
        {
          name: "formData",
          type: "object",
          description: "Form fields and values",
        },
      ],
      actions: [
        "Receiving form data",
        "Validating required fields",
        "Processing attachments",
      ],
      result: {
        summary: "Form submitted by John Doe",
        data: {
          submitter: "John Doe",
          formType: "Insurance Claim",
          fields: 24,
        },
      },
    },
    {
      title: "API Webhook",
      description: "Listens for data from partner systems",
      outputs: [
        {
          name: "payload",
          type: "json",
          description: "JSON payload from webhook",
        },
      ],
      actions: [
        "Listening for webhook events",
        "Validating API signature",
        "Processing payload",
      ],
      result: {
        summary: "Webhook received from payment system",
        data: {
          source: "PaymentAPI",
          eventType: "payment.processed",
          timestamp: "2023-03-15T14:22:33Z",
        },
      },
    },
  ],
  extraction: [
    {
      title: "MedClaim Extractor",
      description: "Extracts data from medical insurance PDFs",
      inputs: [
        {
          name: "document",
          type: "file",
          description: "Medical claim PDF document",
        },
      ],
      outputs: [
        {
          name: "claimData",
          type: "object",
          description: "Structured claim information",
        },
      ],
      actions: [
        "Parsing PDF content",
        "Identifying claim fields",
        "Extracting provider information",
      ],
      result: {
        summary: "Extracted medical claim data from aetna-med-1.pdf",
        data: {
          policyNumber: "AET-12345",
          claimAmount: "$520.75",
          serviceDate: "2023-02-15",
        },
      },
    },
    {
      title: "VisionClaim Parser",
      description: "Pulls coverage details from vision plan docs",
      inputs: [
        {
          name: "document",
          type: "file",
          description: "Vision plan document",
        },
      ],
      outputs: [
        {
          name: "visionData",
          type: "object",
          description: "Vision coverage details",
        },
      ],
      actions: [
        "Reading document structure",
        "Locating coverage tables",
        "Extracting benefit limits",
      ],
      result: {
        summary: "Extracted vision plan details from aetna-vis-1.pdf",
        data: {
          examCoverage: "100%",
          frameAllowance: "$150",
          contactsAllowance: "$130",
        },
      },
    },
    {
      title: "DentalClaim Scanner",
      description: "Identifies dental procedure codes in plans",
      inputs: [
        {
          name: "document",
          type: "file",
          description: "Dental claim document",
        },
      ],
      outputs: [
        {
          name: "dentalData",
          type: "object",
          description: "Dental procedure information",
        },
      ],
      actions: [
        "Scanning procedure codes",
        "Matching ADA codes",
        "Extracting coverage percentages",
      ],
      result: {
        summary: "Extracted dental procedures from aetna-dental-plan-1.pdf",
        data: {
          preventiveCare: "100% covered",
          basicServices: "80% covered",
          majorServices: "50% covered",
        },
      },
    },
    {
      title: "Policy Field Extractor",
      description: "Captures insured details from policy forms",
      inputs: [
        {
          name: "document",
          type: "file",
          description: "Insurance policy document",
        },
      ],
      outputs: [
        {
          name: "policyData",
          type: "object",
          description: "Policy holder information",
        },
      ],
      actions: [
        "Identifying policy sections",
        "Extracting insured details",
        "Validating coverage dates",
      ],
      result: {
        summary: "Extracted policy information from form fields",
        data: {
          policyHolder: "Sarah Johnson",
          policyNumber: "POL-987654",
          effectiveDate: "2023-01-01",
        },
      },
    },
  ],
  generation: [
    {
      title: "Excel Report Generator",
      description: "Creates spreadsheet reports from extracted data",
      inputs: [
        {
          name: "claimData",
          type: "array",
          description: "Array of claim objects",
        },
      ],
      outputs: [
        {
          name: "report",
          type: "file",
          description: "Excel report file",
        },
      ],
      actions: [
        "Formatting data columns",
        "Calculating totals",
        "Generating Excel file",
      ],
      result: {
        summary: "Generated Excel report with 3 claims",
        data: {
          filename: "claims_report_march.xlsx",
          sheets: 2,
          records: 35,
        },
      },
    },
    {
      title: "Coverage Summary",
      description: "Generates plain-language benefit summaries",
      inputs: [
        {
          name: "benefitData",
          type: "object",
          description: "Benefit details object",
        },
      ],
      outputs: [
        {
          name: "summary",
          type: "text",
          description: "Plain language summary",
        },
      ],
      actions: [
        "Analyzing coverage terms",
        "Simplifying legal language",
        "Formatting user-friendly text",
      ],
      result: {
        summary: "Created benefit summary in plain language",
        data: {
          wordCount: 450,
          readabilityScore: "Grade 8",
          sections: 5,
        },
      },
    },
    {
      title: "Comparison Document",
      description: "Creates side-by-side plan comparisons",
      inputs: [
        {
          name: "plans",
          type: "array",
          description: "Multiple plan objects",
        },
      ],
      outputs: [
        {
          name: "comparison",
          type: "file",
          description: "Comparison document",
        },
      ],
      actions: [
        "Identifying comparable features",
        "Calculating cost differences",
        "Creating comparison tables",
      ],
      result: {
        summary: "Generated comparison of 3 dental plans",
        data: {
          filename: "dental_plan_comparison.pdf",
          comparedPlans: 3,
          features: 12,
        },
      },
    },
    {
      title: "Premium Calculator",
      description: "Computes pricing based on coverage options",
      inputs: [
        {
          name: "planOptions",
          type: "object",
          description: "Selected coverage options",
        },
      ],
      outputs: [
        {
          name: "pricing",
          type: "object",
          description: "Premium calculations",
        },
      ],
      actions: [
        "Calculating base premiums",
        "Applying coverage modifiers",
        "Computing total costs",
      ],
      result: {
        summary: "Calculated premium based on selected options",
        data: {
          monthlyPremium: "$245.50",
          annualTotal: "$2,946.00",
          savings: "$120.00",
        },
      },
    },
  ],
  condition: [
    {
      title: "Plan Type Checker",
      description: "Routes workflow based on insurance type",
      inputs: [
        {
          name: "policy",
          type: "object",
          description: "Policy information",
        },
      ],
      outputs: [
        {
          name: "route",
          type: "string",
          description: "Processing route name",
        },
      ],
      actions: [
        "Identifying plan category",
        "Checking coverage type",
        "Determining processing path",
      ],
      result: {
        summary: "Routed claim to dental processing",
        data: {
          planType: "Dental",
          routePath: "dental-processing",
          priority: "normal",
        },
      },
    },
    {
      title: "Coverage Validator",
      description: "Verifies plan covers requested services",
      inputs: [
        {
          name: "serviceRequest",
          type: "object",
          description: "Requested service details",
        },
      ],
      outputs: [
        {
          name: "validation",
          type: "object",
          description: "Coverage validation result",
        },
      ],
      actions: [
        "Checking service codes",
        "Validating against plan coverage",
        "Calculating co-pay amounts",
      ],
      result: {
        summary: "Service is covered at 80%",
        data: {
          isCovered: true,
          coveragePercent: 80,
          patientResponsibility: "$45.00",
        },
      },
    },
    {
      title: "Premium Status",
      description: "Checks if premium payments are current",
      inputs: [
        {
          name: "accountId",
          type: "string",
          description: "Customer account ID",
        },
      ],
      outputs: [
        {
          name: "status",
          type: "object",
          description: "Payment status information",
        },
      ],
      actions: [
        "Retrieving payment history",
        "Checking payment dates",
        "Validating active coverage",
      ],
      result: {
        summary: "Account is current with all payments",
        data: {
          isPaid: true,
          lastPayment: "2023-03-01",
          nextPayment: "2023-04-01",
        },
      },
    },
    {
      title: "Document Completeness",
      description: "Ensures all required forms are present",
      inputs: [
        {
          name: "submission",
          type: "object",
          description: "Submitted documents",
        },
      ],
      outputs: [
        {
          name: "completeness",
          type: "object",
          description: "Document verification result",
        },
      ],
      actions: [
        "Counting submitted documents",
        "Checking required forms",
        "Validating signatures",
      ],
      result: {
        summary: "Submission complete with all required documents",
        data: {
          isComplete: true,
          documentsReceived: 4,
          missingItems: [],
        },
      },
    },
  ],
  action: [
    {
      title: "SendEmail Notification",
      description: "Sends confirmation email to clients",
      inputs: [
        {
          name: "recipient",
          type: "object",
          description: "Email recipient information",
        },
      ],
      actions: [
        "Preparing email template",
        "Personalizing content",
        "Sending via SMTP server",
      ],
      result: {
        summary: "Confirmation email sent to john@foundinsurance.com",
        data: {
          recipient: "john@foundinsurance.com",
          subject: "Your claim has been received",
          deliveryStatus: "Sent",
        },
      },
    },
    {
      title: "Database Update",
      description: "Saves processed information to client record",
      inputs: [
        {
          name: "clientData",
          type: "object",
          description: "Updated client information",
        },
      ],
      actions: [
        "Connecting to database",
        "Updating client record",
        "Verifying data integrity",
      ],
      result: {
        summary: "Client record updated in database",
        data: {
          clientId: "C-9876",
          updatedFields: ["address", "contactInfo", "planDetails"],
          timestamp: "2023-03-15T16:42:00Z",
        },
      },
    },
    {
      title: "Document Archiver",
      description: "Stores processed documents in compliance system",
      inputs: [
        {
          name: "documents",
          type: "array",
          description: "Array of document files",
        },
      ],
      actions: [
        "Preparing document metadata",
        "Encrypting files",
        "Storing in compliance archive",
      ],
      result: {
        summary: "4 documents archived successfully",
        data: {
          archiveReference: "ARH-2023-1249",
          documentCount: 4,
          retentionPeriod: "7 years",
        },
      },
    },
    {
      title: "Claims Processor",
      description: "Submits verified claims to payment system",
      inputs: [
        {
          name: "verifiedClaim",
          type: "object",
          description: "Validated claim information",
        },
      ],
      actions: [
        "Formatting claim for payment system",
        "Submitting to processor",
        "Recording transaction ID",
      ],
      result: {
        summary: "Claim submitted to payment processor",
        data: {
          claimId: "CLM-45678",
          paymentAmount: "$420.75",
          processingStatus: "In Progress",
        },
      },
    },
  ],
};
