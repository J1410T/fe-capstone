import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusColor, getStatusIcon } from "../utils/statusHelpers";

interface Task {
  id: number;
  title: string;
  assignee: string;
  dueDate: string;
  status: string;
  priority: string;
}

interface TasksTabProps {
  tasks: Task[];
}

export const TasksTab: React.FC<TasksTabProps> = ({ tasks }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
          Project Tasks
        </CardTitle>
        <CardDescription className="text-sm sm:text-base mt-1">
          Manage and track project tasks and activities
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm text-gray-900 flex-1 break-words">
                  {task.title}
                </h3>
                <Badge
                  variant="outline"
                  className={getStatusColor(task.status)}
                >
                  {getStatusIcon(task.status)}
                  <span className="ml-1">{task.status}</span>
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Assignee:</span>
                  <span className="font-medium">{task.assignee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Due Date:</span>
                  <span className="font-medium">{task.dueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Priority:</span>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(task.priority)}
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs">
                View Details
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] sm:w-[300px]">
                  Task
                </TableHead>
                <TableHead className="min-w-[120px]">Assignee</TableHead>
                <TableHead className="min-w-[100px]">Due Date</TableHead>
                <TableHead className="min-w-[80px]">Priority</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="text-right min-w-[100px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium text-sm break-words">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-sm">{task.assignee}</TableCell>
                  <TableCell className="text-sm">{task.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getPriorityColor(task.priority)} text-xs`}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(task.status)} text-xs`}
                    >
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
