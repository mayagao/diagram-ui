import { BlockData } from "./workflowBlocks";
import { BlockType } from "@/types/diagram";

export const noticeOfCancelWorkflow: Record<BlockType, BlockData[]> = {
  trigger: [
    {
      id: "foundation-api-trigger",
      type: "trigger",
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
    {
      id: "two-day-trigger",
      type: "trigger",
      title: "Two Day Check",
      description: "Trigger check every two days",
      inputs: {
        interval: {
          type: "number",
          description: "Interval in days",
          default: 2,
        },
      },
      outputs: [],
      actions: ["Waiting for interval", "Triggering check"],
      result: {
        summary: "Two day interval triggered",
        data: {
          lastCheck: "2024-03-26T10:00:00Z",
          nextCheck: "2024-03-28T10:00:00Z",
        },
      },
    },
  ],
  extraction: [
    {
      id: "customer-data-extraction",
      type: "extraction",
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
          name: "customerInfo",
          type: "object",
          description: "Basic customer information",
          properties: {
            customerName: {
              type: "string",
              description: "Full name of customer",
            },
            email: { type: "string", description: "Customer email address" },
            accountNumber: {
              type: "string",
              description: "Unique account identifier",
            },
          },
        },
        {
          name: "paymentInfo",
          type: "object",
          description: "Payment-related information",
          properties: {
            lastPaymentDate: {
              type: "string",
              description: "Date of last payment",
            },
            paymentMethod: {
              type: "string",
              description: "Preferred payment method",
            },
            outstandingBalance: {
              type: "number",
              description: "Current balance",
            },
          },
        },
        {
          name: "serviceInfo",
          type: "object",
          description: "Service-related information",
          properties: {
            serviceType: { type: "string", description: "Type of service" },
            startDate: { type: "string", description: "Service start date" },
            cancellationDate: {
              type: "string",
              description: "Scheduled cancellation date",
            },
          },
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
      id: "check-payments-rpa",
      type: "action",
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
  ],
  generation: [
    {
      id: "initial-notice-email",
      type: "generation",
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
      id: "follow-up-email",
      type: "generation",
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
      id: "final-notice-email",
      type: "generation",
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
      id: "check-payment-status",
      type: "condition",
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
      id: "check-final-notice",
      type: "condition",
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
      id: "workflow-end",
      type: "end",
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
    { from: "foundation-api-trigger", to: "customer-data-extraction" },
    { from: "customer-data-extraction", to: "check-payments-rpa" },
    { from: "check-payments-rpa", to: "check-payment-status" },
    {
      from: "check-payment-status",
      to: "initial-notice-email",
      condition: "!hasPayment",
    },
    {
      from: "check-payment-status",
      to: "workflow-end",
      condition: "hasPayment",
    },
    { from: "initial-notice-email", to: "two-day-trigger" },
    { from: "two-day-trigger", to: "check-payments-rpa" },
    { from: "check-payments-rpa", to: "check-payment-status" },
    {
      from: "check-payment-status",
      to: "follow-up-email",
      condition: "!hasPayment",
    },
    {
      from: "check-payment-status",
      to: "workflow-end",
      condition: "hasPayment",
    },
    { from: "follow-up-email", to: "check-final-notice" },
    {
      from: "check-final-notice",
      to: "final-notice-email",
      condition: "isFinalNotice",
    },
    {
      from: "check-final-notice",
      to: "two-day-trigger",
      condition: "!isFinalNotice",
    },
    { from: "final-notice-email", to: "workflow-end" },
  ],
  groups: [
    {
      id: "initial-process",
      title: "Initial Process",
      blocks: [
        "foundation-api-trigger",
        "customer-data-extraction",
        "check-payments-rpa",
      ],
    },
    {
      id: "follow-up-process",
      title: "Follow-up Process",
      blocks: ["two-day-trigger", "check-payments-rpa", "check-payment-status"],
    },
    {
      id: "final-process",
      title: "Final Process",
      blocks: ["check-final-notice", "final-notice-email", "workflow-end"],
    },
  ],
};
