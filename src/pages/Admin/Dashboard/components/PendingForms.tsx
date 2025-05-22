import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

interface FormData {
  type: string;
  count: number;
}

interface PendingFormsProps {
  data: FormData[];
}

export const PendingForms: React.FC<PendingFormsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Forms</CardTitle>
        <CardDescription>Forms awaiting review</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((form) => (
            <div key={form.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>{form.type}</span>
              </div>
              <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                {form.count} pending
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
