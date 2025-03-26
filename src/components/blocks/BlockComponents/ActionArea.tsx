import { BlockState } from "@/types/blocks";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionAreaProps {
  state: BlockState;
  isHovered: boolean;
  onRun?: () => void;
  onPause?: () => void;
  onRerun?: () => void;
}

export function ActionArea({
  state,
  isHovered,
  onRun,
  onPause,
  onRerun,
}: ActionAreaProps) {
  const iconContainerClasses =
    "hover:bg-gray-100/50 hover:text-gray-800 flex items-center justify-center rounded-md w-5 h-5 transition-all duration-200";
  const iconClasses = "w-4 h-4";

  const renderTooltipButton = (
    icon: React.ReactNode,
    tooltipText: string,
    onClick?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _bgClass = ""
  ) => (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <button
          variant="ghost"
          onClick={onClick}
          className={`${iconContainerClasses} `}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p className="text-xs">{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );

  const renderActionButton = () => {
    if (!isHovered) {
      // Default state icons (shown when not hovering)
      switch (state) {
        case "running":
          return (
            <div className={`${iconContainerClasses} bg-blue-100`}>
              <Spinner className="w-4 h-4 text-blue-600" />
            </div>
          );
        case "paused":
          return (
            <div className={`${iconContainerClasses}`}>
              <PauseIcon className={`${iconClasses} text-gray-600`} />
            </div>
          );
        case "finished":
          return (
            <div className={`${iconContainerClasses} `}>
              <CheckIcon
                style={{ color: "#6B48E5" }}
                className={`${iconClasses} text-purple-600`}
                strokeWidth={2}
              />
            </div>
          );
        case "error":
          return (
            <div className={`${iconContainerClasses}`}>
              <ExclamationTriangleIcon
                className={`${iconClasses} text-red-600`}
                strokeWidth={2}
              />
            </div>
          );
        case "idle":
        default:
          return null; // Show nothing by default when not hovering
      }
    }

    // Hover state buttons
    switch (state) {
      case "running":
        return renderTooltipButton(
          <PauseIcon className={`${iconClasses} text-gray-600`} />,
          "Pause execution",
          onPause
        );
      case "paused":
      case "idle":
      default: // Handle both idle and default the same way
        return renderTooltipButton(
          <PlayIcon className={`${iconClasses} text-gray-600`} />,
          "Run block",
          onRun
        );
      case "error":
      case "finished":
        return renderTooltipButton(
          <ArrowPathIcon className={`${iconClasses} text-gray-600`} />,
          "Run again",
          onRerun
        );
    }
  };

  return <div className="">{renderActionButton()}</div>;
}
