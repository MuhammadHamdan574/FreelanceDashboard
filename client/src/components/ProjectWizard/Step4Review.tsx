import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { formatDate, getPriorityColor } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

// Mock team members for display
const teamMembersData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 4,
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  },
];

export default function Step4Review() {
  const { wizardData } = useSelector((state: RootState) => state.projects);

  const selectedMembers = teamMembersData.filter(member => 
    wizardData.teamMembers.includes(member.id)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const memberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Review & Create Project</h3>
      
      <div className="space-y-6">
        <motion.div variants={sectionVariants} className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-3">Project Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Name:</span>
              <span className="font-medium">{wizardData.projectName || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Category:</span>
              <span className="font-medium">
                {wizardData.category ? 
                  wizardData.category.charAt(0).toUpperCase() + wizardData.category.slice(1) : 
                  'Not specified'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Priority:</span>
              {wizardData.priority ? (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(wizardData.priority)}`}>
                  {wizardData.priority.charAt(0).toUpperCase() + wizardData.priority.slice(1)}
                </span>
              ) : (
                <span className="font-medium">Not specified</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Duration:</span>
              <span className="font-medium">
                {wizardData.startDate && wizardData.dueDate ? 
                  `${formatDate(wizardData.startDate)} - ${formatDate(wizardData.dueDate)}` :
                  'Not specified'
                }
              </span>
            </div>
            {wizardData.description && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-600">Description:</span>
                <p className="text-sm text-slate-700 mt-1">{wizardData.description}</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={sectionVariants} className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-3">
            Team Members 
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({selectedMembers.length} selected)
            </span>
          </h4>
          
          {selectedMembers.length > 0 ? (
            <div className="flex -space-x-2">
              {selectedMembers.map((member, index) => (
                <motion.img
                  key={member.id}
                  variants={memberVariants}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  src={member.avatar}
                  alt={member.name}
                  title={member.name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer"
                  style={{ zIndex: selectedMembers.length - index }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No team members selected</p>
          )}
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <CheckCircle className="text-green-600 mr-3 h-5 w-5" />
          <p className="text-sm text-green-800">
            All required information has been provided. Ready to create project.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
