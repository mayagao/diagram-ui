import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { FunnelIcon } from "@heroicons/react/24/outline";
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
}

export default function ExtractionBlock({
  title,
  description = "Pull structured data from sources",
  state,
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
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
      icon={FunnelIcon}
      size={size}
      isInDiagram={isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
    />
  );
}
