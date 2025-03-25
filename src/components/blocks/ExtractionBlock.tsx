import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { BlockResult, BlockState } from "@/types/blocks";

interface ExtractionBlockProps {
  title: string;
  description?: string;
  state?: BlockState;
  size?: "compact" | "default";
  isInDiagram?: boolean;
  isInNotebook?: boolean;
  runningAction?: string;
  result?: BlockResult;
  isCompact?: boolean;
  errorMessage?: string;
  onRun?: () => void;
  onPause?: () => void;
  onRerun?: () => void;
  hideConnectors?: boolean;
}

export default function ExtractionBlock({
  title,
  description = "Extract structured data from content",
  state = "idle",
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
  errorMessage,
  onRun,
  onPause,
  onRerun,
  hideConnectors,
}: ExtractionBlockProps) {
  return (
    <Block
      type="extraction"
      title={title}
      description={description}
      state={state}
      inputs={1}
      outputs={1}
      color={BLOCK_COLORS.extraction}
      icon={DocumentTextIcon}
      size={size}
      isInDiagram={isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
      errorMessage={errorMessage}
      onRun={onRun}
      onPause={onPause}
      onRerun={onRerun}
      hideConnectors={hideConnectors}
    />
  );
}
