import React, { useState } from "react";
import { InviteMembersStep } from "@/pages/ProjectEnroll/components/InviteMembersStep";
import { SimpleInvitedUser } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InviteMembersDemo: React.FC = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<SimpleInvitedUser[]>([]);

  const handleNext = () => {
    console.log("Next step with collaborators:", collaborators);
    alert(`Next step! Selected ${collaborators.length} collaborators.`);
  };

  const handlePrevious = () => {
    console.log("Previous step");
    alert("Previous step!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-2xl font-bold text-gray-800">
                🧪 Invite Members Step - Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  New Features Implemented:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    <strong>Single Search Input:</strong> Search and select users directly without popover
                  </li>
                  <li>
                    <strong>Automatic CV Requests:</strong> System automatically sends CV requests when members are selected
                  </li>
                  <li>
                    <strong>CV Status Tracking:</strong> Real-time status updates (pending/approved/rejected)
                  </li>
                  <li>
                    <strong>Enhanced Member Cards:</strong> Shows name, email, role, avatar, and CV status
                  </li>
                  <li>
                    <strong>Visual Status Indicators:</strong> Color-coded badges and loading spinners
                  </li>
                  <li>
                    <strong>Status Summary:</strong> Overview of all CV request statuses
                  </li>
                </ul>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Try it out:</strong> Use the search field below to find and add team members. 
                    The system will automatically request their Scientific CV and show real-time status updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Component */}
        <InviteMembersStep
          collaborators={collaborators}
          onCollaboratorsChange={setCollaborators}
          onNext={handleNext}
          onPrevious={handlePrevious}
          mode="detailed"
        />

        {/* Debug Info */}
        {collaborators.length > 0 && (
          <Card className="mt-8 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">
                🔍 Debug Info - Selected Collaborators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(collaborators, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InviteMembersDemo;
