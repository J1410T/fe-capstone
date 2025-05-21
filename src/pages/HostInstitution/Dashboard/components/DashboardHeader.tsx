import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Host Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of research projects and funding at your institution
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/host/register-project")}>
          <FileText className="mr-2 h-4 w-4" />
          Register Project
        </Button>
        <Button variant="outline" onClick={() => navigate("/host/projects")}>
          <Briefcase className="mr-2 h-4 w-4" />
          All Projects
        </Button>
      </div>
    </div>
  );
};
