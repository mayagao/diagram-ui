import React from "react";
import {
  ArrowDownCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/spinner";
import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { BlockResult, BlockProps } from "@/types/blocks";

interface TriggerBlockProps extends Omit<BlockProps, "type"> {
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
  hideConnectors?: boolean;
  onRun?: () => void;
  onPause?: () => void;
  onRerun?: () => void;
}

const TriggerBlock: React.FC<TriggerBlockProps> = ({
  title,
  description = "Initiates workflow execution",
  state,
  size,
  isInDiagram,
  isInNotebook,
  runningAction,
  result,
  isCompact = false,
  errorMessage,
  hideConnectors = false,
  onRun,
  onPause,
  onRerun,
}) => {
  const renderIcon = () => {
    if (state === "running")
      return <Spinner className="h-5 w-5 text-blue-500" />;
    if (state === "finished")
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (state === "error")
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    return <ArrowDownCircleIcon className="h-5 w-5 text-gray-400" />;
  };

  const renderContent = () => {
    if (state === "running") {
      return (
        <div className="mt-2 text-blue-600">
          <p className="font-medium">{runningAction}</p>
        </div>
      );
    }

    if (state === "finished" && result) {
      return (
        <div className="mt-2">
          <p className="font-medium text-green-600">{result.summary}</p>
          {!isCompact && result.data && (
            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </div>
      );
    }

    if (state === "error") {
      return (
        <div className="mt-2">
          <p className="font-medium text-red-600">
            {errorMessage || "An error occurred"}
          </p>
        </div>
      );
    }

    return isCompact ? null : (
      <p className="mt-2 text-gray-600">{description}</p>
    );
  };

  // Custom renderer for trigger data
  const renderTriggerData = (
    result: BlockResult,
    isCompact: boolean = false
  ) => {
    if (!result || !result.data) return null;

    const { filename, documentType, pageCount } = result.data;

    // For compact mode, just show the filename
    if (isCompact) {
      return (
        <div className="text-xs text-gray-700 truncate">
          {filename || "Untitled Document"}
        </div>
      );
    }

    // Regular detailed view
    return (
      <div className="text-xs">
        <div className="font-medium text-gray-800">
          {filename || "Untitled Document"}
        </div>
        <div className="text-gray-600 flex items-center ">
          <span>{documentType || "Unknown Type"}</span>
          <span className="px-1 text-gray-200">•</span>
          <span>
            {pageCount ? `${pageCount} page${pageCount !== 1 ? "s" : ""}` : ""}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Block
      type="trigger"
      title={title}
      description={description}
      state={state}
      inputs={0}
      outputs={1}
      color={BLOCK_COLORS.trigger}
      icon={ArrowDownCircleIcon}
      size={size}
      isInDiagram={isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
      errorMessage={errorMessage}
      hideConnectors={hideConnectors}
      onRun={onRun}
      onPause={onPause}
      onRerun={onRerun}
      customResultRenderer={(result) => renderTriggerData(result, isCompact)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="mr-3">{renderIcon()}</div>
          <h3 className="font-medium">{title}</h3>
        </div>
        {state === "error" && (
          <div className="text-red-500">
            <ExclamationTriangleIcon className="h-5 w-5" />
          </div>
        )}
      </div>
      {!isCompact && !state && (
        <p className="mt-2 text-gray-600">{description}</p>
      )}
      {renderContent()}
    </Block>
  );
};

export default TriggerBlock;
