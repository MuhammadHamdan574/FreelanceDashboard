import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/store";
import { removeNotification } from "@/store/slices/notificationsSlice";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationColors = {
  success: "bg-green-500 border-green-400",
  error: "bg-red-500 border-red-400",
  warning: "bg-amber-500 border-amber-400",
  info: "bg-blue-500 border-blue-400",
};

const iconColors = {
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export default function NotificationSystem() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    notifications.forEach((notification) => {
      const duration = notification.duration || 5000;
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, duration);

      // Cleanup timer if component unmounts or notification changes
      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  const handleDismiss = (id: string) => {
    dispatch(removeNotification(id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const notificationVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      x: 100,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      x: 100,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      }
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type];
            const colorClass = notificationColors[notification.type];
            const iconColorClass = iconColors[notification.type];

            return (
              <motion.div
                key={notification.id}
                variants={notificationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className={`glass-effect text-white px-4 py-3 rounded-lg shadow-lg border ${colorClass} backdrop-blur-lg`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${iconColorClass} flex-shrink-0`} />
                  <span className="text-sm font-medium flex-1 text-white">
                    {notification.message}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(notification.id)}
                    className="ml-auto text-white/70 hover:text-white hover:bg-white/10 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Progress bar for auto-dismiss */}
                <motion.div
                  className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="h-full bg-white/40"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ 
                      duration: (notification.duration || 5000) / 1000,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
