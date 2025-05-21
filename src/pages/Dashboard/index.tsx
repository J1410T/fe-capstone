import React from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Dashboard page
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your dashboard, {user?.name}!
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{user?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role:</span>
                <span className="text-sm">{user?.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Role-Specific Information</CardTitle>
            <CardDescription>Information based on your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user?.role === UserRole.STAFF && (
                <p className="text-sm">
                  As a staff member, you have access to the sidebar with
                  additional administrative features.
                </p>
              )}
              {user?.role === UserRole.MEMBER && (
                <p className="text-sm">
                  As a member, you can participate in research projects.
                </p>
              )}
              {user?.role === UserRole.APPRAISAL_COUNCIL && (
                <p className="text-sm">
                  As an appraisal council member, you can review and evaluate
                  research projects.
                </p>
              )}
              {user?.role === UserRole.HOST_INSTITUTION && (
                <p className="text-sm">
                  As a host institution, you can manage research projects hosted
                  at your institution.
                </p>
              )}
              {user?.role === UserRole.PRINCIPAL_INVESTIGATOR && (
                <p className="text-sm">
                  As a principal investigator, you can lead research projects.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
