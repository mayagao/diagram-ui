export type BlockResultData = Record<
  string,
  string | number | boolean | null | string[]
>;

export interface BlockResult {
  summary: string;
  data?: BlockResultData;
}

export type BlockType =
  | "trigger"
  | "extraction"
  | "generation"
  | "condition"
  | "action"
  | "end";

export type BlockState = "idle" | "running" | "finished" | "error" | "paused";

interface BaseBlockProps {
  title: string;
  description: string;
  state?: "idle" | "running" | "finished" | "error" | "paused";
  isInNotebook?: boolean;
  isCompact?: boolean;
  hideConnectors?: boolean;
  result?: BlockResult;
  errorMessage?: string;
  runningAction?: string;
  onRun?: () => void;
  onPause?: () => void;
  onRerun?: () => void;
}

export type TriggerBlockProps = BaseBlockProps & {
  color?: string;
};

export type ExtractionBlockProps = BaseBlockProps;

export interface BlockProps {
  type: BlockType;
  title: string;
  description?: string;
  state?: BlockState;
  inputs?: number;
  outputs?: number;
  color: string;
  result?: BlockResult;
}

export const BLOCK_COLORS = {
  trigger: "bg-blue-500",
  extraction: "bg-purple-500",
  generation: "bg-green-500",
  condition: "bg-orange-500",
  action: "bg-red-500",
  end: "bg-gray-500",
};
