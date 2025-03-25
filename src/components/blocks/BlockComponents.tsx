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
}: IconProps) {
  const iconColorValues: Record<BlockType, string> = {
    trigger: "#2563eb", // blue-600
    extraction: "#9333ea", // purple-600
    generation: "#16a34a", // green-600
    condition: "#ea580c", // orange-600
    action: "#dc2626", // red-600
  };

  return (
    <div
      className={`
        ${color.light} 
        ${isCompact ? "w-7 h-7" : "w-10 h-10"} 
        rounded-lg 
        flex items-center justify-center
        flex-shrink-0
        ${isCompact ? "my-auto" : ""}
      `}
    >
      {Icon && (
        <Icon
          className={isCompact ? "w-4 h-4" : "w-6 h-6"}
          style={{ color: iconColorValues[type] }}
        />
      )}
    </div>
  );
}

// Connector dots for inputs and outputs
export function InputConnector({ isLoading }: ConnectorProps) {
  return (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
      <div className="w-3 h-3 bg-gray-400 rounded-full" />
    </div>
  );
}

export function OutputConnector({ isLoading }: ConnectorProps) {
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
      <div className="w-3 h-3 bg-gray-400 rounded-full" />
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
        className={`font-medium text-gray-800 ${
          isCompact ? "text-sm truncate" : ""
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
    <div
      className={`${
        isCompact ? "" : "mt-2"
      } p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 flex items-center truncate`}
    >
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
  const getBgColor = () => {
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
  };

  return (
    <div
      className={`${
        isCompact ? "" : "mt-2"
      } p-2 border rounded-lg text-xs ${getBgColor()}`}
    >
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
}: NotebookBlockProps & { isCompact?: boolean }) {
  // Define icon colors for inline display
  const iconColorValues: Record<BlockType, string> = {
    trigger: "#2563eb", // blue-600
    extraction: "#9333ea", // purple-600
    generation: "#16a34a", // green-600
    condition: "#ea580c", // orange-600
    action: "#dc2626", // red-600
  };

  return (
    <div
      className={`
        w-full 
        ${isCompact ? "h-[52px]" : "min-h-[80px]"}
        p-3
        bg-white 
        border 
        border-gray-200 
        rounded-xl
        overflow-hidden
        relative
      `}
    >
      <div
        className={`flex ${
          isCompact ? "flex-row items-center" : "flex-col"
        } gap-2`}
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className={`${color.light} ${
                isCompact ? "w-5 h-5" : "w-6 h-6"
              } rounded-md flex items-center justify-center flex-shrink-0`}
            >
              <Icon
                className={isCompact ? "w-3 h-3" : "w-3.5 h-3.5"}
                style={{ color: iconColorValues[type] }}
              />
            </div>
          )}
          <h3
            className={`font-medium text-gray-800 ${
              isCompact ? "text-sm truncate" : ""
            }`}
          >
            {title}
          </h3>
        </div>

        {/* Children (content) with proper spacing */}
        <div className={`${isCompact ? "flex-1" : ""}`}>{children}</div>
      </div>
    </div>
  );
}
