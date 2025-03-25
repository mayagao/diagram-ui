import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { BlockResult } from "@/types/blocks";

interface ConditionBlockProps {
  title: string;
  description?: string;
  state?: "idle" | "running" | "finished" | "error";
  size?: "compact" | "default";
  isInDiagram?: boolean;
  isInNotebook?: boolean;
  runningAction?: string;
  result?: BlockResult;
  isCompact?: boolean;
  errorMessage?: string;
}

export default function ConditionBlock({
  title,
  description = "Routes based on conditions",
  state,
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
  errorMessage,
}: ConditionBlockProps) {
  return (
    <Block
      type="condition"
      title={title}
      description={description}
      state={state}
      inputs={1}
      outputs={2}
      color={BLOCK_COLORS.condition}
      icon={ArrowsPointingOutIcon}
      size={size}
      isInDiagram={isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
      errorMessage={errorMessage}
    />
  );
}
