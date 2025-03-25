import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { BoltIcon } from "@heroicons/react/24/outline";
import { BlockResult } from "@/types/blocks";

interface ActionBlockProps {
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
  hideConnectors?: boolean;
}

export default function ActionBlock({
  title,
  description = "Perform external system operations",
  state,
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
  errorMessage,
  hideConnectors = false,
}: ActionBlockProps) {
  return (
    <Block
      type="action"
      title={title}
      description={description}
      state={state}
      inputs={1}
      outputs={0}
      color={BLOCK_COLORS.action}
      icon={BoltIcon}
      size={size}
      isInDiagram={isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
      errorMessage={errorMessage}
      hideConnectors={hideConnectors}
    />
  );
}
