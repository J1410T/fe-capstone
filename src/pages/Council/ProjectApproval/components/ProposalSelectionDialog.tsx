import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Calendar,
  Building,
  FileText,
  GraduationCap,
  CheckCircle,
} from "lucide-react";

interface Proposal {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  institution: string;
  experience: string;
  publications: number;
  degrees: string[];
  status: string;
  appliedFor: number;
  appliedDate: string;
  proposalTitle: string;
  proposalSummary: string;
  proposalType: string;
  submittedBy: string;
}

interface ProposalSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: Proposal[];
  onSelectProposal: (proposalId: number) => void;
  topicTitle: string;
}

export const ProposalSelectionDialog: React.FC<
  ProposalSelectionDialogProps
> = ({ isOpen, onClose, proposals, onSelectProposal, topicTitle }) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"select" | "details">("select");

  const selectedProposal = proposals.find(
    (p) => p.id === Number(selectedProposalId)
  );

  const handleConfirmSelection = () => {
    if (selectedProposalId) {
      onSelectProposal(Number(selectedProposalId));
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedProposalId("");
    setViewMode("select");
    onClose();
  };

  const handleViewDetails = () => {
    if (selectedProposalId) {
      setViewMode("details");
    }
  };

  const handleBackToSelection = () => {
    setViewMode("select");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            {viewMode === "select" ? "Select Proposal" : "Proposal Details"}
          </DialogTitle>
          <DialogDescription>
            {viewMode === "select"
              ? `Choose a Principal Investigator proposal for topic: "${topicTitle}"`
              : `Review details for the selected proposal`}
          </DialogDescription>
        </DialogHeader>

        {viewMode === "select" ? (
          <div className="space-y-6">
            {/* Proposal Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Available Proposals ({proposals.length})
                </label>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {proposals.length} option{proposals.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <Select
                value={selectedProposalId}
                onValueChange={setSelectedProposalId}
              >
                <SelectTrigger className="w-full h-12 bg-white border-gray-200">
                  <SelectValue placeholder="Select a proposal to review..." />
                </SelectTrigger>
                <SelectContent>
                  {proposals.map((proposal) => (
                    <SelectItem
                      key={proposal.id}
                      value={proposal.id.toString()}
                      className="py-3"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">
                            {proposal.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 truncate">
                            {proposal.proposalTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {proposal.name} • {proposal.institution}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Proposal Preview */}
            {selectedProposal && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-700">
                      {selectedProposal.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedProposal.proposalTitle}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className="bg-white text-blue-700 border-blue-200"
                      >
                        {selectedProposal.proposalType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-white text-green-700 border-green-200"
                      >
                        {selectedProposal.status}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                      {selectedProposal.proposalSummary}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {selectedProposal.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {selectedProposal.institution}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {selectedProposal.experience} experience
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          Applied{" "}
                          {new Date(
                            selectedProposal.appliedDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Detailed View
          selectedProposal && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Proposal Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-700">
                        {selectedProposal.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedProposal.proposalTitle}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-blue-600 text-white">
                          {selectedProposal.proposalType}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {selectedProposal.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Principal Investigator Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Principal Investigator
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="text-gray-900">{selectedProposal.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">{selectedProposal.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Institution
                      </label>
                      <p className="text-gray-900">
                        {selectedProposal.institution}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Department
                      </label>
                      <p className="text-gray-900">
                        {selectedProposal.department}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Experience
                      </label>
                      <p className="text-gray-900">
                        {selectedProposal.experience}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Publications
                      </label>
                      <p className="text-gray-900">
                        {selectedProposal.publications}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Proposal Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Proposal Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProposal.proposalSummary}
                  </p>
                </div>

                {/* Education */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Education
                  </h4>
                  <ul className="space-y-2">
                    {selectedProposal.degrees.map((degree, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {degree}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          )
        )}

        <DialogFooter className="gap-3">
          {viewMode === "select" ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              {selectedProposalId && (
                <Button
                  variant="outline"
                  onClick={handleViewDetails}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  View Details
                </Button>
              )}
              <Button
                onClick={handleConfirmSelection}
                disabled={!selectedProposalId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Select Proposal
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBackToSelection}>
                Back to Selection
              </Button>
              <Button
                onClick={handleConfirmSelection}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Selection
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
