import React from "react";
import { ComingSoon } from "@/components/common/ComingSoon";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

const GeneralComingSoon: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Determine the back path based on user role
  const getBackPath = () => {
    if (!user) return "/";

    switch (user.role) {
      case UserRole.STAFF:
        return "/staff/dashboard";
      case UserRole.HOST_INSTITUTION:
        return "/host/dashboard";
      case UserRole.APPRAISAL_COUNCIL:
        return "/council/evaluations";
      case UserRole.PRINCIPAL_INVESTIGATOR:
      case UserRole.MEMBER:
      default:
        return "/home";
    }
  };

  // Determine the page title based on the current path and user role
  const getPageInfo = () => {
    const path = location.pathname;

    // Host Institution pages
    if (path.includes("/host/")) {
      if (path.includes("/dashboard")) {
        return {
          title: "Host Dashboard",
          description:
            "The host institution dashboard is being developed. You'll be able to manage your institution's projects and activities here.",
          estimatedTime: "Next update",
        };
      }
      return {
        title: "Host Feature",
        description:
          "This host institution feature is currently under development and will be available soon.",
        estimatedTime: "Next update",
      };
    }

    // Council pages
    if (path.includes("/council/")) {
      if (path.includes("/meetings")) {
        return {
          title: "Council Meetings",
          description:
            "The council meetings interface is being developed. You'll be able to manage meeting schedules and minutes here.",
          estimatedTime: "Next update",
        };
      }
      if (path.includes("/approvals")) {
        return {
          title: "Council Approvals",
          description:
            "The council approval interface is being developed. You'll be able to review and approve proposals here.",
          estimatedTime: "Next update",
        };
      }
      return {
        title: "Council Feature",
        description:
          "This council feature is currently under development and will be available soon.",
        estimatedTime: "Next update",
      };
    }

    // Member pages
    if (path.includes("/member/")) {
      if (path.includes("/projects")) {
        return {
          title: "My Projects",
          description:
            "The member projects interface is being developed. You'll be able to view and manage your project participation here.",
          estimatedTime: "Next update",
        };
      }
      if (path.includes("/profile")) {
        return {
          title: "Profile Settings",
          description:
            "The profile management interface is being developed. You'll be able to update your profile information here.",
          estimatedTime: "Next update",
        };
      }
      return {
        title: "Member Feature",
        description:
          "This member feature is currently under development and will be available soon.",
        estimatedTime: "Next update",
      };
    }

    // Default case
    return {
      title: "Feature Coming Soon",
      description:
        "This feature is currently under development and will be available soon.",
      estimatedTime: "Next update",
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

export default GeneralComingSoon;
