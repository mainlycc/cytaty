import { Button } from "@/components/ui/button"
import type { TimeWindow } from "@/lib/tmdb"
import { timeWindows } from "@/lib/tmdb"

interface TimeWindowSwitchProps {
  currentTimeWindow: TimeWindow
  onTimeWindowChange: (timeWindow: TimeWindow) => void
}

export function TimeWindowSwitch({
  currentTimeWindow,
  onTimeWindowChange,
}: TimeWindowSwitchProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {timeWindows.map(({ label, value }) => (
        <Button
          key={value}
          variant={currentTimeWindow === value ? "default" : "outline"}
          onClick={() => onTimeWindowChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

