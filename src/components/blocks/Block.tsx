import { BlockProps, BlockResult, BlockState, BlockType } from "@/types/blocks";
import {
  ArrowDownCircleIcon, // for Trigger
  DocumentArrowDownIcon, // for Extraction
  SquaresPlusIcon, // for Generation
  BeakerIcon, // for Condition
  BoltIcon, // for Action
} from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  BlockIcon,
  BlockContent,
  InputConnector,
  OutputConnector,
  NotebookBlock,
} from "./BlockComponents";
import { ActionArea } from "./BlockComponents/ActionArea";

interface BlockColor {
  light: string;
  medium: string;
  dark: string;
}

interface ExtendedBlockProps extends Omit<BlockProps, "type"> {
  id?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  type: BlockType;
  title: string;
  color: BlockColor;
  size?: "compact" | "default";
  _isInDiagram?: boolean;
  isInNotebook?: boolean;
  runningAction?: string;
  result?: BlockResult;
  isCompact?: boolean;
  errorMessage?: string;
  onRun?: () => void;
  onPause?: () => void;
  onRerun?: () => void;
  customResultRenderer?: (
    result: BlockResult,
    isCompact?: boolean
  ) => React.ReactNode;
  hideConnectors?: boolean;
}

const pulseAnimation = `
`;

const getStateStyles = (state: BlockState) => {
  switch (state) {
    case "running":
      return "border-1 border-blue-100 animate-pulse-border bg-blue-50";
    case "paused":
      return "border-1 border-gray-300 bg-white";
    case "finished":
      return "border-1 border-gray-200 bg-white";
    case "error":
      return "border-1 border-red-200 bg-red-50";
    default:
      return "border-1 border-gray-200 bg-white";
  }
};

export default function Block(props: ExtendedBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
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
    isInNotebook = false,
    isCompact = false,
    runningAction,
    result,
    errorMessage,
    onRun,
    onPause,
    onRerun,
    customResultRenderer,
    hideConnectors,
  } = props;

  // Add a more visible console log
  console.log(`🔍 Block "${title}" - isCompact:`, isCompact);

  const isRunning = state === "running";
  const isFinished = state === "finished";

  return (
    <>
      <style>{pulseAnimation}</style>
      {isInNotebook ? (
        <NotebookView
          title={title || ""}
          description={description || ""}
          type={type || "trigger"}
          state={state}
          color={color || { light: "", medium: "", dark: "" }}
          icon={Icon}
          isCompact={isCompact}
          runningAction={runningAction}
          result={result}
          errorMessage={errorMessage}
          onRun={onRun}
          onPause={onPause}
          onRerun={onRerun}
          customResultRenderer={customResultRenderer}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isRunning={isRunning}
          isFinished={isFinished}
        />
      ) : (
        <DiagramView
          title={title || ""}
          description={description || ""}
          type={type || "trigger"}
          state={state}
          color={color || { light: "", medium: "", dark: "" }}
          icon={Icon}
          inputs={inputs}
          outputs={outputs}
          size={size}
          isCompact={isCompact}
          isRunning={isRunning}
          isFinished={isFinished}
          runningAction={runningAction}
          result={result}
          errorMessage={errorMessage}
          onRun={onRun}
          onPause={onPause}
          onRerun={onRerun}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          hideConnectors={hideConnectors}
          customResultRenderer={customResultRenderer}
        />
      )}
    </>
  );
}

interface NotebookViewProps extends ExtendedBlockProps {
  isHovered: boolean;
  setIsHovered: (hover: boolean) => void;
  isRunning: boolean;
  isFinished: boolean;
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
  runningAction,
  result,
  errorMessage,
  onRun,
  onPause,
  onRerun,
  customResultRenderer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isHovered,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsHovered,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isRunning,
  isFinished,
}: NotebookViewProps) {
  // Add state variables at the top of the component
  const isError = state === "error";

  return (
    <NotebookBlock
      type={type}
      title={title}
      description={description}
      color={color}
      icon={Icon || (() => null)}
      isCompact={isCompact}
      state={state || "idle"}
      className="hover:shadow-md cursor-pointer"
    >
      {(hoverState: boolean): React.ReactNode => (
        <>
          <div className="absolute top-3 right-3">
            <ActionArea
              state={state || "idle"}
              isHovered={hoverState}
              onRun={onRun}
              onPause={onPause}
              onRerun={onRerun}
            />
          </div>

          <div
            className={`relative flex gap-2 text-xs ${
              isCompact ? "px-2 pb-2" : ""
            }`}
          >
            <div className={`${isCompact ? "flex gap-2" : ""} w-full`}>
              {renderNotebookContent()}
            </div>
          </div>
        </>
      )}
    </NotebookBlock>
  );

  // Inner function to render the appropriate content based on state and compact mode
  function renderNotebookContent() {
    if (isCompact) {
      // Add paused state handling for compact mode
      if (state === "paused" && runningAction) {
        return (
          <div className="text-gray-600 flex items-center">
            <span className="truncate">{runningAction}</span>
          </div>
        );
      }

      if (isError && errorMessage) {
        return (
          <div className="text-xs text-red-700 flex items-center">
            <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
              {errorMessage}
            </span>
          </div>
        );
      }

      if (isFinished && result) {
        // Use custom renderer if provided
        if (customResultRenderer) {
          return customResultRenderer(result, isCompact);
        }

        return (
          <div
            className={`px-2 py-1  bg-gray-50 border-t border-gray-200 text-xs `}
          >
            <div className="mt-2 p-2 border rounded-lg text-xs">
              <div className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">
                {result.summary}
              </div>
              {result.data && (
                <div className="mt-1 text-xs opacity-80">
                  {Object.entries(result.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      // Default state - show description
      return <div className="text-gray-600 truncate">{description}</div>;
    } else {
      // Non-compact mode
      return (
        <>
          <p className="text-gray-600 px-2 pb-2">
            {state === "paused" && <span>Paused</span>}
            {description}
          </p>
          {runningAction && (
            <div
              className={`${
                state === "paused"
                  ? "bg-gray-50 text-gray-600"
                  : "bg-blue-100 text-blue-800"
              } px-2 py-1 border-t border-gray-200`}
            >
              <span className="truncate">{runningAction}</span>
            </div>
          )}
          {isFinished && result && (
            <div
              className={`px-2 py-1  bg-gray-50 border-t border-gray-200 text-xs `}
            >
              {customResultRenderer ? (
                customResultRenderer(result, isCompact)
              ) : (
                <div className="mt-2 p-2 border rounded-lg text-xs">
                  <div className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">
                    {result.summary}
                  </div>
                  {result.data && (
                    <div className="mt-1 text-xs opacity-80">
                      {Object.entries(result.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      );
    }
  }
}

interface DiagramViewProps extends ExtendedBlockProps {
  isRunning: boolean;
  isFinished: boolean;
  isHovered: boolean;
  setIsHovered: (hover: boolean) => void;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = "default",
  isCompact = false,
  isRunning,
  isFinished,
  runningAction,
  result,
  errorMessage,
  onRun,
  onPause,
  onRerun,
  isHovered,
  setIsHovered,
  hideConnectors,
  customResultRenderer,
}: DiagramViewProps) {
  const isError = state === "error";

  return (
    <div className="relative mx-auto">
      {inputs > 0 && !hideConnectors && (
        <InputConnector isLoading={isRunning} />
      )}

      <div
        className={`
          w-64
          min-h-[52px]
          rounded-md
          ${getStateStyles(state || "idle")} 
          transition-all duration-200
          ${isRunning ? "bg-blue-50" : ""}
          flex flex-col 
          mx-auto
          overflow-hidden
          relative
          hover:shadow-md
          cursor-pointer
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header with icon and title */}
        <div className="flex items-center gap-2 relative px-2 py-2">
          <BlockIcon
            color={color}
            icon={Icon || (() => null)}
            type={type}
            isCompact={isCompact}
          />
          <div className="flex flex-col truncate flex-1">
            <BlockContent
              title={title}
              description={description}
              isCompact={isCompact}
            />
            {isCompact && renderCompactContent()}
          </div>
          <ActionArea
            state={state || "idle"}
            isHovered={isHovered}
            onRun={onRun}
            onPause={onPause}
            onRerun={onRerun}
          />
        </div>
        {/* Only render this for non-compact mode */}
        {!isCompact && renderDefaultContent()}
      </div>

      {outputs > 0 && !hideConnectors && (
        <OutputConnector isLoading={isRunning} />
      )}
    </div>
  );

  // Render content for compact mode
  function renderCompactContent() {
    // Add paused state handling
    if (state === "paused" && runningAction) {
      return (
        <div className="text-xs text-gray-600 flex items-center gap-1">
          <span className="truncate">{runningAction}</span>
        </div>
      );
    }

    // 1. DEFAULT STATE: Show description text
    if (!isRunning && !isFinished && !isError) {
      return (
        <div className="text-xs text-gray-600 truncate">{description}</div>
      );
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

    // 4. FINISHED STATE: Show result summary or custom renderer
    if (isFinished && result) {
      // Use custom renderer if provided
      if (customResultRenderer) {
        return (
          <div
            className={`text-xs text-gray-600 truncate ${
              isCompact ? "flex" : ""
            }`}
          >
            {customResultRenderer(result, isCompact)}
          </div>
        );
      }

      // Otherwise use the default summary
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
    if (state === "paused" && runningAction) {
      return (
        <div className="px-2 text-xs border-t py-1 border-gray-100 bg-gray-50">
          <span className="truncate">{runningAction}</span>
        </div>
      );
    }

    if (isError && errorMessage) {
      return (
        <div className="px-2 py-1 truncate border-t border-gray-100 text-xs bg-red-100 text-red-700">
          {errorMessage}
        </div>
      );
    }

    if (isFinished && result) {
      // Use custom renderer if provided
      if (customResultRenderer) {
        return (
          <div className="border-t border-gray-100 p-2 text-xs bg-gray-50">
            {customResultRenderer(result, isCompact)}
          </div>
        );
      }

      // Otherwise use default rendering
      return (
        <div className={`text-xs `}>
          <div className="p-2 line-clamp-2">{result.summary}</div>
          {result.data && <div className="">{renderData(result.data)}</div>}
        </div>
      );
    }

    if (isRunning && runningAction) {
      return (
        <div className="px-2 py-1 text-xs text-blue-700 truncate bg-blue-100">
          {runningAction}
        </div>
      );
    }
    return null;
  }
}

// Export icons for the blocks
export const blockIcons = {
  trigger: ArrowDownCircleIcon,
  extraction: DocumentArrowDownIcon,
  generation: SquaresPlusIcon,
  condition: BeakerIcon,
  action: BoltIcon,
};

// Inside the renderContent function or wherever you're displaying the data
const renderData = (data: Record<string, unknown>) => {
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
