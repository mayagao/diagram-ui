import { ReactNode } from "react";
import { BlockType, BlockResult } from "@/types/blocks";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

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
  children?: ReactNode | ((isHovered: boolean) => React.ReactNode);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  color: _color,
  icon: Icon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: _type = "trigger",
  isCompact = false,
  state = "idle",
}: IconProps & { state?: string }) {
  const getIconColor = () => {
    switch (state) {
      case "running":
        return "#2563eb"; // blue-600
      case "error":
        return "#dc2626"; // red-600
      default:
        return "#64748b"; // gray-500 for default/idle state
    }
  };

  return (
    <div
      className={`
        w-5 h-5
        rounded 
        flex items-center justify-center
        flex-shrink-0
        ${isCompact ? "my-auto" : ""}
      `}
    >
      {Icon && <Icon className="w-5 h-5" style={{ color: getIconColor() }} />}
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

export function OutputConnector({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoading: _isLoading,
}: ConnectorProps) {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isCompact: _isCompact = false,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: _type = "trigger",
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: _type,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description: _description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  color: _color,
  icon: Icon,
  isCompact = false,
  children,
  state = "idle",
  onMouseEnter,
  onMouseLeave,
  className,
}: NotebookBlockProps & {
  isCompact?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Class for pulsing border animation
  const borderClass =
    state === "running"
      ? "border-blue-400 animate-pulse-border"
      : state === "error"
      ? "border-red-200"
      : "border-gray-200";

  // Background color based on state
  const bgClass =
    state === "running"
      ? "bg-blue-50"
      : state === "error"
      ? "bg-red-50"
      : state === "finished"
      ? "bg-gray-50"
      : "bg-white";

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <div
      className={`
        w-full 
        ${isCompact ? "min-h-[52px]" : ""}
        ${bgClass}
        border 
        ${borderClass}
        rounded-md
        overflow-hidden
        relative
        ${className || ""}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`pt-2`}>
        {/* Header with icon and title always in one row */}
        <div className="flex items-center gap-2 px-2 pb-1 ">
          {Icon && (
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
            </div>
          )}
          <h3 className={`font-medium text-gray-800 text-sm`}>{title}</h3>
        </div>
        <div>
          <div className="w-full text-xs">
            {typeof children === "function"
              ? (children as (isHovered: boolean) => React.ReactNode)(isHovered)
              : children}
          </div>
        </div>
      </div>
    </div>
  );
}
