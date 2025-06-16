import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CalendarTest: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [calendarDate, setCalendarDate] = useState<Date | undefined>();

  // Dialog test states
  const [dialogDate, setDialogDate] = useState<Date | undefined>();
  const [dialogDateTime, setDialogDateTime] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTestSubmit = () => {
    const results = {
      selectedDate: selectedDate?.toISOString(),
      selectedDateTime: selectedDateTime?.toISOString(),
      selectedTime,
      calendarDate: calendarDate?.toISOString(),
    };

    console.log("Calendar Test Results:", results);
    alert(`Calendar Test Results:\n${JSON.stringify(results, null, 2)}`);
    toast.success("Calendar test completed! Check console for results.");
  };

  const handleClearAll = () => {
    setSelectedDate(undefined);
    setSelectedDateTime(undefined);
    setSelectedTime("");
    setCalendarDate(undefined);
    toast.info("All calendar values cleared!");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Calendar Components Test</h1>
        <p className="text-muted-foreground">
          Test all calendar components to ensure they work correctly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Picker Test */}
        <Card>
          <CardHeader>
            <CardTitle>Date Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              placeholder="Select a date"
              disablePastDates={true}
            />
            <p className="text-sm text-muted-foreground">
              Selected:{" "}
              {selectedDate ? selectedDate.toLocaleDateString() : "None"}
            </p>
          </CardContent>
        </Card>

        {/* Date Time Picker Test */}
        <Card>
          <CardHeader>
            <CardTitle>Date Time Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DateTimePicker
              date={selectedDateTime}
              onDateChange={setSelectedDateTime}
              placeholder="Select date and time"
            />
            <p className="text-sm text-muted-foreground">
              Selected:{" "}
              {selectedDateTime ? selectedDateTime.toLocaleString() : "None"}
            </p>
          </CardContent>
        </Card>

        {/* Time Picker Test */}
        <Card>
          <CardHeader>
            <CardTitle>Time Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimePicker
              value={selectedTime}
              onChange={setSelectedTime}
              placeholder="Select time"
            />
            <p className="text-sm text-muted-foreground">
              Selected: {selectedTime || "None"}
            </p>
          </CardContent>
        </Card>

        {/* Calendar Test */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md border"
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
            <p className="text-sm text-muted-foreground">
              Selected:{" "}
              {calendarDate ? calendarDate.toLocaleDateString() : "None"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button onClick={handleTestSubmit} variant="default">
          Test Results
        </Button>
        <Button onClick={handleClearAll} variant="outline">
          Clear All
        </Button>

        {/* Dialog Test Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Test Calendar in Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Calendar Test in Dialog</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Date Picker in Dialog</Label>
                <DatePicker
                  date={dialogDate}
                  onDateChange={setDialogDate}
                  placeholder="Select a date"
                  inDialog={true}
                />
                <p className="text-sm text-muted-foreground">
                  Selected:{" "}
                  {dialogDate ? dialogDate.toLocaleDateString() : "None"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>DateTime Picker in Dialog</Label>
                <DateTimePicker
                  date={dialogDateTime}
                  onDateChange={setDialogDateTime}
                  placeholder="Select date and time"
                  inDialog={true}
                />
                <p className="text-sm text-muted-foreground">
                  Selected:{" "}
                  {dialogDateTime ? dialogDateTime.toLocaleString() : "None"}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    alert(
                      `Dialog Results:\nDate: ${
                        dialogDate?.toLocaleDateString() || "None"
                      }\nDateTime: ${
                        dialogDateTime?.toLocaleString() || "None"
                      }`
                    );
                  }}
                >
                  Show Results
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>1. Try selecting dates in each component</p>
            <p>2. Verify that the popover opens and closes correctly</p>
            <p>3. Check that date selection works and updates the display</p>
            <p>4. Test that past dates are disabled where appropriate</p>
            <p>5. Verify that the calendar doesn't disappear unexpectedly</p>
            <p>6. Click "Test Results" to see all selected values in console</p>
            <p>
              <strong>
                7. Click "Test Calendar in Dialog" to test calendar
                functionality inside dialogs
              </strong>
            </p>
            <p>
              <strong>
                8. In the dialog, test both date picker and datetime picker
              </strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarTest;
