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
  errorMessage?: string;
}

const pulseAnimation = `
`;

const getStateStyles = (state: string, color: BlockProps["color"]) => {
  switch (state) {
    case "running":
      return "border-1 border-blue-100 animate-pulse-border bg-blue-50";
    case "finished":
      return "border-1 border-gray-200 bg-gray-100";
    case "error":
      return "border-1 border-red-200 bg-red-50";
    default:
      return "border-1 border-gray-200 bg-white";
  }
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
    errorMessage,
  } = props;

  // Add a more visible console log
  console.log(`🔍 Block "${title}" - isCompact:`, isCompact);

  const isRunning = state === "running";
  const isFinished = state === "finished";
  const isError = state === "error";

  return (
    <>
      <style>{pulseAnimation}</style>
      {isInNotebook ? (
        <NotebookView
          {...props}
          isRunning={isRunning}
          isFinished={isFinished}
        />
      ) : (
        <DiagramView {...props} isRunning={isRunning} isFinished={isFinished} />
      )}
    </>
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
  state,
  isRunning,
  isFinished,
  runningAction,
  result,
  errorMessage,
}: ExtendedBlockProps & { isRunning: boolean; isFinished: boolean }) {
  const isError = state === "error";

  return (
    <NotebookBlock
      type={type}
      title={title}
      description={description}
      color={color}
      icon={Icon}
      isCompact={isCompact}
      state={state}
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
          <div className="">
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

      if (isError && errorMessage) {
        return (
          <div className="text-xs text-red-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
              {errorMessage}
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
  errorMessage,
}: ExtendedBlockProps & {
  isRunning: boolean;
  isFinished: boolean;
}) {
  const isError = state === "error";

  return (
    <div className="relative mx-auto">
      {inputs > 0 && <InputConnector isLoading={isRunning} />}

      <div
        className={`
          w-64
          ${isCompact ? "min-h-[52px]" : "min-h-[80px]"}
          rounded-md
          ${getStateStyles(state, color)} 
          transition-all duration-200
          ${isRunning ? "bg-blue-50" : ""}
          flex flex-col gap-1
          mx-auto
          overflow-hidden
          relative
        `}
      >
        {/* Header with icon and title */}
        <div className="flex items-start gap-2 relative px-2 py-2">
          <BlockIcon
            color={color}
            icon={Icon}
            type={type}
            isCompact={isCompact}
          />
          <div className="flex flex-col gap-1 truncate flex-1">
            <BlockContent
              title={title}
              description={description}
              isCompact={isCompact}
            />
            {isCompact && renderCompactContent()}
          </div>
          {/* Main content area - always render this for compact mode */}

          {/* Status indicators in top right corner for compact mode */}
          {renderStatusIndicator()}
        </div>

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
        <div style={{ right: "0px" }} className="self-end my-auto">
          <Spinner size="sm" className="text-blue-600 h-3.5 w-3.5 " />
        </div>
      );
    }

    if (isFinished) {
      return (
        <div className="self-end w-4 h-4 flex items-center justify-center bg-green-700 rounded-full my-auto">
          <CheckIcon
            style={{ strokeWidth: 3.5, width: 12, height: 10 }}
            className="text-white"
          />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="self-end w-4 h-4 flex items-center justify-center bg-red-600 rounded-full my-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ width: 14, height: 14 }}
            className="text-white"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </div>
      );
    }

    return null;
  }

  // Render content for compact mode
  function renderCompactContent() {
    // 1. DEFAULT STATE: Show description text
    if (!isRunning && !isFinished && !isError) {
      return <div className="text-xs text-gray-600">{description}</div>;
    }

    // 2. RUNNING STATE: Show current action with spinner
    if (isRunning && runningAction) {
      return (
        <div className="text-xs text-gray-600 truncate">{runningAction}</div>
      );
    }

    // 3. ERROR STATE: Show error message
    if (isError && errorMessage) {
      return (
        <div className="text-xs text-gray-600 truncate">{errorMessage}</div>
      );
    }

    // 4. FINISHED STATE: Show result summary
    if (isFinished && result) {
      return (
        <div className={`text-xs text-gray-600`}>
          <div className="truncate">{result.summary}</div>
        </div>
      );
    }

    return null;
  }

  // Render content for default (non-compact) mode
  function renderDefaultContent() {
    if (isRunning && runningAction) {
      return (
        <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-xs text-gray-600 flex items-center">
          <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {runningAction}
          </span>
        </div>
      );
    }

    if (isError && errorMessage) {
      return (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {errorMessage}
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
            <div className="mt-2 text-sm">{renderData(result.data)}</div>
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

// Inside the renderContent function or wherever you're displaying the data
const renderData = (data: any) => {
  if (!data) return null;

  return Object.entries(data).map(([key, value]) => {
    const displayValue =
      typeof value === "string" && value.startsWith("{")
        ? JSON.parse(value)
        : value;

    return (
      <div key={key} className="mb-1">
        <span className="font-medium">{key}: </span>
        {typeof displayValue === "object" ? (
          <pre className="inline">{JSON.stringify(displayValue, null, 2)}</pre>
        ) : (
          <span>{String(displayValue)}</span>
        )}
      </div>
    );
  });
};
