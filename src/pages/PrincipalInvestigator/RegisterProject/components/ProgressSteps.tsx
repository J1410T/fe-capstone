// import React from "react";
// import { Check, FileText, Users, Eye, PlusCircle } from "lucide-react";
// import { cn } from "@/utils";

// interface ProgressStepsProps {
//   currentStep: number;
// }

// const steps = [
//   {
//     id: 1,
//     title: "Project Registration",
//     description: "Basic project information",
//     icon: PlusCircle,
//   },
//   {
//     id: 2,
//     title: "Project Summary",
//     description: "Detailed description and objectives",
//     icon: FileText,
//   },
//   {
//     id: 3,
//     title: "Invite Members",
//     description: "Add team members to your project",
//     icon: Users,
//   },
//   {
//     id: 4,
//     title: "Review",
//     description: "Review and submit your project",
//     icon: Eye,
//   },
// ];

// export const ProgressSteps: React.FC<ProgressStepsProps> = ({
//   currentStep,
// }) => {
//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => {
//           const isCompleted = currentStep > step.id;
//           const isActive = currentStep === step.id;
//           const Icon = step.icon;

//           return (
//             <React.Fragment key={step.id}>
//               <div className="flex flex-col items-center">
//                 <div
//                   className={cn(
//                     "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
//                     {
//                       "bg-primary border-primary text-primary-foreground":
//                         isActive,
//                       "bg-green-500 border-green-500 text-white": isCompleted,
//                       "bg-background border-muted-foreground text-muted-foreground":
//                         !isActive && !isCompleted,
//                     }
//                   )}
//                 >
//                   {isCompleted ? (
//                     <Check className="w-6 h-6" />
//                   ) : (
//                     <Icon className="w-6 h-6" />
//                   )}
//                 </div>
//                 <div className="mt-2 text-center">
//                   <p
//                     className={cn("text-sm font-medium", {
//                       "text-primary": isActive,
//                       "text-green-600": isCompleted,
//                       "text-muted-foreground": !isActive && !isCompleted,
//                     })}
//                   >
//                     {step.title}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     {step.description}
//                   </p>
//                 </div>
//               </div>
//               {index < steps.length - 1 && (
//                 <div
//                   className={cn(
//                     "flex-1 h-0.5 mx-4 transition-all duration-200",
//                     {
//                       "bg-green-500": currentStep > step.id,
//                       "bg-muted": currentStep <= step.id,
//                     }
//                   )}
//                 />
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
