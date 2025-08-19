// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ArrowLeft, Send, Users, FileText, Info } from "lucide-react";
// import { FormPIRegister } from "@/types/form";
// import { SimpleInvitedUser } from "@/components/common";
// import { TinyMCEViewer } from "@/components/ui/TinyMCE";

// interface ReviewStepProps {
//   formData: FormPIRegister;
//   teamMembers: SimpleInvitedUser[];
//   projectId: string | null;
//   onPrevStep: () => void;
//   onSubmit: () => void;
//   isLoading: boolean;
// }

// export const ReviewStep: React.FC<ReviewStepProps> = ({
//   formData,
//   teamMembers,
//   projectId,
//   onPrevStep,
//   onSubmit,
//   isLoading,
// }) => {
//   return (
//     <div className="space-y-6">
//       {/* Project Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Info className="w-5 h-5" />
//             Project Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 English Title
//               </h4>
//               <p className="mt-1">{formData.englishTitle}</p>
//             </div>
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Vietnamese Title
//               </h4>
//               <p className="mt-1">{formData.vietnameseTitle}</p>
//             </div>
//             {formData.abbreviations && (
//               <div>
//                 <h4 className="font-medium text-sm text-muted-foreground">
//                   Abbreviations
//                 </h4>
//                 <p className="mt-1">{formData.abbreviations}</p>
//               </div>
//             )}
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Duration
//               </h4>
//               <p className="mt-1">{formData.duration} months</p>
//             </div>
//             {projectId && (
//               <div>
//                 <h4 className="font-medium text-sm text-muted-foreground">
//                   Project ID
//                 </h4>
//                 <p className="mt-1 font-mono text-sm">{projectId}</p>
//               </div>
//             )}
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Language
//               </h4>
//               <p className="mt-1">{formData.language}</p>
//             </div>
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Category
//               </h4>
//               <p className="mt-1">{formData.category}</p>
//             </div>
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Type
//               </h4>
//               <p className="mt-1">{formData.type}</p>
//             </div>
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Maximum Members
//               </h4>
//               <p className="mt-1">{formData.maximumMember}</p>
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-3">
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Research Fields
//               </h4>
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {formData.field.map((fieldId, index) => (
//                   <Badge key={index} variant="secondary">
//                     {fieldId}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium text-sm text-muted-foreground">
//                 Academic Majors
//               </h4>
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {formData.major.map((majorId, index) => (
//                   <Badge key={index} variant="secondary">
//                     {majorId}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//             {formData.tags.length > 0 && (
//               <div>
//                 <h4 className="font-medium text-sm text-muted-foreground">
//                   Tags
//                 </h4>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {formData.tags.map((tag, index) => (
//                     <Badge key={index} variant="outline">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Project Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileText className="w-5 h-5" />
//             Project Summary
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div>
//             <h4 className="font-medium text-sm text-muted-foreground mb-2">
//               Description
//             </h4>
//             <div className="prose prose-sm max-w-none">
//               <TinyMCEViewer content={formData.description} />
//             </div>
//           </div>

//           <Separator />

//           <div>
//             <h4 className="font-medium text-sm text-muted-foreground mb-2">
//               Objective
//             </h4>
//             <div className="prose prose-sm max-w-none">
//               <TinyMCEViewer content={formData.objective} />
//             </div>
//           </div>

//           <Separator />

//           <div>
//             <h4 className="font-medium text-sm text-muted-foreground mb-2">
//               Methodology
//             </h4>
//             <div className="prose prose-sm max-w-none">
//               <TinyMCEViewer content={formData.methodology} />
//             </div>
//           </div>

//           <Separator />

//           <div>
//             <h4 className="font-medium text-sm text-muted-foreground mb-2">
//               Expected Outcome
//             </h4>
//             <div className="prose prose-sm max-w-none">
//               <TinyMCEViewer content={formData.expectedOutcome} />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Team Members */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="w-5 h-5" />
//             Team Members ({teamMembers.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {teamMembers.length > 0 ? (
//             <div className="space-y-3">
//               {teamMembers.map((member, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-3 border rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={member.avatar}
//                       alt={member.name}
//                       className="w-8 h-8 rounded-full"
//                     />
//                     <div>
//                       <p className="font-medium">{member.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {member.email}
//                       </p>
//                     </div>
//                   </div>
//                   <Badge
//                     variant={member.role === "Leader" ? "default" : "secondary"}
//                   >
//                     {member.role}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-muted-foreground text-center py-4">
//               No team members added. You can add team members after project
//               creation.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Submission */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Submit Project Registration</CardTitle>
//           <CardDescription>
//             Please review all information above carefully. Once submitted, your
//             project will be sent to staff for review and approval.
//           </CardDescription>
//         </CardHeader>
//         <CardFooter className="flex justify-between">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onPrevStep}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Previous Step
//           </Button>
//           <Button
//             type="submit"
//             onClick={onSubmit}
//             disabled={isLoading}
//             className="flex items-center gap-2"
//           >
//             {isLoading ? (
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//             ) : (
//               <Send className="w-4 h-4" />
//             )}
//             {isLoading ? "Submitting..." : "Submit Project"}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };
