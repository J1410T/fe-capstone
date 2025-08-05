import { useEffect, useState } from "react";
import { getMemberTasksByTaskId, getTasksByMilestoneId } from "@/services/resources/task";
import { MemberTask, ProjectTask } from "@/types/task";
import { getAccountById } from "@/services/resources/auth";

// Task interface compatible with TaskTable component
interface TaskTableTask {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Complete" | "Overdue";
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
const transformTaskStatus = (status: string): "Not Started" | "In Progress" | "Complete" | "Overdue" => {
  switch (status?.toLowerCase()) {
    case "todo":
    case "not started":
      return "Not Started";
    case "inprogress":
    case "in progress":
      return "In Progress";
    case "completed":
    case "complete":
      return "Complete";
    case "overdue":
      return "Overdue";
    default:
      return "Not Started";
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

export function useTasksWithMembersByMilestoneId(milestoneId: string) {
  const [tasks, setTasks] = useState<TaskTableTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        console.log("🔍 Enhanced hook - Raw tasks from API:", {
          milestoneId,
          tasksCount: taskList.length,
          tasks: taskList.map(t => ({
            id: t.id,
            name: t.name,
            memberTasksCount: t["member-tasks"]?.length || 0,
            memberTasks: t["member-tasks"]
          }))
        });

        const enrichedTasks: TaskTableTask[] = await Promise.all(
          taskList.map(async (task: ProjectTask) => {
            try {
              // Get member tasks for this task
              const memberResponse = await getMemberTasksByTaskId(task.id);
              const memberTasks: MemberTask[] = memberResponse["data-list"] || [];

              console.log(`🔍 Member tasks for task ${task.name} (${task.id}):`, {
                memberTasksCount: memberTasks.length,
                memberTasks: memberTasks.map(mt => ({
                  id: mt.id,
                  memberId: mt.memberId,
                  status: mt.status
                }))
              });

              // Fetch member details for each member task
              const memberTasksWithDetails = await Promise.all(
                memberTasks.map(async (memberTask) => {
                  try {
                    // Fetch member details
                    const memberDetails = await getAccountById(memberTask.memberId);

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
                    console.error(`Error fetching member details for ${memberTask.memberId}:`, memberError);
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

              // Transform ProjectTask to TaskTableTask format
              return {
                id: task.id,
                title: task.name,
                description: task.description,
                status: transformTaskStatus(task.status),
                dueDate: task.endDate,
                priority: transformTaskPriority(task.priority),
                projectTag: task.code || "Task",
                "member-tasks": memberTasksWithDetails,
                createdAt: task.startDate,
                updatedAt: task.startDate, // Using startDate as fallback
              };
            } catch (taskError) {
              console.error(`Error processing task ${task.id}:`, taskError);
              // Return task with empty member tasks on error
              return {
                id: task.id,
                title: task.name,
                description: task.description,
                status: transformTaskStatus(task.status),
                dueDate: task.endDate,
                priority: transformTaskPriority(task.priority),
                projectTag: task.code || "Task",
                "member-tasks": [],
                createdAt: task.startDate,
                updatedAt: task.startDate,
              };
            }
          })
        );

        console.log("✅ Enhanced hook - Successfully fetched tasks with members:", {
          milestoneId,
          tasksCount: enrichedTasks.length,
          tasksWithMembers: enrichedTasks.filter(t => t["member-tasks"].length > 0).length,
          sampleTask: enrichedTasks[0] ? {
            id: enrichedTasks[0].id,
            title: enrichedTasks[0].title,
            memberTasksCount: enrichedTasks[0]["member-tasks"].length,
            memberTasks: enrichedTasks[0]["member-tasks"].map(mt => ({
              memberId: mt["member-id"],
              memberName: mt.member.name
            }))
          } : null
        });

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
  }, [milestoneId]);

  return { tasks, loading, error };
}
