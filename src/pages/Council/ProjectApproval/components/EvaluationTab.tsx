import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  User,
  Users,
  Building,
  Plus,
  Trash2,
  Globe,
} from "lucide-react";
import { EvaluationData, TeamMember } from "../types";

interface EvaluationTabProps {
  evaluationData: EvaluationData;
  onDataChange: (data: EvaluationData) => void;
  isEditable?: boolean;
}

const EvaluationTab: React.FC<EvaluationTabProps> = ({
  evaluationData,
  onDataChange,
  isEditable = true,
}) => {
  const handleResearchTitleChange = (field: string, value: string) => {
    onDataChange({
      ...evaluationData,
      researchTitle: {
        ...evaluationData.researchTitle,
        [field]: value,
      },
    });
  };

  const handleImplementationTimeChange = (field: string, value: string) => {
    onDataChange({
      ...evaluationData,
      implementationTime: {
        ...evaluationData.implementationTime,
        [field]: value,
      },
    });
  };

  const handlePrincipalInvestigatorChange = (field: string, value: string) => {
    onDataChange({
      ...evaluationData,
      principalInvestigator: {
        ...evaluationData.principalInvestigator,
        [field]: value,
      },
    });
  };

  const handleSecretaryChange = (field: string, value: string) => {
    onDataChange({
      ...evaluationData,
      secretary: {
        ...evaluationData.secretary,
        [field]: value,
      },
    });
  };

  const handleTeamMemberChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedMembers = [...evaluationData.teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    onDataChange({
      ...evaluationData,
      teamMembers: updatedMembers,
    });
  };

  const addTeamMember = () => {
    if (evaluationData.teamMembers.length < 10) {
      const newMember: TeamMember = {
        name: "",
        academicTitle: "",
        workUnit: "",
        contribution: "",
        workDuration: "",
      };
      onDataChange({
        ...evaluationData,
        teamMembers: [...evaluationData.teamMembers, newMember],
      });
    }
  };

  const removeTeamMember = (index: number) => {
    const updatedMembers = evaluationData.teamMembers.filter(
      (_, i) => i !== index
    );
    onDataChange({
      ...evaluationData,
      teamMembers: updatedMembers,
    });
  };

  const handleHostInstitutionChange = (field: string, value: string) => {
    onDataChange({
      ...evaluationData,
      hostInstitution: {
        ...evaluationData.hostInstitution,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Research Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Research Title
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="titleVietnamese"
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Vietnamese Title
            </Label>
            <Input
              id="titleVietnamese"
              value={evaluationData.researchTitle.vietnamese}
              onChange={(e) =>
                handleResearchTitleChange("vietnamese", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter Vietnamese title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleEnglish" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              English Title
            </Label>
            <Input
              id="titleEnglish"
              value={evaluationData.researchTitle.english}
              onChange={(e) =>
                handleResearchTitleChange("english", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter English title"
            />
          </div>
        </CardContent>
      </Card>

      {/* Implementation Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Implementation Time
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="durationMonths">Duration (Months)</Label>
            <Input
              id="durationMonths"
              value={evaluationData.implementationTime.durationMonths}
              onChange={(e) =>
                handleImplementationTimeChange("durationMonths", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Duration"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startMonth">Start Month</Label>
            <Input
              id="startMonth"
              value={evaluationData.implementationTime.startMonth}
              onChange={(e) =>
                handleImplementationTimeChange("startMonth", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Start month"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startYear">Start Year</Label>
            <Input
              id="startYear"
              value={evaluationData.implementationTime.startYear}
              onChange={(e) =>
                handleImplementationTimeChange("startYear", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Start year"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endMonth">End Month</Label>
            <Input
              id="endMonth"
              value={evaluationData.implementationTime.endMonth}
              onChange={(e) =>
                handleImplementationTimeChange("endMonth", e.target.value)
              }
              disabled={!isEditable}
              placeholder="End month"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endYear">End Year</Label>
            <Input
              id="endYear"
              value={evaluationData.implementationTime.endYear}
              onChange={(e) =>
                handleImplementationTimeChange("endYear", e.target.value)
              }
              disabled={!isEditable}
              placeholder="End year"
            />
          </div>
        </CardContent>
      </Card>

      {/* Principal Investigator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Principal Investigator
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="piName">Name</Label>
            <Input
              id="piName"
              value={evaluationData.principalInvestigator.name}
              onChange={(e) =>
                handlePrincipalInvestigatorChange("name", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piAcademicTitle">Academic Title</Label>
            <Input
              id="piAcademicTitle"
              value={evaluationData.principalInvestigator.academicTitle}
              onChange={(e) =>
                handlePrincipalInvestigatorChange(
                  "academicTitle",
                  e.target.value
                )
              }
              disabled={!isEditable}
              placeholder="Enter academic title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piDateOfBirth">Date of Birth</Label>
            <Input
              id="piDateOfBirth"
              value={evaluationData.principalInvestigator.dateOfBirth}
              onChange={(e) =>
                handlePrincipalInvestigatorChange("dateOfBirth", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter date of birth"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piGender">Gender</Label>
            <Input
              id="piGender"
              value={evaluationData.principalInvestigator.gender}
              onChange={(e) =>
                handlePrincipalInvestigatorChange("gender", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter gender"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piSpecialization">Specialization</Label>
            <Input
              id="piSpecialization"
              value={evaluationData.principalInvestigator.specialization}
              onChange={(e) =>
                handlePrincipalInvestigatorChange(
                  "specialization",
                  e.target.value
                )
              }
              disabled={!isEditable}
              placeholder="Enter specialization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piScientificTitle">Scientific Title</Label>
            <Input
              id="piScientificTitle"
              value={evaluationData.principalInvestigator.scientificTitle}
              onChange={(e) =>
                handlePrincipalInvestigatorChange(
                  "scientificTitle",
                  e.target.value
                )
              }
              disabled={!isEditable}
              placeholder="Enter scientific title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piPhone">Phone</Label>
            <Input
              id="piPhone"
              value={evaluationData.principalInvestigator.phone}
              onChange={(e) =>
                handlePrincipalInvestigatorChange("phone", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piEmail">Email</Label>
            <Input
              id="piEmail"
              type="email"
              value={evaluationData.principalInvestigator.email}
              onChange={(e) =>
                handlePrincipalInvestigatorChange("email", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piWorkUnit">Work Unit</Label>
            <Input
              id="piWorkUnit"
              value={evaluationData.principalInvestigator.workUnit}
              onChange={(e) =>
                handlePrincipalInvestigatorChange("workUnit", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter work unit"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="piWorkAddress">Work Address</Label>
            <Input
              id="piWorkAddress"
              value={evaluationData.principalInvestigator.workAddress}
              onChange={(e) =>
                handlePrincipalInvestigatorChange("workAddress", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter work address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Secretary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Secretary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="secName">Name</Label>
            <Input
              id="secName"
              value={evaluationData.secretary.name}
              onChange={(e) => handleSecretaryChange("name", e.target.value)}
              disabled={!isEditable}
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secDateOfBirth">Date of Birth</Label>
            <Input
              id="secDateOfBirth"
              value={evaluationData.secretary.dateOfBirth}
              onChange={(e) =>
                handleSecretaryChange("dateOfBirth", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter date of birth"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secGender">Gender</Label>
            <Input
              id="secGender"
              value={evaluationData.secretary.gender}
              onChange={(e) => handleSecretaryChange("gender", e.target.value)}
              disabled={!isEditable}
              placeholder="Enter gender"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secSpecialization">Specialization</Label>
            <Input
              id="secSpecialization"
              value={evaluationData.secretary.specialization}
              onChange={(e) =>
                handleSecretaryChange("specialization", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter specialization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secScientificTitle">Scientific Title</Label>
            <Input
              id="secScientificTitle"
              value={evaluationData.secretary.scientificTitle}
              onChange={(e) =>
                handleSecretaryChange("scientificTitle", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter scientific title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secPhone">Phone</Label>
            <Input
              id="secPhone"
              value={evaluationData.secretary.phone}
              onChange={(e) => handleSecretaryChange("phone", e.target.value)}
              disabled={!isEditable}
              placeholder="Enter phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secEmail">Email</Label>
            <Input
              id="secEmail"
              type="email"
              value={evaluationData.secretary.email}
              onChange={(e) => handleSecretaryChange("email", e.target.value)}
              disabled={!isEditable}
              placeholder="Enter email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secWorkUnit">Work Unit</Label>
            <Input
              id="secWorkUnit"
              value={evaluationData.secretary.workUnit}
              onChange={(e) =>
                handleSecretaryChange("workUnit", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter work unit"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="secWorkAddress">Work Address</Label>
            <Input
              id="secWorkAddress"
              value={evaluationData.secretary.workAddress}
              onChange={(e) =>
                handleSecretaryChange("workAddress", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter work address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
            <span className="text-sm text-muted-foreground ml-2">
              ({evaluationData.teamMembers.length}/10)
            </span>
          </CardTitle>
          {isEditable && evaluationData.teamMembers.length < 10 && (
            <Button
              onClick={addTeamMember}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {evaluationData.teamMembers.map((member, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Member {index + 1}</h4>
                {isEditable && (
                  <Button
                    onClick={() => removeTeamMember(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`memberName-${index}`}>Name</Label>
                  <Input
                    id={`memberName-${index}`}
                    value={member.name}
                    onChange={(e) =>
                      handleTeamMemberChange(index, "name", e.target.value)
                    }
                    disabled={!isEditable}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`memberAcademicTitle-${index}`}>
                    Academic Title
                  </Label>
                  <Input
                    id={`memberAcademicTitle-${index}`}
                    value={member.academicTitle}
                    onChange={(e) =>
                      handleTeamMemberChange(
                        index,
                        "academicTitle",
                        e.target.value
                      )
                    }
                    disabled={!isEditable}
                    placeholder="Enter academic title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`memberWorkUnit-${index}`}>Work Unit</Label>
                  <Input
                    id={`memberWorkUnit-${index}`}
                    value={member.workUnit}
                    onChange={(e) =>
                      handleTeamMemberChange(index, "workUnit", e.target.value)
                    }
                    disabled={!isEditable}
                    placeholder="Enter work unit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`memberContribution-${index}`}>
                    Contribution
                  </Label>
                  <Input
                    id={`memberContribution-${index}`}
                    value={member.contribution}
                    onChange={(e) =>
                      handleTeamMemberChange(
                        index,
                        "contribution",
                        e.target.value
                      )
                    }
                    disabled={!isEditable}
                    placeholder="Enter contribution"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`memberWorkDuration-${index}`}>
                    Work Duration
                  </Label>
                  <Input
                    id={`memberWorkDuration-${index}`}
                    value={member.workDuration}
                    onChange={(e) =>
                      handleTeamMemberChange(
                        index,
                        "workDuration",
                        e.target.value
                      )
                    }
                    disabled={!isEditable}
                    placeholder="Enter work duration"
                  />
                </div>
              </div>
            </div>
          ))}
          {evaluationData.teamMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No team members added yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Host Institution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Host Institution
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hostName">Institution Name</Label>
            <Input
              id="hostName"
              value={evaluationData.hostInstitution.name}
              onChange={(e) =>
                handleHostInstitutionChange("name", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter institution name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hostAddress">Institution Address</Label>
            <Input
              id="hostAddress"
              value={evaluationData.hostInstitution.address}
              onChange={(e) =>
                handleHostInstitutionChange("address", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter institution address"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationTab;
