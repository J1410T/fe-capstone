import React from "react";
import { ComingSoon } from "@/components/common/ComingSoon";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

const FormsComingSoon: React.FC = () => {
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
    
    if (path.includes("/forms/bm05")) {
      return {
        title: "BM05 Form",
        description: "The BM05 form interface is being developed. You'll be able to fill out and submit BM05 forms here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/forms/bm06")) {
      return {
        title: "BM06 Form",
        description: "The BM06 form interface is being developed. You'll be able to fill out and submit BM06 forms here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/forms/budget")) {
      return {
        title: "Budget Request Form",
        description: "Budget request form is coming soon. You'll be able to submit budget requests and track their status here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/forms/progress")) {
      return {
        title: "Progress Report Form",
        description: "Progress report submission interface is being developed. You'll be able to submit project progress reports here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/forms/final")) {
      return {
        title: "Final Report Form",
        description: "Final report submission interface is coming soon. You'll be able to submit final project reports here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/forms/extension")) {
      return {
        title: "Extension Request Form",
        description: "Project extension request form is being developed. You'll be able to request project extensions here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/forms/history")) {
      return {
        title: "Form Submission History",
        description: "Form submission history is coming soon. You'll be able to view all your submitted forms and their status here.",
        estimatedTime: "Next update"
      };
    }
    
    if (path.includes("/forms/templates")) {
      return {
        title: "Form Templates",
        description: "Form template library is being developed. You'll be able to access and download form templates here.",
        estimatedTime: "Next update"
      };
    }
    
    // Default case
    return {
      title: "Form Feature",
      description: "This form-related feature is currently under development and will be available soon.",
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

export default FormsComingSoon;
