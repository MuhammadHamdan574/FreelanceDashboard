import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { updateWizardData } from "@/store/slices/projectsSlice";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mock team members data
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    role: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    status: "available",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    status: "available",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Backend Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    status: "busy",
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "Project Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    status: "available",
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    role: "DevOps Engineer",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    status: "available",
  },
];

export default function Step3Team() {
  const dispatch = useDispatch();
  const { wizardData } = useSelector((state: RootState) => state.projects);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberToggle = (memberId: number, checked: boolean) => {
    const updatedMembers = checked
      ? [...wizardData.teamMembers, memberId]
      : wizardData.teamMembers.filter(id => id !== memberId);
    
    dispatch(updateWizardData({ teamMembers: updatedMembers }));
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

  const memberVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Assign Team Members</h3>
      
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </motion.div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              variants={memberVariants}
              whileHover={{ scale: 1.01 }}
              className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <Checkbox
                id={`member-${member.id}`}
                checked={wizardData.teamMembers.includes(member.id)}
                onCheckedChange={(checked) => handleMemberToggle(member.id, checked as boolean)}
                className="mr-3"
              />
              <Label
                htmlFor={`member-${member.id}`}
                className="flex items-center cursor-pointer flex-1"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    member.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </Label>
            </motion.div>
          ))}
        </div>

        {wizardData.teamMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-sm text-green-800">
              ✓ {wizardData.teamMembers.length} team member{wizardData.teamMembers.length !== 1 ? 's' : ''} selected
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
