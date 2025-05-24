import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge"; // Unused import
import { Separator } from "@/components/ui/separator";
import {
  Moon,
  Sun,
  Bell,
  Mail,
  // MessageSquare, // Unused import
  Shield,
  Globe,
  Clock,
  Save,
  Smartphone,
  Monitor,
  Volume2,
  // VolumeX // Unused import,
} from "lucide-react";

// Mock settings data
const mockSettings = {
  theme: "light" as "light" | "dark" | "system",
  language: "en",
  timezone: "America/New_York",
  notifications: {
    email: true,
    push: true,
    desktop: false,
    sound: true,
    taskUpdates: true,
    projectUpdates: true,
    mentions: true,
    deadlines: true,
  },
  privacy: {
    profileVisibility: "team" as "public" | "team" | "private",
    activityStatus: true,
    lastSeen: false,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium" as "small" | "medium" | "large",
  },
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as Record<string, any>),
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleDirectChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      // Show success message (you could add a toast here)
    }, 1000);
  };

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "zh", label: "中文" },
  ];

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Settings
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Customize your experience and manage your preferences
              </p>
            </div>
            {hasChanges && (
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Appearance */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Theme
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleDirectChange("theme", value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      settings.theme === value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                    <div className="text-sm font-medium text-slate-700">
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Language
              </Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleDirectChange("language", value)}
              >
                <SelectTrigger className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Timezone
              </Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleDirectChange("timezone", value)}
              >
                <SelectTrigger className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notification Channels */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-slate-700">
                Notification Channels
              </Label>

              <div className="space-y-3">
                {[
                  { key: "email", label: "Email Notifications", icon: Mail },
                  {
                    key: "push",
                    label: "Push Notifications",
                    icon: Smartphone,
                  },
                  {
                    key: "desktop",
                    label: "Desktop Notifications",
                    icon: Monitor,
                  },
                  { key: "sound", label: "Sound Notifications", icon: Volume2 },
                ].map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {label}
                      </span>
                    </div>
                    <Switch
                      checked={
                        settings.notifications[
                          key as keyof typeof settings.notifications
                        ]
                      }
                      onCheckedChange={(checked) =>
                        handleSettingChange("notifications", key, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-200" />

            {/* Notification Types */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-slate-700">
                What to notify me about
              </Label>

              <div className="space-y-3">
                {[
                  {
                    key: "taskUpdates",
                    label: "Task Updates",
                    description:
                      "When tasks are assigned, updated, or completed",
                  },
                  {
                    key: "projectUpdates",
                    label: "Project Updates",
                    description: "When projects have new updates or milestones",
                  },
                  {
                    key: "mentions",
                    label: "Mentions",
                    description:
                      "When someone mentions you in comments or discussions",
                  },
                  {
                    key: "deadlines",
                    label: "Deadline Reminders",
                    description: "Reminders for upcoming task deadlines",
                  },
                ].map(({ key, label, description }) => (
                  <div
                    key={key}
                    className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-700">
                        {label}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {description}
                      </div>
                    </div>
                    <Switch
                      checked={
                        settings.notifications[
                          key as keyof typeof settings.notifications
                        ]
                      }
                      onCheckedChange={(checked) =>
                        handleSettingChange("notifications", key, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Visibility */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Profile Visibility
              </Label>
              <Select
                value={settings.privacy.profileVisibility}
                onValueChange={(value) =>
                  handleSettingChange("privacy", "profileVisibility", value)
                }
              >
                <SelectTrigger className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-xs text-slate-500">
                        Visible to everyone
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="team">
                    <div>
                      <div className="font-medium">Team Only</div>
                      <div className="text-xs text-slate-500">
                        Visible to team members only
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-xs text-slate-500">
                        Only visible to you
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activity Status */}
            <div className="space-y-3">
              {[
                {
                  key: "activityStatus",
                  label: "Show Activity Status",
                  description: "Let others see when you're online or active",
                },
                {
                  key: "lastSeen",
                  label: "Show Last Seen",
                  description:
                    "Display when you were last active to team members",
                },
              ].map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-700">
                      {label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {description}
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(
                      settings.privacy[key as keyof typeof settings.privacy]
                    )}
                    onCheckedChange={(checked) =>
                      handleSettingChange("privacy", key, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Role Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Member Account
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  You have member-level access. Some advanced settings are only
                  available to team leaders and administrators.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
