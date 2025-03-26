import { useEffect } from "react";
import { useDiagramStore } from "../store/useDiagramStore";

export function useInitializeDiagram() {
  const addBlock = useDiagramStore((state) => state.addBlock);
  const blocks = useDiagramStore((state) => state.blocks);

  useEffect(() => {
    // Only initialize if there are no blocks
    if (blocks.length === 0) {
      // Add default blocks in sequence
      addBlock("processor", { name: "Input Block" });
      addBlock("transformer", { name: "Processor Block" });
      addBlock("output", { name: "Output Block" });
    }
  }, [addBlock, blocks.length]);
}
