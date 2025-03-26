export interface CustomDataRenderer {
  renderResult(result: Record<string, unknown>): React.ReactNode;
}

export type SomeFunction = (params: Record<string, unknown>) => Promise<void>;
