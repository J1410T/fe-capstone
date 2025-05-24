import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  GraduationCap,
  FileText,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  AcademicRequirementsTab,
  SystemLimitsTab,
  ApprovalConditionsTab,
  DegreeRequirements,
  SystemLimits,
  ApprovalConditions,
} from "./components";

/**
 * System Configuration page for admin
 */
const SystemConfig: React.FC = () => {
  // Academic Degree & CV Requirements
  const [degreeRequirements, setDegreeRequirements] = useState<DegreeRequirements>({
    piMinDegree: "PhD",
    memberMinDegree: "Bachelor",
    councilMinDegree: "PhD",
    requireCV: true,
    requirePublications: true,
    minPublications: 3,
  });

  // System Limits
  const [systemLimits, setSystemLimits] = useState<SystemLimits>({
    maxBudgetRegular: 100000,
    maxBudgetLarge: 500000,
    maxDisbursementRounds: 3,
    projectDurationMonths: 24,
    maxTeamMembers: 10,
    maxActiveProjects: 5,
  });

  // Form Fields & Approval Conditions
  const [approvalConditions, setApprovalConditions] = useState<ApprovalConditions>({
    budgetThreshold: 200000,
    requireSeniorReview: true,
    minCouncilApprovals: 2,
    requireChairmanApproval: true,
    autoCloseInactiveDays: 30,
  });

  // Handle degree requirements changes
  const handleDegreeRequirementsChange = (field: keyof DegreeRequirements, value: any) => {
    setDegreeRequirements({
      ...degreeRequirements,
      [field]: value,
    });
  };

  // Handle system limits changes
  const handleSystemLimitsChange = (field: keyof SystemLimits, value: number) => {
    setSystemLimits({
      ...systemLimits,
      [field]: value,
    });
  };

  // Handle approval conditions changes
  const handleApprovalConditionsChange = (field: keyof ApprovalConditions, value: any) => {
    setApprovalConditions({
      ...approvalConditions,
      [field]: value,
    });
  };

  // Handle form submissions
  const handleSaveDegreeRequirements = () => {
    console.log("Saving degree requirements:", degreeRequirements);
    // API call would go here
    alert("Academic Degree & CV Requirements saved successfully!");
  };

  const handleSaveSystemLimits = () => {
    console.log("Saving system limits:", systemLimits);
    // API call would go here
    alert("System Limits saved successfully!");
  };

  const handleSaveApprovalConditions = () => {
    console.log("Saving approval conditions:", approvalConditions);
    // API call would go here
    alert("Form Fields & Approval Conditions saved successfully!");
  };

  // Handle reset to defaults
  const handleResetToDefaults = () => {
    // Reset all settings to default values
    setDegreeRequirements({
      piMinDegree: "PhD",
      memberMinDegree: "Bachelor",
      councilMinDegree: "PhD",
      requireCV: true,
      requirePublications: true,
      minPublications: 3,
    });

    setSystemLimits({
      maxBudgetRegular: 100000,
      maxBudgetLarge: 500000,
      maxDisbursementRounds: 3,
      projectDurationMonths: 24,
      maxTeamMembers: 10,
      maxActiveProjects: 5,
    });

    setApprovalConditions({
      budgetThreshold: 200000,
      requireSeniorReview: true,
      minCouncilApprovals: 2,
      requireChairmanApproval: true,
      autoCloseInactiveDays: 30,
    });

    alert("All settings reset to defaults!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <Button onClick={handleResetToDefaults}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="academic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="academic">
            <GraduationCap className="mr-2 h-4 w-4" />
            Academic Requirements
          </TabsTrigger>
          <TabsTrigger value="limits">
            <Settings className="mr-2 h-4 w-4" />
            System Limits
          </TabsTrigger>
          <TabsTrigger value="approval">
            <FileText className="mr-2 h-4 w-4" />
            Approval Conditions
          </TabsTrigger>
        </TabsList>

        {/* Academic Degree & CV Requirements */}
        <TabsContent value="academic">
          <AcademicRequirementsTab
            degreeRequirements={degreeRequirements}
            onDegreeRequirementsChange={handleDegreeRequirementsChange}
            onSave={handleSaveDegreeRequirements}
          />
        </TabsContent>

        {/* System Limits */}
        <TabsContent value="limits">
          <SystemLimitsTab
            systemLimits={systemLimits}
            onSystemLimitsChange={handleSystemLimitsChange}
            onSave={handleSaveSystemLimits}
          />
        </TabsContent>

        {/* Form Fields & Approval Conditions */}
        <TabsContent value="approval">
          <ApprovalConditionsTab
            approvalConditions={approvalConditions}
            onApprovalConditionsChange={handleApprovalConditionsChange}
            onSave={handleSaveApprovalConditions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfig;
