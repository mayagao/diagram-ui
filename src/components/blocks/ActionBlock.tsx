import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { BoltIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { BlockResult } from "@/types/blocks";

interface ActionBlockProps {
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

const ActionBlock: React.FC<ActionBlockProps> = (props) => {
  // Custom renderer for action data
  const renderActionData = (
    result: BlockResult,
    isCompact: boolean = false
  ) => {
    if (!result || !result.data) return null;

    // Extract the actionSteps array if it exists
    let actionSteps = [];
    if (result.data.actionSteps && Array.isArray(result.data.actionSteps)) {
      actionSteps = result.data.actionSteps;
    }

    // For compact mode, just show the summary with step count
    if (isCompact) {
      return (
        <div className="text-xs text-gray-700 truncate">
          {result.summary} ({actionSteps.length} steps)
        </div>
      );
    }

    // Regular detailed view with key fields from the action
    return (
      <div className=" text-xs">
        {/* Main summary with completion check */}
        <div className="font-medium gap-2 truncate">{result.summary}</div>

        {/* Step count indicator */}
        <div className="text-gray-600 truncate">
          {actionSteps.length} action steps completed
        </div>
      </div>
    );
  };

  return (
    <Block
      type="action"
      title={props.title}
      description={props.description || "Perform external system operations"}
      state={props.state}
      inputs={1}
      outputs={1}
      color={BLOCK_COLORS.action}
      icon={BoltIcon}
      size={props.size}
      isInDiagram={props.isInDiagram}
      isInNotebook={props.isInNotebook}
      isCompact={props.isCompact}
      runningAction={props.runningAction}
      result={props.result}
      errorMessage={props.errorMessage}
      hideConnectors={props.hideConnectors}
      onRun={props.onRun}
      onPause={props.onPause}
      onRerun={props.onRerun}
      customResultRenderer={(result) =>
        renderActionData(result, props.isCompact)
      }
    />
  );
};

export default ActionBlock;
