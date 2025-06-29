import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { updateWizardData } from "@/store/slices/projectsSlice";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Laptop, Smartphone, Palette, Megaphone } from "lucide-react";

const categories = [
  { value: "web", label: "Web Development", icon: Laptop, color: "text-indigo-600" },
  { value: "mobile", label: "Mobile App", icon: Smartphone, color: "text-emerald-600" },
  { value: "design", label: "Design", icon: Palette, color: "text-purple-600" },
  { value: "marketing", label: "Marketing", icon: Megaphone, color: "text-orange-600" },
];

const priorities = [
  { value: "high", label: "High", color: "border-red-200 bg-red-50 text-red-700" },
  { value: "medium", label: "Medium", color: "border-amber-200 bg-amber-50 text-amber-700" },
  { value: "low", label: "Low", color: "border-green-200 bg-green-50 text-green-700" },
];

export default function Step2Category() {
  const dispatch = useDispatch();
  const { wizardData } = useSelector((state: RootState) => state.projects);

  const handleCategoryChange = (value: string) => {
    dispatch(updateWizardData({ category: value }));
  };

  const handlePriorityChange = (value: string) => {
    dispatch(updateWizardData({ priority: value }));
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
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
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Category & Priority</h3>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3">Category *</Label>
          <RadioGroup value={wizardData.category} onValueChange={handleCategoryChange}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.value}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Label
                    htmlFor={category.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      wizardData.category === category.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <RadioGroupItem value={category.value} id={category.value} className="mr-3" />
                    <div className="flex items-center space-x-3">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                      <span className="font-medium">{category.label}</span>
                    </div>
                  </Label>
                </motion.div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3">Priority Level *</Label>
          <RadioGroup value={wizardData.priority} onValueChange={handlePriorityChange}>
            <div className="flex space-x-3 mt-3">
              {priorities.map((priority, index) => (
                <motion.div
                  key={priority.value}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Label
                    htmlFor={priority.value}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardData.priority === priority.value
                        ? `${priority.color} border-opacity-100`
                        : `${priority.color} border-opacity-50 hover:border-opacity-75`
                    }`}
                  >
                    <RadioGroupItem value={priority.value} id={priority.value} className="mr-2" />
                    <span className="font-medium">{priority.label}</span>
                  </Label>
                </motion.div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </motion.div>
  );
}
