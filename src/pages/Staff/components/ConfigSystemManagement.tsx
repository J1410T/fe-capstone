import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Settings,
  Database,
  Mail,
  Shield,
  Globe,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  systemConfigService,
  ConfigItem,
} from "@/services/resources/systemConfigService";

const ConfigSystemManagement: React.FC = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConfigItem | null>(null);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const data = await systemConfigService.getAllConfigs();
      // Filter out null/invalid items and ensure proper structure
      const validConfigs = data.filter(
        (config) =>
          config &&
          config.id &&
          config["config-key"] !== undefined &&
          config["config-value"] !== undefined &&
          config["config-type"] !== undefined
      );
      setConfigs(validConfigs);
      toast.success("Data loaded successfully!");
    } catch (error) {
      console.error("Error fetching configs:", error);
      toast.error("Failed to load configuration data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const getConfigTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "finance":
        return <Database className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getConfigTypeBadgeColor = (type: string) => {
    switch (type) {
      case "security":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "email":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "finance":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "system":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleSaveConfig = async () => {
    if (editingConfig) {
      setSaving(true);
      try {
        await systemConfigService.updateConfig(editingConfig.id, {
          "config-key": editingConfig["config-key"],
          "config-value": editingConfig["config-value"],
          "config-type": editingConfig["config-type"],
          description: editingConfig.description || undefined,
        });

        // Clear editing state first
        setEditingConfig(null);

        // Auto refresh to get latest data from server
        await fetchConfigs();

        toast.success("Configuration updated successfully!");
      } catch (error) {
        console.error("Error updating config:", error);
        toast.error("Failed to update configuration!");
        // Don't clear editing state on error so user can retry
      } finally {
        setSaving(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchConfigs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Configuration Management
          </h1>
          <p className="text-muted-foreground">Manage system configurations</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Configs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configurations ({configs.length})
          </CardTitle>
          <CardDescription>All system configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => {
                // Safety check for each config item
                if (!config || !config.id) {
                  return null;
                }

                return (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">
                      {editingConfig?.id === config.id ? (
                        <Input
                          value={editingConfig["config-key"] || ""}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              "config-key": e.target.value,
                            })
                          }
                        />
                      ) : (
                        config["config-key"] || "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingConfig?.id === config.id ? (
                        <Input
                          value={editingConfig["config-value"] || ""}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              "config-value": e.target.value,
                            })
                          }
                        />
                      ) : (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {config["config-value"] || "N/A"}
                        </code>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getConfigTypeBadgeColor(
                          config["config-type"] || "system"
                        )}
                      >
                        <span className="flex items-center gap-1">
                          {getConfigTypeIcon(config["config-type"] || "system")}
                          {config["config-type"] || "system"}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {editingConfig?.id === config.id ? (
                        <Input
                          value={editingConfig.description || ""}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              description: e.target.value,
                            })
                          }
                          placeholder="Add description..."
                        />
                      ) : (
                        config.description || (
                          <span className="text-muted-foreground">
                            No description
                          </span>
                        )
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {config["last-update"]
                        ? new Date(config["last-update"]).toLocaleDateString(
                            "en-US"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {editingConfig?.id === config.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveConfig}
                            disabled={saving}
                          >
                            {saving ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingConfig(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingConfig(config)}
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigSystemManagement;
