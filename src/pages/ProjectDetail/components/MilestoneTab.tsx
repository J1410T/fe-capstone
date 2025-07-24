import React, { useState, useEffect, useCallback } from "react";
import { Card, Accordion } from "@/components/ui";
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
    <Card className="bg-white shadow rounded-md border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b bg-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Project Milestones Overview
        </h2>
        <p className="text-sm text-gray-600">
          View your project's milestone progress
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div className="bg-green-50 rounded p-2 border border-green-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">
                {completedMilestones}
              </p>
              <p className="text-xs text-green-700">Completed</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded p-2 border border-blue-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-800">
                {inProgressMilestones}
              </p>
              <p className="text-xs text-blue-700">In Progress</p>
            </div>
          </div>
          <div className="bg-orange-50 rounded p-2 border border-orange-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-800">
                {notStartedMilestones}
              </p>
              <p className="text-xs text-orange-700">Not Started</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded p-2 border border-gray-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-800">{totalTasks}</p>
              <p className="text-xs text-gray-700">Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-gray-800">Milestones</h3>
          </div>

          {milestones.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-1">
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-6 text-sm text-gray-500 border rounded bg-gray-50">
              <p>No milestones found for this project.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MilestoneTab;
