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
  Star,
  Award,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { validateEmail, validateRequired } from "@/utils";

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
  projectsCompleted: 42,
  rating: 4.8,
  certifications: ["AWS Certified", "React Professional", "Node.js Expert"],
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
    const newErrors: { [key: string]: string } = {};

    // Validate name
    if (!validateRequired(editData.name)) {
      newErrors.name = "Name is required";
    }

    // Validate email
    if (!validateRequired(editData.email)) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(editData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate phone (optional)
    if (editData.phone && editData.phone.length > 0) {
      const cleanPhone = editData.phone.replace(/[\s\-()]/g, "");
      if (!/^[+]?[1-9][\d]{0,15}$/.test(cleanPhone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
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
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Clean Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-emerald-500 text-white text-4xl font-bold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full p-0 bg-white hover:bg-gray-50 text-gray-700 shadow-lg border-2 border-white"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* User Info */}
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold tracking-tight">
                    {user.name}
                  </h1>
                  {user.isLeader && (
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                      <Shield className="w-4 h-4 mr-1" />
                      Leader
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-white/90 mb-2">
                  {user.role} • {user.department}
                </p>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{user.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{user.projectsCompleted} Projects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-white text-emerald-600 hover:bg-gray-50 border border-white shadow-lg font-medium"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Skills */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Projects Completed
                  </span>
                  <span className="font-bold text-emerald-600 text-lg">
                    {user.projectsCompleted}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Average Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="font-bold text-gray-800 text-lg">
                      {user.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-600 font-medium">
                    RESEARCHER Since
                  </span>
                  <span className="font-bold text-gray-800">
                    {format(new Date(user.joinDate), "MMM yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 px-3 py-1.5"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-gray-700">{cert}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <div>
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`transition-all duration-200 ${
                            errors.name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <div>
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`transition-all duration-200 ${
                            errors.email
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <div>
                        <Input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                          className={`transition-all duration-200 ${
                            errors.phone
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="City, State/Country"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    About Me
                  </Label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white transition-all duration-200"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  )}
                </div>

                {/* Edit Actions */}
                {isEditing && (
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex-1 sm:flex-none"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Activity */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Account Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      RESEARCHER Since
                    </Label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-800 font-medium">
                        {format(new Date(user.joinDate), "MMMM dd, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Last Login
                    </Label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-800 font-medium">
                        {format(
                          new Date(user.lastLogin),
                          "MMM dd, yyyy 'at' HH:mm"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6 bg-gray-200" />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Account Type
                  </Label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-800 font-medium">
                      {user.isLeader ? "Leader Account" : "RESEARCHER Account"}
                    </span>
                    {user.isLeader && (
                      <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Full Access
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
