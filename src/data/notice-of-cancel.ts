import { BlockData } from "./workflowBlocks";

export const noticeOfCancelWorkflow: Record<string, BlockData[]> = {
  trigger: [
    {
      title: "API Call to Foundation",
      description: "Fetch customer data from Foundation API",
      inputs: {
        api: {
          type: "code",
          description: "API configuration for Foundation",
          language: "typescript",
          default: `const response = await fetch('https://api.foundation.com/customer-data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${process.env.FOUNDATION_API_KEY}'
  }
});`,
        },
      },
      outputs: [
        {
          name: "customerData",
          type: "object",
          description: "Customer data from Foundation",
        },
      ],
      actions: [
        "Connecting to Foundation API",
        "Fetching customer data",
        "Validating response",
      ],
      result: {
        summary: "Successfully retrieved customer data from Foundation",
        data: {
          customerId: "CUST-123",
          documentId: "DOC-456",
          status: "POC",
        },
      },
    },
  ],
  extraction: [
    {
      title: "Extract Customer Data",
      description: "Extract relevant information from customer document",
      inputs: {
        document: {
          type: "object",
          description: "Customer document from Foundation",
        },
      },
      outputs: [
        {
          name: "extractedData",
          type: "object",
          description: "Extracted customer information",
        },
      ],
      actions: [
        "Processing document",
        "Extracting customer details",
        "Validating extracted data",
      ],
      result: {
        summary: "Successfully extracted customer information",
        data: {
          customerName: "John Doe",
          email: "john.doe@example.com",
          accountNumber: "ACC-789",
        },
      },
    },
  ],
  action: [
    {
      title: "Check Payment Status",
      description: "RPA action to check customer payment status on website",
      inputs: {
        customerData: {
          type: "object",
          description: "Customer data to search for",
        },
      },
      outputs: [
        {
          name: "paymentStatus",
          type: "object",
          description: "Payment status information",
        },
      ],
      actions: [
        "Navigating to payment portal",
        "Searching for customer",
        "Checking payment status",
      ],
      result: {
        summary: "Payment status check completed",
        data: {
          hasPayments: false,
          lastPaymentDate: null,
        },
      },
    },
    {
      title: "Send Initial Notice",
      description: "Send initial payment request email to customer",
      inputs: {
        customerData: {
          type: "object",
          description: "Customer information for email",
        },
      },
      outputs: [
        {
          name: "emailStatus",
          type: "object",
          description: "Email sending status",
        },
      ],
      actions: [
        "Preparing email content",
        "Sending email",
        "Confirming delivery",
      ],
      result: {
        summary: "Initial notice email sent successfully",
        data: {
          emailId: "EMAIL-123",
          sentAt: "2024-03-26T10:00:00Z",
        },
      },
    },
    {
      title: "Check Payment Status (Follow-up)",
      description: "Check if customer has made payment after initial notice",
      inputs: {
        customerData: {
          type: "object",
          description: "Customer data to check",
        },
      },
      outputs: [
        {
          name: "paymentStatus",
          type: "object",
          description: "Updated payment status",
        },
      ],
      actions: ["Checking payment status", "Updating records"],
      result: {
        summary: "Follow-up payment check completed",
        data: {
          hasPayments: false,
          daysSinceNotice: 2,
        },
      },
    },
    {
      title: "Send Follow-up Email",
      description: "Send follow-up payment request email",
      inputs: {
        customerData: {
          type: "object",
          description: "Customer information for follow-up",
        },
      },
      outputs: [
        {
          name: "emailStatus",
          type: "object",
          description: "Follow-up email status",
        },
      ],
      actions: [
        "Preparing follow-up email",
        "Sending email",
        "Confirming delivery",
      ],
      result: {
        summary: "Follow-up email sent successfully",
        data: {
          emailId: "EMAIL-124",
          sentAt: "2024-03-28T10:00:00Z",
        },
      },
    },
    {
      title: "Send Final Notice",
      description: "Send final notice email before cancellation",
      inputs: {
        customerData: {
          type: "object",
          description: "Customer information for final notice",
        },
      },
      outputs: [
        {
          name: "emailStatus",
          type: "object",
          description: "Final notice email status",
        },
      ],
      actions: [
        "Preparing final notice",
        "Sending email",
        "Confirming delivery",
      ],
      result: {
        summary: "Final notice email sent successfully",
        data: {
          emailId: "EMAIL-125",
          sentAt: "2024-03-30T10:00:00Z",
        },
      },
    },
  ],
  condition: [
    {
      title: "Has Payment?",
      description: "Check if customer has made payment",
      inputs: {
        paymentStatus: {
          type: "object",
          description: "Payment status to check",
        },
      },
      outputs: [
        {
          name: "hasPayment",
          type: "boolean",
          description: "Whether payment has been made",
        },
      ],
      actions: ["Evaluating payment status", "Determining next steps"],
      result: {
        summary: "Payment status evaluated",
        data: {
          hasPayment: false,
          evaluationDate: "2024-03-26T10:00:00Z",
        },
      },
    },
    {
      title: "Is Final Notice Time?",
      description: "Check if it's time to send final notice",
      inputs: {
        timeline: {
          type: "object",
          description: "Timeline information",
        },
      },
      outputs: [
        {
          name: "isFinalNotice",
          type: "boolean",
          description: "Whether to send final notice",
        },
      ],
      actions: ["Checking timeline", "Evaluating notice status"],
      result: {
        summary: "Timeline evaluation completed",
        data: {
          isFinalNotice: false,
          daysUntilCancellation: 4,
        },
      },
    },
  ],
  end: [
    {
      title: "End Workflow",
      description: "Complete the notice of cancellation workflow",
      inputs: {
        status: {
          type: "string",
          description: "Final workflow status",
        },
      },
      outputs: [],
      actions: ["Recording completion status", "Closing workflow"],
      result: {
        summary: "Workflow completed successfully",
        data: {
          completionDate: "2024-03-30T10:00:00Z",
          finalStatus: "completed",
        },
      },
    },
  ],
};

// Define the workflow connections and layout
export const noticeOfCancelLayout = {
  connections: [
    { from: "trigger", to: "extraction" },
    { from: "extraction", to: "action" },
    { from: "action", to: "condition" },
    { from: "condition", to: "action", condition: "!hasPayment" },
    { from: "condition", to: "end", condition: "hasPayment" },
    { from: "action", to: "condition", condition: "!isFinalNotice" },
    { from: "action", to: "end", condition: "isFinalNotice" },
  ],
  groups: [
    {
      id: "initial-process",
      title: "Initial Process",
      blocks: ["trigger", "extraction", "action"],
    },
    {
      id: "follow-up-process",
      title: "Follow-up Process",
      blocks: ["condition", "action"],
    },
    {
      id: "final-process",
      title: "Final Process",
      blocks: ["condition", "action", "end"],
    },
  ],
};
