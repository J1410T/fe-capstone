import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import { UserRole } from "@/contexts/auth-types";

interface MeetingHeaderProps {
  title: string;
  description: string;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  description,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      navigate("/pi/meetings");
    } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
      navigate("/council/meetings");
    } else {
      // fallback hoặc 404
      navigate("/");
    }
  };

  return (
    <div className="flex items-center gap-4 ">
      <Button variant="outline" onClick={handleBack}>
        <ArrowLeft className=" h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meeting Minutes</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
