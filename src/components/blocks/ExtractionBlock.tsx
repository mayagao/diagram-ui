import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { BlockResult, BlockState } from "@/types/blocks";

interface ExtractionBlockProps {
  title: string;
  description?: string;
  state?: BlockState;
  size?: "compact" | "default";
  isInDiagram?: boolean;
  isInNotebook?: boolean;
  runningAction?: string;
  result?: BlockResult;
  isCompact?: boolean;
  errorMessage?: string;
  onRun?: () => void;
  onPause?: () => void;
  onRerun?: () => void;
  hideConnectors?: boolean;
}

const ExtractionBlock: React.FC<ExtractionBlockProps> = (props) => {
  // Custom renderer for extraction data
  const renderExtractionData = (
    result: BlockResult,
    isCompact: boolean = false
  ) => {
    if (!result || !result.data) return null;

    // For compact mode, just show the document name or a summary
    if (isCompact) {
      // Get the document name or filename
      const documentName =
        result.data.filename ||
        result.data.documentName ||
        result.summary?.split(" ").pop() ||
        "Document extracted";

      return (
        <div className="text-xs text-gray-700 truncate">{documentName}</div>
      );
    }

    // Regular detailed view code for non-compact mode
    const filteredData = Object.entries(result.data).filter(
      ([key]) =>
        !key.startsWith("_") &&
        key !== "details" &&
        key !== "error" &&
        key !== "errorMessages"
    );

    const totalFields = filteredData.length;
    const topFields = filteredData.slice(0, 3);

    return (
      <div className="w-full">
        <div className="text-xs text-gray-500 mb-1">
          {totalFields} fields extracted
        </div>

        <div className="space-y-1">
          {topFields.map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs mt-1">
              <span className="font-medium text-gray-800">{key}:</span>
              <span className="text-gray-600 truncate max-w-[60%] text-right">
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Block
      type="extraction"
      title={props.title}
      description={props.description || ""}
      state={props.state}
      inputs={1}
      outputs={1}
      color={BLOCK_COLORS.extraction}
      icon={DocumentTextIcon}
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
      customResultRenderer={(result) =>
        renderExtractionData(result, props.isCompact)
      }
    />
  );
};

export default ExtractionBlock;
