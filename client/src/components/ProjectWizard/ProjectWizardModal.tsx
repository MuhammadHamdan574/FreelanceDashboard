import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/store";
import { setProjectWizardOpen } from "@/store/slices/uiSlice";
import { updateWizardData, resetWizardData, createProject } from "@/store/slices/projectsSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Step1Basic from "./Step1Basic";
import Step2Category from "./Step2Category";
import Step3Team from "./Step3Team";
import Step4Review from "./Step4Review";

const steps = [
  { number: 1, title: "Project Information", component: Step1Basic },
  { number: 2, title: "Category & Priority", component: Step2Category },
  { number: 3, title: "Team Members", component: Step3Team },
  { number: 4, title: "Review & Create", component: Step4Review },
];

export default function ProjectWizardModal() {
  const dispatch = useDispatch();
  const { projectWizardOpen } = useSelector((state: RootState) => state.ui);
  const { wizardData, loading } = useSelector((state: RootState) => state.projects);

  const currentStep = steps.find(step => step.number === wizardData.step);
  const CurrentStepComponent = currentStep?.component;

  const handleClose = () => {
    dispatch(setProjectWizardOpen(false));
    dispatch(resetWizardData());
  };

  const handleNext = () => {
    if (wizardData.step < steps.length) {
      dispatch(updateWizardData({ step: wizardData.step + 1 }));
    } else {
      // Create project
      handleCreateProject();
    }
  };

  const handlePrevious = () => {
    if (wizardData.step > 1) {
      dispatch(updateWizardData({ step: wizardData.step - 1 }));
    }
  };

  const handleCreateProject = async () => {
    try {
      const projectData = {
        name: wizardData.projectName,
        description: wizardData.description,
        category: wizardData.category as any,
        priority: wizardData.priority as any,
        status: "active" as const,
        startDate: wizardData.startDate,
        dueDate: wizardData.dueDate,
        progress: 0,
        teamMembers: wizardData.teamMembers,
      };

      await dispatch(createProject(projectData));
      dispatch(addNotification({
        type: "success",
        message: "Project created successfully!",
      }));
      handleClose();
    } catch (error) {
      dispatch(addNotification({
        type: "error",
        message: "Failed to create project. Please try again.",
      }));
    }
  };

  const isLastStep = wizardData.step === steps.length;
  const canProceed = validateCurrentStep();

  function validateCurrentStep(): boolean {
    switch (wizardData.step) {
      case 1:
        return !!(wizardData.projectName && wizardData.startDate && wizardData.dueDate);
      case 2:
        return !!(wizardData.category && wizardData.priority);
      case 3:
        return wizardData.teamMembers.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2,
      }
    }
  };

  return (
    <AnimatePresence>
      {projectWizardOpen && (
        <Dialog open={projectWizardOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-2xl"
            >
              {/* Header */}
              <DialogHeader className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-slate-800">Create New Project</DialogTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      Step {wizardData.step} of {steps.length}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full gradient-card"
                        initial={{ width: "25%" }}
                        animate={{ width: `${(wizardData.step / steps.length) * 100}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-sm text-slate-500">
                      {Math.round((wizardData.step / steps.length) * 100)}%
                    </span>
                  </div>
                </div>
              </DialogHeader>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wizardData.step}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {CurrentStepComponent && <CurrentStepComponent />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-b-xl">
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={wizardData.step === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="space-x-3">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed || loading}
                      className="gradient-card text-white hover:shadow-lg transition-all duration-200"
                    >
                      {loading ? "Creating..." : isLastStep ? "Create Project" : "Next Step"}
                      {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
