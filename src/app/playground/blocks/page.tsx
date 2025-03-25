"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TriggerBlock from "@/components/blocks/TriggerBlock";
import ExtractionBlock from "@/components/blocks/ExtractionBlock";
import GenerationBlock from "@/components/blocks/GenerationBlock";
import ConditionBlock from "@/components/blocks/ConditionBlock";
import ActionBlock from "@/components/blocks/ActionBlock";
import { workflowBlocks } from "@/data/workflowBlocks";

export default function BlocksDemo() {
  const [isNotebook, setIsNotebook] = useState(false);
  const [isCompact, setIsCompact] = useState(true);
  const [runningActionIndex, setRunningActionIndex] = useState(0);
  const [compactUpdateTrigger, setCompactUpdateTrigger] = useState({});

  // Rotate through running actions for dynamic demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setRunningActionIndex((prev) => (prev + 1) % 3); // Assuming 3 actions per block
    }, 2000); // Change action every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Get current running action for a specific block type
  const getCurrentAction = (type: string, index: number) => {
    return (
      workflowBlocks[type][index].actions?.[runningActionIndex] ||
      "Processing..."
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b z-10 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Insurance Workflow Blocks</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isCompact}
                    onChange={(e) => {
                      const newValue = e.target.checked;
                      console.log("Setting isCompact to:", newValue);
                      setIsCompact(newValue);

                      // Force re-render by creating a new object reference
                      setCompactUpdateTrigger({});
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Compact Mode {isCompact ? "(On)" : "(Off)"}
                  </span>
                </label>
              </div>
              <Link
                href="/playground"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Playground
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Trigger Blocks Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Trigger Blocks</h2>

            {/* States Display */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Default
                  </h3>
                  <TriggerBlock
                    title={workflowBlocks.trigger[0].title}
                    description={workflowBlocks.trigger[0].description}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Running
                  </h3>
                  <TriggerBlock
                    title={workflowBlocks.trigger[1].title}
                    description={workflowBlocks.trigger[1].description}
                    state="running"
                    runningAction={getCurrentAction("trigger", 1)}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Completed
                  </h3>
                  <TriggerBlock
                    title={workflowBlocks.trigger[2].title}
                    description={workflowBlocks.trigger[2].description}
                    state="finished"
                    result={workflowBlocks.trigger[2].result}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Blocks Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Extraction Blocks</h2>

            {/* States Display */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Default
                  </h3>
                  <ExtractionBlock
                    title={workflowBlocks.extraction[0].title}
                    description={workflowBlocks.extraction[0].description}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Running
                  </h3>
                  <ExtractionBlock
                    title={workflowBlocks.extraction[1].title}
                    description={workflowBlocks.extraction[1].description}
                    state="running"
                    runningAction={getCurrentAction("extraction", 1)}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Completed
                  </h3>
                  <ExtractionBlock
                    title={workflowBlocks.extraction[2].title}
                    description={workflowBlocks.extraction[2].description}
                    state="finished"
                    result={workflowBlocks.extraction[2].result}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generation Blocks Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Generation Blocks</h2>

            {/* States Display */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Default
                  </h3>
                  <GenerationBlock
                    title={workflowBlocks.generation[0].title}
                    description={workflowBlocks.generation[0].description}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Running
                  </h3>
                  <GenerationBlock
                    title={workflowBlocks.generation[1].title}
                    description={workflowBlocks.generation[1].description}
                    state="running"
                    runningAction={getCurrentAction("generation", 1)}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Completed
                  </h3>
                  <GenerationBlock
                    title={workflowBlocks.generation[2].title}
                    description={workflowBlocks.generation[2].description}
                    state="finished"
                    result={workflowBlocks.generation[2].result}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Condition Blocks Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Condition Blocks</h2>

            {/* States Display */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Default
                  </h3>
                  <ConditionBlock
                    title={workflowBlocks.condition[0].title}
                    description={workflowBlocks.condition[0].description}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Running
                  </h3>
                  <ConditionBlock
                    title={workflowBlocks.condition[1].title}
                    description={workflowBlocks.condition[1].description}
                    state="running"
                    runningAction={getCurrentAction("condition", 1)}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Completed
                  </h3>
                  <ConditionBlock
                    title={workflowBlocks.condition[2].title}
                    description={workflowBlocks.condition[2].description}
                    state="finished"
                    result={workflowBlocks.condition[2].result}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Blocks Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Action Blocks</h2>

            {/* States Display */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Default
                  </h3>
                  <ActionBlock
                    title={workflowBlocks.action[0].title}
                    description={workflowBlocks.action[0].description}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Running
                  </h3>
                  <ActionBlock
                    title={workflowBlocks.action[1].title}
                    description={workflowBlocks.action[1].description}
                    state="running"
                    runningAction={getCurrentAction("action", 1)}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Completed
                  </h3>
                  <ActionBlock
                    title={workflowBlocks.action[2].title}
                    description={workflowBlocks.action[2].description}
                    state="finished"
                    result={workflowBlocks.action[2].result}
                    isInNotebook={isNotebook}
                    isCompact={isCompact}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Example Workflow */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Workflow Example</h2>

            {isNotebook ? (
              <div className="space-y-4">
                <TriggerBlock
                  title="Email Receiver"
                  description={workflowBlocks.trigger[0].description}
                  state="finished"
                  result={workflowBlocks.trigger[0].result}
                  isInNotebook={true}
                  isCompact={isCompact}
                />
                <ExtractionBlock
                  title="MedClaim Extractor"
                  description={workflowBlocks.extraction[0].description}
                  state="finished"
                  result={workflowBlocks.extraction[0].result}
                  isInNotebook={true}
                  isCompact={isCompact}
                />
                <GenerationBlock
                  title="Excel Report Generator"
                  description={workflowBlocks.generation[0].description}
                  state="running"
                  runningAction={getCurrentAction("generation", 0)}
                  isInNotebook={true}
                  isCompact={isCompact}
                />
                <ActionBlock
                  title="SendEmail Notification"
                  description={workflowBlocks.action[0].description}
                  isInNotebook={true}
                  isCompact={isCompact}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-8">
                <TriggerBlock
                  title="Email Receiver"
                  description={workflowBlocks.trigger[0].description}
                  state="finished"
                  result={workflowBlocks.trigger[0].result}
                  isInNotebook={false}
                  isCompact={isCompact}
                />
                <div className="h-8 w-0.5 bg-gray-300"></div>
                <ExtractionBlock
                  title="MedClaim Extractor"
                  description={workflowBlocks.extraction[0].description}
                  state="finished"
                  result={workflowBlocks.extraction[0].result}
                  isInNotebook={false}
                  isCompact={isCompact}
                />
                <div className="h-8 w-0.5 bg-gray-300"></div>
                <GenerationBlock
                  title="Excel Report Generator"
                  description={workflowBlocks.generation[0].description}
                  state="running"
                  runningAction={getCurrentAction("generation", 0)}
                  isInNotebook={false}
                  isCompact={isCompact}
                />
                <div className="h-8 w-0.5 bg-gray-300"></div>
                <ActionBlock
                  title="SendEmail Notification"
                  description={workflowBlocks.action[0].description}
                  isInNotebook={false}
                  isCompact={isCompact}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
