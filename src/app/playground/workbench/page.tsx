"use client";

import { useState } from "react";
import TriggerBlock from "@/components/blocks/TriggerBlock";
import ExtractionBlock from "@/components/blocks/ExtractionBlock";
import ConditionBlock from "@/components/blocks/ConditionBlock";
import ActionBlock from "@/components/blocks/ActionBlock";
import {
  noticeOfCancelWorkflow,
  noticeOfCancelLayout,
} from "@/data/notice-of-cancel";
import { BlockState, BlockResult, BlockResultData } from "@/types/blocks";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import { BLOCK_COLORS } from "@/types/blocks";

export default function NotebookWorkflowPage() {
  const [isCompact, setIsCompact] = useState(true);
  const [blockStates, setBlockStates] = useState<Record<string, BlockState>>(
    {}
  );
  const [currentWorkflow, setCurrentWorkflow] = useState(
    "Notice of Cancellation"
  );

  // Handle workflow selection
  const handleWorkflowSelect = (workflowTitle: string) => {
    setCurrentWorkflow(workflowTitle);
    // Reset block states when switching workflows
    setBlockStates({});
  };

  // Get the appropriate block component based on type
  const getBlockComponent = (type: string) => {
    switch (type) {
      case "trigger":
        return TriggerBlock;
      case "extraction":
        return ExtractionBlock;
      case "condition":
        return ConditionBlock;
      case "action":
        return ActionBlock;
      default:
        return TriggerBlock;
    }
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

  // Helper to safely format result data
  const formatResult = (result: unknown): BlockResult | undefined => {
    if (!result) return undefined;
    const typedResult = result as Record<string, unknown>;

    // Process the data object to ensure all values are properly typed
    const processedData = typedResult.data
      ? Object.entries(typedResult.data).reduce((acc, [key, value]) => {
          acc[key] =
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            Array.isArray(value) ||
            value === null
              ? value
              : String(value);
          return acc;
        }, {} as BlockResultData)
      : undefined;

    return {
      summary: String(typedResult.summary || ""),
      data: processedData,
    };
  };

  // Render a single block
  const renderBlock = (type: string, index: number) => {
    const BlockComponent = getBlockComponent(type);
    const block = noticeOfCancelWorkflow[type][index];
    const blockId = `${type}-${index}`;
    const state = blockStates[blockId] || "idle";

    return (
      <div key={blockId} className="mb-4">
        <BlockComponent
          title={block.title}
          description={block.description}
          state={state as "idle" | "running" | "finished" | "error"}
          isInNotebook={true}
          isCompact={isCompact}
          hideConnectors={true}
          result={formatResult(block.result)}
          onRun={() => handleRun(blockId)}
          onPause={() => handlePause(blockId)}
          onRerun={() => handleRerun(blockId)}
          color={BLOCK_COLORS[type as keyof typeof BLOCK_COLORS]}
        />
      </div>
    );
  };

  // Render a group of blocks
  const renderGroup = (group: {
    id: string;
    title: string;
    blocks: string[];
  }) => {
    return (
      <div key={group.id} className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {group.title}
        </h3>
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          {group.blocks.map((blockType) => {
            const index = 0; // For this workflow, we only have one block of each type
            return renderBlock(blockType, index);
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <BreadcrumbHeader
        currentPage="Notebook workflow"
        isCompact={isCompact}
        setIsCompact={setIsCompact}
        currentWorkflow={currentWorkflow}
        onWorkflowSelect={handleWorkflowSelect}
      />

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{currentWorkflow}</h1>
          <div className="space-y-8">
            {noticeOfCancelLayout.groups.map(renderGroup)}
          </div>
        </div>
      </div>
    </div>
  );
}
