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
  | "action";

export type BlockState = "idle" | "running" | "finished" | "error";

interface BaseBlockProps {
  title: string;
  description: string;
  state?: "idle" | "running" | "finished" | "error";
  isInNotebook?: boolean;
  isCompact?: boolean;
  runningAction?: string;
  result?: BlockResult;
}

export interface TriggerBlockProps extends BaseBlockProps {
  // ... any trigger-specific props
}

export interface ExtractionBlockProps extends BaseBlockProps {
  // ... any extraction-specific props
}

export interface BlockProps {
  type: BlockType;
  title: string;
  description?: string;
  state?: BlockState;
  inputs?: number;
  outputs?: number;
  color: {
    light: string;
    medium: string;
    dark: string;
  };
  result?: BlockResult;
}

export const BLOCK_COLORS = {
  trigger: {
    light: "bg-blue-100",
    medium: "bg-blue-500",
    dark: "bg-blue-700",
  },
  extraction: {
    light: "bg-purple-100",
    medium: "bg-purple-500",
    dark: "bg-purple-700",
  },
  generation: {
    light: "bg-green-100",
    medium: "bg-green-500",
    dark: "bg-green-700",
  },
  condition: {
    light: "bg-orange-100",
    medium: "bg-orange-500",
    dark: "bg-orange-700",
  },
  action: {
    light: "bg-red-100",
    medium: "bg-red-500",
    dark: "bg-red-700",
  },
};
