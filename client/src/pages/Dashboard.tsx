import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { setSidebarCollapsed } from "@/store/slices/uiSlice";
import Sidebar from "@/components/Dashboard/Sidebar";
import TopBar from "@/components/Dashboard/TopBar";
import StatsCards from "@/components/Dashboard/StatsCards";
import RecentProjects from "@/components/Dashboard/RecentProjects";
import ActivityFeed from "@/components/Dashboard/ActivityFeed";
import TaskManagement from "@/components/Dashboard/TaskManagement";
import ProjectWizardModal from "@/components/ProjectWizard/ProjectWizardModal";
import TaskDetailModal from "@/components/TaskDetailModal";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        dispatch(setSidebarCollapsed(true));
      } else {
        dispatch(setSidebarCollapsed(false));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-x-hidden overflow-y-auto mobile-padding py-4 sm:py-6"
        >
          {/* Stats Cards Section */}
          <div className="mb-6 sm:mb-8">
            <StatsCards />
          </div>
          
          {/* Projects and Activity Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="xl:col-span-2">
              <RecentProjects />
            </div>
            <div className="order-first xl:order-last">
              <ActivityFeed />
            </div>
          </div>
          
          {/* Task Management Section */}
          <div>
            <TaskManagement />
          </div>
        </motion.main>
      </div>
      
      <ProjectWizardModal />
      <TaskDetailModal />
    </div>
  );
}
