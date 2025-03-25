import { ReactNode } from "react";
import { BlockProps, BlockType, BlockResult } from "@/types/blocks";
import { Spinner } from "@/components/ui/spinner";

// Define component prop types
interface IconProps {
  color: {
    light: string;
    medium: string;
    dark: string;
  };
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  type: BlockType;
  isCompact?: boolean;
  state?: string;
}

interface NotebookBlockProps {
  type: BlockType;
  title: string;
  description: string;
  color: {
    light: string;
    medium: string;
    dark: string;
  };
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  children?: ReactNode;
  state?: string;
}

interface OutputResultProps {
  type: BlockType;
  result: BlockResult;
}

// Update the connector components to handle loading state
interface ConnectorProps {
  isLoading?: boolean;
}

// Icon container component
export function BlockIcon({
  color,
  icon: Icon,
  type,
  isCompact = false,
  state = "idle",
}: IconProps & { state?: string }) {
  const getIconColor = () => {
    switch (state) {
      case "running":
        return "#2563eb"; // blue-600
      case "finished":
        return "#16a34a"; // green-600
      case "error":
        return "#dc2626"; // red-600
      default:
        return "#64748b"; // gray-500 for default/idle state
    }
  };

  return (
    <div
      className={`
   
        ${isCompact ? "w-6 h-6" : "w-10 h-10"} 
        rounded 
        flex items-center justify-center
        flex-shrink-0
        ${isCompact ? "my-auto" : ""}
      `}
    >
      {Icon && (
        <Icon
          className={isCompact ? "w-4 h-4" : "w-5 h-5"}
          style={{ color: getIconColor() }}
        />
      )}
    </div>
  );
}

// Connector dots for inputs and outputs
export function InputConnector({}: ConnectorProps) {
  return (
    <div className="absolute z-10 -top-2 left-1/2 -translate-x-1/2 border border-4 rounded-full border-gray-50">
      <div className="w-3 h-3 bg-white border border-gray-100 rounded-full" />
    </div>
  );
}

export function OutputConnector({ isLoading }: ConnectorProps) {
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
      <div className="w-3 h-3 bg-white border border-gray-100 rounded-full" />
    </div>
  );
}

// Content component for block header (title and description)
export function BlockContent({
  title,
  description,
  isCompact = false,
}: {
  title: string;
  description: string;
  isCompact?: boolean;
}) {
  return (
    <div className="flex-1 overflow-hidden">
      <h3
        className={`font-medium text-gray-800 text-sm truncate ${
          isCompact ? "" : ""
        }`}
      >
        {title}
      </h3>
      {!isCompact && (
        <p className="text-xs text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis">
          {description}
        </p>
      )}
    </div>
  );
}

// Running indicator component
export function RunningBlock({
  action,
  isCompact = false,
}: {
  action: string;
  isCompact?: boolean;
}) {
  return (
    <div className={`mt-2 text-xs text-blue-700 flex items-center`}>
      <Spinner size="sm" className="text-blue-600 -ml-1 mr-2 flex-shrink-0" />
      <span className="overflow-hidden whitespace-nowrap text-ellipsis w-full">
        {action}
      </span>
    </div>
  );
}

// Output results component
export function OutputResult({
  type,
  result,
  isCompact = false,
}: OutputResultProps & { isCompact?: boolean }) {
  return (
    <div className={`mt-2 p-2 border rounded-lg text-xs`}>
      <div className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">
        {result.summary}
      </div>
      {!isCompact && result.data && (
        <div className="mt-1 text-xs opacity-80">
          {Object.entries(result.data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key}:</span>
              <span>{value as ReactNode}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Notebook-specific block styling
export function NotebookBlock({
  type,
  title,
  description,
  color,
  icon: Icon,
  isCompact = false,
  children,
  state = "idle",
}: NotebookBlockProps & { isCompact?: boolean }) {
  // Class for pulsing border animation
  const borderClass =
    state === "running"
      ? "border-blue-400 animate-pulse-border"
      : state === "finished"
      ? "border-green-100"
      : state === "error"
      ? "border-red-400"
      : "border-gray-200";

  // Background color based on state
  const bgClass =
    state === "running"
      ? "bg-blue-50"
      : state === "error"
      ? "bg-red-50"
      : "bg-white";

  return (
    <div
      className={`
        w-full 
        ${isCompact ? "min-h-[52px]" : "min-h-[80px]"}
        p-3
        ${bgClass}
        border 
        ${borderClass}
        rounded-xl
        overflow-hidden
        relative
      `}
    >
      <div className={`flex flex-col gap-2`}>
        {/* Header with icon and title always in one row */}
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className={`${color.light} ${
                isCompact ? "w-5 h-5" : "w-6 h-6"
              } rounded-md flex items-center justify-center flex-shrink-0`}
            >
              <Icon
                className={isCompact ? "w-3 h-3" : "w-3.5 h-3.5"}
                style={{
                  color:
                    state === "running"
                      ? "#2563eb" // blue for running
                      : state === "finished"
                      ? "#16a34a" // green for finished
                      : "#64748b", // gray for default
                }}
              />
            </div>
          )}
          <h3
            className={`font-medium text-gray-800 ${
              isCompact ? "text-sm" : ""
            }`}
          >
            {title}
          </h3>
        </div>

        {/* Content below the header - even in compact mode */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

// Error message component
export function ErrorBlock({
  message,
  isCompact = false,
}: {
  message: string;
  isCompact?: boolean;
}) {
  return (
    <div className={`mt-2 text-xs text-red-700 flex items-center`}>
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
        {message}
      </span>
    </div>
  );
}
