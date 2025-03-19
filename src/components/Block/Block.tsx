import { useState } from "react";
import { BlockState } from "../../types/diagram";
import { useDiagramStore } from "../../store/useDiagramStore";
import { Card } from "@/components/ui/card";
import {
  Bars3Icon,
  PlayIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface BlockProps {
  id: string;
}

const stateIcons: Record<BlockState, typeof PlayIcon> = {
  idle: Bars3Icon,
  running: PlayIcon,
  finished: CheckIcon,
  error: XCircleIcon,
};

const stateStyles: Record<
  BlockState,
  { icon: string; background: string; border: string }
> = {
  idle: {
    icon: "text-muted-foreground",
    background: "bg-card",
    border: "border-border",
  },
  running: {
    icon: "text-blue-500",
    background: "bg-blue-50",
    border: "border-blue-200",
  },
  finished: {
    icon: "text-green-500",
    background: "bg-green-50",
    border: "border-green-200",
  },
  error: {
    icon: "text-red-500",
    background: "bg-red-50",
    border: "border-red-200",
  },
};

export function Block({ id }: BlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const block = useDiagramStore((state) =>
    state.blocks.find((b) => b.id === id)
  );
  const setSelectedBlock = useDiagramStore((state) => state.setSelectedBlock);
  const setIsDragging = useDiagramStore((state) => state.setIsDragging);

  if (!block) return null;

  const StateIcon = stateIcons[block.state];
  const styles = stateStyles[block.state];

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header
    if ((e.target as HTMLElement).closest(".block-header")) {
      setIsDragging(true);
      setSelectedBlock(id);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedBlock(null);
  };

  return (
    <div className="relative">
      {/* Input Point (Left) */}
      <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-3 h-3">
        <div className="w-full h-full rounded-full border-2 border-blue-500 bg-white" />
      </div>

      {/* Top Connection Point */}
      <div className="absolute top-0 left-1/2 -translate-y-[6px] -translate-x-1/2">
        <div
          className={`w-2 h-2 rounded-full ${
            stateStyles[block.state].background
          }`}
        />
      </div>

      {/* Bottom Connection Point */}
      <div className="absolute bottom-0 left-1/2 translate-y-[6px] -translate-x-1/2">
        <div
          className={`w-2 h-2 rounded-full ${
            stateStyles[block.state].background
          }`}
        />
      </div>

      <Card
        className={`
          w-[200px] shadow-sm bg-white relative z-10
          ${isHovered ? "ring-2 ring-blue-400 ring-offset-2" : ""}
          ${stateStyles[block.state].background}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Header - Draggable area */}
        <div className="block-header p-2 border-b cursor-move flex items-center gap-2">
          <StateIcon className={`h-4 w-4 ${stateStyles[block.state].icon}`} />
          <span className="font-medium text-sm">{block.label}</span>
        </div>

        {/* Content */}
        <div className="p-2">
          <div className="text-xs text-muted-foreground">
            Type: {block.type}
          </div>
        </div>
      </Card>
    </div>
  );
}
