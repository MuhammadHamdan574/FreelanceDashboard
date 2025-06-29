import { users, type User, type InsertUser, type Project, type InsertProject, type Task, type InsertTask, type Comment, type InsertComment, type Activity, type InsertActivity } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject & { createdBy: number }): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Tasks
  getAllTasks(filters?: {
    projectId?: number;
    status?: string;
    priority?: string;
    assigneeId?: number;
  }): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask & { createdBy: number }): Promise<Task>;
  updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Comments
  getTaskComments(taskId: number): Promise<Comment[]>;
  createComment(comment: InsertComment & { authorId: number }): Promise<Comment>;
  
  // Activities
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity & { userId: number }): Promise<Activity>;
  
  // Dashboard
  getDashboardStats(): Promise<{
    activeProjects: number;
    completedTasks: number;
    teamMembers: number;
    pendingTasks: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private tasks: Map<number, Task>;
  private comments: Map<number, Comment>;
  private activities: Map<number, Activity>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.comments = new Map();
    this.activities = new Map();
    this.currentId = 1;
    
    // Add some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock users
    const mockUsers = [
      { id: 1, username: "johndoe", email: "john@example.com", password: "password", name: "John Doe", role: "Project Manager", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150", status: "available", createdAt: new Date() },
      { id: 2, username: "sarahjohnson", email: "sarah@example.com", password: "password", name: "Sarah Johnson", role: "UI/UX Designer", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150", status: "available", createdAt: new Date() },
      { id: 3, username: "michaelchen", email: "michael@example.com", password: "password", name: "Michael Chen", role: "Backend Developer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150", status: "busy", createdAt: new Date() },
      { id: 4, username: "emmadavis", email: "emma@example.com", password: "password", name: "Emma Davis", role: "Project Manager", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150", status: "available", createdAt: new Date() },
    ];
    
    mockUsers.forEach(user => this.users.set(user.id, user));
    
    // Mock projects
    const mockProjects = [
      { id: 5, name: "Website Redesign", description: "Complete redesign of company website", category: "web", priority: "high", status: "active", startDate: new Date('2025-01-01'), dueDate: new Date('2025-03-15'), progress: 65, teamMembers: ["1", "2"], createdBy: 1, createdAt: new Date() },
      { id: 6, name: "Mobile App Development", description: "iOS and Android app for customer management", category: "mobile", priority: "medium", status: "active", startDate: new Date('2025-01-15'), dueDate: new Date('2025-05-01'), progress: 30, teamMembers: ["3", "4"], createdBy: 1, createdAt: new Date() },
      { id: 7, name: "Brand Identity Update", description: "Logo and brand guidelines refresh", category: "design", priority: "low", status: "completed", startDate: new Date('2024-12-01'), dueDate: new Date('2025-01-31'), progress: 100, teamMembers: ["2"], createdBy: 2, createdAt: new Date() },
    ];
    
    mockProjects.forEach(project => this.projects.set(project.id, project));
    
    // Mock tasks
    const mockTasks = [
      { id: 8, title: "Design homepage wireframes", description: "Create initial wireframes for new homepage layout", status: "completed", priority: "high", projectId: 5, assigneeId: 2, dueDate: new Date('2025-01-20'), completed: true, createdBy: 1, createdAt: new Date() },
      { id: 9, title: "Implement user authentication", description: "Set up secure login and registration system", status: "in_progress", priority: "high", projectId: 6, assigneeId: 3, dueDate: new Date('2025-02-15'), completed: false, createdBy: 1, createdAt: new Date() },
      { id: 10, title: "Create color palette", description: "Develop new brand color schemes", status: "todo", priority: "medium", projectId: 7, assigneeId: 2, dueDate: new Date('2025-02-01'), completed: false, createdBy: 2, createdAt: new Date() },
      { id: 11, title: "Write API documentation", description: "Document all backend endpoints", status: "todo", priority: "medium", projectId: 6, assigneeId: 3, dueDate: new Date('2025-02-28'), completed: false, createdBy: 1, createdAt: new Date() },
    ];
    
    mockTasks.forEach(task => this.tasks.set(task.id, task));
    
    // Mock activities
    const mockActivities = [
      { id: 12, type: "task_completed", description: "John Doe completed 'Design homepage wireframes'", userId: 1, projectId: 5, taskId: 8, createdAt: new Date() },
      { id: 13, type: "project_updated", description: "Sarah Johnson updated project progress", userId: 2, projectId: 5, taskId: null, createdAt: new Date() },
      { id: 14, type: "task_assigned", description: "Michael Chen was assigned to 'Implement user authentication'", userId: 3, projectId: 6, taskId: 9, createdAt: new Date() },
    ];
    
    mockActivities.forEach(activity => this.activities.set(activity.id, activity));
    
    this.currentId = 15;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      role: insertUser.role || "member",
      status: insertUser.status || "available",
      avatar: insertUser.avatar || null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject & { createdBy: number }): Promise<Project> {
    const id = this.currentId++;
    const newProject: Project = {
      ...project,
      id,
      createdAt: new Date(),
      description: project.description || null,
      status: project.status || "active",
      progress: project.progress || 0,
      teamMembers: project.teamMembers || null,
      createdBy: project.createdBy || null
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...data };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Task methods
  async getAllTasks(filters?: {
    projectId?: number;
    status?: string;
    priority?: string;
    assigneeId?: number;
  }): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values());
    
    if (filters) {
      if (filters.projectId) {
        tasks = tasks.filter(task => task.projectId === filters.projectId);
      }
      if (filters.status) {
        tasks = tasks.filter(task => task.status === filters.status);
      }
      if (filters.priority) {
        tasks = tasks.filter(task => task.priority === filters.priority);
      }
      if (filters.assigneeId) {
        tasks = tasks.filter(task => task.assigneeId === filters.assigneeId);
      }
    }
    
    return tasks;
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask & { createdBy: number }): Promise<Task> {
    const id = this.currentId++;
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date(),
      description: task.description || null,
      status: task.status || "todo",
      projectId: task.projectId || null,
      assigneeId: task.assigneeId || null,
      dueDate: task.dueDate || null,
      completed: task.completed || false,
      createdBy: task.createdBy || null
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...data };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Comment methods
  async getTaskComments(taskId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.taskId === taskId);
  }

  async createComment(comment: InsertComment & { authorId: number }): Promise<Comment> {
    const id = this.currentId++;
    const newComment: Comment = {
      ...comment,
      id,
      createdAt: new Date(),
      taskId: comment.taskId || null,
      authorId: comment.authorId || null
    };
    this.comments.set(id, newComment);
    return newComment;
  }

  // Activity methods
  async getRecentActivities(limit: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
    return activities;
  }

  async createActivity(activity: InsertActivity & { userId: number }): Promise<Activity> {
    const id = this.currentId++;
    const newActivity: Activity = {
      ...activity,
      id,
      createdAt: new Date(),
      projectId: activity.projectId || null,
      taskId: activity.taskId || null,
      userId: activity.userId || null
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Dashboard methods
  async getDashboardStats(): Promise<{
    activeProjects: number;
    completedTasks: number;
    teamMembers: number;
    pendingTasks: number;
  }> {
    const projects = Array.from(this.projects.values());
    const tasks = Array.from(this.tasks.values());
    const users = Array.from(this.users.values());
    
    return {
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedTasks: tasks.filter(t => t.completed).length,
      teamMembers: users.length,
      pendingTasks: tasks.filter(t => !t.completed).length
    };
  }
}

export const storage = new MemStorage();
