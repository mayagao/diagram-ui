import { BlockType } from "@/types/diagram";

export interface BlockData {
  id: string;
  type: BlockType;
  title: string;
  description: string;
  inputs: {
    [key: string]: {
      type: string;
      description: string;
      default?: unknown;
      language?: string;
      properties?: {
        [key: string]: {
          type: string;
          description: string;
        };
      };
    };
  };
  outputs: {
    name: string;
    type: string;
    description: string;
    properties?: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
  }[];
  actions: string[];
  result?: {
    summary: string;
    data?: Record<string, unknown>;
  };
}

export const workflowBlocks: Record<string, BlockData[]> = {
  trigger: [
    {
      id: "email-trigger",
      type: "trigger",
      title: "Email Received",
      description: "Trigger workflow when a new email is received",
      inputs: {
        email: {
          type: "object",
          description: "Email content and metadata",
        },
      },
      outputs: [
        {
          name: "emailData",
          type: "object",
          description: "Parsed email data",
        },
      ],
      actions: [
        "Checking email server",
        "Downloading email",
        "Processing attachments",
      ],
      result: {
        summary: "Email received and processed",
        data: {
          title: "Untitled Document",
          description: "Unknown Type",
          filename: "document.pdf",
          documentType: "PDF",
          pageCount: 3,
          status: "processed",
        },
      },
    },
  ],
  extraction: [
    {
      id: "address-extraction",
      type: "extraction",
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
        summary: "Successfully extracted policy information",
        data: {
          policyNumber: "POL-123",
          insuredName: "Acme Corp",
          newAddress: "123 New St, New City, NY 10001",
          oldAddress: "456 Old St, Old City, NY 10001",
          endorsementType: "address_change",
        },
      },
    },
  ],
  generation: [
    {
      id: "email-generation",
      type: "generation",
      title: "Generate Email Response",
      description: "Generate an email response based on the extracted data",
      inputs: {
        data: {
          type: "object",
          description: "Data to use for email generation",
        },
      },
      outputs: [
        {
          name: "emailContent",
          type: "string",
          description: "Generated email content",
        },
      ],
      actions: [
        "Processing input data",
        "Generating email content",
        "Formatting response",
      ],
      result: {
        summary: "Email response generated successfully",
        data: {
          subject: "Re: Policy Update Request",
          body: "Thank you for your request...",
          attachments: ["policy_update.pdf"],
        },
      },
    },
  ],
  condition: [
    {
      id: "payment-condition",
      type: "condition",
      title: "Check Payment Status",
      description: "Check if payment has been received",
      inputs: {
        paymentData: {
          type: "object",
          description: "Payment information to check",
        },
      },
      outputs: [
        {
          name: "paymentStatus",
          type: "boolean",
          description: "Whether payment has been received",
        },
      ],
      actions: [
        "Checking payment records",
        "Validating payment status",
        "Determining next steps",
      ],
      result: {
        summary: "Payment status checked",
        data: {
          details: [
            {
              rule: "Payment Received",
              status: "failed",
              message: "No payment found in the last 30 days",
            },
            {
              rule: "Payment Amount",
              status: "pending",
              message: "Waiting for payment verification",
            },
            {
              rule: "Payment Method",
              status: "passed",
              message: "Valid payment method on file",
            },
          ],
          passedRules: 1,
          failedRules: 1,
          pendingRules: 1,
          totalRules: 3,
          hasPayment: false,
          paymentDate: null,
        },
      },
    },
  ],
  action: [
    {
      id: "send-email",
      type: "action",
      title: "Send Email",
      description: "Send the generated email to the customer",
      inputs: {
        emailContent: {
          type: "string",
          description: "Email content to send",
        },
      },
      outputs: [
        {
          name: "emailStatus",
          type: "object",
          description: "Status of email sending",
        },
      ],
      actions: [
        "Preparing email",
        "Sending to recipient",
        "Confirming delivery",
      ],
      result: {
        summary: "Email sent successfully",
        data: {
          sentAt: "2024-03-26T10:00:00Z",
          recipient: "customer@example.com",
          status: "delivered",
        },
      },
    },
  ],
};
