export type BlockType =
  | "trigger"
  | "extraction"
  | "generation"
  | "condition"
  | "action"
  | "end";
export type BlockState = "idle" | "running" | "finished" | "error";

export interface Position {
  x: number;
  y: number;
  row?: number;
  column?: number;
}

export interface Block {
  id: string;
  type: BlockType;
  position: Position;
  label: string;
  state: BlockState;
  inputs: string[]; // IDs of connected input blocks
  outputs: string[]; // IDs of connected output blocks
  config: Record<string, unknown>;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  condition?: string;
  isTrueBranch?: boolean;
}

export interface DiagramState {
  blocks: Block[];
  connections: Connection[];
  selectedBlockId: string | null;
  isDragging: boolean;
}

// Define valid connections between block types
export const VALID_CONNECTIONS: Record<BlockType, BlockType[]> = {
  trigger: ["extraction", "action", "condition"],
  extraction: ["action", "condition"],
  generation: ["action", "condition", "end"],
  condition: ["generation", "action", "trigger", "end"],
  action: ["condition", "generation", "end"],
  end: [],
};

// Define number of inputs and outputs for each block type
export const BLOCK_IO: Record<BlockType, { inputs: number; outputs: number }> =
  {
    trigger: { inputs: 0, outputs: 1 },
    extraction: { inputs: 1, outputs: 1 },
    generation: { inputs: 1, outputs: 1 },
    condition: { inputs: 1, outputs: 2 },
    action: { inputs: 1, outputs: 1 },
    end: { inputs: 1, outputs: 0 },
  };
