import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  Block,
  Connection,
  Position,
  BlockType,
  DiagramState,
  VALID_CONNECTIONS,
  MAX_CONNECTIONS,
} from "../types/diagram";

const VERTICAL_SPACING = 8; // Grid units between blocks
const INITIAL_COLUMN = 10; // Fixed horizontal position for blocks

interface DiagramStore extends DiagramState {
  // Block operations
  addBlock: (type: BlockType, config?: Record<string, unknown>) => void;
  removeBlock: (id: string) => void;
  updateBlockPosition: (id: string, position: Position) => void;
  updateBlockState: (id: string, state: Block["state"]) => void;
  updateBlockConfig: (id: string, config: Record<string, unknown>) => void;
  reorderBlocks: () => void;

  // Connection operations
  connectBlocks: (sourceId: string, targetId: string) => boolean;
  removeConnection: (connectionId: string) => void;

  // Selection
  setSelectedBlock: (id: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;

  // Validation
  canConnectBlocks: (sourceId: string, targetId: string) => boolean;

  // Helper function to connect blocks in order
  autoConnectBlocks: () => void;
}

export const useDiagramStore = create<DiagramStore>((set, get) => ({
  blocks: [],
  connections: [],
  selectedBlockId: null,
  isDragging: false,

  addBlock: (type, config = {}) => {
    const { blocks } = get();
    const newPosition: Position = {
      column: INITIAL_COLUMN,
      row:
        blocks.length > 0
          ? blocks[blocks.length - 1].position.row + VERTICAL_SPACING
          : 5,
    };

    const newBlock: Block = {
      id: nanoid(),
      type,
      position: newPosition,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
      state: "idle",
      inputs: [],
      outputs: [],
      config,
    };

    set((state) => {
      const newBlocks = [...state.blocks, newBlock];

      // If there's a previous block, connect them automatically
      if (blocks.length > 0) {
        const previousBlock = blocks[blocks.length - 1];
        if (get().canConnectBlocks(previousBlock.id, newBlock.id)) {
          get().connectBlocks(previousBlock.id, newBlock.id);
        }
      }

      return { blocks: newBlocks };
    });
  },

  autoConnectBlocks: () => {
    const { blocks } = get();

    console.log("Auto-connect called with blocks:", blocks.length);

    if (blocks.length <= 1) {
      console.log("Not enough blocks to create connections");
      return;
    }

    const orderedBlocks = [...blocks].sort(
      (a, b) => a.position.row - b.position.row
    );

    // Clear existing connections
    set((state) => ({ ...state, connections: [] }));

    // Connect consecutive blocks if valid
    const newConnections: Connection[] = [];

    for (let i = 0; i < orderedBlocks.length - 1; i++) {
      const sourceBlock = orderedBlocks[i];
      const targetBlock = orderedBlocks[i + 1];

      console.log(
        `Attempting to connect ${sourceBlock.id} (${sourceBlock.type}) to ${targetBlock.id} (${targetBlock.type})`
      );

      // Force connection regardless of type
      const newConnection: Connection = {
        id: `conn-${sourceBlock.id}-${targetBlock.id}`,
        sourceId: sourceBlock.id,
        targetId: targetBlock.id,
      };

      newConnections.push(newConnection);

      console.log(`Created connection: ${newConnection.id}`);
    }

    // Update connections state
    set((state) => ({
      ...state,
      connections: newConnections,
      // Update blocks with input/output connections
      blocks: state.blocks.map((block) => {
        const outputs = newConnections
          .filter((c) => c.sourceId === block.id)
          .map((c) => c.targetId);

        const inputs = newConnections
          .filter((c) => c.targetId === block.id)
          .map((c) => c.sourceId);

        return {
          ...block,
          inputs,
          outputs,
        };
      }),
    }));

    console.log(
      "Auto-connect complete, connections created:",
      newConnections.length
    );
  },

  reorderBlocks: () => {
    set((state) => {
      const orderedBlocks = [...state.blocks].sort(
        (a, b) => a.position.row - b.position.row
      );

      // Reposition blocks with even spacing
      const updatedBlocks = orderedBlocks.map((block, index) => ({
        ...block,
        position: {
          column: INITIAL_COLUMN,
          row: 5 + index * VERTICAL_SPACING,
        },
      }));

      // Update state with reordered blocks
      const newState = { blocks: updatedBlocks };

      // Auto-connect blocks after reordering
      setTimeout(() => get().autoConnectBlocks(), 0);

      return newState;
    });
  },

  removeBlock: (id) => {
    set((state) => {
      const newState = {
        blocks: state.blocks.filter((block) => block.id !== id),
        connections: state.connections.filter(
          (conn) => conn.sourceId !== id && conn.targetId !== id
        ),
      };

      // Reorder remaining blocks
      const orderedBlocks = newState.blocks.map((block, index) => ({
        ...block,
        position: {
          column: INITIAL_COLUMN,
          row: 5 + index * VERTICAL_SPACING,
        },
      }));

      return { ...newState, blocks: orderedBlocks };
    });
  },

  updateBlockPosition: (id, newPosition) => {
    set((state) => {
      const updatedBlocks = state.blocks.map((block) =>
        block.id === id ? { ...block, position: newPosition } : block
      );

      // Sort blocks by vertical position
      const orderedBlocks = [...updatedBlocks].sort(
        (a, b) => a.position.row - b.position.row
      );

      return {
        blocks: orderedBlocks,
        connections: [], // Clear connections, they will be recreated
      };
    });

    // After position update, reorder and reconnect blocks
    get().reorderBlocks();
  },

  updateBlockState: (id, newState) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, state: newState } : block
      ),
    }));
  },

  updateBlockConfig: (id, config) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id
          ? { ...block, config: { ...block.config, ...config } }
          : block
      ),
    }));
  },

  canConnectBlocks: (sourceId, targetId) => {
    const { blocks } = get();
    const sourceBlock = blocks.find((b) => b.id === sourceId);
    const targetBlock = blocks.find((b) => b.id === targetId);

    if (!sourceBlock || !targetBlock) return false;

    // Check if connection type is valid
    const validTargetTypes = VALID_CONNECTIONS[sourceBlock.type];
    if (!validTargetTypes.includes(targetBlock.type)) return false;

    // Check connection limits
    const sourceMaxOutputs = MAX_CONNECTIONS[sourceBlock.type].outputs;
    const targetMaxInputs = MAX_CONNECTIONS[targetBlock.type].inputs;

    if (sourceBlock.outputs.length >= sourceMaxOutputs) return false;
    if (targetBlock.inputs.length >= targetMaxInputs) return false;

    return true;
  },

  connectBlocks: (sourceId, targetId) => {
    const canConnect = get().canConnectBlocks(sourceId, targetId);
    if (!canConnect) return false;

    const newConnection: Connection = {
      id: nanoid(),
      sourceId,
      targetId,
    };

    set((state) => ({
      connections: [...state.connections, newConnection],
      blocks: state.blocks.map((block) => {
        if (block.id === sourceId) {
          return { ...block, outputs: [...block.outputs, targetId] };
        }
        if (block.id === targetId) {
          return { ...block, inputs: [...block.inputs, sourceId] };
        }
        return block;
      }),
    }));

    return true;
  },

  removeConnection: (connectionId) => {
    set((state) => {
      const connection = state.connections.find((c) => c.id === connectionId);
      if (!connection) return state;

      return {
        connections: state.connections.filter((c) => c.id !== connectionId),
        blocks: state.blocks.map((block) => {
          if (block.id === connection.sourceId) {
            return {
              ...block,
              outputs: block.outputs.filter((id) => id !== connection.targetId),
            };
          }
          if (block.id === connection.targetId) {
            return {
              ...block,
              inputs: block.inputs.filter((id) => id !== connection.sourceId),
            };
          }
          return block;
        }),
      };
    });
  },

  setSelectedBlock: (id) => set({ selectedBlockId: id }),
  setIsDragging: (isDragging) => set({ isDragging }),
}));
