import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The project you're looking for doesn't exist or you don't have access.
      </p>
      <Button onClick={() => navigate("/host/projects")}>
        Back to Projects
      </Button>
    </div>
  );
};

export default NotFound;
