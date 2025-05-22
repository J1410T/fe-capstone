import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Download,
  User,
  Mail,
  Phone,
  Building,
  BookOpen,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  institution: string;
  experience: string;
  publications: number;
  degrees: string[];
  status: string;
  appliedFor: number;
  appliedDate: string;
  documents: { name: string; url: string }[];
}

interface ApplicantProfileProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (applicantId: number) => void;
  onReject: (applicantId: number) => void;
  onRequestRevision: (applicantId: number) => void;
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({
  applicant,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestRevision,
}) => {
  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Applicant Profile</DialogTitle>
          <DialogDescription>
            Review the applicant's qualifications and documents
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Name:</span> {applicant.name}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span> {applicant.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span> {applicant.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Institution:</span>{" "}
                  {applicant.institution}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Department:</span>{" "}
                  {applicant.department}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Experience:</span>{" "}
                  {applicant.experience}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Publications:</span>{" "}
                  {applicant.publications}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Applied Date:</span>{" "}
                  {applicant.appliedDate}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Academic Degrees</h3>
              <ul className="space-y-1">
                {applicant.degrees.map((degree, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    {degree}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="space-y-4">
              {applicant.documents.map((doc, index) => (
                <Card key={index}>
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{doc.name}</CardTitle>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle>Council Evaluation</CardTitle>
                <CardDescription>
                  Evaluate this Principal Investigator applicant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Evaluation Criteria</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Academic qualifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Research experience
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Publication record
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Relevance to research topic
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Current Status</h3>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {applicant.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => onRequestRevision(applicant.id)}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Request Revision
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onReject(applicant.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={() => onApprove(applicant.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantProfile;
