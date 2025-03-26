import { useEffect } from "react";
import { useDiagramStore } from "../store/useDiagramStore";
import { BlockType } from "../types/diagram";

export function useInitializeDiagram() {
  const addBlock = useDiagramStore((state) => state.addBlock);
  const connectBlocks = useDiagramStore((state) => state.connectBlocks);
  const blocks = useDiagramStore((state) => state.blocks);

  useEffect(() => {
    // Only initialize if there are no blocks
    if (blocks.length === 0) {
      // Add blocks in sequence
      addBlock("trigger" as BlockType, { name: "API Call" });
      addBlock("extraction" as BlockType, { name: "Extract Data" });
      addBlock("action" as BlockType, { name: "Check Payments" });
      addBlock("condition" as BlockType, { name: "Has Payment?" });
      addBlock("generation" as BlockType, { name: "Send Email" });
      addBlock("trigger" as BlockType, { name: "Two Day Check" });
      addBlock("condition" as BlockType, { name: "Is Final Notice?" });
      addBlock("generation" as BlockType, { name: "Send Final Notice" });
      addBlock("end" as BlockType, { name: "End Workflow" });

      // Connect blocks with branching
      setTimeout(() => {
        // Initial flow
        connectBlocks("trigger-1", "extraction-1");
        connectBlocks("extraction-1", "action-1");
        connectBlocks("action-1", "condition-1");

        // Branching from condition
        connectBlocks("condition-1", "generation-1", "!hasPayment", false);
        connectBlocks("condition-1", "trigger-2", "hasPayment", true);

        // Two day check flow
        connectBlocks("trigger-2", "condition-2");
        connectBlocks("condition-2", "generation-2", "isFinalNotice", true);
        connectBlocks("condition-2", "trigger-2", "!isFinalNotice", false);

        // End workflow
        connectBlocks("generation-1", "end-1");
        connectBlocks("generation-2", "end-1");
      }, 100);
    }
  }, [addBlock, connectBlocks, blocks.length]);
}
