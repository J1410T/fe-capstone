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

interface ConfigItem {
  id: string;
  configKey: string;
  configValue: string;
  configType: string;
  description: string | null;
  lastUpdate: string;
  createDate: string;
}

const ConfigSystemManagement: React.FC = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<ConfigItem | null>(null);
  // Mock data dựa trên hình ảnh database
  useEffect(() => {
    const mockConfigs: ConfigItem[] = [
      {
        id: "1",
        configKey: "otp.attempt",
        configValue: "3",
        configType: "security",
        description: null,
        lastUpdate: "2025-08-10 21:16:49.4766667",
        createDate: "2025-08-10 21:16:49.4766667",
      },
      {
        id: "2",
        configKey: "access.system",
        configValue: "fe.edu.vn",
        configType: "email",
        description: null,
        lastUpdate: "2025-08-10 21:16:49.4766667",
        createDate: "2025-08-10 21:16:49.4766667",
      },
      {
        id: "3",
        configKey: "system",
        configValue: "no.reply.service.dev@gmail.com",
        configType: "email",
        description: null,
        lastUpdate: "2025-08-10 21:16:49.4766667",
        createDate: "2025-08-10 21:16:49.4766667",
      },
      {
        id: "4",
        configKey: "fund.request.to",
        configValue: "50000000",
        configType: "finance",
        description: null,
        lastUpdate: "2025-08-10 21:16:49.4766667",
        createDate: "2025-08-10 21:16:49.4766667",
      },
      {
        id: "5",
        configKey: "access.system",
        configValue: "fpt.edu.vn",
        configType: "email",
        description: null,
        lastUpdate: "2025-08-10 21:16:49.4766667",
        createDate: "2025-08-10 21:16:49.4766667",
      },
      {
        id: "6",
        configKey: "otp.ttl",
        configValue: "5",
        configType: "security",
        description: null,
        lastUpdate: "2025-08-10 21:16:49.4766667",
        createDate: "2025-08-10 21:16:49.4766667",
      },
      {
        id: "7",
        configKey: "fund.request.from",
        configValue: "7000000",
        configType: "finance",
        description: null,
        lastUpdate: "2025-08-10 21:16:49.4766667",
        createDate: "2025-08-10 21:16:49.4766667",
      },
    ];

    setTimeout(() => {
      setConfigs(mockConfigs);
      setLoading(false);
    }, 1000);
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

  const handleSaveConfig = () => {
    if (editingConfig) {
      // Update existing config
      setConfigs(
        configs.map((config) =>
          config.id === editingConfig.id
            ? { ...editingConfig, lastUpdate: new Date().toISOString() }
            : config
        )
      );
      setEditingConfig(null);
      toast.success("Cấu hình đã được cập nhật thành công!");
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Dữ liệu đã được làm mới!");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải cấu hình hệ thống...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Cấu hình Hệ thống
          </h1>
          <p className="text-muted-foreground">
            Quản lý các cấu hình và tham số hệ thống
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Configs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Danh sách Cấu hình ({configs.length})
          </CardTitle>
          <CardDescription>Tất cả cấu hình hệ thống hiện tại</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khóa cấu hình</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Cập nhật lần cuối</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">
                    {editingConfig?.id === config.id ? (
                      <Input
                        value={editingConfig.configKey}
                        onChange={(e) =>
                          setEditingConfig({
                            ...editingConfig,
                            configKey: e.target.value,
                          })
                        }
                      />
                    ) : (
                      config.configKey
                    )}
                  </TableCell>
                  <TableCell>
                    {editingConfig?.id === config.id ? (
                      <Input
                        value={editingConfig.configValue}
                        onChange={(e) =>
                          setEditingConfig({
                            ...editingConfig,
                            configValue: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {config.configValue}
                      </code>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getConfigTypeBadgeColor(config.configType)}
                    >
                      <span className="flex items-center gap-1">
                        {getConfigTypeIcon(config.configType)}
                        {config.configType}
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
                        placeholder="Thêm mô tả..."
                      />
                    ) : (
                      config.description || (
                        <span className="text-muted-foreground">Không có</span>
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(config.lastUpdate).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {editingConfig?.id === config.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveConfig}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingConfig(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingConfig(config)}
                      >
                        Sửa
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigSystemManagement;
