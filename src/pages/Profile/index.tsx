import React, { useState, useEffect } from "react";
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
  // Clock,
  Star,
  Award,
  BookOpen,
  Building,
  Globe,
  Facebook,
  Linkedin,
} from "lucide-react";
import { format } from "date-fns";
import { validateEmail, validateRequired } from "@/utils";
import { useAccountInfo } from "@/hooks/queries";
import { ScientificCV } from "@/components/profile/ScientificCV";

const Profile: React.FC = () => {
  const { data: accountInfo } = useAccountInfo();

  // Initialize state with empty values that will be populated when accountInfo loads
  const [user, setUser] = useState({
    id: "",
    identityCode: "",
    name: "",
    email: "",
    alternativeEmail: "",
    phone: "",
    address: "",
    dateOfBirth: null as Date | null,
    gender: "",
    website: "",
    facebookUrl: "",
    linkedInUrl: "",
    avatar: "",
    bio: "",
    degree: "",
    degreeType: "",
    proficiencyLevel: "",
    companyName: "",
    createTime: null as Date | null,
    status: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    alternativeEmail: "",
    phone: "",
    address: "",
    bio: "",
    website: "",
    facebookUrl: "",
    linkedInUrl: "",
    companyName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Update user state when accountInfo changes
  useEffect(() => {
    if (accountInfo) {
      const userData = {
        id: accountInfo.id || "",
        identityCode: accountInfo["identity-code"] || "",
        name: accountInfo["full-name"] || "",
        email: accountInfo.email || "",
        alternativeEmail: accountInfo["alternative-email"] || "",
        phone: accountInfo["phone-number"] || "",
        address: accountInfo.address || "",
        dateOfBirth: accountInfo["date-of-birth"]
          ? new Date(accountInfo["date-of-birth"])
          : null,
        gender: accountInfo.gender || "",
        website: accountInfo.website || "",
        facebookUrl: accountInfo["facebook-url"] || "",
        linkedInUrl: accountInfo["linked-in-url"] || "",
        avatar: accountInfo["avatar-url"] || "",
        bio: accountInfo.bio || "",
        degree: accountInfo.degree || "",
        degreeType: accountInfo["degree-type"] || "",
        proficiencyLevel: accountInfo["proficiency-level"] || "",
        companyName: accountInfo["company-name"] || "",
        createTime: accountInfo["create-time"]
          ? new Date(accountInfo["create-time"])
          : null,
        status: accountInfo.status || "",
      };

      setUser(userData);
      setEditData({
        name: userData.name,
        email: userData.email,
        alternativeEmail: userData.alternativeEmail,
        phone: userData.phone,
        address: userData.address,
        bio: userData.bio,
        website: userData.website,
        facebookUrl: userData.facebookUrl,
        linkedInUrl: userData.linkedInUrl,
        companyName: userData.companyName,
      });
    }
  }, [accountInfo]);

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

    // Validate alternative email (optional)
    if (
      editData.alternativeEmail &&
      !validateEmail(editData.alternativeEmail)
    ) {
      newErrors.alternativeEmail = "Please enter a valid email address";
    }

    // Validate phone (optional)
    if (editData.phone && editData.phone.length > 0) {
      const cleanPhone = editData.phone.replace(/[\s\-()]/g, "");
      if (!/^[+]?[1-9][\d]{0,15}$/.test(cleanPhone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Validate website URL (optional)
    if (editData.website && editData.website.length > 0) {
      try {
        new URL(editData.website);
      } catch {
        newErrors.website = "Please enter a valid URL";
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
      alternativeEmail: user.alternativeEmail,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      website: user.website,
      facebookUrl: user.facebookUrl,
      linkedInUrl: user.linkedInUrl,
      companyName: user.companyName,
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

  // Show loading state while data is being fetched
  if (!accountInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
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
                    {user.name || "Unknown User"}
                  </h1>
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Shield className="w-4 h-4 mr-1" />
                    {user.status?.charAt(0).toUpperCase() +
                      user.status?.slice(1) || "Active"}
                  </Badge>
                </div>
                <p className="text-xl text-white/90 mb-2">
                  {user.identityCode && `ID: ${user.identityCode}`}
                  {user.degree &&
                    user.degreeType &&
                    ` • ${user.degree} (${user.degreeType})`}
                </p>
                <div className="flex items-center gap-4 text-white/80">
                  {user.proficiencyLevel && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">
                        {user.proficiencyLevel}
                      </span>
                    </div>
                  )}
                  {user.companyName && (
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{user.companyName}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.address}</span>
                    </div>
                  )}
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
          {/* Left Column - Info & Links */}
          <div className="space-y-6">
            {/* Account Details */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Identity Code
                  </span>
                  <span className="font-bold text-emerald-600 text-lg">
                    {user.identityCode || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-600 font-medium">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {user.status?.charAt(0).toUpperCase() +
                      user.status?.slice(1) || "Active"}
                  </Badge>
                </div>
                {user.createTime && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Member Since
                    </span>
                    <span className="font-bold text-gray-800">
                      {format(new Date(user.createTime), "MMM yyyy")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education & Professional */}
            {(user.degree || user.degreeType || user.proficiencyLevel) && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    Education & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.degree && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 block">
                          {user.degree}
                        </span>
                        {user.degreeType && (
                          <span className="text-sm text-gray-500">
                            {user.degreeType}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {user.proficiencyLevel && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        Proficiency: {user.proficiencyLevel}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {(user.website || user.facebookUrl || user.linkedInUrl) && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-gray-700">Website</span>
                    </a>
                  )}
                  {user.facebookUrl && (
                    <a
                      href={user.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-700">
                        Facebook
                      </span>
                    </a>
                  )}
                  {user.linkedInUrl && (
                    <a
                      href={user.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <span className="font-medium text-gray-700">
                        LinkedIn
                      </span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scientific CV Section */}
            <ScientificCV className="border-0 shadow-lg bg-white" />

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
                          {user.name || "Not provided"}
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
                          {user.email || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Alternative Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      Alternative Email
                    </Label>
                    {isEditing ? (
                      <div>
                        <Input
                          type="email"
                          value={editData.alternativeEmail}
                          onChange={(e) =>
                            handleInputChange(
                              "alternativeEmail",
                              e.target.value
                            )
                          }
                          placeholder="Alternative email address"
                          className={`transition-all duration-200 ${
                            errors.alternativeEmail
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                          }`}
                        />
                        {errors.alternativeEmail && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            {errors.alternativeEmail}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.alternativeEmail || "Not provided"}
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
                          {user.phone || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Address
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Your address"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.address || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-600" />
                      Company
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        placeholder="Company name"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.companyName || "Not provided"}
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
                        {user.bio || "No bio provided"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Website */}
                {isEditing && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      Website
                    </Label>
                    <div>
                      <Input
                        value={editData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="https://your-website.com"
                        className={`transition-all duration-200 ${
                          errors.website
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                            : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                        }`}
                      />
                      {errors.website && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.website}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links - Edit Mode */}
                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </Label>
                      <Input
                        value={editData.facebookUrl}
                        onChange={(e) =>
                          handleInputChange("facebookUrl", e.target.value)
                        }
                        placeholder="https://facebook.com/profile"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        LinkedIn
                      </Label>
                      <Input
                        value={editData.linkedInUrl}
                        onChange={(e) =>
                          handleInputChange("linkedInUrl", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/profile"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

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
                  {user.createTime && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        Member Since
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {format(new Date(user.createTime), "MMMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                  )}

                  {user.dateOfBirth && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        Date of Birth
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {format(new Date(user.dateOfBirth), "MMMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                  )}

                  {user.gender && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        Gender
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">
                          {user.gender}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6 bg-gray-200" />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Account Status
                  </Label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-800 font-medium">
                      {user.status?.charAt(0).toUpperCase() +
                        user.status?.slice(1) || "Active"}
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {user.status === "created" ? "Account Created" : "Active"}
                    </Badge>
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
