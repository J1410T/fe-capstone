<<<<<<< HEAD
<<<<<<< HEAD
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
=======
=======
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
<<<<<<< HEAD
>>>>>>> ec4c6af (feat: Add TimePicker component and integrate with ScheduleMeeting form)
=======
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
<<<<<<< HEAD
<<<<<<< HEAD
}: CalendarProps) {
=======
}: React.ComponentProps<typeof DayPicker>) {
>>>>>>> ec4c6af (feat: Add TimePicker component and integrate with ScheduleMeeting form)
=======
}: React.ComponentProps<typeof DayPicker>) {
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
<<<<<<< HEAD
<<<<<<< HEAD
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
=======
=======
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
<<<<<<< HEAD
>>>>>>> ec4c6af (feat: Add TimePicker component and integrate with ScheduleMeeting form)
=======
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
<<<<<<< HEAD
<<<<<<< HEAD
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
=======
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
>>>>>>> ec4c6af (feat: Add TimePicker component and integrate with ScheduleMeeting form)
=======
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
<<<<<<< HEAD
<<<<<<< HEAD
        Chevron: ({ orientation, ...props }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" {...props} />
          ) : (
            <ChevronRight className="h-4 w-4" {...props} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
=======
=======
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
<<<<<<< HEAD
>>>>>>> ec4c6af (feat: Add TimePicker component and integrate with ScheduleMeeting form)
=======
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
