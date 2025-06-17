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
    <div className="flex items-center gap-4 ">
      <Button variant="outline" onClick={() => navigate("/council/meetings")}>
        <ArrowLeft className=" h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meeting Minutes</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
