import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/contexts/AuthContext";

interface NewUser {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newUser: NewUser;
  onNewUserChange: (field: keyof NewUser, value: string) => void;
  onAddUser: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  onClose,
  newUser,
  onNewUserChange,
  onAddUser,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account in the system
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newUser.name}
              onChange={(e) => onNewUserChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => onNewUserChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={newUser.role}
              onValueChange={(value) => onNewUserChange("role", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                <SelectItem value={UserRole.PRINCIPAL_INVESTIGATOR}>
                  Principal Investigator
                </SelectItem>
                <SelectItem value={UserRole.APPRAISAL_COUNCIL}>
                  Appraisal Council
                </SelectItem>
                <SelectItem value={UserRole.HOST_INSTITUTION}>
                  Host Institution
                </SelectItem>
                <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddUser}>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
