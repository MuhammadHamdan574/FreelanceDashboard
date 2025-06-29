import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Project, ProjectWizardData } from '@/types';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  wizardData: ProjectWizardData;
  loading: boolean;
  error: string | null;
}

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "Frontend development and API integration",
    category: "web",
    priority: "high",
    status: "active",
    startDate: "2024-11-01",
    dueDate: "2024-12-15",
    progress: 75,
    teamMembers: [1, 2, 3],
    createdBy: 1,
    createdAt: "2024-11-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Mobile App Redesign",
    description: "UI/UX improvements and performance optimization",
    category: "mobile",
    priority: "medium",
    status: "active",
    startDate: "2024-11-15",
    dueDate: "2025-01-20",
    progress: 45,
    teamMembers: [2, 4],
    createdBy: 1,
    createdAt: "2024-11-15T00:00:00Z"
  },
  {
    id: 3,
    name: "Analytics Dashboard",
    description: "Data visualization and reporting features",
    category: "web",
    priority: "low",
    status: "active",
    startDate: "2024-12-01",
    dueDate: "2025-02-10",
    progress: 20,
    teamMembers: [1, 3, 4, 5],
    createdBy: 1,
    createdAt: "2024-12-01T00:00:00Z"
  }
];

const initialState: ProjectsState = {
  projects: mockProjects,
  currentProject: null,
  wizardData: {
    step: 1,
    projectName: '',
    description: '',
    startDate: '',
    dueDate: '',
    category: '',
    priority: '',
    teamMembers: [],
  },
  loading: false,
  error: null,
};

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: Omit<Project, 'id' | 'createdAt' | 'createdBy'>) => {
    // In real implementation, this would call an API
    const newProject: Project = {
      ...projectData,
      id: Date.now(),
      createdBy: 1,
      createdAt: new Date().toISOString(),
    };
    return newProject;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    updateWizardData: (state, action: PayloadAction<Partial<ProjectWizardData>>) => {
      state.wizardData = { ...state.wizardData, ...action.payload };
    },
    resetWizardData: (state) => {
      state.wizardData = {
        step: 1,
        projectName: '',
        description: '',
        startDate: '',
        dueDate: '',
        category: '',
        priority: '',
        teamMembers: [],
      };
    },
    updateProjectProgress: (state, action: PayloadAction<{ id: number; progress: number }>) => {
      const project = state.projects.find(p => p.id === action.payload.id);
      if (project) {
        project.progress = action.payload.progress;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create project';
      });
  },
});

export const { 
  setCurrentProject, 
  updateWizardData, 
  resetWizardData, 
  updateProjectProgress 
} = projectsSlice.actions;

export default projectsSlice.reducer;
