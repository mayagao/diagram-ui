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

const stateStyles: Record<BlockState, { icon: string; background: string }> = {
  idle: {
    icon: "text-muted-foreground",
    background: "bg-card",
  },
  running: {
    icon: "text-blue-500",
    background: "bg-blue-50",
  },
  finished: {
    icon: "text-green-500",
    background: "bg-green-50",
  },
  error: {
    icon: "text-red-500",
    background: "bg-red-50",
  },
};

export function Block({ id }: BlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const block = useDiagramStore((state) =>
    state.blocks.find((b) => b.id === id)
  );
  const selectedBlockId = useDiagramStore((state) => state.selectedBlockId);
  const setSelectedBlock = useDiagramStore((state) => state.setSelectedBlock);
  const setIsDragging = useDiagramStore((state) => state.setIsDragging);

  if (!block) return null;

  const StateIcon = stateIcons[block.state];

  const handleMouseDown = () => {
    setIsDragging(true);
    setSelectedBlock(id);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const isSelected = selectedBlockId === id;

  return (
    <Card
      className={`
        w-fit px-3 py-1.5 shadow-sm cursor-move flex items-center gap-2
        ${stateStyles[block.state].background}
        ${isHovered ? "ring-2 ring-blue-400 ring-offset-2" : ""}
        ${isSelected ? "ring-2 ring-blue-600 ring-offset-2" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={() => setSelectedBlock(id)}
    >
      <StateIcon className={`h-4 w-4 ${stateStyles[block.state].icon}`} />
      <span className="font-medium text-sm whitespace-nowrap">
        {block.label}
      </span>
    </Card>
  );
}
