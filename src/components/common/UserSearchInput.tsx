import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Mail, User, Plus } from "lucide-react";
import { cn } from "@/utils";

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  role?: string;
}

export interface InvitedUser extends UserSearchResult {
  isInvitation?: boolean; // true if user doesn't exist in system
  role: "Leader" | "Member";
}

interface UserSearchInputProps {
  placeholder?: string;
  onUserSelect: (user: UserSearchResult) => void;
  excludeUserIds?: string[];
  className?: string;
  disabled?: boolean;
}

// Mock user data - in real app, this would come from an API
const mockUsers: UserSearchResult[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@university.edu",
    avatar: "/avatars/john.jpg",
    department: "Computer Science",
    role: "Professor",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@university.edu",
    avatar: "/avatars/john-doe.jpg",
    department: "Mathematics",
    role: "Associate Professor",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    avatar: "/avatars/jane.jpg",
    department: "Physics",
    role: "Researcher",
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    department: "Chemistry",
    role: "PhD Student",
  },
];

export const UserSearchInput: React.FC<UserSearchInputProps> = ({
  placeholder = "Search by name or email...",
  onUserSelect,
  excludeUserIds = [],
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserSearchResult[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateUsers, setDuplicateUsers] = useState<UserSearchResult[]>([]);

  // Filter users based on search input
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredUsers([]);
      return;
    }

    const filtered = mockUsers.filter((user) => {
      if (excludeUserIds.includes(user.id)) return false;

      const searchLower = searchValue.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });

    setFilteredUsers(filtered);
  }, [searchValue, excludeUserIds]);

  const handleUserSelect = (user: UserSearchResult) => {
    // Check for duplicate names
    const duplicates = filteredUsers.filter(
      (u) =>
        u.name.toLowerCase() === user.name.toLowerCase() && u.id !== user.id
    );

    if (duplicates.length > 0) {
      setDuplicateUsers([user, ...duplicates]);
      setShowDuplicateDialog(true);
    } else {
      onUserSelect(user);
      setSearchValue("");
      setOpen(false);
    }
  };

  const handleDuplicateSelect = (user: UserSearchResult) => {
    onUserSelect(user);
    setShowDuplicateDialog(false);
    setSearchValue("");
    setOpen(false);
  };

  const handleEmailInvitation = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchValue)) {
      return;
    }

    // Create invitation user
    const invitationUser: UserSearchResult = {
      id: `invitation-${Date.now()}`,
      name: searchValue.split("@")[0], // Use email prefix as name
      email: searchValue,
      role: "Invited",
    };

    onUserSelect(invitationUser);
    setSearchValue("");
    setOpen(false);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showEmailInvitation =
    searchValue.trim() &&
    isValidEmail(searchValue) &&
    filteredUsers.length === 0;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setOpen(true)}
              className="pl-10"
              disabled={disabled}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandList>
              {filteredUsers.length === 0 &&
                !showEmailInvitation &&
                searchValue.trim() && (
                  <CommandEmpty>No users found.</CommandEmpty>
                )}

              {filteredUsers.length > 0 && (
                <CommandGroup heading="Users">
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleUserSelect(user)}
                      className="flex items-center space-x-3 p-3 cursor-pointer"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.department && (
                          <p className="text-xs text-gray-400 truncate">
                            {user.department} • {user.role}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {showEmailInvitation && (
                <CommandGroup heading="Invite by Email">
                  <CommandItem
                    onSelect={handleEmailInvitation}
                    className="flex items-center space-x-3 p-3 cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Invite {searchValue}
                      </p>
                      <p className="text-sm text-gray-500">
                        Send invitation to this email
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Duplicate Names Dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Multiple users found</h3>
            <p className="text-sm text-gray-600 mb-4">
              Multiple users have the same name. Please select the correct one:
            </p>
            <div className="space-y-2 mb-4">
              {duplicateUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDuplicateSelect(user)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 text-left"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-gray-400">
                        {user.department} • {user.role}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDuplicateDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
