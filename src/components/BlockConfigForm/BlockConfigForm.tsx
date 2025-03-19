import { BlockType } from "../../types/diagram";
import { useDiagramStore } from "../../store/useDiagramStore";
import { Card } from "@/components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface BlockConfigFormProps {
  blockId: string;
}

// Configuration fields for each block type
const blockTypeConfigs: Record<
  BlockType,
  { fields: { key: string; label: string; type: string }[] }
> = {
  processor: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "inputFormat", label: "Input Format", type: "text" },
      { key: "processingType", label: "Processing Type", type: "text" },
    ],
  },
  transformer: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "transformationType", label: "Transformation Type", type: "text" },
      { key: "outputFormat", label: "Output Format", type: "text" },
    ],
  },
  output: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "destination", label: "Destination", type: "text" },
      { key: "format", label: "Format", type: "text" },
    ],
  },
};

export function BlockConfigForm({ blockId }: BlockConfigFormProps) {
  const block = useDiagramStore((state) =>
    state.blocks.find((b) => b.id === blockId)
  );
  const updateBlockConfig = useDiagramStore((state) => state.updateBlockConfig);

  if (!block) return null;

  const config = blockTypeConfigs[block.type];

  const handleConfigChange = (key: string, value: string) => {
    updateBlockConfig(blockId, { [key]: value });
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Configure {block.type}</h3>
      <div className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type={field.type}
              value={(block.config[field.key] as string) || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleConfigChange(field.key, e.target.value)
              }
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
