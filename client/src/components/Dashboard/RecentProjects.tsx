import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { formatDate, cn } from "@/lib/utils";
import { Calendar, Users, Laptop, Smartphone, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryIcons = {
  web: Laptop,
  mobile: Smartphone,
  design: BarChart3,
  marketing: BarChart3,
} as const;

const categoryColors = {
  web: "bg-gradient-to-br from-blue-500 to-purple-600",
  mobile: "bg-gradient-to-br from-green-500 to-teal-600", 
  design: "bg-gradient-to-br from-pink-500 to-rose-600",
  marketing: "bg-gradient-to-br from-orange-500 to-amber-600",
} as const;

export default function RecentProjects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const projectVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="glass-effect rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center p-4 bg-white rounded-lg border border-slate-100 animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-lg mr-4"></div>
              <div className="flex-1">
                <div className="w-24 h-4 bg-slate-200 rounded mb-2"></div>
                <div className="w-full h-3 bg-slate-200 rounded mb-2"></div>
                <div className="flex space-x-4">
                  <div className="w-16 h-3 bg-slate-200 rounded"></div>
                  <div className="w-20 h-3 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white"
          >
            Recent Projects
          </motion.h2>
          <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            <Plus className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-4">No projects yet</p>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            Create Your First Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white"
        >
          Recent Projects
        </motion.h2>
        <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm">
          View All
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 sm:space-y-4"
      >
        {projects?.slice(0, 3).map((project: any) => {
          const Icon = categoryIcons[project.category];
          const colorClass = categoryColors[project.category];
          
          return (
            <motion.div
              key={project.id}
              variants={projectVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="flex items-center p-4 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mr-4`}>
                <Icon className="text-white h-5 w-5" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{project.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{project.description}</p>
                
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="text-slate-400 h-3 w-3" />
                    <span className="text-xs text-slate-500">
                      {formatDate(project.dueDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="text-slate-400 h-3 w-3" />
                    <span className="text-xs text-slate-500">
                      {project.teamMembers.length} members
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                    />
                    <motion.path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${project.progress}, 100` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-slate-700">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
