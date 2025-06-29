import { RootState } from '../store';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// UI selectors
export const selectUI = (state: RootState) => state.ui;
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectProjectWizardOpen = (state: RootState) => state.ui.projectWizardOpen;
export const selectTaskDetailModalOpen = (state: RootState) => state.ui.taskDetailModalOpen;
export const selectSelectedTaskId = (state: RootState) => state.ui.selectedTaskId;
export const selectUILoading = (state: RootState) => state.ui.loading;
export const selectUIError = (state: RootState) => state.ui.error;

// Projects selectors
export const selectProjects = (state: RootState) => state.projects;
export const selectAllProjects = (state: RootState) => state.projects.projects;
export const selectCurrentProject = (state: RootState) => state.projects.currentProject;
export const selectProjectWizardData = (state: RootState) => state.projects.wizardData;
export const selectProjectsLoading = (state: RootState) => state.projects.loading;
export const selectProjectsError = (state: RootState) => state.projects.error;

// Advanced project selectors
export const selectActiveProjects = (state: RootState) =>
  state.projects.projects.filter(project => project.status === 'active');

export const selectCompletedProjects = (state: RootState) =>
  state.projects.projects.filter(project => project.status === 'completed');

export const selectRecentProjects = (state: RootState) =>
  state.projects.projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

export const selectProjectsByCategory = (category: string) => (state: RootState) =>
  state.projects.projects.filter(project => project.category === category);

// Tasks selectors
export const selectTasks = (state: RootState) => state.tasks;
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectCurrentTask = (state: RootState) => state.tasks.currentTask;
export const selectTaskFilters = (state: RootState) => state.tasks.filters;
export const selectTaskPagination = (state: RootState) => state.tasks.pagination;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;

// Advanced task selectors
export const selectFilteredTasks = (state: RootState) => {
  const { tasks, filters } = state.tasks;
  return tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesSearch = !filters.search || 
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });
};

export const selectPaginatedTasks = (state: RootState) => {
  const filteredTasks = selectFilteredTasks(state);
  const { currentPage, itemsPerPage } = state.tasks.pagination;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredTasks.slice(startIndex, endIndex);
};

export const selectCompletedTasks = (state: RootState) =>
  state.tasks.tasks.filter(task => task.completed);

export const selectPendingTasks = (state: RootState) =>
  state.tasks.tasks.filter(task => !task.completed);

export const selectTasksByProject = (projectId: number) => (state: RootState) =>
  state.tasks.tasks.filter(task => task.projectId === projectId);

export const selectTasksByPriority = (priority: string) => (state: RootState) =>
  state.tasks.tasks.filter(task => task.priority === priority);

// Notifications selectors
export const selectNotifications = (state: RootState) => state.notifications;
export const selectAllNotifications = (state: RootState) => state.notifications.notifications;
export const selectNotificationsByType = (type: string) => (state: RootState) =>
  state.notifications.notifications.filter(notification => notification.type === type);

// Combined selectors for dashboard stats
export const selectDashboardStats = (state: RootState) => ({
  activeProjects: selectActiveProjects(state).length,
  completedTasks: selectCompletedTasks(state).length,
  teamMembers: selectUser(state) ? 1 : 0, // Simple calculation for demo
  pendingTasks: selectPendingTasks(state).length,
});