interface BaseBlockProps {
  // ... existing props ...
  hideConnectors?: boolean;
}

export const BaseBlock: React.FC<BaseBlockProps> = ({
  // ... other props ...
  hideConnectors = false,
}) => {
  return (
    <div className="relative border rounded-lg p-4">
      {/* Only show connectors if hideConnectors is false */}
      {!hideConnectors && (
        <>
          <div className="input-connector">
            {/* Your input connector implementation */}
          </div>
          <div className="output-connector">
            {/* Your output connector implementation */}
          </div>
        </>
      )}

      {/* Rest of your block content */}
    </div>
  );
};
