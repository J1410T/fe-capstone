import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Test page to demonstrate redirect behavior and navigation guard functionality
 * This page allows testing various navigation patterns that should trigger unauthorized access
 */
const TestRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testRedirectChain = async () => {
    addTestResult("Starting redirect chain test...");
    
    // Simulate rapid redirects that should trigger unauthorized access
    setTimeout(() => {
      addTestResult("Navigating to /dashboard");
      navigate("/dashboard");
    }, 100);
    
    setTimeout(() => {
      addTestResult("Navigating to /home");
      navigate("/home");
    }, 300);
    
    setTimeout(() => {
      addTestResult("Navigating to /dashboard again");
      navigate("/dashboard");
    }, 500);
    
    setTimeout(() => {
      addTestResult("Navigating to /staff/dashboard (should trigger unauthorized)");
      navigate("/staff/dashboard");
    }, 700);
  };

  const testCrossRoleNavigation = async () => {
    addTestResult("Starting cross-role navigation test...");
    
    // Navigate to different role-specific routes rapidly
    setTimeout(() => {
      addTestResult("Navigating to /researcher/projects");
      navigate("/researcher/projects");
    }, 100);
    
    setTimeout(() => {
      addTestResult("Navigating to /staff/dashboard");
      navigate("/staff/dashboard");
    }, 300);
    
    setTimeout(() => {
      addTestResult("Navigating to /host/dashboard");
      navigate("/host/dashboard");
    }, 500);
  };

  const testDirectUnauthorizedAccess = () => {
    addTestResult("Testing direct unauthorized access...");
    
    // Try to access a route that requires different permissions
    const unauthorizedRoutes = [
      "/staff/dashboard",
      "/host/dashboard", 
      "/pi/dashboard",
      "/council/evaluations"
    ];
    
    const randomRoute = unauthorizedRoutes[Math.floor(Math.random() * unauthorizedRoutes.length)];
    addTestResult(`Attempting to access ${randomRoute}`);
    navigate(randomRoute);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Guard Test Page</CardTitle>
          <CardDescription>
            Test various navigation patterns to verify unauthorized access detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Current User:</span>
            <Badge variant="outline">{user?.name || "Unknown"}</Badge>
            <Badge variant="secondary">{user?.role || "No Role"}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={testRedirectChain}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <span className="font-medium">Test Redirect Chain</span>
              <span className="text-xs text-muted-foreground mt-1">
                Rapid redirects between dashboard routes
              </span>
            </Button>
            
            <Button 
              onClick={testCrossRoleNavigation}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <span className="font-medium">Test Cross-Role Navigation</span>
              <span className="text-xs text-muted-foreground mt-1">
                Navigate between different role routes
              </span>
            </Button>
            
            <Button 
              onClick={testDirectUnauthorizedAccess}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <span className="font-medium">Test Direct Unauthorized</span>
              <span className="text-xs text-muted-foreground mt-1">
                Direct access to unauthorized route
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Navigation attempts and their outcomes
            </CardDescription>
          </div>
          <Button onClick={clearResults} variant="outline" size="sm">
            Clear Results
          </Button>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No test results yet. Click a test button above to start.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className="text-sm p-2 bg-muted rounded font-mono"
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <strong>Redirect Chain Test:</strong> Should detect multiple redirects and trigger unauthorized access
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <strong>Cross-Role Navigation:</strong> Should detect attempts to access different role routes and block access
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <strong>Direct Unauthorized:</strong> Should immediately redirect to unauthorized page for role-restricted routes
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestRedirect;
