import { BlockProps, BlockResult } from "@/types/blocks";
import {
  PlayIcon, // for Trigger
  FunnelIcon, // for Extraction
  CpuChipIcon, // for Generation
  ArrowsPointingOutIcon, // for Condition
  BoltIcon, // for Action
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  BlockIcon,
  BlockContent,
  InputConnector,
  OutputConnector,
  RunningBlock,
  OutputResult,
  NotebookBlock,
} from "./BlockComponents";
import { Spinner } from "@/components/ui/spinner";
import { ReactNode } from "react";

interface ExtendedBlockProps extends BlockProps {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  size?: "compact" | "default";
  isInDiagram?: boolean;
  isInNotebook?: boolean;
  runningAction?: string;
  result?: BlockResult;
  isCompact?: boolean;
}

const getStateStyles = (state: string, color: BlockProps["color"]) => {
  switch (state) {
    case "running":
      return "border-2 " + color.medium;
    case "finished":
      return "border-2 border-green-500";
    case "error":
      return "border-2 border-red-500";
    default:
      return "border-2 border-gray-200";
  }
};

// Define direct color hex values for the icons
const iconColorValues = {
  trigger: "#2563eb", // blue-600
  extraction: "#9333ea", // purple-600
  generation: "#16a34a", // green-600
  condition: "#ea580c", // orange-600
  action: "#dc2626", // red-600
};

export default function Block(props: ExtendedBlockProps) {
  const {
    type,
    title,
    description,
    state = "idle",
    inputs = 0,
    outputs = 0,
    color,
    icon: Icon,
    size = "default",
    isInDiagram = true,
    isInNotebook = false,
    isCompact = false,
    runningAction,
    result,
  } = props;

  // Add a more visible console log
  console.log(`🔍 Block "${title}" - isCompact:`, isCompact);

  const isRunning = state === "running";
  const isFinished = state === "finished";

  // Choose the appropriate view based on notebook or diagram mode
  return isInNotebook ? (
    <NotebookView {...props} isRunning={isRunning} isFinished={isFinished} />
  ) : (
    <DiagramView {...props} isRunning={isRunning} isFinished={isFinished} />
  );
}

// Notebook view implementation
function NotebookView({
  type,
  title,
  description,
  color,
  icon: Icon,
  isCompact = false,
  isRunning,
  isFinished,
  runningAction,
  result,
}: ExtendedBlockProps & { isRunning: boolean; isFinished: boolean }) {
  return (
    <NotebookBlock
      type={type}
      title={title}
      description={description}
      color={color}
      icon={Icon}
      isCompact={isCompact}
    >
      {renderNotebookContent()}
    </NotebookBlock>
  );

  // Inner function to render the appropriate content based on state and compact mode
  function renderNotebookContent() {
    if (isCompact) {
      // In compact mode, handle each state individually
      if (isRunning && runningAction) {
        return (
          <div className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700 flex items-center">
            <Spinner
              size="sm"
              className="text-blue-600 -ml-1 mr-2 flex-shrink-0 h-3 w-3"
            />
            <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
              {runningAction}
            </span>
          </div>
        );
      }

      if (isFinished && result) {
        return (
          <div
            className={`px-2 py-1 rounded-md text-xs ${getBgColorByType(type)}`}
          >
            <div className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">
              {result.summary}
            </div>
          </div>
        );
      }

      // Default state - show description
      return (
        <div className="text-xs text-gray-600 px-2 py-1 bg-gray-50 rounded-md overflow-hidden whitespace-nowrap text-ellipsis w-full">
          {description}
        </div>
      );
    } else {
      // Non-compact mode - show all content stacked
      return (
        <>
          <p className="text-sm text-gray-600">{description}</p>
          {isRunning && runningAction && (
            <RunningBlock action={runningAction} />
          )}
          {isFinished && result && <OutputResult type={type} result={result} />}
        </>
      );
    }
  }
}

// Diagram view implementation
function DiagramView({
  type,
  title,
  description,
  state,
  color,
  icon: Icon,
  inputs = 0,
  outputs = 0,
  isCompact = false,
  isRunning,
  isFinished,
  runningAction,
  result,
}: ExtendedBlockProps & { isRunning: boolean; isFinished: boolean }) {
  return (
    <div className="relative mx-auto">
      {inputs > 0 && <InputConnector isLoading={isRunning} />}

      <div
        className={`
          w-64
          ${isCompact ? "min-h-[52px]" : "min-h-[80px]"}
          rounded-xl
          p-3
          ${getStateStyles(state, color)}
          transition-all duration-200
          bg-white
          flex flex-col gap-1
          shadow-sm
          mx-auto
          overflow-hidden
          relative
        `}
      >
        {/* Header with icon and title */}
        <div className="flex items-center gap-2">
          <BlockIcon
            color={color}
            icon={Icon}
            type={type}
            isCompact={isCompact}
          />
          <BlockContent
            title={title}
            description={description}
            isCompact={isCompact}
          />

          {/* Status indicators in top right corner for compact mode */}
          {renderStatusIndicator()}
        </div>

        {/* Main content area - always render this for compact mode */}
        {isCompact && renderCompactContent()}

        {/* Only render this for non-compact mode */}
        {!isCompact && renderDefaultContent()}
      </div>

      {outputs > 0 && <OutputConnector isLoading={isRunning} />}
    </div>
  );

  // Status indicator in top right (only in compact mode)
  function renderStatusIndicator() {
    if (!isCompact) return null;

    if (isRunning) {
      return (
        <div className="absolute top-3 right-3">
          <Spinner size="sm" className="text-blue-600 h-4 w-4" />
        </div>
      );
    }

    if (isFinished) {
      return (
        <div className="absolute top-3 right-3">
          <CheckIcon className="h-4 w-4 text-green-500" />
        </div>
      );
    }

    return null;
  }

  // Render content for compact mode
  function renderCompactContent() {
    // 1. DEFAULT STATE: Show description text
    if (!isRunning && !isFinished) {
      return (
        <div className="text-xs text-gray-600 mt-1 px-2 py-1 bg-gray-50 rounded-md overflow-hidden whitespace-nowrap text-ellipsis w-full">
          {description}
        </div>
      );
    }

    // 2. RUNNING STATE: Show current action with spinner
    if (isRunning && runningAction) {
      return (
        <div className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700 flex items-center">
          <Spinner
            size="sm"
            className="text-blue-600 -ml-1 mr-2 flex-shrink-0 h-3 w-3"
          />
          <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {runningAction}
          </span>
        </div>
      );
    }

    // 3. FINISHED STATE: Show result summary
    if (isFinished && result) {
      return (
        <div
          className={`px-2 py-1 rounded-md text-xs ${getBgColorByType(type)}`}
        >
          <div className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">
            {result.summary}
          </div>
        </div>
      );
    }

    return null;
  }

  // Render content for default (non-compact) mode
  function renderDefaultContent() {
    if (isRunning && runningAction) {
      return (
        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 flex items-center">
          <Spinner
            size="sm"
            className="text-blue-600 -ml-1 mr-2 flex-shrink-0"
          />
          <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {runningAction}
          </span>
        </div>
      );
    }

    if (isFinished && result) {
      return (
        <div className={`border rounded-lg text-xs ${getBgColorByType(type)}`}>
          <div className="font-medium p-2 overflow-hidden whitespace-nowrap text-ellipsis">
            {result.summary}
          </div>
          {result.data && (
            <div className="border-t px-2 py-1.5 text-xs opacity-80">
              {Object.entries(result.data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {key}:
                  </span>
                  <span className="overflow-hidden whitespace-nowrap text-ellipsis ml-2">
                    {value as ReactNode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  }
}

// Helper function to get background colors based on block type
function getBgColorByType(type: string) {
  switch (type) {
    case "trigger":
      return "bg-blue-50 border-blue-200 text-blue-700";
    case "extraction":
      return "bg-purple-50 border-purple-200 text-purple-700";
    case "generation":
      return "bg-green-50 border-green-200 text-green-700";
    case "condition":
      return "bg-orange-50 border-orange-200 text-orange-700";
    case "action":
      return "bg-red-50 border-red-200 text-red-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
}

// Export icons for the blocks
export const blockIcons = {
  trigger: PlayIcon,
  extraction: FunnelIcon,
  generation: CpuChipIcon,
  condition: ArrowsPointingOutIcon,
  action: BoltIcon,
};
