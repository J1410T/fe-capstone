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
// import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Users,
  // User,
  CheckCircle,
  AlertCircle,
  // Crown,
  // GraduationCap,
  Search,
} from "lucide-react";
import { Council, LegacyProject } from "../../../../types/detailViewTypes";
import { useAppraisalCouncilsList } from "@/hooks/queries/appraisal-council";
import { AppraisalCouncil } from "@/types/appraisal-council";

interface CouncilAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: LegacyProject;
  onAssignCouncil: (project: LegacyProject, council: Council) => void;
  isAssigning?: boolean;
}

// Convert AppraisalCouncil to Council type for compatibility
const convertToCouncil = (appraisalCouncil: AppraisalCouncil): Council => ({
  id: appraisalCouncil.id,
  name: appraisalCouncil.name,
  description: `Code: ${appraisalCouncil.code}`,
  chairperson: "TBD", // This would need to be fetched from members
  members: [], // This would need to be fetched separately
  specialization: [], // This would need to be fetched separately
  status: appraisalCouncil.status === "created" ? "active" : "inactive",
  createdAt: appraisalCouncil["created-at"],
  maxProjects: 10, // Default value
  currentProjects: 0, // Default value
});

export const CouncilAssignmentModal: React.FC<CouncilAssignmentModalProps> = ({
  isOpen,
  onClose,
  project,
  onAssignCouncil,
  isAssigning: externalIsAssigning = false,
}) => {
  const [selectedCouncil, setSelectedCouncil] = useState<Council | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // API call to get councils list with search
  const { data: councilsResponse, isLoading: isLoadingCouncils } =
    useAppraisalCouncilsList({
      "key-word": searchTerm,
      "page-index": 1,
      "page-size": 500, // Increased to show more councils
      status: "created",
    });

  const handleAssign = async () => {
    if (!selectedCouncil) return;

    onAssignCouncil(project, selectedCouncil);
    setSelectedCouncil(null);
  };

  const handleClose = () => {
    setSelectedCouncil(null);
    setSearchTerm("");
    onClose();
  };

  // Convert API councils to UI format
  const councils = councilsResponse?.["data-list"]?.map(convertToCouncil) || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <Users className="w-5 h-5" />
            <span>Assign Council</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 line-clamp-2">
            Select a council for:{" "}
            <span className="font-medium">"{project["english-title"]}"</span>
          </DialogDescription>
        </DialogHeader>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-hidden flex flex-col space-y-3">
          {/* Search Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search councils..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {!isLoadingCouncils && councils.length > 0 && (
              <div className="text-xs text-gray-500 px-1">
                Found {councils.length} council
                {councils.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Scroll content */}
          <ScrollArea className="flex-1 pr-4 overflow-y-auto">
            {isLoadingCouncils ? (
              <div className="text-center py-8 text-gray-500">
                Loading councils...
              </div>
            ) : councils.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No councils found
              </div>
            ) : (
              <div className="space-y-3">
                {councils.map((council) => (
                  <div
                    key={council.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedCouncil?.id === council.id
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
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
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {council.name}
                          </h3>
                          {council.currentProjects >= council.maxProjects && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Full
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {council.description}
                        </p>
                      </div>
                      {selectedCouncil?.id === council.id && (
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer luôn ở dưới */}
        <DialogFooter className="pt-2 border-t mt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedCouncil || externalIsAssigning}
            className="min-w-[100px]"
          >
            {externalIsAssigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CouncilAssignmentModal;
