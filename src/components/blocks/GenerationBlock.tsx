import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { BlockResult } from "@/types/blocks";

interface GenerationBlockProps {
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

export default function GenerationBlock({
  title,
  description = "Transform or generate new content",
  state,
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
}: GenerationBlockProps) {
  return (
    <Block
      type="generation"
      title={title}
      description={description}
      state={state}
      inputs={1}
      outputs={1}
      color={BLOCK_COLORS.generation}
      icon={CpuChipIcon}
      size={size}
      isInDiagram={isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
    />
  );
}
