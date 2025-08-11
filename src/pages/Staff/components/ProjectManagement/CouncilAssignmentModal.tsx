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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  User,
  CheckCircle,
  AlertCircle,
  Crown,
  GraduationCap,
} from "lucide-react";
import { Council, LegacyProject } from "./detailViewTypes";
import { mockCouncils } from "./mockCouncilData";

interface CouncilAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: LegacyProject;
  onAssignCouncil: (project: LegacyProject, council: Council) => void;
}

export const CouncilAssignmentModal: React.FC<CouncilAssignmentModalProps> = ({
  isOpen,
  onClose,
  project,
  onAssignCouncil,
}) => {
  const [selectedCouncil, setSelectedCouncil] = useState<Council | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedCouncil) return;

    setIsAssigning(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onAssignCouncil(project, selectedCouncil);
    setIsAssigning(false);
    setSelectedCouncil(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedCouncil(null);
    onClose();
  };

  // Filter councils based on project specialization
  const getRecommendedCouncils = () => {
    const projectTags = project["project-tags"].map((tag) =>
      tag.name.toLowerCase()
    );
    const projectCategory = project.category.toLowerCase();

    return mockCouncils
      .map((council) => {
        const matchScore = council.specialization.reduce((score, spec) => {
          const specLower = spec.toLowerCase();
          if (
            projectTags.some(
              (tag) => specLower.includes(tag) || tag.includes(specLower)
            )
          ) {
            return score + 2;
          }
          if (
            specLower.includes(projectCategory) ||
            projectCategory.includes(specLower)
          ) {
            return score + 1;
          }
          return score;
        }, 0);

        return { ...council, matchScore, isRecommended: matchScore > 0 };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const councils = getRecommendedCouncils();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Assign Council to Project</span>
          </DialogTitle>
          <DialogDescription>
            Select an appropriate council to evaluate and oversee the project: "
            {project["english-title"]}"
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-4">
            {councils.map((council) => (
              <div
                key={council.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCouncil?.id === council.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                } ${
                  council.currentProjects >= council.maxProjects
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => {
                  if (council.currentProjects < council.maxProjects) {
                    setSelectedCouncil(council);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {council.name}
                      </h3>
                      {council.isRecommended && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      {council.currentProjects >= council.maxProjects && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Full Capacity
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {council.description}
                    </p>
                  </div>
                  {selectedCouncil?.id === council.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Chairperson</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">
                      {council.chairperson}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        Capacity: {council.currentProjects}/
                        {council.maxProjects}
                      </span>
                    </div>
                    <div className="ml-6">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            council.currentProjects >= council.maxProjects
                              ? "bg-red-500"
                              : council.currentProjects / council.maxProjects >
                                0.7
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              (council.currentProjects / council.maxProjects) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">
                        Specializations
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-6">
                      {council.specialization.map((spec, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        Members ({council.members.length})
                      </span>
                    </div>
                    <div className="ml-6 text-sm text-gray-600">
                      {council.members.slice(0, 3).map((member, index) => (
                        <span key={member.id}>
                          {member.name}
                          {index < Math.min(2, council.members.length - 1) &&
                            ", "}
                        </span>
                      ))}
                      {council.members.length > 3 && (
                        <span> and {council.members.length - 3} more...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedCouncil || isAssigning}
            className="min-w-[120px]"
          >
            {isAssigning ? "Assigning..." : "Assign Council"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CouncilAssignmentModal;
