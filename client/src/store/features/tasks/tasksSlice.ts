import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TasksState, Task, TaskFilters, PaginationState } from '../../types';
import { apiRequest } from '../../../lib/queryClient';

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  loading: false,
  error: null,
};

// Async Thunks for API operations
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters?: { 
    projectId?: number; 
    status?: string; 
    priority?: string; 
    assigneeId?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters?.projectId) queryParams.append('projectId', filters.projectId.toString());
    if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);
    if (filters?.priority && filters.priority !== 'all') queryParams.append('priority', filters.priority);
    if (filters?.assigneeId) queryParams.append('assigneeId', filters.assigneeId.toString());
    
    const url = `/api/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiRequest(url);
    return response as Task[];
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id: number) => {
    const response = await apiRequest(`/api/tasks/${id}`);
    return response as Task;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
    const response = await apiRequest('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return response as Task;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: number; data: Partial<Task> }) => {
    const response = await apiRequest(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response as Task;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number) => {
    await apiRequest(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        priority: 'all',
        assignee: 'all',
        search: '',
      };
      state.pagination.currentPage = 1;
    },
    updatePagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    toggleTaskCompletion: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'todo';
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: number; status: 'todo' | 'in_progress' | 'completed' }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.completed = action.payload.status === 'completed';
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch task';
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.pagination.totalItems += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        state.pagination.totalItems -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export const {
  setCurrentTask,
  updateFilters,
  clearFilters,
  updatePagination,
  setCurrentPage,
  toggleTaskCompletion,
  updateTaskStatus,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;