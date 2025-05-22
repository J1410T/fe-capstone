import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MeetingHeaderProps {
  title: string;
  description: string;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  description,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-2"
        onClick={() => navigate("/council/meetings")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Meetings
      </Button>
      <h1 className="text-2xl font-bold tracking-tight">Meeting Minutes</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
