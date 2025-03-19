import { useRef, useEffect } from "react";
import { useDiagramStore } from "../../store/useDiagramStore";
import { Position } from "../../types/diagram";
import { BlockContainer } from "../BlockContainer/BlockContainer";

const GRID_SIZE = 20; // Size of each grid cell in pixels

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedBlockId = useDiagramStore((state) => state.selectedBlockId);
  const isDragging = useDiagramStore((state) => state.isDragging);
  const updateBlockPosition = useDiagramStore(
    (state) => state.updateBlockPosition
  );

  useEffect(() => {
    if (!isDragging || !selectedBlockId || !canvasRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Snap to grid
      const snappedPosition: Position = {
        row: Math.round(y / GRID_SIZE),
        column: Math.round(x / GRID_SIZE),
      };

      updateBlockPosition(selectedBlockId, snappedPosition);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isDragging, selectedBlockId, updateBlockPosition]);

  // Calculate grid lines
  const gridStyle = {
    backgroundImage: `
      linear-gradient(to right, #f0f0f0 1px, transparent 1px),
      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
    `,
    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-white overflow-hidden"
      style={gridStyle}
    >
      {/* Use BlockContainer which has automated connections */}
      <BlockContainer />
    </div>
  );
}
