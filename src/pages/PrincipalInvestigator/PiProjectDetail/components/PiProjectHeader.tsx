import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowLeft } from "lucide-react";

interface PiProjectHeaderProps {
  title: string;
  status: string;
  pi: string;
  hasAccess: boolean;
  onRequestAccess: () => void;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'in progress':
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
    case 'under review':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const PiProjectHeader: React.FC<PiProjectHeaderProps> = ({
  title,
  status,
  pi,
  hasAccess,
  onRequestAccess,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/pi/projects")}
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                <strong>Principal Investigator:</strong> {pi}
              </span>
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
          </div>
        </div>
        
        {!hasAccess && (
          <Button
            onClick={onRequestAccess}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Request Access
          </Button>
        )}
      </div>
    </div>
  );
};
