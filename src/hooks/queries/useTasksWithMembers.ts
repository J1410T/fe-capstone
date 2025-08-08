import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMemberTasksByTaskId,
  getTasksByMilestoneId,
} from "@/services/resources/task";
import { MemberTask, ProjectTask } from "@/types/task";
import {
  getAccountById,
  getUserRolesByProjectId,
} from "@/services/resources/auth";
import { UserRole } from "@/types/auth";

// Task interface compatible with TaskTable component
interface TaskTableTask {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed" | "Overdue";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  projectTag: string;
  "member-tasks": Array<{
    id: string;
    "member-id": string;
    member: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

// Helper function to transform task status
const transformTaskStatus = (
  status: string
): "To Do" | "In Progress" | "Completed" | "Overdue" => {
  switch (status?.toLowerCase()) {
    case "todo":
    case "not started":
    case "to do":
      return "To Do";
    case "inprogress":
    case "in progress":
      return "In Progress";
    case "completed":
    case "complete":
      return "Completed";
    case "overdue":
      return "Overdue";
    default:
      return "To Do";
  }
};

// Helper function to transform task priority
const transformTaskPriority = (priority: string): "Low" | "Medium" | "High" => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    default:
      return "Medium";
  }
};

export function useTasksWithMembersByMilestoneId(
  milestoneId: string,
  projectId?: string
) {
  const [tasks, setTasks] = useState<TaskTableTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Create a unique query key for this hook to make it reactive to invalidations
  const queryKey = ["tasks-with-members", milestoneId, projectId];

  // Use React Query to make this hook reactive to query invalidations
  const { data: queryTrigger } = useQuery({
    queryKey,
    queryFn: () => {
      const timestamp = Date.now();
      return timestamp;
    },
    enabled: !!milestoneId,
    staleTime: 0, // Always consider stale to ensure fresh data
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!milestoneId) {
        setTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const taskResponse = await getTasksByMilestoneId(milestoneId, 1, 100);
        const taskList: ProjectTask[] = taskResponse.data["data-list"] || [];

        // If projectId is provided, fetch all user roles for the project to get member info efficiently
        let projectUserRoles: UserRole[] = [];
        if (projectId) {
          try {
            const userRolesResponse = await getUserRolesByProjectId(
              projectId,
              1,
              100
            );
            projectUserRoles = userRolesResponse["data-list"] || [];
            console.log("✅ Fetched user roles:", {
              projectId,
              userRolesCount: projectUserRoles.length,
              userRoles: projectUserRoles.map((ur) => ({
                id: ur.id,
                accountId: ur["account-id"],
                fullName: ur["full-name"],
                avatarUrl: ur["avatar-url"],
              })),
            });
          } catch (userRoleError) {
            console.error(
              "❌ Error fetching user roles for project:",
              userRoleError
            );
          }
        }

        const enrichedTasks: TaskTableTask[] = await Promise.all(
          taskList.map(async (task: ProjectTask) => {
            try {
              // First, try to use member-tasks from the task response if available
              let memberTasksWithDetails: Array<{
                id: string;
                "member-id": string;
                member: {
                  id: string;
                  name: string;
                  avatarUrl: string;
                };
              }> = [];

              if (task["member-tasks"] && task["member-tasks"].length > 0) {
                console.log(
                  `🔍 Using member-tasks from task response for ${task.name}:`,
                  {
                    memberTasksCount: task["member-tasks"].length,
                    memberTasks: task["member-tasks"].map((mt) => ({
                      id: mt.id,
                      memberId: mt.memberId,
                      fullName: mt["full-name"],
                      avatarUrl: mt["avatar-url"],
                      roleName: mt["role-name"],
                      status: mt.status,
                    })),
                  }
                );

                // Use member data directly from the task response (no additional API calls needed!)
                memberTasksWithDetails = task["member-tasks"].map(
                  (memberTask) => {
                    console.log(
                      `✅ Using member data from API response for ${memberTask.memberId}:`,
                      {
                        fullName: memberTask["full-name"],
                        avatarUrl: memberTask["avatar-url"],
                        roleName: memberTask["role-name"],
                      }
                    );

                    return {
                      id: memberTask.id,
                      "member-id": memberTask.memberId,
                      member: {
                        id: memberTask.memberId,
                        name: memberTask["full-name"] || "Unknown Member",
                        avatarUrl: memberTask["avatar-url"] || "",
                      },
                    };
                  }
                );
              } else {
                // Fallback: Get member tasks separately if not included in task response
                const memberResponse = await getMemberTasksByTaskId(task.id);
                const memberTasks: MemberTask[] =
                  memberResponse["data-list"] || [];

                console.log(
                  `🔍 Member tasks from separate API for task ${task.name}:`,
                  {
                    memberTasksCount: memberTasks.length,
                    memberTasks: memberTasks.map((mt) => ({
                      id: mt.id,
                      memberId: mt.memberId,
                      status: mt.status,
                    })),
                  }
                );

                // Fetch member details for each member task
                memberTasksWithDetails = await Promise.all(
                  memberTasks.map(async (memberTask) => {
                    try {
                      // Fetch member details
                      const memberDetails = await getAccountById(
                        memberTask.memberId
                      );

                      return {
                        id: memberTask.id,
                        "member-id": memberTask.memberId,
                        member: {
                          id: memberTask.memberId,
                          name: memberDetails["full-name"] || "Unknown Member",
                          avatarUrl: memberDetails["avatar-url"] || "",
                        },
                      };
                    } catch (memberError) {
                      console.error(
                        `Error fetching member details for ${memberTask.memberId}:`,
                        memberError
                      );
                      // Return fallback member data
                      return {
                        id: memberTask.id,
                        "member-id": memberTask.memberId,
                        member: {
                          id: memberTask.memberId,
                          name: "Unknown Member",
                          avatarUrl: "",
                        },
                      };
                    }
                  })
                );
              }

              // Automatic overdue status logic: Set status to "Overdue" if end-date is past today
              // and the task is not already completed, regardless of the stored status
              let isOverdue = false;
              if (task["end-date"] && task["end-date"] !== "null") {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
                const endDate = new Date(task["end-date"]);
                endDate.setHours(0, 0, 0, 0); // Reset time to start of day

                isOverdue =
                  endDate < today &&
                  task.status.toLowerCase() !== "completed" &&
                  task.status.toLowerCase() !== "complete";
              }
              const finalStatus = isOverdue
                ? "Overdue"
                : transformTaskStatus(task.status);

              // Transform ProjectTask to TaskTableTask format
              return {
                id: task.id,
                title: task.name,
                description: task.description,
                status: finalStatus,
                dueDate: task["end-date"] || "", // Map end-date to dueDate for TaskTable, handle null
                priority: transformTaskPriority(task.priority),
                projectTag: task.code || "Task",
                "member-tasks": memberTasksWithDetails,
                createdAt: task["start-date"] || "", // Map start-date to createdAt, handle null
                updatedAt: task["start-date"] || "", // Using start-date as fallback since API doesn't provide updated date
              };
            } catch (taskError) {
              console.error(`Error processing task ${task.id}:`, taskError);

              // Apply automatic overdue status logic even in error case
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const endDate = new Date(task["end-date"]);
              endDate.setHours(0, 0, 0, 0);

              const isOverdue =
                endDate < today &&
                task.status.toLowerCase() !== "completed" &&
                task.status.toLowerCase() !== "complete";
              const finalStatus = isOverdue
                ? "Overdue"
                : transformTaskStatus(task.status);

              // Return task with empty member tasks on error
              return {
                id: task.id,
                title: task.name,
                description: task.description,
                status: finalStatus,
                dueDate: task["end-date"], // Map end-date to dueDate
                priority: transformTaskPriority(task.priority),
                projectTag: task.code || "Task",
                "member-tasks": [],
                createdAt: task["start-date"], // Map start-date to createdAt
                updatedAt: task["start-date"],
              };
            }
          })
        );

        setTasks(enrichedTasks);
      } catch (err) {
        console.error("❌ Error fetching tasks and members:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tasks");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [milestoneId, projectId, queryTrigger]);

  return { tasks, loading, error };
}
