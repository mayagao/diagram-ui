import Block from "../blocks/Block";
import { Connector } from "../Connector/Connector";
import { BranchingConnector } from "../Connector/BranchingConnector";
import { useDiagramStore } from "../../store/useDiagramStore";
import { useEffect, useRef, useState } from "react";
import { useInitializeDiagram } from "../../hooks/useInitializeDiagram";
import { BLOCK_COLORS } from "@/types/blocks";
import { BlockState, BlockType } from "@/types/diagram";

// Update DiagramBlock interface to use the correct BlockState
interface DiagramBlock {
  id: string;
  type: BlockType;
  position: {
    x: number;
    y: number;
  };
  state: BlockState;
  label: string;
  inputs: string[];
  outputs: string[];
  config: Record<string, unknown>;
}

// Add type mapping function
const mapDiagramTypeToComponentType = (type: BlockType): BlockType => {
  return type; // Since we're using the same types now
};

export function BlockContainer() {
  // Initialize diagram with default blocks
  useInitializeDiagram();

  // Type the blocks from the store
  const blocks = useDiagramStore((state) => state.blocks) as DiagramBlock[];
  const connections = useDiagramStore((state) => state.connections);
  const autoConnectBlocks = useDiagramStore((state) => state.autoConnectBlocks);
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockPositions, setBlockPositions] = useState<
    Map<string, { top: number; bottom: number }>
  >(new Map());

  // Force auto-connect on component mount
  useEffect(() => {
    console.log("Initial auto-connect triggered");
    setTimeout(() => {
      autoConnectBlocks();
    }, 500);
  }, [autoConnectBlocks]);

  // Calculate block positions when blocks change
  useEffect(() => {
    if (!containerRef.current) return;

    const newPositions = new Map<string, { top: number; bottom: number }>();
    blocks.forEach((block) => {
      const element = containerRef.current?.querySelector(
        `[data-block-id="${block.id}"]`
      );
      if (element) {
        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          newPositions.set(block.id, {
            top: rect.top - containerRect.top,
            bottom: rect.bottom - containerRect.top,
          });
        }
      }
    });

    setBlockPositions(newPositions);
  }, [blocks]);

  // Create manual connectors if no connections exist
  const manualConnectors = [];
  if (connections.length === 0 && blocks.length > 1) {
    const sortedBlocks = [...blocks].sort(
      (a, b) => a.position.y - b.position.y
    );

    for (let i = 0; i < sortedBlocks.length - 1; i++) {
      const sourceBlock = sortedBlocks[i];
      const targetBlock = sortedBlocks[i + 1];

      const sourcePos = blockPositions.get(sourceBlock.id);
      const targetPos = blockPositions.get(targetBlock.id);

      if (sourcePos && targetPos) {
        manualConnectors.push({
          id: `manual-${i}`,
          sourceId: sourceBlock.id,
          targetId: targetBlock.id,
          state: sourceBlock.state,
          startY: sourcePos.bottom,
          endY: targetPos.top,
        });
      }
    }

    console.log("Created manual connectors:", manualConnectors.length);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Render blocks */}
      {blocks.map((block) => (
        <div
          key={block.id}
          className="block-wrapper mb-24"
          data-block-id={block.id}
          style={{ marginBottom: "80px" }}
        >
          <Block
            id={block.id}
            type={mapDiagramTypeToComponentType(block.type)}
            title={block.label}
            description={`${block.type} block`}
            color={BLOCK_COLORS[mapDiagramTypeToComponentType(block.type)]}
          />
        </div>
      ))}

      {/* Debug information */}
      <div className="hidden">
        Blocks: {blocks.length}, Connections: {connections.length}, Positions:{" "}
        {blockPositions.size}
      </div>

      {/* Render connectors from store */}
      {connections.map((connection) => {
        const sourcePos = blockPositions.get(connection.sourceId);
        const targetPos = blockPositions.get(connection.targetId);

        if (!sourcePos || !targetPos) return null;

        const sourceBlock = blocks.find((b) => b.id === connection.sourceId);
        if (!sourceBlock) return null;

        // Check if this is a branching connection
        const isBranching = connection.condition !== undefined;
        if (isBranching) {
          return (
            <BranchingConnector
              key={connection.id}
              fromBlockId={connection.sourceId}
              toBlockId={connection.targetId}
              state={sourceBlock.state}
              startY={sourcePos.bottom}
              endY={targetPos.top}
              condition={connection.condition}
              isTrueBranch={connection.isTrueBranch}
            />
          );
        }

        return (
          <Connector
            key={connection.id}
            fromBlockId={connection.sourceId}
            toBlockId={connection.targetId}
            state={sourceBlock.state}
            startY={sourcePos.bottom}
            endY={targetPos.top}
          />
        );
      })}

      {/* Render manual connectors as fallback */}
      {connections.length === 0 &&
        manualConnectors.map((conn) => (
          <Connector
            key={conn.id}
            fromBlockId={conn.sourceId}
            toBlockId={conn.targetId}
            state={conn.state}
            startY={conn.startY}
            endY={conn.endY}
          />
        ))}
    </div>
  );
}
