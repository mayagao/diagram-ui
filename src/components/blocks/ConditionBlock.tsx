import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { BlockProps, BlockResult } from "@/types/blocks";
import {
  CheckIcon,
  ExclamationCircleIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

const ConditionBlock: React.FC<BlockProps> = (props) => {
  // Custom renderer for rules
  const renderRulesData = (result: BlockResult) => {
    if (!result || !result.data || !result.data.details) return null;

    let details;
    try {
      // Handle string JSON if needed
      details =
        typeof result.data.details === "string"
          ? JSON.parse(result.data.details)
          : result.data.details;
    } catch (_e) {
      details = [];
    }

    // Ensure details is an array and limit to first 3
    const rulesDetails = Array.isArray(details) ? details.slice(0, 3) : [];

    return (
      <div className="space-y-2 mt-2">
        {rulesDetails.map((rule, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className={`w-4 h-4 flex-shrink-0 rounded-full ${
                rule.status === "passed"
                  ? "bg-green-100 text-green-600"
                  : rule.status === "failed"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              } flex items-center justify-center`}
            >
              {rule.status === "passed" ? (
                <CheckIcon className="h-3 w-3" />
              ) : rule.status === "failed" ? (
                <ExclamationIcon className="h-3 w-3" />
              ) : (
                "?"
              )}
            </div>
            <span className="font-medium">
              {rule.rule || rule.name || `Rule ${index + 1}`}:
            </span>
            <span className="text-gray-600 truncate">
              {rule.message || rule.description || "No description"}
            </span>
          </div>
        ))}
        {Array.isArray(details) && details.length > 3 && (
          <div className="text-xs text-gray-500 italic">
            + {details.length - 3} more rules
          </div>
        )}
      </div>
    );
  };

  return (
    <Block
      type="condition"
      title={props.title}
      description={props.description || ""}
      state={props.state}
      inputs={1}
      outputs={1}
      color={BLOCK_COLORS.condition}
      icon={BeakerIcon}
      size={props.size}
      isInDiagram={props.isInDiagram}
      isInNotebook={props.isInNotebook}
      isCompact={props.isCompact}
      runningAction={props.runningAction}
      result={props.result}
      errorMessage={props.errorMessage}
      onRun={props.onRun}
      onPause={props.onPause}
      onRerun={props.onRerun}
      hideConnectors={props.hideConnectors}
      customResultRenderer={renderRulesData}
    />
  );
};

export default ConditionBlock;
