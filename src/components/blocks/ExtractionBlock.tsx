import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BlockResult } from "@/types/blocks";

interface ExtractionBlockProps {
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

export default function ExtractionBlock({
  title,
  description = "Extract structured data from content",
  state,
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
  errorMessage,
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
      icon={DocumentMagnifyingGlassIcon}
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
