"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TriggerBlock from "@/components/blocks/TriggerBlock";
import ExtractionBlock from "@/components/blocks/ExtractionBlock";
import GenerationBlock from "@/components/blocks/GenerationBlock";
import ConditionBlock from "@/components/blocks/ConditionBlock";
import ActionBlock from "@/components/blocks/ActionBlock";
import { workflowBlocks } from "@/data/workflowBlocks";
import { BlockState } from "@/types/blocks";

const pages = [
  {
    title: "Blocks",
    href: "/playground/blocks",
    description: "Explore and interact with different types of workflow blocks",
  },
  {
    title: "Diagram",
    href: "/playground/diagram",
    description: "Visual workflow builder interface",
  },
  {
    title: "Notebook",
    href: "/playground/notebook",
    description: "Interactive notebook for workflow testing",
  },
];

export default function BlocksDemo() {
  const [isNotebook, setIsNotebook] = useState(false);
  const [isCompact, setIsCompact] = useState(true);
  const [runningActionIndex, setRunningActionIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [blockStates, setBlockStates] = useState<Record<string, BlockState>>(
    {}
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Rotate through running actions for dynamic demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setRunningActionIndex((prev) => (prev + 1) % 3); // Assuming 3 actions per block
    }, 2000); // Change action every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Get current running action for a specific block type
  const getCurrentAction = (type: string, index: number) => {
    const block = workflowBlocks[type][index];
    return block.actions?.[runningActionIndex] || "Processing...";
  };

  // Generate standard error message for a block type
  const getErrorMessage = (blockType: string) => {
    // Extract error messages from the mock data if available
    const errorData = workflowBlocks[blockType][0].result?.data;
    if (errorData && "error" in errorData && errorData.error) {
      return String(errorData.error);
    }

    if (
      errorData &&
      "errorMessages" in errorData &&
      Array.isArray(errorData.errorMessages)
    ) {
      return (
        errorData.errorMessages[0] ||
        `Failed to initialize ${blockType}: Invalid configuration.`
      );
    }

    // For the rules block, use the specific validation error message
    if (blockType === "rules" && errorData && "details" in errorData) {
      const details = errorData.details as any[];
      const failedRule = details?.find(
        (detail: any) => detail.status === "failed"
      );
      if (failedRule) {
        return (
          failedRule.message || `Rule validation failed: ${failedRule.rule}`
        );
      }
    }

    return `Failed to initialize ${blockType}: Invalid configuration.`;
  };

  // Helper to safely format result data to match component expectations
  const formatResult = (result: any) => {
    if (!result) return undefined;

    // Helper to safely stringify any value
    const safeStringify = (
      value: any
    ): string | number | boolean | string[] | null => {
      if (value === null) return null;
      if (typeof value === "string") return value;
      if (typeof value === "number") return value;
      if (typeof value === "boolean") return value;
      if (Array.isArray(value)) {
        return value.map((item) =>
          typeof item === "string" ? item : JSON.stringify(item)
        );
      }
      if (typeof value === "object") {
        return JSON.stringify(value);
      }
      return String(value);
    };

    // Process the data object to ensure all values are properly stringified
    const processedData = result.data
      ? Object.entries(result.data).reduce((acc, [key, value]) => {
          acc[key] = safeStringify(value);
          return acc;
        }, {} as Record<string, string | number | boolean | string[] | null>)
      : undefined;

    return {
      summary: result.summary || "",
      data: processedData,
    };
  };

  const handleRun = (blockId: string) => {
    setBlockStates((prev) => ({ ...prev, [blockId]: "running" }));
  };

  const handlePause = (blockId: string) => {
    setBlockStates((prev) => ({ ...prev, [blockId]: "paused" }));
  };

  const handleRerun = (blockId: string) => {
    setBlockStates((prev) => ({ ...prev, [blockId]: "running" }));
  };

  const renderBlockStates = (
    BlockComponent: React.ComponentType<any>,
    type: string,
    index: number = 0
  ) => (
    <div className="space-y-6">
      <div>
        <BlockComponent
          title={workflowBlocks[type][index].title}
          description={workflowBlocks[type][index].description}
          isInNotebook={isNotebook}
          isCompact={isCompact}
          hideConnectors={true}
          onRun={() => handleRun(`${type}-${index}`)}
        />
      </div>

      <div>
        <BlockComponent
          title={workflowBlocks[type][index].title}
          description={workflowBlocks[type][index].description}
          state="running"
          runningAction={getCurrentAction(type, index)}
          isInNotebook={isNotebook}
          isCompact={isCompact}
          hideConnectors={true}
          onPause={() => handlePause(`${type}-${index}`)}
        />
      </div>

      <div>
        <BlockComponent
          title={workflowBlocks[type][index].title}
          description={workflowBlocks[type][index].description}
          state="paused"
          runningAction={`Analysis paused at: ${getCurrentAction(type, index)}`}
          isInNotebook={isNotebook}
          isCompact={isCompact}
          hideConnectors={true}
          onRun={() => handleRun(`${type}-${index}`)}
        />
      </div>

      <div>
        <BlockComponent
          title={workflowBlocks[type][index].title}
          description={workflowBlocks[type][index].description}
          state="finished"
          result={formatResult(workflowBlocks[type][index].result)}
          isInNotebook={isNotebook}
          isCompact={isCompact}
          hideConnectors={true}
          onRerun={() => handleRerun(`${type}-${index}`)}
        />
      </div>

      <div>
        <BlockComponent
          title={workflowBlocks[type][index].title}
          description={workflowBlocks[type][index].description}
          state="error"
          errorMessage={getErrorMessage(type)}
          isInNotebook={isNotebook}
          isCompact={isCompact}
          hideConnectors={true}
          onRerun={() => handleRerun(`${type}-${index}`)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b z-10 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/playground"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                ← Back
              </Link>

              {/* Combined Title and Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-3xl font-bold"
                >
                  <span>Blocks</span>
                  <svg
                    className={`w-6 h-6 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-1 z-50">
                    {pages.map((page) => (
                      <Link
                        key={page.title}
                        href={page.href}
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-gray-500">
                          {page.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mode Toggles Section */}
            <div className="flex items-center gap-4">
              {/* Diagram/Notebook Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    !isNotebook
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsNotebook(false)}
                >
                  Diagram Mode
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    isNotebook
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsNotebook(true)}
                >
                  Notebook Mode
                </button>
              </div>

              {/* Compact/Regular Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    !isCompact
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsCompact(false)}
                >
                  Regular
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    isCompact
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsCompact(true)}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Trigger Blocks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trigger Blocks</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(TriggerBlock, "trigger")}
            </div>
          </div>

          {/* Extraction Blocks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Extraction Blocks</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(ExtractionBlock, "extraction")}
            </div>
          </div>

          {/* Rules Blocks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Rules Blocks</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(ConditionBlock, "rules")}
            </div>
          </div>

          {/* Generation Blocks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Generation Blocks</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(GenerationBlock, "generation")}
            </div>
          </div>

          {/* Condition Blocks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Condition Blocks</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(ConditionBlock, "condition")}
            </div>
          </div>

          {/* Action Blocks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Action Blocks</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(ActionBlock, "action")}
            </div>
          </div>

          {/* Example Workflow */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Workflow Example</h2>

            {isNotebook ? (
              <div className="space-y-4">
                <TriggerBlock
                  title={workflowBlocks.trigger[0].title}
                  description={workflowBlocks.trigger[0].description}
                  state="finished"
                  result={formatResult(workflowBlocks.trigger[0].result)}
                  isInNotebook={true}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
                <ExtractionBlock
                  title={workflowBlocks.extraction[0].title}
                  description={workflowBlocks.extraction[0].description}
                  state="finished"
                  result={formatResult(workflowBlocks.extraction[0].result)}
                  isInNotebook={true}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
                <ConditionBlock
                  title={workflowBlocks.rules[0].title}
                  description={workflowBlocks.rules[0].description}
                  state="error"
                  errorMessage={getErrorMessage("rules")}
                  isInNotebook={true}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
                <ActionBlock
                  title={workflowBlocks.action[0].title}
                  description={workflowBlocks.action[0].description}
                  isInNotebook={true}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-8">
                <TriggerBlock
                  title={workflowBlocks.trigger[0].title}
                  description={workflowBlocks.trigger[0].description}
                  state="finished"
                  result={formatResult(workflowBlocks.trigger[0].result)}
                  isInNotebook={false}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
                <div className="h-8 w-0.5 bg-gray-300"></div>
                <ExtractionBlock
                  title={workflowBlocks.extraction[0].title}
                  description={workflowBlocks.extraction[0].description}
                  state="finished"
                  result={formatResult(workflowBlocks.extraction[0].result)}
                  isInNotebook={false}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
                <div className="h-8 w-0.5 bg-gray-300"></div>
                <ConditionBlock
                  title={workflowBlocks.rules[0].title}
                  description={workflowBlocks.rules[0].description}
                  state="error"
                  errorMessage={getErrorMessage("rules")}
                  isInNotebook={false}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
                <div className="h-8 w-0.5 bg-gray-300"></div>
                <ActionBlock
                  title={workflowBlocks.action[0].title}
                  description={workflowBlocks.action[0].description}
                  isInNotebook={false}
                  isCompact={isCompact}
                  hideConnectors={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
