import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { updateWizardData } from "@/store/slices/projectsSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Step1Basic() {
  const dispatch = useDispatch();
  const { wizardData } = useSelector((state: RootState) => state.projects);

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateWizardData({ [field]: value }));
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

  const fieldVariants = {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Information</h3>
      
      <div className="space-y-4">
        <motion.div variants={fieldVariants}>
          <Label htmlFor="projectName" className="text-sm font-medium text-slate-700 mb-2">
            Project Name *
          </Label>
          <Input
            id="projectName"
            type="text"
            placeholder="Enter project name"
            value={wizardData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            className="mt-2"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <Label htmlFor="description" className="text-sm font-medium text-slate-700 mb-2">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your project..."
            value={wizardData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="mt-2 h-24"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={fieldVariants}>
            <Label htmlFor="startDate" className="text-sm font-medium text-slate-700 mb-2">
              Start Date *
            </Label>
            <Input
              id="startDate"
              type="date"
              value={wizardData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="mt-2"
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700 mb-2">
              Due Date *
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={wizardData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="mt-2"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
