import React from "react";
import {
  ArrowDownCircleIcon,
  ExclamationTriangleIcon,
  // DocumentIcon
} from "@heroicons/react/24/outline";
import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { BlockResult, BlockProps } from "@/types/blocks";

interface TriggerBlockProps extends Omit<BlockProps, "type"> {
  title: string;
  description?: string;
  state?: "idle" | "running" | "finished" | "error";
  size?: "compact" | "default";
  _isInDiagram?: boolean;
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
  _isInDiagram,
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
  const renderContent = () => {
    if (state === "running") {
      return (
        <div className="mt-2 text-blue-600">
          <p className="font-medium">{runningAction}</p>
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
  };

  const renderTriggerData = (
    result: BlockResult,
    isCompact: boolean = false
  ) => {
    return (
      <>
        {state === "error" && (
          <div className="text-red-500">
            <ExclamationTriangleIcon className="h-5 w-5" />
          </div>
        )}

        {!isCompact && !state && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
        {renderContent()}

        {result && result.data && (
          <>
            {isCompact ? (
              <div className="text-xs text-gray-700 truncate">
                {result.data.title ||
                  result.data.filename ||
                  "Untitled Document"}
                <div className="text-gray-600 truncate">
                  {result.data.description ||
                    result.data.documentType ||
                    "Unknown Type"}
                </div>
              </div>
            ) : (
              <>
                <div className="font-medium text-gray-800 truncate">
                  {result.data.title ||
                    result.data.filename ||
                    "Untitled Document"}
                </div>
                <div className="text-gray-600 flex items-center truncate">
                  <span>
                    {result.data.description ||
                      result.data.documentType ||
                      "Unknown Type"}
                  </span>
                  {result.data.pageCount && (
                    <>
                      <span className="px-1 text-gray-200">•</span>
                      <span>
                        {`${result.data.pageCount} page${
                          result.data.pageCount !== 1 ? "s" : ""
                        }`}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </>
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
      _isInDiagram={_isInDiagram}
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
      errorMessage={errorMessage}
      hideConnectors={hideConnectors}
      onRun={onRun}
      onPause={onPause}
      onRerun={onRerun}
      customResultRenderer={renderTriggerData}
    />
  );
};

export default TriggerBlock;
