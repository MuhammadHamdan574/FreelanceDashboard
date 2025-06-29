import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectsState, Project, ProjectWizardData } from '../../types';
import { apiRequest } from '../../../lib/queryClient';

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  wizardData: {
    step: 1,
    projectName: '',
    description: '',
    startDate: '',
    dueDate: '',
    category: 'web',
    priority: 'medium',
    teamMembers: [],
  },
  loading: false,
  error: null,
};

// Async Thunks for API operations
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await apiRequest('/api/projects');
    return response as Project[];
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Omit<Project, 'id' | 'createdAt' | 'createdBy'>) => {
    const response = await apiRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response as Project;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }: { id: number; data: Partial<Project> }) => {
    const response = await apiRequest(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response as Project;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: number) => {
    await apiRequest(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    updateWizardData: (state, action: PayloadAction<Partial<ProjectWizardData>>) => {
      state.wizardData = { ...state.wizardData, ...action.payload };
    },
    nextWizardStep: (state) => {
      state.wizardData.step += 1;
    },
    previousWizardStep: (state) => {
      state.wizardData.step -= 1;
    },
    resetWizardData: (state) => {
      state.wizardData = {
        step: 1,
        projectName: '',
        description: '',
        startDate: '',
        dueDate: '',
        category: 'web',
        priority: 'medium',
        teamMembers: [],
      };
    },
    updateProjectProgress: (state, action: PayloadAction<{ id: number; progress: number }>) => {
      const project = state.projects.find(p => p.id === action.payload.id);
      if (project) {
        project.progress = action.payload.progress;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      // Create project
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
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update project';
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete project';
      });
  },
});

export const {
  setCurrentProject,
  updateWizardData,
  nextWizardStep,
  previousWizardStep,
  resetWizardData,
  updateProjectProgress,
  clearError,
} = projectsSlice.actions;

export default projectsSlice.reducer;