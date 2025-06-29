import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FolderOpen, CheckSquare, Users, Clock } from "lucide-react";

interface DashboardStats {
  activeProjects: number;
  completedTasks: number;
  teamMembers: number;
  pendingTasks: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    select: (data: DashboardStats) => [
      {
        name: "Active Projects",
        value: data.activeProjects,
        change: "+12%",
        changeType: "positive",
        icon: FolderOpen,
        color: "bg-gradient-to-br from-blue-500 to-purple-600",
        progress: 68,
      },
      {
        name: "Completed Tasks", 
        value: data.completedTasks,
        change: "+8%",
        changeType: "positive",
        icon: CheckSquare,
        color: "bg-gradient-to-br from-green-500 to-teal-600",
        progress: 84,
      },
      {
        name: "Team Members",
        value: data.teamMembers,
        change: "+3",
        changeType: "positive", 
        icon: Users,
        color: "bg-gradient-to-br from-orange-500 to-pink-600",
        progress: 72,
      },
      {
        name: "Pending Tasks",
        value: data.pendingTasks,
        change: "2 overdue",
        changeType: "negative",
        icon: Clock,
        color: "bg-gradient-to-br from-red-500 to-rose-600", 
        progress: 45,
      },
    ]
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-effect rounded-xl p-4 sm:p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg"></div>
              <div className="w-12 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="w-16 h-8 bg-slate-200 rounded mb-1"></div>
            <div className="w-24 h-4 bg-slate-200 rounded mb-4"></div>
            <div className="w-full h-2 bg-slate-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      {stats?.map((stat, index) => (
        <motion.div
          key={stat.name}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02,
            y: -4,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          className="glass-effect rounded-xl p-4 sm:p-6 hover:shadow-2xl hover:border-white/30 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <stat.icon className="text-white text-lg sm:text-xl" />
            </div>
            <span 
              className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {stat.change}
            </span>
          </div>
          
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-1"
          >
            {stat.value}
          </motion.h3>
          
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">{stat.name}</p>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stat.progress}%` }}
              transition={{ 
                duration: 1, 
                delay: 0.5 + index * 0.1,
                ease: "easeOut"
              }}
              className={`${stat.color} h-2 rounded-full shadow-sm`}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
