export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  status: "available" | "busy" | "away";
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  category: "web" | "mobile" | "design" | "marketing";
  priority: "high" | "medium" | "low";
  status: "active" | "completed" | "paused";
  startDate: string;
  dueDate: string;
  progress: number;
  teamMembers: number[];
  createdBy: number;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "completed";
  priority: "high" | "medium" | "low";
  projectId: number;
  assigneeId?: number;
  dueDate?: string;
  completed: boolean;
  createdBy: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  createdAt: string;
  author?: User;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  userId: number;
  projectId?: number;
  taskId?: number;
  createdAt: string;
  user?: User;
}

export interface NotificationItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface ProjectWizardData {
  step: number;
  projectName: string;
  description: string;
  startDate: string;
  dueDate: string;
  category: string;
  priority: string;
  teamMembers: number[];
}

export interface DashboardStats {
  activeProjects: number;
  completedTasks: number;
  teamMembers: number;
  pendingTasks: number;
}

export interface TaskFilters {
  status: string;
  priority: string;
  assignee: string;
  search: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
