import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

export interface DegreeRequirements {
  piMinDegree: string;
  memberMinDegree: string;
  councilMinDegree: string;
  requireCV: boolean;
  requirePublications: boolean;
  minPublications: number;
}

interface AcademicRequirementsTabProps {
  degreeRequirements: DegreeRequirements;
  onDegreeRequirementsChange: (
    field: keyof DegreeRequirements,
    value: string | number | boolean
  ) => void;
  onSave: () => void;
}

export const AcademicRequirementsTab: React.FC<
  AcademicRequirementsTabProps
> = ({ degreeRequirements, onDegreeRequirementsChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Degree & CV Requirements</CardTitle>
        <CardDescription>
          Configure minimum academic qualifications and CV requirements for
          different roles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="piMinDegree">
              Minimum Degree for Principal Investigators
            </Label>
            <Select
              value={degreeRequirements.piMinDegree}
              onValueChange={(value) =>
                onDegreeRequirementsChange("piMinDegree", value)
              }
            >
              <SelectTrigger id="piMinDegree">
                <SelectValue placeholder="Select minimum degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="Master">Master's Degree</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Professor">Professor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberMinDegree">
              Minimum Degree for Team Members
            </Label>
            <Select
              value={degreeRequirements.memberMinDegree}
              onValueChange={(value) =>
                onDegreeRequirementsChange("memberMinDegree", value)
              }
            >
              <SelectTrigger id="memberMinDegree">
                <SelectValue placeholder="Select minimum degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Requirement</SelectItem>
                <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="Master">Master's Degree</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="councilMinDegree">
              Minimum Degree for Council Members
            </Label>
            <Select
              value={degreeRequirements.councilMinDegree}
              onValueChange={(value) =>
                onDegreeRequirementsChange("councilMinDegree", value)
              }
            >
              <SelectTrigger id="councilMinDegree">
                <SelectValue placeholder="Select minimum degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Master">Master's Degree</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Professor">Professor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minPublications">Minimum Publications for PI</Label>
            <Input
              id="minPublications"
              type="number"
              value={degreeRequirements.minPublications}
              onChange={(e) =>
                onDegreeRequirementsChange(
                  "minPublications",
                  parseInt(e.target.value)
                )
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="requireCV">Require CV Upload</Label>
            <Switch
              id="requireCV"
              checked={degreeRequirements.requireCV}
              onCheckedChange={(checked) =>
                onDegreeRequirementsChange("requireCV", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="requirePublications">
              Require Publication History
            </Label>
            <Switch
              id="requirePublications"
              checked={degreeRequirements.requirePublications}
              onCheckedChange={(checked) =>
                onDegreeRequirementsChange("requirePublications", checked)
              }
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
