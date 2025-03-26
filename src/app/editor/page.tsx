"use client";

import Link from "next/link";
import { Canvas } from "../../components/Canvas/Canvas";
import { useDiagramStore } from "../../store/useDiagramStore";
import { BlockType } from "@/types/diagram";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  PlayIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { BlockConfigForm } from "../../components/BlockConfigForm/BlockConfigForm";

const blockIconMap: Record<
  BlockType,
  React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
> = {
  trigger: DocumentTextIcon,
  extraction: DocumentMagnifyingGlassIcon,
  generation: DocumentDuplicateIcon,
  condition: ArrowPathIcon,
  action: DocumentCheckIcon,
  end: DocumentTextIcon,
};

export default function EditorPage() {
  const addBlock = useDiagramStore((state) => state.addBlock);
  const selectedBlockId = useDiagramStore((state) => state.selectedBlockId);

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-4 h-14 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Diagram Editor</h1>
        </div>

        {/* Centered Add Block buttons */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {(Object.keys(blockIconMap) as BlockType[]).map((type) => {
            const Icon = blockIconMap[type];
            return (
              <Button
                key={type}
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handleAddBlock(type)}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              >
                <Icon className="h-5 w-5" />
              </Button>
            );
          })}
        </div>

        <Button>
          <PlayIcon className="h-4 w-4 mr-2" />
          Run Diagram
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Config Panel */}
        <div className="w-64 border-r bg-white">
          <div className="p-4">
            <h2 className="font-medium mb-4">Configuration</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Diagram Settings
                </h3>
                <div className="text-sm text-muted-foreground">
                  Configure global diagram settings here
                </div>
              </Card>
              {selectedBlockId && <BlockConfigForm blockId={selectedBlockId} />}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50">
          <Canvas />
        </div>

        {/* Preview Panel */}
        <div className="w-80 border-l bg-white">
          <div className="p-4">
            <h2 className="font-medium mb-4">Preview</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Input
                </h3>
                <div className="h-[120px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                  Input preview
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Output
                </h3>
                <div className="h-[120px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                  Output preview
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
