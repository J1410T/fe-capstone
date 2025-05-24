import React from "react";
import { ComingSoon } from "@/components/common/ComingSoon";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

const ProjectsComingSoon: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine the back path based on user role
  const getBackPath = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case UserRole.STAFF:
        return "/staff/dashboard";
      case UserRole.HOST_INSTITUTION:
        return "/host/my-projects";
      case UserRole.APPRAISAL_COUNCIL:
        return "/council/evaluations";
      case UserRole.PRINCIPAL_INVESTIGATOR:
      case UserRole.MEMBER:
      default:
        return "/member/home";
    }
  };
  
  // Determine the page title based on the current path
  const getPageInfo = () => {
    const path = location.pathname;
    
    if (path.includes("/project/") && path.includes("/edit")) {
      return {
        title: "Edit Project",
        description: "The project editing interface is being developed. You'll be able to modify project details, team members, and settings here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/project/") && path.includes("/reports")) {
      return {
        title: "Project Reports",
        description: "Project reporting features are coming soon. You'll be able to generate and view detailed project reports here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/project/") && path.includes("/budget")) {
      return {
        title: "Project Budget",
        description: "Budget management features are being developed. You'll be able to track expenses and manage project finances here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/project/") && path.includes("/team")) {
      return {
        title: "Team Management",
        description: "Team management interface is coming soon. You'll be able to add, remove, and manage team members here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/project/") && path.includes("/documents")) {
      return {
        title: "Project Documents",
        description: "Document management system is being developed. You'll be able to upload, organize, and share project documents here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/project/") && path.includes("/timeline")) {
      return {
        title: "Project Timeline",
        description: "Timeline and milestone tracking features are coming soon. You'll be able to manage project schedules here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/projects/search")) {
      return {
        title: "Project Search",
        description: "Advanced project search functionality is being developed. You'll be able to find projects using various filters here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/projects/analytics")) {
      return {
        title: "Project Analytics",
        description: "Project analytics and insights are coming soon. You'll see detailed project performance metrics here.",
        estimatedTime: "Next update"
      };
    }
    
    // Default case
    return {
      title: "Project Feature",
      description: "This project-related feature is currently under development and will be available soon.",
      estimatedTime: "Next update"
    };
  };

  const pageInfo = getPageInfo();

  return (
    <ComingSoon
      title={pageInfo.title}
      description={pageInfo.description}
      estimatedTime={pageInfo.estimatedTime}
      backPath={getBackPath()}
    />
  );
};

export default ProjectsComingSoon;
