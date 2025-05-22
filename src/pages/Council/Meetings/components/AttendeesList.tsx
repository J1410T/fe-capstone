import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Attendee {
  id: number;
  name: string;
  role: string;
  present: boolean;
}

interface AttendeesListProps {
  attendees: Attendee[];
}

export const AttendeesList: React.FC<AttendeesListProps> = ({ attendees }) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Attendees</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map((attendee) => (
            <TableRow key={attendee.id}>
              <TableCell className="font-medium">{attendee.name}</TableCell>
              <TableCell>{attendee.role}</TableCell>
              <TableCell>
                {attendee.present ? (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Present
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 border-red-200"
                  >
                    Absent
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
