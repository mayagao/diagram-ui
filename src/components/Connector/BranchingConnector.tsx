import { BlockState } from "../../types/diagram";
import { useEffect } from "react";

interface BranchingConnectorProps {
  state: BlockState;
  fromBlockId: string;
  toBlockId: string;
  startY: number;
  endY: number;
  condition?: string;
  isTrueBranch?: boolean;
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

export function BranchingConnector({
  state,
  fromBlockId,
  toBlockId,
  startY,
  endY,
  condition,
  isTrueBranch,
}: BranchingConnectorProps) {
  const style = stateStyles[state];
  const height = endY - startY;

  // Debug log
  useEffect(() => {
    console.log(
      `Rendering branching connector from ${fromBlockId} to ${toBlockId} (${startY} -> ${endY}, height: ${height})`
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
        left: `${isTrueBranch ? "150px" : "-50px"}`,
      }}
    >
      {/* Connection line - using SVG for more control */}
      <svg
        width="3"
        height="100%"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ overflow: "visible" }}
      >
        {/* Curved path for branching */}
        <path
          d={`M 1.5 0 
             C 1.5 ${height * 0.2}, ${isTrueBranch ? "20" : "-20"} ${
            height * 0.5
          }, ${isTrueBranch ? "20" : "-20"} ${height * 0.8}
             C ${isTrueBranch ? "20" : "-20"} ${height * 0.8}, 1.5 ${
            height * 0.8
          }, 1.5 ${height}`}
          fill="none"
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
        </path>

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

        {/* Condition label */}
        {condition && (
          <text
            x={isTrueBranch ? "25" : "-25"}
            y={height * 0.5}
            textAnchor={isTrueBranch ? "start" : "end"}
            fill={style.color}
            fontSize="12"
            className="font-medium"
          >
            {condition}
          </text>
        )}
      </svg>
    </div>
  );
}
