import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FolderOpen,
  CheckSquare,
  Users,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", icon: BarChart3, href: "/", current: true },
  { name: "Projects", icon: FolderOpen, href: "/", current: false },
  { name: "Tasks", icon: CheckSquare, href: "/", current: false },
  { name: "Team", icon: Users, href: "/team", current: false },
  { name: "Notifications", icon: Bell, href: "/", current: false, badge: 3 },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        animate={sidebarCollapsed ? "closed" : "open"}
        className={cn(
          "glass-effect border-r border-white/20 w-64 sm:w-72 flex-shrink-0 h-full z-40",
          "lg:relative lg:translate-x-0",
          "fixed lg:static top-0 left-0",
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-card rounded-lg flex items-center justify-center">
                <CheckSquare className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-slate-800">TaskFlow</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                  item.current
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.a>
            ))}
          </nav>

          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-8 border-t border-slate-200"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
