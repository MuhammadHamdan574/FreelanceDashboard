import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { 
  setFilters, 
  setPagination, 
  toggleTaskCompletion,
  setCurrentTask 
} from "@/store/slices/tasksSlice";
import { setTaskDetailModalOpen, setSelectedTaskId } from "@/store/slices/uiSlice";
import { formatDate, getPriorityColor, getStatusColor } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function TaskManagement() {
  const dispatch = useDispatch();
  const { tasks, filters, pagination } = useSelector((state: RootState) => state.tasks);
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesSearch = !filters.search || 
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleTaskClick = (task: any) => {
    dispatch(setCurrentTask(task));
    dispatch(setSelectedTaskId(task.id));
    dispatch(setTaskDetailModalOpen(true));
  };

  const handleTaskToggle = (taskId: number) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    // Debounce search
    setTimeout(() => {
      dispatch(setFilters({ search: value }));
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const taskVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold text-slate-800"
        >
          Task Management
        </motion.h2>

        {/* Task Filters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center space-x-2 space-y-2 md:space-y-0"
        >
          <Select value={filters.status} onValueChange={(value) => dispatch(setFilters({ status: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => dispatch(setFilters({ priority: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full md:w-auto"
            />
          </div>
        </motion.div>
      </div>

      {/* Task List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filteredTasks.slice(0, pagination.itemsPerPage).map((task) => (
          <motion.div
            key={task.id}
            variants={taskVariants}
            whileHover={{ 
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
            className="bg-white rounded-lg border border-slate-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <h3 className={`font-semibold text-slate-800 ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                  {task.status === 'in_progress' ? 'In Progress' : 
                   task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                {task.assigneeId && (
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
                    alt="Assignee"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                {task.dueDate && (
                  <span className="text-sm text-slate-500">
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200"
      >
        <div className="text-sm text-slate-500">
          Showing 1-{Math.min(pagination.itemsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" className="gradient-card text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
