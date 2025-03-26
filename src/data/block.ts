// types.ts
export type BlockType =
  | "trigger"
  | "extraction"
  | "generation"
  | "condition"
  | "action";
export type BlockState =
  | "editing"
  | "ready"
  | "running"
  | "completed"
  | "error"
  | "checkpoint";

export interface BlockTypeDefinition {
  type: BlockType;
  name: string;
  description: string;
  examples: string[];
  color: string;
}

export interface BlockStateDefinition {
  state: BlockState;
  description: string;
}

export interface BlockDefinitions {
  blockTypes: BlockTypeDefinition[];
  blockStates: BlockStateDefinition[];
}

// blockDefinitions.ts
import { BlockDefinitions } from "./types";

export const BLOCK_DEFINITIONS: BlockDefinitions = {
  blockTypes: [
    {
      type: "trigger",
      name: "Trigger Blocks",
      description:
        "Starting points that initiate workflow execution when specific events occur, such as receiving an email or API call. Triggers determine when workflows begin and what initial inputs they receive.",
      examples: [
        "Email receipt trigger",
        "Scheduled daily report trigger",
        "API endpoint trigger",
        "File upload trigger",
      ],
      color: "#3498db",
    },
    {
      type: "extraction",
      name: "Extraction Blocks",
      description:
        "Transform unstructured content into structured data by identifying and extracting specific information from documents, images, or text, making it available for further processing.",
      examples: [
        "Insurance form field extraction",
        "Invoice line item extraction",
        "Medical record data extraction",
        "Contract clause identification",
      ],
      color: "#9b59b6",
    },
    {
      type: "generation",
      name: "Generation Blocks",
      description:
        "Create new content or transform existing data using AI models. These blocks generate text, modify data formats, or produce new documents based on input parameters.",
      examples: [
        "Email response generator",
        "Data format transformer",
        "PDF report creator",
        "Summary generator",
      ],
      color: "#2ecc71",
    },
    {
      type: "condition",
      name: "Condition Blocks",
      description:
        "Evaluate logic to control workflow direction, allowing the system to make decisions and take different paths based on data values, comparisons, or validation results.",
      examples: [
        "Payment status checker",
        "Risk score evaluator",
        "Document completeness validator",
        "Customer type classifier",
      ],
      color: "#f39c12",
    },
    {
      type: "action",
      name: "Action Blocks",
      description:
        "Execute operations that affect external systems, creating tangible outcomes from the workflow such as sending communications, updating records, or automating web interactions.",
      examples: [
        "Email sender",
        "API call to update database",
        "RPA web form completion",
        "Document export to storage",
      ],
      color: "#e74c3c",
    },
  ],
  blockStates: [
    {
      state: "editing",
      description:
        "Block is currently being configured or modified by the user",
    },
    {
      state: "ready",
      description: "Block is configured and ready to execute",
    },
    {
      state: "running",
      description: "Block is actively executing its operation",
    },
    {
      state: "completed",
      description: "Block has successfully finished execution",
    },
    {
      state: "error",
      description: "Block encountered an error during execution",
    },
    {
      state: "checkpoint",
      description:
        "Block execution is paused at a defined checkpoint for inspection",
    },
  ],
};

// Helper functions to work with the definitions
export function getBlockTypeDefinition(
  type: BlockType
): BlockTypeDefinition | undefined {
  return BLOCK_DEFINITIONS.blockTypes.find(
    (blockType) => blockType.type === type
  );
}

export function getBlockStateDefinition(
  state: BlockState
): BlockStateDefinition | undefined {
  return BLOCK_DEFINITIONS.blockStates.find(
    (blockState) => blockState.state === state
  );
}

export function getBlockColor(type: BlockType): string {
  const definition = getBlockTypeDefinition(type);
  return definition ? definition.color : "#cccccc";
}

export function getBlockExamples(type: BlockType): string[] {
  const definition = getBlockTypeDefinition(type);
  return definition ? definition.examples : [];
}
