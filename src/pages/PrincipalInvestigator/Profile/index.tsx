import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Save, Edit, FileText, User } from "lucide-react";
import { FileUpload } from "../shared/components";
import { FileUpload as FileUploadType } from "../shared/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ScientificResume {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    department: string;
    position: string;
    address: string;
  };
  education: {
    degree: string;
    institution: string;
    year: string;
    field: string;
  }[];
  experience: {
    position: string;
    institution: string;
    startYear: string;
    endYear: string;
    description: string;
  }[];
  publications: {
    title: string;
    journal: string;
    year: string;
    authors: string;
    doi?: string;
  }[];
  awards: {
    title: string;
    organization: string;
    year: string;
    description: string;
  }[];
  researchInterests: string[];
  skills: string[];
  attachments: FileUploadType[];
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState<ScientificResume>({
    personalInfo: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      institution: "",
      department: "",
      position: "",
      address: "",
    },
    education: [],
    experience: [],
    publications: [],
    awards: [],
    researchInterests: [],
    skills: [],
    attachments: [],
  });

  useEffect(() => {
    // Load existing resume data
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to load resume data
      setTimeout(() => {
        // Mock data - in real app, this would come from API
        setResume((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            phone: "+1 (555) 123-4567",
            institution: "University of Science",
            department: "Computer Science",
            position: "Associate Professor",
          },
          education: [
            {
              degree: "Ph.D. in Computer Science",
              institution: "MIT",
              year: "2015",
              field: "Machine Learning",
            },
          ],
          researchInterests: [
            "Machine Learning",
            "Artificial Intelligence",
            "Data Science",
          ],
          skills: ["Python", "R", "TensorFlow", "Research Design"],
        }));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading resume:", error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save resume
      setTimeout(() => {
        toast.success("Scientific resume updated successfully");
        setIsEditing(false);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
      setIsLoading(false);
    }
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", year: "", field: "" },
      ],
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Scientific Resume
            </h1>
            <p className="text-muted-foreground">
              Form BM02 - Manage your scientific profile
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Resume
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Form Badge */}
      <div className="flex items-center space-x-2">
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <FileText className="w-3 h-3 mr-1" />
          BM02
        </Badge>
        <span className="text-sm text-muted-foreground">
          Scientific Resume Form
        </span>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Basic contact and institutional information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={resume.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={resume.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resume.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={resume.personalInfo.institution}
                onChange={(e) =>
                  updatePersonalInfo("institution", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={resume.personalInfo.department}
                onChange={(e) =>
                  updatePersonalInfo("department", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={resume.personalInfo.position}
                onChange={(e) => updatePersonalInfo("position", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={resume.personalInfo.address}
              onChange={(e) => updatePersonalInfo("address", e.target.value)}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>
                Academic qualifications and degrees
              </CardDescription>
            </div>
            {isEditing && (
              <Button variant="outline" onClick={addEducation}>
                Add Education
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Education {index + 1}</h4>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., Ph.D. in Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(index, "institution", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., MIT"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year *</Label>
                  <Input
                    value={edu.year}
                    onChange={(e) =>
                      updateEducation(index, "year", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., 2015"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study *</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(index, "field", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., Machine Learning"
                  />
                </div>
              </div>
            </div>
          ))}
          {resume.education.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No education records added yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* File Attachments */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
            <CardDescription>
              Upload CV, certificates, and other relevant documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              files={resume.attachments}
              onFilesChange={(files) =>
                setResume((prev) => ({ ...prev, attachments: files }))
              }
              label="Upload Documents"
              description="PDF, DOC, XLS, TXT, JPG, PNG up to 10MB each (max 5 files)"
              maxFiles={5}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
