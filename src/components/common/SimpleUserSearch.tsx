import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Mail, Plus } from "lucide-react";
import { UserSearchResult } from "@/types/auth";

export interface InvitedUser extends UserSearchResult {
  isInvitation?: boolean; // true if user doesn't exist in system
  role: "Leader" | "Researcher" | "Secretary";
}

interface SimpleUserSearchProps {
  placeholder?: string;
  onUserSelect: (user: UserSearchResult) => void;
  excludeUserIds?: string[];
  className?: string;
  disabled?: boolean;
}

export const SimpleUserSearch: React.FC<SimpleUserSearchProps> = ({
  placeholder = "Search by name or email...",
  onUserSelect,
  excludeUserIds = [],
  className,
  disabled = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Filter users based on search input
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredUsers([]);
      setShowResults(false);
      return;
    }

    // const filtered = mockUsers.filter((user) => {
    //   if (excludeUserIds.includes(user.id)) return false;

    //   const searchLower = searchValue.toLowerCase();
    //   return (
    //     user.name.toLowerCase().includes(searchLower) ||
    //     user.email.toLowerCase().includes(searchLower)
    //   );
    // });

    // setFilteredUsers(filtered);
    setShowResults(true);
  }, [searchValue, excludeUserIds]);

  const handleUserSelect = (user: UserSearchResult) => {
    onUserSelect(user);
    setSearchValue("");
    setShowResults(false);
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
      role: "Researcher",
    };

    onUserSelect(invitationUser);
    setSearchValue("");
    setShowResults(false);
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
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      {/* Search Results */}
      {showResults && (searchValue.trim() || filteredUsers.length > 0) && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {/* Found Users */}
            {filteredUsers.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                  Found Users ({filteredUsers.length})
                </div>
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
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
                  </button>
                ))}
              </div>
            )}

            {/* Email Invitation Option */}
            {showEmailInvitation && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                  Invite by Email
                </div>
                <button
                  onClick={handleEmailInvitation}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-blue-50 text-left"
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
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredUsers.length === 0 &&
              !showEmailInvitation &&
              searchValue.trim() && (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No users found</p>
                  <p className="text-xs mt-1">Try searching by name or email</p>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};
