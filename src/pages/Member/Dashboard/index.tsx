import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "./components/DashboardOverview";
import { RecentTaskList } from "./components/RecentTaskList";
import { AnalyticsCharts } from "./components/AnalyticsCharts";
import { FundingRequestList } from "./components/FundingRequestList";
import { BarChart3, CheckSquare, TrendingUp, DollarSign } from "lucide-react";

const MemberDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Member Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage your tasks, track progress, and monitor funding requests
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Recent Tasks</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="funding" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <DollarSign className="w-4 h-4" />
              <span>Funding</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <RecentTaskList />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsCharts />
          </TabsContent>

          <TabsContent value="funding" className="space-y-6">
            <FundingRequestList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberDashboard;
