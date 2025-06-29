import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  projectWizardOpen: boolean;
  taskDetailModalOpen: boolean;
  selectedTaskId: number | null;
  loading: {
    dashboard: boolean;
    projects: boolean;
    tasks: boolean;
  };
}

const initialState: UIState = {
  sidebarCollapsed: false,
  darkMode: false,
  projectWizardOpen: false,
  taskDetailModalOpen: false,
  selectedTaskId: null,
  loading: {
    dashboard: false,
    projects: false,
    tasks: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setProjectWizardOpen: (state, action: PayloadAction<boolean>) => {
      state.projectWizardOpen = action.payload;
    },
    setTaskDetailModalOpen: (state, action: PayloadAction<boolean>) => {
      state.taskDetailModalOpen = action.payload;
    },
    setSelectedTaskId: (state, action: PayloadAction<number | null>) => {
      state.selectedTaskId = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: keyof UIState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleDarkMode,
  setDarkMode,
  setProjectWizardOpen,
  setTaskDetailModalOpen,
  setSelectedTaskId,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
