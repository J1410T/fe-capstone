import React from "react";
import { ComingSoon } from "@/components/common/ComingSoon";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

const NotFound: React.FC = () => {
  const { user } = useAuth();
  
  // Determine the back path based on user role
  const getBackPath = () => {
    if (!user) return "/auth/login";
    
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

  return (
    <ComingSoon
      title="Page Not Found"
      description="The page you're looking for doesn't exist yet, but we're working on it! This feature will be available soon."
      estimatedTime="Next update"
      backPath={getBackPath()}
    />
  );
};

export default NotFound;
