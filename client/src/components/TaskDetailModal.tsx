import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/store";
import { setTaskDetailModalOpen, setSelectedTaskId } from "@/store/slices/uiSlice";
import { updateTask, deleteTask, setCurrentTask } from "@/store/slices/tasksSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { formatRelativeTime, getStatusColor, getPriorityColor } from "@/lib/utils";
import { X, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Mock comments data
const mockComments = [
  {
    id: 1,
    content: "I've reviewed the authentication flow. Consider adding two-factor authentication for enhanced security.",
    authorId: 2,
    author: {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    content: "Great progress! What's the ETA for completion?",
    authorId: 4,
    author: {
      id: 4,
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export default function TaskDetailModal() {
  const dispatch = useDispatch();
  const { taskDetailModalOpen, selectedTaskId } = useSelector((state: RootState) => state.ui);
  const { currentTask, loading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [editMode, setEditMode] = useState(false);
  const [taskData, setTaskData] = useState(currentTask || {});
  const [newComment, setNewComment] = useState("");
  const [comments] = useState(mockComments);

  const handleClose = () => {
    dispatch(setTaskDetailModalOpen(false));
    dispatch(setSelectedTaskId(null));
    dispatch(setCurrentTask(null));
    setEditMode(false);
    setTaskData({});
  };

  const handleSave = async () => {
    if (!currentTask) return;
    
    try {
      await dispatch(updateTask({ ...taskData, id: currentTask.id }));
      dispatch(addNotification({
        type: "success",
        message: "Task updated successfully!",
      }));
      setEditMode(false);
    } catch (error) {
      dispatch(addNotification({
        type: "error",
        message: "Failed to update task. Please try again.",
      }));
    }
  };

  const handleDelete = async () => {
    if (!currentTask) return;
    
    try {
      dispatch(deleteTask(currentTask.id));
      dispatch(addNotification({
        type: "success",
        message: "Task deleted successfully!",
      }));
      handleClose();
    } catch (error) {
      dispatch(addNotification({
        type: "error",
        message: "Failed to delete task. Please try again.",
      }));
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would create a new comment via API
    dispatch(addNotification({
      type: "success",
      message: "Comment added successfully!",
    }));
    setNewComment("");
  };

  const handleTaskToggle = () => {
    const updatedTask = {
      ...taskData,
      completed: !taskData.completed,
      status: !taskData.completed ? 'completed' : 'todo'
    };
    setTaskData(updatedTask);
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      }
    }
  };

  const commentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    }
  };

  if (!currentTask) return null;

  return (
    <AnimatePresence>
      {taskDetailModalOpen && (
        <Dialog open={taskDetailModalOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-2xl"
            >
              {/* Header */}
              <DialogHeader className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={taskData.completed || currentTask.completed}
                      onCheckedChange={handleTaskToggle}
                      className="w-5 h-5"
                    />
                    <DialogTitle className={`text-xl font-bold text-slate-800 ${
                      (taskData.completed || currentTask.completed) ? 'line-through' : ''
                    }`}>
                      {editMode ? (
                        <Input
                          value={taskData.title || currentTask.title}
                          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                          className="text-xl font-bold border-none p-0 h-auto"
                        />
                      ) : (
                        taskData.title || currentTask.title
                      )}
                    </DialogTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Task Details */}
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2">Description</Label>
                  {editMode ? (
                    <Textarea
                      value={taskData.description || currentTask.description || ''}
                      onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                      className="mt-2 h-24"
                      placeholder="Task description..."
                    />
                  ) : (
                    <p className="text-slate-700 mt-2 p-3 bg-slate-50 rounded-lg">
                      {taskData.description || currentTask.description || 'No description provided.'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2">Status</Label>
                    {editMode ? (
                      <Select 
                        value={taskData.status || currentTask.status} 
                        onValueChange={(value) => setTaskData({ ...taskData, status: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(taskData.status || currentTask.status)}`}>
                          {(taskData.status || currentTask.status) === 'in_progress' ? 'In Progress' : 
                           (taskData.status || currentTask.status).charAt(0).toUpperCase() + (taskData.status || currentTask.status).slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2">Priority</Label>
                    {editMode ? (
                      <Select 
                        value={taskData.priority || currentTask.priority} 
                        onValueChange={(value) => setTaskData({ ...taskData, priority: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(taskData.priority || currentTask.priority)}`}>
                          {(taskData.priority || currentTask.priority).charAt(0).toUpperCase() + (taskData.priority || currentTask.priority).slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2">Due Date</Label>
                    {editMode ? (
                      <Input
                        type="date"
                        value={taskData.dueDate || currentTask.dueDate || ''}
                        onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                        className="mt-2"
                      />
                    ) : (
                      <p className="text-slate-700 mt-2">
                        {taskData.dueDate || currentTask.dueDate || 'No due date'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2">Assignee</Label>
                    <div className="flex items-center space-x-3 p-2 border border-slate-200 rounded-lg mt-2">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
                        alt="Assignee"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-800">John Doe</span>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Comments</h3>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          variants={commentVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-start space-x-3"
                        >
                          <img
                            src={comment.author?.avatar}
                            alt={comment.author?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-800">{comment.author?.name}</span>
                              <span className="text-xs text-slate-500">{formatRelativeTime(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-slate-700">{comment.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Add Comment */}
                  <div className="mt-4 flex items-start space-x-3">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="h-16"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handleCommentSubmit}
                          disabled={!newComment.trim()}
                          className="gradient-card text-white hover:shadow-lg transition-all duration-200"
                          size="sm"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-b-xl">
                <div className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </Button>
                  
                  <div className="space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={editMode ? () => setEditMode(false) : handleClose}
                    >
                      Cancel
                    </Button>
                    {editMode ? (
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="gradient-card text-white hover:shadow-lg transition-all duration-200"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setEditMode(true)}
                        className="gradient-card text-white hover:shadow-lg transition-all duration-200"
                      >
                        Edit Task
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
