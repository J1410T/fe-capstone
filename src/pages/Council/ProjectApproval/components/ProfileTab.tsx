import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  Award,
} from "lucide-react";
import { ProfileData } from "../types";

interface ProfileTabProps {
  profileData: ProfileData;
  onDataChange: (data: ProfileData) => void;
  isEditable?: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profileData,
  onDataChange,
  isEditable = true,
}) => {
  const handlePersonalInfoChange = (field: string, value: string) => {
    onDataChange({
      ...profileData,
      personalInformation: {
        ...profileData.personalInformation,
        [field]: value,
      },
    });
  };

  const handleContactInfoChange = (field: string, value: string) => {
    onDataChange({
      ...profileData,
      contactInformation: {
        ...profileData.contactInformation,
        [field]: value,
      },
    });
  };

  const handleAcademicTitleChange = (field: string, value: string) => {
    onDataChange({
      ...profileData,
      academicTitle: {
        ...profileData.academicTitle,
        [field]: value,
      },
    });
  };

  const handleWorkUnitChange = (field: string, value: string) => {
    onDataChange({
      ...profileData,
      workUnit: {
        ...profileData.workUnit,
        [field]: value,
      },
    });
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedEducation = [...profileData.educationHistory];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    onDataChange({
      ...profileData,
      educationHistory: updatedEducation,
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profileData.personalInformation.fullName}
              onChange={(e) =>
                handlePersonalInfoChange("fullName", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter full name"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthYear">Year of Birth</Label>
            <Input
              id="birthYear"
              value={profileData.personalInformation.birthYear}
              onChange={(e) =>
                handlePersonalInfoChange("birthYear", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter birth year"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={profileData.personalInformation.gender}
              onChange={(e) =>
                handlePersonalInfoChange("gender", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter gender"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeOfBirth">Place of Birth</Label>
            <Input
              id="placeOfBirth"
              value={profileData.personalInformation.placeOfBirth}
              onChange={(e) =>
                handlePersonalInfoChange("placeOfBirth", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter place of birth"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nativePlace">Native Place</Label>
            <Input
              id="nativePlace"
              value={profileData.personalInformation.nativePlace}
              onChange={(e) =>
                handlePersonalInfoChange("nativePlace", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter native place"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={profileData.contactInformation.contactPhone}
              onChange={(e) =>
                handleContactInfoChange("contactPhone", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter contact phone"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={profileData.contactInformation.contactEmail}
              onChange={(e) =>
                handleContactInfoChange("contactEmail", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter contact email"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Title / Degree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Academic Title / Degree
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="academicTitle">Academic Title (GS/PGS)</Label>
            <Input
              id="academicTitle"
              value={profileData.academicTitle.academicTitle}
              onChange={(e) =>
                handleAcademicTitleChange("academicTitle", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter academic title"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicTitleYear">Year of Conferring</Label>
            <Input
              id="academicTitleYear"
              value={profileData.academicTitle.academicTitleYear}
              onChange={(e) =>
                handleAcademicTitleChange("academicTitleYear", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter year"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicTitleInstitution">
              Place of Conferring
            </Label>
            <Input
              id="academicTitleInstitution"
              value={profileData.academicTitle.academicTitleInstitution}
              onChange={(e) =>
                handleAcademicTitleChange(
                  "academicTitleInstitution",
                  e.target.value
                )
              }
              disabled={!isEditable}
              placeholder="Enter institution"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Unit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Work Unit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workUnitName">Name of Work Unit</Label>
            <Input
              id="workUnitName"
              value={profileData.workUnit.workUnitName}
              onChange={(e) =>
                handleWorkUnitChange("workUnitName", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter work unit name"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workUnitPhone">Phone Number</Label>
            <Input
              id="workUnitPhone"
              value={profileData.workUnit.workUnitPhone}
              onChange={(e) =>
                handleWorkUnitChange("workUnitPhone", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter phone number"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workUnitAddress">Address</Label>
            <Input
              id="workUnitAddress"
              value={profileData.workUnit.workUnitAddress}
              onChange={(e) =>
                handleWorkUnitChange("workUnitAddress", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter address"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workUnitEmail">Email</Label>
            <Input
              id="workUnitEmail"
              type="email"
              value={profileData.workUnit.workUnitEmail}
              onChange={(e) =>
                handleWorkUnitChange("workUnitEmail", e.target.value)
              }
              disabled={!isEditable}
              placeholder="Enter email"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Education History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.educationHistory.map((education, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {education.level}
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${index}`}>Institution</Label>
                  <Input
                    id={`institution-${index}`}
                    value={education.institution}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                    disabled={!isEditable}
                    placeholder="Enter institution"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`major-${index}`}>Major</Label>
                  <Input
                    id={`major-${index}`}
                    value={education.major}
                    onChange={(e) =>
                      handleEducationChange(index, "major", e.target.value)
                    }
                    disabled={!isEditable}
                    placeholder="Enter major"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`graduationYear-${index}`}>
                    Graduation Year
                  </Label>
                  <Input
                    id={`graduationYear-${index}`}
                    value={education.graduationYear}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "graduationYear",
                        e.target.value
                      )
                    }
                    disabled={!isEditable}
                    placeholder="Enter year"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
