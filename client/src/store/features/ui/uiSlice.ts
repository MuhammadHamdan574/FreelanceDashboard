import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiState } from '../../types';

const initialState: UiState = {
  sidebarCollapsed: false,
  projectWizardOpen: false,
  taskDetailModalOpen: false,
  selectedTaskId: null,
  loading: false,
  error: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setProjectWizardOpen: (state, action: PayloadAction<boolean>) => {
      state.projectWizardOpen = action.payload;
    },
    openProjectWizard: (state) => {
      state.projectWizardOpen = true;
    },
    closeProjectWizard: (state) => {
      state.projectWizardOpen = false;
    },
    setTaskDetailModalOpen: (state, action: PayloadAction<boolean>) => {
      state.taskDetailModalOpen = action.payload;
      if (!action.payload) {
        state.selectedTaskId = null;
      }
    },
    openTaskDetailModal: (state, action: PayloadAction<number>) => {
      state.taskDetailModalOpen = true;
      state.selectedTaskId = action.payload;
    },
    closeTaskDetailModal: (state) => {
      state.taskDetailModalOpen = false;
      state.selectedTaskId = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;