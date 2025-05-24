import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

// Mock user data
const mockUser = {
  id: "user1",
  name: "Sarah Chen",
  email: "sarah.chen@company.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  role: "Senior Developer",
  department: "Engineering",
  avatar: "",
  joinDate: "2023-03-15T10:00:00Z",
  lastLogin: "2024-01-25T14:30:00Z",
  bio: "Passionate full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Love building scalable applications and mentoring junior developers.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  isLeader: true,
};

const Profile: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!editData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      editData.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(editData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        ...editData,
      }));
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Profile
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage your personal information and account settings
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 border-slate-300"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {user.name}
                  </h2>
                  {user.isLeader && (
                    <Badge className="bg-blue-100 text-blue-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Leader
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 mb-1">
                  {user.role} • {user.department}
                </p>
                <p className="text-sm text-slate-500 mb-4">{user.email}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Full Name
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{user.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{user.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Phone Number
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={`${
                      errors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{user.phone}</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Location
              </Label>
              {isEditing ? (
                <Input
                  value={editData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="City, State/Country"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{user.location}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Bio</Label>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Member Since
                </Label>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    {format(new Date(user.joinDate), "MMMM dd, yyyy")}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Last Login
                </Label>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    {format(
                      new Date(user.lastLogin),
                      "MMM dd, yyyy 'at' HH:mm"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-200" />

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Account Type
              </Label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">
                  {user.isLeader ? "Leader Account" : "Member Account"}
                </span>
                {user.isLeader && (
                  <Badge className="bg-blue-100 text-blue-700 ml-2">
                    Full Access
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
