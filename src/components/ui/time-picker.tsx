import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  className,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState<string>("");
  const [selectedMinute, setSelectedMinute] = React.useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("AM");

  // Parse the value when it changes
  React.useEffect(() => {
    if (value) {
      const [time, period] =
        value.includes("AM") || value.includes("PM")
          ? value.split(" ")
          : [value, ""];

      if (time) {
        const [hour, minute] = time.split(":");
        if (period) {
          // 12-hour format
          setSelectedHour(hour);
          setSelectedMinute(minute);
          setSelectedPeriod(period);
        } else {
          // 24-hour format - convert to 12-hour
          const hourNum = parseInt(hour);
          const isPM = hourNum >= 12;
          const displayHour =
            hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
          setSelectedHour(displayHour.toString().padStart(2, "0"));
          setSelectedMinute(minute);
          setSelectedPeriod(isPM ? "PM" : "AM");
        }
      }
    } else {
      setSelectedHour("");
      setSelectedMinute("");
      setSelectedPeriod("AM");
    }
  }, [value]);

  // Generate hour options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour.toString().padStart(2, "0");
  });

  // Generate minute options (00, 15, 30, 45)
  const minutes = ["00", "15", "30", "45"];

  const handleTimeChange = (hour: string, minute: string, period: string) => {
    if (hour && minute && period && onChange) {
      const time = `${hour}:${minute} ${period}`;
      onChange(time);
      setIsOpen(false);
    }
  };

  const formatDisplayTime = () => {
    if (selectedHour && selectedMinute && selectedPeriod) {
      return `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    }
    return null;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime() || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Time</div>
          <div className="grid grid-cols-3 gap-2">
            {/* Hour Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Hour
              </label>
              <Select
                value={selectedHour}
                onValueChange={(hour) => {
                  setSelectedHour(hour);
                  if (hour && selectedMinute && selectedPeriod) {
                    handleTimeChange(hour, selectedMinute, selectedPeriod);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minute Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Minute
              </label>
              <Select
                value={selectedMinute}
                onValueChange={(minute) => {
                  setSelectedMinute(minute);
                  if (selectedHour && minute && selectedPeriod) {
                    handleTimeChange(selectedHour, minute, selectedPeriod);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AM/PM Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Period
              </label>
              <Select
                value={selectedPeriod}
                onValueChange={(period) => {
                  setSelectedPeriod(period);
                  if (selectedHour && selectedMinute && period) {
                    handleTimeChange(selectedHour, selectedMinute, period);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Time Buttons */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Quick Select
            </div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleTimeChange("09", "00", "AM")}
              >
                9:00 AM
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleTimeChange("10", "00", "AM")}
              >
                10:00 AM
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleTimeChange("01", "00", "PM")}
              >
                1:00 PM
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleTimeChange("02", "00", "PM")}
              >
                2:00 PM
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleTimeChange("03", "00", "PM")}
              >
                3:00 PM
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleTimeChange("04", "00", "PM")}
              >
                4:00 PM
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
