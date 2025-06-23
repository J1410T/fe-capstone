/**
 * Example component demonstrating TanStack Query usage in SRPM
 */

import React, { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
} from "@/hooks/queries/useProjects";
import {
  useTasks,
  useCreateTask,
  useUpdateTaskStatus,
} from "@/hooks/queries/useTasks";
import { useMe, useLogin, useLogout } from "@/hooks/queries/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Example: Using Projects Query
 */
const ProjectsExample: React.FC = () => {
  const {
    data: projectsData,
    isLoading,
    error,
  } = useProjects({
    page: 1,
    limit: 10,
    status: "Active",
  });

  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();

  const handleCreateProject = () => {
    createProjectMutation.mutate({
      name: "New Research Project",
      type: "Basic",
      objective: "Research advanced algorithms",
      description: "A comprehensive study of machine learning algorithms",
    });
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading projects</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Projects
          <Button
            onClick={handleCreateProject}
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projectsData?.data.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProject(project.id)}
                disabled={deleteProjectMutation.isPending}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        {projectsData && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {projectsData.data.length} of{" "}
            {projectsData.pagination.total} projects
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Example: Using Tasks Query
 */
const TasksExample: React.FC = () => {
  const { data: tasksData, isLoading } = useTasks({
    page: 1,
    limit: 5,
  });

  const createTaskMutation = useCreateTask();
  const updateStatusMutation = useUpdateTaskStatus();

  const handleCreateTask = () => {
    createTaskMutation.mutate({
      title: "New Research Task",
      description: "Complete literature review",
      priority: "High",
      assigneeId: "user-1",
      dueDate: new Date().toISOString(),
    });
  };

  const handleUpdateStatus = (taskId: string, status: string) => {
    updateStatusMutation.mutate({ taskId, status });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tasks
          <Button
            onClick={handleCreateTask}
            disabled={createTaskMutation.isPending}
          >
            Create Task
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasksData?.data.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <span className="font-medium">{task.title}</span>
                <Badge className="ml-2" variant="outline">
                  {task.status}
                </Badge>
              </div>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(task.id, "In Progress")}
                  disabled={updateStatusMutation.isPending}
                >
                  Start
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(task.id, "Completed")}
                  disabled={updateStatusMutation.isPending}
                >
                  Complete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Example: Using Auth Query
 */
const AuthExample: React.FC = () => {
  const { data: user, isLoading } = useMe();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    loginMutation.mutate(credentials);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <Button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            variant="outline"
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Main example component
 */
const QueryExample: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">TanStack Query Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AuthExample />
        <ProjectsExample />
        <TasksExample />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          Benefits of TanStack Query
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Automatic caching and background updates</li>
          <li>Optimistic updates for better UX</li>
          <li>Error handling and retry logic</li>
          <li>Loading states management</li>
          <li>Data synchronization across components</li>
          <li>Invalidation and refetching</li>
          <li>Devtools for debugging</li>
        </ul>
      </div>
    </div>
  );
};

export default QueryExample;
