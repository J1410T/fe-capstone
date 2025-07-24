import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EnrollmentData } from "../index";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Users,
  Crown,
  User,
  Send,
} from "lucide-react";

interface ReviewSubmitStepProps {
  enrollmentData: EnrollmentData;
  projectTitle: string;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  enrollmentData,
  projectTitle,
  onPrevious,
  onSubmit,
  isSubmitting,
}) => {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const { bm1Content, collaborators } = enrollmentData;

  const getRoleIcon = (role: "Leader" | "Member") => {
    return role === "Leader" ? (
      <Crown className="w-4 h-4 text-amber-600" />
    ) : (
      <User className="w-4 h-4 text-blue-600" />
    );
  };

  const getRoleBadgeVariant = (role: "Leader" | "Member") => {
    return role === "Leader" ? "default" : "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review your project summary and team members before submitting your
          enrollment request.
        </p>
      </div>

      {/* Project Summary Review */}
      <Card className="pt-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 pt-4">
            <FileText className="w-5 h-5 text-blue-600 " />
            Project Register
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Your project description and research details
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-y-auto border-b border-gray-100">
            <Editor
              apiKey={apiKey}
              initialValue={bm1Content}
              init={{
                height: 500,
                width: "100%",
                menubar: false,
                toolbar: false,
                readonly: true,
                content_style: `
                  body {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #333;
                    padding: 20px;
                    background: #fff;
                  }
                  h1, h2, h3, h4, h5, h6 {
                    color: #1f2937;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                  }
                  h1 { font-size: 2em; }
                  h2 { font-size: 1.5em; }
                  h3 { font-size: 1.3em; }
                  p { margin-bottom: 1em; }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1em 0;
                  }
                  table td, table th {
                    border: 1px solid #d1d5db;
                    padding: 8px;
                    text-align: left;
                  }
                  table th {
                    background-color: #f9fafb;
                    font-weight: 600;
                  }
                `,
                branding: false,
                promotion: false,
                resize: false,
                statusbar: false,
                elementpath: false,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members Review */}
      <Card className="pt-0 ">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Team Members
            </div>
            <Badge variant="outline" className="bg-white">
              {collaborators.length} members
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Collaborators who will be invited to join this project
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {collaborators.length > 0 ? (
            <div className="space-y-4">
              {/* Role Summary */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-amber-600" />
                  {collaborators.filter((u) => u.role === "Leader").length}{" "}
                  Leader(s)
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4 text-blue-600" />
                  {collaborators.filter((u) => u.role === "Member").length}{" "}
                  Member(s)
                </span>
              </div>

              <Separator />

              {/* Members List */}
              <div className="max-h-[400px] overflow-y-auto space-y-3">
                {collaborators.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          {user.isInvitation && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300"
                            >
                              Invitation
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.department && !user.isInvitation && (
                          <p className="text-xs text-gray-500 mt-1">
                            {user.department}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="flex items-center gap-1"
                      >
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No team members added</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Ready to Submit
              </h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>
                  <strong>Project:</strong> {projectTitle}
                </p>
                <p>
                  <strong>BM1 Content:</strong>{" "}
                  {bm1Content ? "Completed" : "Not provided"}
                </p>
                <p>
                  <strong>Team Members:</strong> {collaborators.length} invited
                </p>
                <p className="mt-3 text-green-700">
                  Your enrollment request will be sent to the project
                  administrators for review. All invited team members will
                  receive email invitations to join the project.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          className="px-8"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={onSubmit}
          size="lg"
          className="px-8 bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enroll Project
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
