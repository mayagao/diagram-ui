export type BlockType = "processor" | "transformer" | "output";
export type BlockState = "idle" | "running" | "finished" | "error";

export interface Position {
  row: number;
  column: number;
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
}

export interface DiagramState {
  blocks: Block[];
  connections: Connection[];
  selectedBlockId: string | null;
  isDragging: boolean;
}

// Validation rules for connections between different block types
export const VALID_CONNECTIONS: Record<BlockType, BlockType[]> = {
  processor: ["transformer", "output"],
  transformer: ["output"],
  output: [],
};

// Maximum number of connections allowed for each block type
export const MAX_CONNECTIONS: Record<
  BlockType,
  { inputs: number; outputs: number }
> = {
  processor: { inputs: 1, outputs: 2 },
  transformer: { inputs: 2, outputs: 1 },
  output: { inputs: 1, outputs: 0 },
};
