import { motion } from "framer-motion";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock activity data
const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "completed task \"API Integration\"",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 2,
    user: "Michael Chen",
    action: "added 3 new tasks to \"Mobile App Redesign\"",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 3,
    user: "Emma Davis",
    action: "updated project milestone",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 4,
    user: "John Doe",
    action: "started working on \"User Authentication\"",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 5,
    user: "Alex Rodriguez",
    action: "reviewed and approved design mockups",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
];

export default function ActivityFeed() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const activityVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-slate-800 mb-6"
      >
        Recent Activity
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            variants={activityVariants}
            whileHover={{ x: 5 }}
            className="flex items-start space-x-3"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={activity.avatar}
              alt={activity.user}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{activity.user}</span>{" "}
                <span>{activity.action}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="outline"
          className="w-full mt-6 text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-colors"
        >
          View All Activity
        </Button>
      </motion.div>
    </div>
  );
}
