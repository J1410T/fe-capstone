import React from "react";
import { ComingSoon } from "@/components/common/ComingSoon";
import { useLocation } from "react-router-dom";

const AdminComingSoon: React.FC = () => {
  const location = useLocation();
  
  // Determine the page title based on the current path
  const getPageInfo = () => {
    const path = location.pathname;
    
    if (path.includes("/projects/create")) {
      return {
        title: "Project Creation",
        description: "The project creation interface is being developed. You'll be able to create and manage projects here soon.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/projects/templates")) {
      return {
        title: "Project Templates",
        description: "Project template management is coming soon. You'll be able to create and manage project templates here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/approvals/budget")) {
      return {
        title: "Budget Approvals",
        description: "Budget approval management interface is under development. You'll be able to review and approve budget requests here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/approvals/templates")) {
      return {
        title: "Form Templates",
        description: "Form template management is coming soon. You'll be able to create and manage form templates here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/system/backup")) {
      return {
        title: "System Backup",
        description: "System backup and restore functionality is being developed. You'll be able to manage system backups here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/users/roles")) {
      return {
        title: "Role Management",
        description: "Advanced role management features are coming soon. You'll be able to create and manage custom roles here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/projects/recent")) {
      return {
        title: "Recent Projects",
        description: "Recent projects overview is being developed. You'll see recently accessed projects here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/projects/stats")) {
      return {
        title: "Project Statistics",
        description: "Detailed project statistics and analytics are coming soon. You'll see comprehensive project insights here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/security")) {
      return {
        title: "Security Settings",
        description: "Security management interface is under development. You'll be able to configure security settings here.",
        estimatedTime: "Next update"
      };
    }
    
    // Default case
    return {
      title: "Admin Feature",
      description: "This admin feature is currently under development and will be available soon.",
      estimatedTime: "Next update"
    };
  };

  const pageInfo = getPageInfo();

  return (
    <ComingSoon
      title={pageInfo.title}
      description={pageInfo.description}
      estimatedTime={pageInfo.estimatedTime}
      backPath="/staff/dashboard"
    />
  );
};

export default AdminComingSoon;
