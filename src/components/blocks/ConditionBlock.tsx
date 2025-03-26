import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { BlockResult } from "@/types/blocks";
import { BeakerIcon } from "@heroicons/react/24/outline";

// Fix the type errors by using proper typings
interface ConditionBlockProps {
  title: string;
  description?: string;
  state?: "idle" | "running" | "paused" | "finished" | "error";
  isCompact?: boolean;
  isInDiagram?: boolean;
  isInNotebook?: boolean;
  runningAction?: string;
  result?: BlockResult;
  errorMessage?: string;
  hideConnectors?: boolean;
  onRun?: () => void;
  onPause?: () => void;
  onRerun?: () => void;
  size?: "compact" | "default";
}

const ConditionBlock: React.FC<ConditionBlockProps> = (props) => {
  // Custom renderer for rules data
  const renderRulesData = (result: BlockResult, isCompact: boolean = false) => {
    if (!result || !result.data) return null;

    // For compact mode, just show the summary of passed/failed rules
    if (isCompact) {
      // Use existing count data if available with proper type handling
      const passedRules =
        typeof result.data.passedRules === "number"
          ? result.data.passedRules
          : 0;
      const failedRules =
        typeof result.data.failedRules === "number"
          ? result.data.failedRules
          : 0;
      const pendingRules =
        typeof result.data.pendingRules === "number"
          ? result.data.pendingRules
          : 0;
      const totalRules =
        typeof result.data.totalRules === "number"
          ? result.data.totalRules
          : passedRules + failedRules + pendingRules;

      return (
        <div className="text-xs text-gray-700 truncate">
          {totalRules} rules ({passedRules} passed, {failedRules} failed
          {pendingRules > 0 ? `, ${pendingRules} pending` : ""})
        </div>
      );
    }

    // Parse the rule details correctly
    let details = [];
    try {
      // Check if details is an array of strings that need parsing
      if (Array.isArray(result.data.details)) {
        details = result.data.details.map((item) => {
          if (typeof item === "string" && item.startsWith("{")) {
            try {
              return JSON.parse(item);
            } catch {
              // If parsing fails, format as is
              return { rule: "Error", status: "unknown", message: item };
            }
          }
          return item;
        });
      }
      // If details is a string, try to parse it
      else if (typeof result.data.details === "string") {
        try {
          const parsed = JSON.parse(result.data.details);
          details = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // Try parsing as individual JSON objects
          details = [];
        }
      } else if (result.data.details) {
        details = Array.isArray(result.data.details)
          ? result.data.details
          : [result.data.details];
      }
    } catch {
      details = [];
    }

    // If no details, create a simple view based on rule numbers
    if (!details.length && result.data.totalRules) {
      const rules = [];
      const totalRulesNum =
        typeof result.data.totalRules === "number"
          ? result.data.totalRules
          : parseInt(String(result.data.totalRules), 10) || 3;

      for (let i = 0; i < Math.min(3, totalRulesNum); i++) {
        rules.push({
          rule: `Rule ${i + 1}`,
          status: "unknown",
          message: "No description",
        });
      }
      details = rules;
    }

    const rulesDetails = Array.isArray(details) ? details.slice(0, 3) : [];
    const totalRules =
      typeof result.data.totalRules === "number"
        ? result.data.totalRules
        : details.length || 0;

    return (
      <div className="space-y-3 ">
        {rulesDetails.map((rule, index) => (
          <div key={index} className="flex items-start gap-1 text-xs mb-1">
            <div className="flex-shrink-0 mt-0.5">
              <div className="text-gray-600">
                {rule.status === "passed"
                  ? "✓"
                  : rule.status === "failed"
                  ? "✗"
                  : "?"}
              </div>
            </div>
            <div className="truncate text-gray-600 ">
              {rule.message || rule.description || "No description"}

              {/* <div className="font-medium truncate">
                {rule.rule || rule.name || `Rule ${index + 1}`}
              </div> */}
            </div>
          </div>
        ))}

        {totalRules > 3 && (
          <div className="text-xs text-gray-500 italic mt-1">
            + {totalRules - 3} more rules
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
      _isInDiagram={props.isInDiagram}
      isInNotebook={props.isInNotebook}
      isCompact={props.isCompact}
      runningAction={props.runningAction}
      result={props.result}
      errorMessage={props.errorMessage}
      onRun={props.onRun}
      onPause={props.onPause}
      onRerun={props.onRerun}
      hideConnectors={props.hideConnectors}
      customResultRenderer={(result) =>
        renderRulesData(result, props.isCompact)
      }
    />
  );
};

export default ConditionBlock;
