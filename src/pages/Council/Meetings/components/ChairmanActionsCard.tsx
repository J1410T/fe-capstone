import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, CheckCircle } from "lucide-react";

export const ChairmanActionsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chairman Actions</CardTitle>
        <CardDescription>
          Special actions for the council chairman
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Follow-up Meeting
        </Button>
        <Button className="w-full" variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Notify All Members
        </Button>
        <Button className="w-full">
          <CheckCircle className="mr-2 h-4 w-4" />
          Submit Final Conclusion
        </Button>
      </CardContent>
    </Card>
  );
};
