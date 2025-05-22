import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ManagementHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Project Management
        </h1>
        <p className="text-muted-foreground">
          Collaborate with Principal Investigators on research projects
        </p>
      </div>
      <Button variant="outline" onClick={() => navigate("/host/projects")}>
        Back to Projects
      </Button>
    </div>
  );
};
