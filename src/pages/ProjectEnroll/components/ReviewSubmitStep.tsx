import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EnrollmentData } from "../index";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Crown,
  User,
  Send,
  FileText,
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

  const getRoleIcon = (role: "Leader" | "Member") =>
    role === "Leader" ? (
      <Crown className="w-4 h-4 text-amber-600" />
    ) : (
      <User className="w-4 h-4 text-blue-600" />
    );

  const getRoleBadgeVariant = (role: "Leader" | "Member") =>
    role === "Leader" ? "default" : "secondary";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please verify the project details and team members before submitting.
        </p>
      </div>

      {/* Project Title + Register Dialog */}
      <Card className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {projectTitle}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Project Registration Summary
            </p>
          </div>

          {/* Dialog View Register */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Register
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[96vw] h-[96vh] max-w-none p-0 overflow-hidden rounded-2xl">
              <div className="flex flex-col h-full bg-white">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-blue-50">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Project Register: {projectTitle}
                  </h2>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto px-6 py-4 bg-white">
                  <Editor
                    apiKey={apiKey}
                    initialValue={bm1Content}
                    init={{
                      height: "100%",
                      menubar: false,
                      toolbar: false,
                      branding: false,
                      promotion: false,
                      resize: false,
                      statusbar: false,
                      elementpath: false,
                      content_style: `
              body {
                font-family: 'Times New Roman', serif;
                padding: 24px;
                color: #222;
                background: #fff;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 1em;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 8px;
              }
            `,
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {/* Team Members */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border border-pink-200">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Users className="w-5 h-5 text-purple-600" />
            Team Members
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-white text-gray-700 border-gray-300"
          >
            {collaborators.length} members
          </Badge>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-gray-600 flex gap-6">
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
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {collaborators.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.department && !user.isInvitation && (
                      <p className="text-xs text-gray-500">{user.department}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {user.isInvitation && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs"
                    >
                      Invitation
                    </Badge>
                  )}
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
        </CardContent>
      </Card>

      {/* Submission Summary */}
      <Card className="bg-green-50 border border-green-200 shadow-sm">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="p-2 rounded-full bg-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-1 text-sm text-green-900">
            <h3 className="text-lg font-semibold">Ready to Submit</h3>
            <p>
              <strong>Project:</strong> {projectTitle}
            </p>
            <p>
              <strong>BM1 Content:</strong>{" "}
              {bm1Content ? "Completed" : "Not Provided"}
            </p>
            <p>
              <strong>Team Members:</strong> {collaborators.length} invited
            </p>
            <p className="mt-2">
              Your enrollment request will be sent to the project
              administrators. All invited members will receive an email.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          size="lg"
          className="px-8 bg-green-600 hover:bg-green-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
