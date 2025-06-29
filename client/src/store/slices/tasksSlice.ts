import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, TaskFilters, PaginationState } from '@/types';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Implement user authentication system",
    description: "Set up login, registration, and password reset functionality",
    status: "in_progress",
    priority: "high",
    projectId: 1,
    assigneeId: 1,
    dueDate: "2024-12-20",
    completed: false,
    createdBy: 1,
    createdAt: "2024-11-01T00:00:00Z"
  },
  {
    id: 2,
    title: "Design landing page mockups",
    description: "Create responsive designs for home page",
    status: "completed",
    priority: "medium",
    projectId: 1,
    assigneeId: 2,
    dueDate: "2024-12-18",
    completed: true,
    createdBy: 1,
    createdAt: "2024-11-02T00:00:00Z"
  },
  {
    id: 3,
    title: "API documentation review",
    description: "Review and update API endpoint documentation",
    status: "todo",
    priority: "low",
    projectId: 1,
    assigneeId: 3,
    dueDate: "2024-12-25",
    completed: false,
    createdBy: 1,
    createdAt: "2024-11-03T00:00:00Z"
  }
];

const initialState: TasksState = {
  tasks: mockTasks,
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
    totalItems: mockTasks.length,
    itemsPerPage: 10,
  },
  loading: false,
  error: null,
};

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (taskData: Partial<Task> & { id: number }) => {
    // In real implementation, this would call an API
    return taskData;
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
    // In real implementation, this would call an API
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdBy: 1,
      createdAt: new Date().toISOString(),
    };
    return newTask;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    toggleTaskCompletion: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'todo';
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...action.payload };
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      });
  },
});

export const { 
  setCurrentTask, 
  setFilters, 
  setPagination, 
  toggleTaskCompletion,
  deleteTask 
} = tasksSlice.actions;

export default tasksSlice.reducer;
