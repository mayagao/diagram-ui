import { useState } from "react";
import { BlockType } from "@/types/diagram";
import { useDiagramStore } from "../../store/useDiagramStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlockConfigFormProps {
  blockId: string;
}

// Configuration fields for each block type
const blockConfigs: Record<
  BlockType,
  { fields: { key: string; label: string; type: string }[] }
> = {
  trigger: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "apiEndpoint", label: "API Endpoint", type: "text" },
      { key: "method", label: "Method", type: "select" },
    ],
  },
  extraction: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "source", label: "Source", type: "select" },
      { key: "fields", label: "Fields to Extract", type: "textarea" },
    ],
  },
  generation: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "template", label: "Template", type: "textarea" },
      { key: "outputFormat", label: "Output Format", type: "select" },
    ],
  },
  condition: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "condition", label: "Condition", type: "textarea" },
      { key: "trueBranch", label: "True Branch", type: "text" },
      { key: "falseBranch", label: "False Branch", type: "text" },
    ],
  },
  action: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "actionType", label: "Action Type", type: "select" },
      { key: "parameters", label: "Parameters", type: "textarea" },
    ],
  },
  end: {
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "finalState", label: "Final State", type: "select" },
    ],
  },
};

export function BlockConfigForm({ blockId }: BlockConfigFormProps) {
  const block = useDiagramStore((state) =>
    state.blocks.find((b) => b.id === blockId)
  );
  const updateBlockConfig = useDiagramStore((state) => state.updateBlockConfig);
  const [config, setConfig] = useState<Record<string, string>>({});

  if (!block) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBlockConfig(blockId, config);
  };

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const fields = blockConfigs[block.type].fields;

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Configure {block.type}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                value={config[field.key] || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(field.key, e.target.value)
                }
              />
            ) : field.type === "select" ? (
              <Select
                value={config[field.key] || ""}
                onValueChange={(value: string) =>
                  handleChange(field.key, value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select ${field.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.key === "method" && (
                    <>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </>
                  )}
                  {field.key === "source" && (
                    <>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                    </>
                  )}
                  {field.key === "outputFormat" && (
                    <>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </>
                  )}
                  {field.key === "actionType" && (
                    <>
                      <SelectItem value="sendEmail">Send Email</SelectItem>
                      <SelectItem value="updateDatabase">
                        Update Database
                      </SelectItem>
                      <SelectItem value="callApi">Call API</SelectItem>
                    </>
                  )}
                  {field.key === "finalState" && (
                    <>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.key}
                type={field.type}
                value={config[field.key] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(field.key, e.target.value)
                }
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Save Configuration
        </button>
      </form>
    </Card>
  );
}
