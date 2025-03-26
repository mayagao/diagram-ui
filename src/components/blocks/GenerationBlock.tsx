import Block from "./Block";
import { BLOCK_COLORS } from "@/types/blocks";
import { SquaresPlusIcon } from "@heroicons/react/24/outline";
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

// Add proper section type
interface Section {
  title?: string;
  name?: string;
  [key: string]: unknown;
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
  const renderGenerationData = (
    result: BlockResult,
    isCompact: boolean = false
  ) => {
    if (!result || !result.data) return null;

    // Extract the text data if it exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let generatedText: string | undefined;

    if (result.data.text && typeof result.data.text === "string") {
      generatedText = result.data.text;
    }

    // For compact mode, just show the document name
    if (isCompact) {
      return (
        <div className="text-xs text-gray-700 truncate">
          {result.data.documentName || "Generated Document"}
        </div>
      );
    }

    // Regular detailed view with sections
    const sections = getSections(result.data);
    const topSections = sections.slice(0, 3);

    return (
      <div className=" text-xs">
        <div className="font-medium text-gray-800">
          {result.data.documentName || "Generated Document"}
        </div>

        {topSections.length > 0 && (
          <div className="mt-1 space-y-1">
            {topSections.map((section, index) => (
              <div key={index} className="text-gray-600 truncate">
                •{" "}
                {typeof section === "string"
                  ? section
                  : (section as Section).title ||
                    (section as Section).name ||
                    `Section ${index + 1}`}
              </div>
            ))}

            {sections.length > 3 && (
              <div className="text-gray-500 italic">
                + {sections.length - 3} more sections
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const getSections = (data: Record<string, unknown>) => {
    let sections: unknown[] = [];
    try {
      if (typeof data.sections === "string") {
        sections = JSON.parse(data.sections);
      } else if (Array.isArray(data.sections)) {
        sections = data.sections;
      }
    } catch (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _
    ) {
      sections = [];
    }
    return sections;
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
      _isInDiagram={isInDiagram} // Changed to use _isInDiagram
      isInNotebook={isInNotebook}
      isCompact={isCompact}
      runningAction={runningAction}
      result={result}
      errorMessage={errorMessage}
      hideConnectors={hideConnectors}
      onRun={onRun}
      onPause={onPause}
      onRerun={onRerun}
      customResultRenderer={(result) => renderGenerationData(result, isCompact)}
    />
  );
}
