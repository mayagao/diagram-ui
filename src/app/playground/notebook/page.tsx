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
import BreadcrumbHeader from "../components/BreadcrumbHeader";

export default function NotebookPage() {
  const [isCompact, setIsCompact] = useState(true);
  const [runningActionIndex, setRunningActionIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [blockStates, setBlockStates] = useState<Record<string, BlockState>>(
    {}
  );

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
  const formatResult = (result: unknown) => {
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

    return {
      summary: typedResult.summary || "",
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

  // Use a generic type parameter to handle component props
  const renderBlockStates = <T extends Record<string, unknown>>(
    BlockComponent: React.ComponentType<T>,
    type: string,
    index: number = 0
  ) => (
    <div className="space-y-6">
      <div>
        <BlockComponent
          {...({
            title: workflowBlocks[type][index].title,
            description: workflowBlocks[type][index].description,
            isInNotebook: true,
            isCompact: isCompact,
            hideConnectors: true,
            onRun: () => handleRun(`${type}-${index}`),
          } as unknown as T)}
        />
      </div>

      <div>
        <BlockComponent
          {...({
            title: workflowBlocks[type][index].title,
            description: workflowBlocks[type][index].description,
            state: "running",
            runningAction: getCurrentAction(type, index),
            isInNotebook: true,
            isCompact: isCompact,
            hideConnectors: true,
            onPause: () => handlePause(`${type}-${index}`),
          } as unknown as T)}
        />
      </div>

      <div>
        <BlockComponent
          {...({
            title: workflowBlocks[type][index].title,
            description: workflowBlocks[type][index].description,
            state: "paused",
            runningAction: `Analysis paused`,
            isInNotebook: true,
            isCompact: isCompact,
            hideConnectors: true,
            onRun: () => handleRun(`${type}-${index}`),
          } as unknown as T)}
        />
      </div>

      <div>
        <BlockComponent
          {...({
            title: workflowBlocks[type][index].title,
            description: workflowBlocks[type][index].description,
            state: "finished",
            result: formatResult(workflowBlocks[type][index].result),
            isInNotebook: true,
            isCompact: isCompact,
            hideConnectors: true,
            onRerun: () => handleRerun(`${type}-${index}`),
          } as unknown as T)}
        />
      </div>

      <div>
        <BlockComponent
          {...({
            title: workflowBlocks[type][index].title,
            description: workflowBlocks[type][index].description,
            state: "error",
            errorMessage: getErrorMessage(type),
            isInNotebook: true,
            isCompact: isCompact,
            hideConnectors: true,
            onRerun: () => handleRerun(`${type}-${index}`),
          } as unknown as T)}
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
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Trigger Blocks Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Trigger Blocks</h2>
              <p className="text-gray-600">
                Trigger blocks are the starting points of your workflow. They
                initiate workflows based on specific events or conditions like
                schedule, webhook, or manual triggers.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(TriggerBlock, "trigger")}
            </div>
          </div>

          {/* Extraction Blocks Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Extraction Blocks</h2>
              <p className="text-gray-600">
                Extraction blocks help you pull specific data from various
                sources. They can parse text, extract structured data, and
                transform information into usable formats.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(ExtractionBlock, "extraction")}
            </div>
          </div>

          {/* Rules Blocks Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Rules Blocks</h2>
              <p className="text-gray-600">
                Rules blocks allow you to define conditions and logic for your
                workflow. They help you make decisions based on extracted data
                and control the flow of your automation.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(ConditionBlock, "rules")}
            </div>
          </div>

          {/* Generation Blocks Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Generation Blocks</h2>
              <p className="text-gray-600">
                Generation blocks leverage AI to create new content based on
                your inputs. They can generate text, analyze data, and provide
                intelligent responses.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(GenerationBlock, "generation")}
            </div>
          </div>

          {/* Action Blocks Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Action Blocks</h2>
              <p className="text-gray-600">
                Action blocks execute specific tasks in your workflow. They can
                send emails, make API calls, update databases, or perform other
                operations based on your workflow's logic.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderBlockStates(ActionBlock, "action")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
