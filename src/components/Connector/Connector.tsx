import { BlockState } from "../../types/diagram";
import { useEffect } from "react";

interface ConnectorProps {
  state: BlockState;
  fromBlockId: string;
  toBlockId: string;
  startY: number;
  endY: number;
}

const stateStyles: Record<BlockState, { color: string }> = {
  idle: {
    color: "#888888",
  },
  running: {
    color: "#3b82f6",
  },
  finished: {
    color: "#22c55e",
  },
  error: {
    color: "#ef4444",
  },
};

export function Connector({
  state,
  fromBlockId,
  toBlockId,
  startY,
  endY,
}: ConnectorProps) {
  const style = stateStyles[state];
  const height = endY - startY;

  // Debug log
  useEffect(() => {
    console.log(
      `Rendering connector from ${fromBlockId} to ${toBlockId} (${startY} -> ${endY}, height: ${height})`
    );
  }, [fromBlockId, toBlockId, startY, endY, height]);

  if (height <= 0) {
    console.log("Skipping connector with zero or negative height");
    return null;
  }

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-0"
      style={{
        top: `${startY}px`,
        height: `${height}px`,
        left: `100px`,
      }}
    >
      {/* Connection line - using SVG for more control */}
      <svg
        width="3"
        height="100%"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ overflow: "visible" }}
      >
        <line
          x1="1.5"
          y1="0"
          x2="1.5"
          y2="100%"
          stroke={style.color}
          strokeWidth="1.5"
          strokeDasharray="4,3"
        >
          {state === "idle" && (
            <animate
              attributeName="stroke-dashoffset"
              values="7;0"
              dur="0.7s"
              repeatCount="indefinite"
            />
          )}
        </line>

        {/* Top dot */}
        <circle
          cx="1.5"
          cy="0"
          r="4"
          fill="white"
          stroke={style.color}
          strokeWidth="1.5"
        />

        {/* Bottom dot */}
        <circle
          cx="1.5"
          cy="100%"
          r="4"
          fill="white"
          stroke={style.color}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
