// Main store configuration
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Export all types
export * from './types';

// Export all action creators
export { 
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError as clearAuthError,
  updateUserStatus,
} from './features/auth/authSlice';

export {
  setSidebarCollapsed,
  toggleSidebar,
  setProjectWizardOpen,
  openProjectWizard,
  closeProjectWizard,
  setTaskDetailModalOpen,
  openTaskDetailModal,
  closeTaskDetailModal,
  setLoading,
  setError,
  clearError as clearUiError,
} from './features/ui/uiSlice';

export {
  addNotification,
  removeNotification,
  clearAllNotifications,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from './features/notifications/notificationsSlice';

export {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  updateWizardData,
  nextWizardStep,
  previousWizardStep,
  resetWizardData,
  updateProjectProgress,
  clearError as clearProjectsError,
} from './features/projects/projectsSlice';

export {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  setCurrentTask,
  updateFilters,
  clearFilters,
  updatePagination,
  setCurrentPage,
  toggleTaskCompletion,
  updateTaskStatus,
  clearError as clearTasksError,
} from './features/tasks/tasksSlice';

// Export selectors for convenience
export const selectAuth = (state: any) => state.auth;
export const selectUI = (state: any) => state.ui;
export const selectProjects = (state: any) => state.projects;
export const selectTasks = (state: any) => state.tasks;
export const selectNotifications = (state: any) => state.notifications;