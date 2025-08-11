import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomModal from "./CustomModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";
import { EnhancedTeamMember, PrincipalInvestigator } from "../types";
import { TinyMCEViewer } from "@/components/ui/tinymce-viewer";
import TinyMCEViewDialog from "./TinyMCEViewDialog";

interface MemberDetailProfileViewProps {
  member: EnhancedTeamMember | PrincipalInvestigator;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const isPrincipalInvestigator = (
  member: EnhancedTeamMember | PrincipalInvestigator
): member is PrincipalInvestigator => {
  return "scientificTitle" in member && !("contribution" in member);
};

export const MemberDetailProfileView: React.FC<
  MemberDetailProfileViewProps
> = ({ member, isOpen, onClose, title }) => {
  const [showCVDialog, setShowCVDialog] = React.useState(false);
  const isPI = isPrincipalInvestigator(member);
  const enhancedMember = !isPI ? (member as EnhancedTeamMember) : null;

  const renderPersonalInformation = () => {
    if (isPI) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Date of Birth:</span>
              <div className="mt-1">
                {new Date(member.dateOfBirth).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Gender:</span>
              <div className="mt-1">{member.gender}</div>
            </div>
          </div>
        </div>
      );
    } else if (enhancedMember?.detailedInfo?.personalInfo) {
      const personalInfo = enhancedMember.detailedInfo.personalInfo;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Birth Year:</span>
              <div className="mt-1">{personalInfo.birthYear}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Gender:</span>
              <div className="mt-1">{personalInfo.gender}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Place of Birth:</span>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                {personalInfo.placeOfBirth}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Native Place:</span>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                {personalInfo.nativePlace}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderContactInformation = () => {
    if (isPI) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{member.phone}</span>
          </div>
        </div>
      );
    } else if (enhancedMember?.detailedInfo?.contactInfo) {
      const contactInfo = enhancedMember.detailedInfo.contactInfo;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{contactInfo.contactEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{contactInfo.contactPhone}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderAcademicInformation = () => {
    if (isPI) {
      return (
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Academic Title:</span>
            <div className="mt-1">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <GraduationCap className="h-3 w-3 mr-1" />
                {member.academicTitle}
              </Badge>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Scientific Title:</span>
            <div className="mt-1">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <Award className="h-3 w-3 mr-1" />
                {member.scientificTitle}
              </Badge>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Specialization:</span>
            <div className="mt-1">{member.specialization}</div>
          </div>
        </div>
      );
    } else if (enhancedMember?.detailedInfo?.academicInfo) {
      const academicInfo = enhancedMember.detailedInfo.academicInfo;
      return (
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Academic Title:</span>
            <div className="mt-1">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <GraduationCap className="h-3 w-3 mr-1" />
                {academicInfo.academicTitle}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Year Obtained:</span>
              <div className="mt-1">{academicInfo.academicTitleYear}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Institution:</span>
              <div className="mt-1">
                {academicInfo.academicTitleInstitution}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderWorkInformation = () => {
    if (isPI) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{member.workUnit}</span>
          </div>
          <div className="text-sm text-gray-600 ml-6">{member.workAddress}</div>
        </div>
      );
    } else if (enhancedMember?.detailedInfo?.workInfo) {
      const workInfo = enhancedMember.detailedInfo.workInfo;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{workInfo.workUnitName}</span>
          </div>
          <div className="text-sm text-gray-600 ml-6">
            {workInfo.workUnitAddress}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-500" />
              <span>{workInfo.workUnitPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-500" />
              <span>{workInfo.workUnitEmail}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderEducationHistory = () => {
    const educationHistory = enhancedMember?.detailedInfo?.educationHistory;
    if (!educationHistory || educationHistory.length === 0) return null;

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Graduation Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educationHistory.map((education, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {education.level}
                  </Badge>
                </TableCell>
                <TableCell>{education.institution}</TableCell>
                <TableCell>{education.major}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    {education.graduationYear}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || `${member.name} - Detailed Profile`}
      width="85vw"
      height="98vh"
    >
      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>{renderPersonalInformation()}</CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>{renderContactInformation()}</CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent>{renderAcademicInformation()}</CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent>{renderWorkInformation()}</CardContent>
        </Card>

        {/* Education History */}
        {enhancedMember?.detailedInfo?.educationHistory && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Education History
              </CardTitle>
            </CardHeader>
            <CardContent>{renderEducationHistory()}</CardContent>
          </Card>
        )}

        {/* Project Contribution (for team members) */}
        {!isPI && enhancedMember && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Project Contribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">
                    Contribution:
                  </span>
                  <div className="mt-1">{enhancedMember.contribution}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Work Duration:
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {enhancedMember.workDuration}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scientific CV */}
        {enhancedMember?.cv && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Scientific CV
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCVDialog(true)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Full Screen View
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TinyMCEViewer content={enhancedMember.cv} height={400} />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Click "Full Screen View" for better readability
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* TinyMCE Full Screen Dialog */}
      {enhancedMember?.cv && (
        <TinyMCEViewDialog
          isOpen={showCVDialog}
          onClose={() => setShowCVDialog(false)}
          title={`${member.name} - Scientific CV`}
          content={enhancedMember.cv}
          height={800}
        />
      )}
    </CustomModal>
  );
};

export default MemberDetailProfileView;
