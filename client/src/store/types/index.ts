// Re-export types from shared schema
export type {
  User,
  Project,
  Task,
  Comment,
  Activity,
} from "../../../../shared/schema";

// UI State Types
export interface UiState {
  sidebarCollapsed: boolean;
  projectWizardOpen: boolean;
  taskDetailModalOpen: boolean;
  selectedTaskId: number | null;
  loading: boolean;
  error: string | null;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Project State Types
export interface ProjectWizardData {
  step: number;
  projectName: string;
  description: string;
  startDate: string;
  dueDate: string;
  category: "web" | "mobile" | "design" | "marketing";
  priority: "high" | "medium" | "low";
  teamMembers: number[];
}

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  wizardData: ProjectWizardData;
  loading: boolean;
  error: string | null;
}

// Task State Types
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

export interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}

// Notification Types
export interface NotificationItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface NotificationsState {
  notifications: NotificationItem[];
}

// Dashboard Stats Types
export interface DashboardStats {
  activeProjects: number;
  completedTasks: number;
  teamMembers: number;
  pendingTasks: number;
}