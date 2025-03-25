import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { SquaresPlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { BlockResult } from "@/types/blocks";

interface GenerationBlockProps {
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

export default function GenerationBlock({
  title,
  description = "Transform or generate new content",
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
}: GenerationBlockProps) {
  // Custom renderer for generation data
  const renderGenerationData = (result: BlockResult) => {
    if (!result || !result.data) return null;

    const documentName = result.data.documentName || "Generated Document";

    // Parse sections if it's a string
    let parsedSections: any[] = [];
    try {
      if (typeof result.data.sections === "string") {
        parsedSections = JSON.parse(result.data.sections);
      } else if (Array.isArray(result.data.sections)) {
        parsedSections = result.data.sections;
      }
    } catch (e) {
      // If parsing fails, use empty array
      parsedSections = [];
    }

    // Get first 3 sections
    const topSections = parsedSections.slice(0, 3);

    return (
      <div className="mt-2 text-xs">
        <div className="font-medium text-gray-800 flex items-center">
          <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-500" />
          {documentName}
        </div>

        {topSections.length > 0 && (
          <div className="mt-1 space-y-1">
            {topSections.map((section, index) => (
              <div key={index} className="text-gray-600 truncate">
                •{" "}
                {typeof section === "string"
                  ? section
                  : section.title || section.name || `Section ${index + 1}`}
              </div>
            ))}

            {parsedSections.length > 3 && (
              <div className="text-gray-500 italic">
                + {parsedSections.length - 3} more sections
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Block
      type="generation"
      title={title}
      description={description}
      state={state}
      inputs={1}
      outputs={1}
      color={BLOCK_COLORS.generation}
      icon={SquaresPlusIcon}
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
      customResultRenderer={renderGenerationData}
    />
  );
}
