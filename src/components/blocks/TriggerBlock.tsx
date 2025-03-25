import React from "react";
import {
  ArrowDownCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/spinner";
import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { BlockResult } from "@/types/blocks";
import { BaseBlockProps } from "@/types/blocks";

interface TriggerBlockProps extends BaseBlockProps {
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
