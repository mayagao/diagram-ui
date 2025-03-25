"use client";

import Link from "next/link";
import TriggerBlock from "@/components/blocks/TriggerBlock";
import ExtractionBlock from "@/components/blocks/ExtractionBlock";
import GenerationBlock from "@/components/blocks/GenerationBlock";
import ConditionBlock from "@/components/blocks/ConditionBlock";
import ActionBlock from "@/components/blocks/ActionBlock";

export default function BlocksDemo() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Workflow Blocks</h1>
          <Link
            href="/playground"
            className="text-blue-500 hover:text-blue-400"
          >
            ← Back to Playground
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Trigger Blocks</h2>
          <div className="flex flex-wrap gap-8 mb-12">
            <TriggerBlock title="GitHub Repository" />
            <TriggerBlock title="Webhook Event" />
            <TriggerBlock title="Scheduled Task" />
            <TriggerBlock title="Manual Trigger" />
          </div>

          <h2 className="text-xl font-semibold mb-6">Extraction Blocks</h2>
          <div className="flex flex-wrap gap-8 mb-12">
            <ExtractionBlock title="Extract JSON Data" />
            <ExtractionBlock title="Parse Document" />
            <ExtractionBlock title="Extract Table Data" />
            <ExtractionBlock title="Extract Form Fields" />
          </div>

          <h2 className="text-xl font-semibold mb-6">Generation Blocks</h2>
          <div className="flex flex-wrap gap-8 mb-12">
            <GenerationBlock title="Generate Summary" />
            <GenerationBlock title="Format Data" />
            <GenerationBlock title="Translate Content" />
            <GenerationBlock title="Transform JSON" />
          </div>

          <h2 className="text-xl font-semibold mb-6">Condition Blocks</h2>
          <div className="flex flex-wrap gap-8 mb-12">
            <ConditionBlock title="Check Status" />
            <ConditionBlock title="Validate Data" />
            <ConditionBlock title="Compare Values" />
            <ConditionBlock title="Check Authentication" />
          </div>

          <h2 className="text-xl font-semibold mb-6">Action Blocks</h2>
          <div className="flex flex-wrap gap-8 mb-12">
            <ActionBlock title="Send Email" />
            <ActionBlock title="Create Ticket" />
            <ActionBlock title="Update Database" />
            <ActionBlock title="Call API Endpoint" />
          </div>
        </div>
      </div>
    </div>
  );
}
