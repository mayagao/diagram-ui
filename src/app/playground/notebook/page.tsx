
"use client";

import { useState, useEffect } from "react";
import TriggerBlock from "@/components/blocks/TriggerBlock";
import ExtractionBlock from "@/components/blocks/ExtractionBlock";
import GenerationBlock from "@/components/blocks/GenerationBlock";
import ConditionBlock from "@/components/blocks/ConditionBlock";
import ActionBlock from "@/components/blocks/ActionBlock";
import { workflowBlocks } from "@/data/workflowBlocks";
import { BlockState, BlockResult } from "@/types/blocks";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import { BLOCK_DEFINITIONS, BlockType } from "@/data/block";

export default function NotebookPage() {
  const [isCompact, setIsCompact] = useState(true);
  const [runningActionIndex, setRunningActionIndex] = useState(0);
  const [, setBlockStates] = useState<Record<string, BlockState>>({});

  // Rotate through running actions for dynamic demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setRunningActionIndex((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Get the appropriate block component based on type
  const getBlockComponent = (type: BlockType) => {
    switch (type) {
      case "trigger":
        return TriggerBlock;
      case "extraction":
        return ExtractionBlock;
      case "condition":
        return ConditionBlock;
      case "generation":
        return GenerationBlock;
      case "action":
        return ActionBlock;
      default:
        return TriggerBlock;
    }
  };

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
      const details = errorData.details as unknown[];
      // Type assertion to handle the find callback correctly
      const failedRule = details?.find(
        (detail) =>
          typeof detail === "object" &&
          detail !== null &&
          "status" in detail &&
          detail.status === "failed"
      ) as Record<string, unknown> | undefined;

      if (failedRule) {
        return (
          (typeof failedRule.message === "string" ? failedRule.message : "") ||
          `Rule validation failed: ${
            typeof failedRule.rule === "string" ? failedRule.rule : ""
          }`
        );
      }
    }

    return `Failed to initialize ${blockType}: Invalid configuration.`;
  };

  // Helper to safely format result data to match component expectations
  const formatResult = (result: unknown): BlockResult | undefined => {
    if (!result) return undefined;

    const typedResult = result as Record<string, unknown>;

    // Helper to safely stringify any value
    const safeStringify = (
      value: unknown
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
    const processedData = typedResult.data
      ? Object.entries(typedResult.data as Record<string, unknown>).reduce(
          (acc, [key, value]) => {
            acc[key] = safeStringify(value);
            return acc;
          },
          {} as Record<string, string | number | boolean | string[] | null>
        )
      : undefined;

    // Create the result object with explicit type annotation
    const formattedResult: BlockResult = {
      summary:
        typeof typedResult.summary === "string"
          ? typedResult.summary
          : String(typedResult.summary || ""),
      data: processedData,
    };

    return formattedResult;
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

  // Update renderBlockStates to use type assertion for component compatibility
  const renderBlockStates = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    BlockComponent: React.ComponentType<any>, // Use any to bypass type checking
    type: string,
    index: number = 0
  ) => (
    <div className="space-y-6">
      <div>
        <BlockComponent
          title={workflowBlocks[type][index].title}
          description={workflowBlocks[type][index].description}
          isInNotebook={true}
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
          isInNotebook={true}
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
          runningAction={`Analysis paused`}
          isInNotebook={true}
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
          isInNotebook={true}
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
          isInNotebook={true}
          isCompact={isCompact}
          hideConnectors={true}
          onRerun={() => handleRerun(`${type}-${index}`)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <BreadcrumbHeader
        currentPage="Notebook block"
        isCompact={isCompact}
        setIsCompact={setIsCompact}
      />

      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-12 text-sm ">
          {BLOCK_DEFINITIONS.blockTypes.map(
            (blockType: {
              type: BlockType;
              name: string;
              description: string;
            }) => (
              <div key={blockType.type} className="grid grid-cols-3 gap-6">
                <div className="mb-6 col-span-1">
                  <h2 className=" font-semibold mb-2">{blockType.name}</h2>
                  <p className="text-gray-600">{blockType.description}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg col-span-2">
                  {renderBlockStates(
                    getBlockComponent(blockType.type),
                    blockType.type
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

