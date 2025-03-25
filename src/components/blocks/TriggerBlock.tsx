import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { PlayIcon } from "@heroicons/react/24/outline";
import { BlockResult } from "@/types/blocks";

interface TriggerBlockProps {
  title: string;
  description?: string;
  state?: "idle" | "running" | "finished" | "error";
  size?: "compact" | "default";
  isInDiagram?: boolean;
  isInNotebook?: boolean;
  runningAction?: string;
  result?: BlockResult;
  isCompact?: boolean;
}

export default function TriggerBlock({
  title,
  description = "Initiates workflow execution",
  state,
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
}: TriggerBlockProps) {
  return (
    <Block
      type="trigger"
      title={title}
      description={description}
      state={state}
      inputs={0}
      outputs={1}
      color={BLOCK_COLORS.trigger}
      icon={PlayIcon}
      size={size}
      isInDiagram={isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
    />
  );
}
