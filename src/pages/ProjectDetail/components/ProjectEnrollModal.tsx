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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserPlus, User, Crown } from "lucide-react";

interface ProjectEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (data: { role: "Principal" | "Member"; message?: string }) => void;
  projectTitle: string;
  isLoading?: boolean;
}

export const ProjectEnrollModal: React.FC<ProjectEnrollModalProps> = ({
  isOpen,
  onClose,
  onEnroll,
  projectTitle,
  isLoading = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<"Principal" | "Member">(
    "Member"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnroll({
      role: selectedRole,
      message: message.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedRole("Member");
      setMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Enroll in Project
          </DialogTitle>
          <DialogDescription>
            Choose your role and provide a message to enroll in "{projectTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Select Role</Label>
              <div className="mt-2 space-y-2">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    selectedRole === "Member"
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setSelectedRole("Member")}
                >
                  <input
                    type="radio"
                    name="role"
                    value="Member"
                    checked={selectedRole === "Member"}
                    onChange={() => setSelectedRole("Member")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <Label className="flex items-center gap-2 cursor-pointer flex-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Member</div>
                      <div className="text-sm text-gray-600">
                        Regular team member with access to project resources
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Member
                    </Badge>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    selectedRole === "Principal"
                      ? "border-amber-500 bg-amber-50"
                      : ""
                  }`}
                  onClick={() => setSelectedRole("Principal")}
                >
                  <input
                    type="radio"
                    name="role"
                    value="Principal"
                    checked={selectedRole === "Principal"}
                    onChange={() => setSelectedRole("Principal")}
                    className="h-4 w-4 text-amber-600"
                  />
                  <Label className="flex items-center gap-2 cursor-pointer flex-1">
                    <Crown className="h-4 w-4 text-amber-600" />
                    <div>
                      <div className="font-medium">Principal</div>
                      <div className="text-sm text-gray-600">
                        Project lead with full management access
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      className="ml-auto bg-amber-100 text-amber-800"
                    >
                      Principal
                    </Badge>
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="text-base font-medium">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Briefly explain why you want to join this project and what you can contribute..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2"
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {message.length}/500 characters
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enrolling..." : "Enroll"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
