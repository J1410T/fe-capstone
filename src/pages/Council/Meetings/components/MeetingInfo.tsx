import React from "react";
import { Calendar, Clock, Users } from "lucide-react";

interface MeetingInfoProps {
  date: string;
  time: string;
  location: string;
}

export const MeetingInfo: React.FC<MeetingInfoProps> = ({
  date,
  time,
  location,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Date:</span>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time:</span>
        <span className="text-sm text-muted-foreground">{time}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Location:</span>
        <span className="text-sm text-muted-foreground">{location}</span>
      </div>
    </div>
  );
};
