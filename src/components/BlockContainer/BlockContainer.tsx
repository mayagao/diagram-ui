import Block from "../blocks/Block";
import { Connector } from "../Connector/Connector";
import { useDiagramStore } from "../../store/useDiagramStore";
import { useEffect, useRef, useState } from "react";
import { useInitializeDiagram } from "../../hooks/useInitializeDiagram";

export function BlockContainer() {
  // Initialize diagram with default blocks
  useInitializeDiagram();

  const blocks = useDiagramStore((state) => state.blocks);
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

    const updatePositions = () => {
      const positions = new Map<string, { top: number; bottom: number }>();

      // Get all block elements
      const blockWrappers =
        containerRef.current?.querySelectorAll(".block-wrapper");

      console.log("Found block wrappers:", blockWrappers?.length);

      blockWrappers?.forEach((element) => {
        const blockId = element.getAttribute("data-block-id");
        if (!blockId) return;

        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        positions.set(blockId, {
          top: rect.top - containerRect.top,
          bottom: rect.bottom - containerRect.top,
        });
      });

      setBlockPositions(positions);
    };

    // Initial position calculation after a short delay to ensure DOM is ready
    setTimeout(updatePositions, 300);

    // Add resize observer to recalculate on size changes
    const observer = new ResizeObserver(() => {
      updatePositions();
      autoConnectBlocks(); // Reconnect blocks after resize
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [blocks, autoConnectBlocks]);

  // Auto-connect blocks when blocks array changes
  useEffect(() => {
    console.log("Block count changed, auto-connecting...");
    autoConnectBlocks();
  }, [blocks.length, autoConnectBlocks]); // Only reconnect when block count changes

  // Debug
  useEffect(() => {
    console.log(
      "Block positions:",
      blockPositions.size,
      Array.from(blockPositions.entries())
    );
    console.log("Connections:", connections.length, connections);
  }, [blockPositions, connections]);

  // Create manual connector array for ordered blocks if no connections exist
  const manualConnectors = [];
  if (connections.length === 0 && blocks.length > 1) {
    // Sort blocks by position (vertical)
    const sortedBlocks = [...blocks].sort(
      (a, b) => a.position.row - b.position.row
    );

    // Create manual connections between consecutive blocks
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
          <Block id={block.id} />
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
