import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Accordion,
} from "@/components/ui";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Milestone, Task } from "../shared/types";
import { calculateMilestoneProgress } from "../shared/utils";
import { MilestoneCard } from "./milestone";
import { ProjectTask } from "@/types/task";

interface MilestoneTabProps {
  milestones: Array<{
    id: string;
    name: string;
    description: string | null;
    deadline: string | null;
    status: string;
    tasks: ProjectTask[] | null;
  }>;
}

const MilestoneTab: React.FC<MilestoneTabProps> = ({
  milestones: apiMilestones,
}) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const loadMilestonesAndTasks = useCallback(async () => {
    try {
      // Handle case where apiMilestones might be empty or undefined
      if (!apiMilestones || apiMilestones.length === 0) {
        setMilestones([]);
        return;
      }

      // Convert API milestones to component format
      const convertedMilestones: Milestone[] = apiMilestones.map(
        (apiMilestone) => {
          // Convert ProjectTask[] to Task[]
          const convertedTasks: Task[] = (apiMilestone.tasks || []).map(
            (projectTask) => ({
              id: projectTask.id,
              title: projectTask.name,
              description: projectTask.description,
              assignedTo: undefined, // ProjectTask doesn't have direct assignee, would need member-tasks
              status:
                projectTask.status === "completed"
                  ? "Completed"
                  : projectTask.status === "in_progress"
                  ? "In Progress"
                  : "To Do",
              priority:
                projectTask.priority === "high"
                  ? "High"
                  : projectTask.priority === "medium"
                  ? "Medium"
                  : "Low",
              dueDate: projectTask.endDate,
              createdAt: projectTask.startDate,
              completedAt: projectTask.deliveryDate,
              "start-date": projectTask.startDate || "",
              "end-date": projectTask.endDate || "",
              "member-tasks": "", // Empty for now
            })
          );

          return {
            id: apiMilestone.id,
            name: apiMilestone.name,
            description: apiMilestone.description || "",
            deadline: apiMilestone.deadline || "",
            status:
              apiMilestone.status === "completed"
                ? "Completed"
                : apiMilestone.status === "in_progress"
                ? "In Progress"
                : apiMilestone.status === "created"
                ? "Not Started"
                : "Not Started",
            progress: calculateMilestoneProgress(convertedTasks),
            "start-date": apiMilestone.deadline || "", // Use deadline as start-date for now
            "end-date": apiMilestone.deadline || "", // Use deadline as end-date for now
            tasks: convertedTasks,
          };
        }
      );

      setMilestones(convertedMilestones);
    } catch (error) {
      console.error("Error loading milestones:", error);
      setMilestones([]);
    }
  }, [apiMilestones]);

  useEffect(() => {
    loadMilestonesAndTasks();
  }, [loadMilestonesAndTasks]);

  // Statistics calculations
  const completedMilestones = milestones.filter(
    (m) => m.status === "Completed"
  ).length;
  const inProgressMilestones = milestones.filter(
    (m) => m.status === "In Progress"
  ).length;
  const notStartedMilestones = milestones.filter(
    (m) => m.status === "Not Started"
  ).length;
  const totalTasks = milestones.reduce(
    (total, m) => total + (m.tasks?.length || 0),
    0
  );
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                Project Milestones
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Track your project's milestone progress and tasks
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-lg font-semibold text-green-800">
                {completedMilestones}
              </p>
              <p className="text-sm text-green-700">Completed</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-lg font-semibold text-blue-800">
                {inProgressMilestones}
              </p>
              <p className="text-sm text-blue-700">In Progress</p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-lg font-semibold text-orange-800">
                {notStartedMilestones}
              </p>
              <p className="text-sm text-orange-700">Not Started</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {totalTasks}
              </p>
              <p className="text-sm text-gray-700">Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
          </div>

          {milestones.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-gray-500 border rounded-lg bg-gray-50">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No milestones found</p>
              <p className="text-sm text-gray-400 mt-1">
                Milestones will appear here once they are created for this
                project.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneTab;
