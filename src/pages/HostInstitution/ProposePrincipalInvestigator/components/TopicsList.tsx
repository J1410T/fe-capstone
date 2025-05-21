import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Clock, CheckCircle } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  department: string;
  createdAt: string;
  applicants: number;
  status: string;
}

interface TopicsListProps {
  topics: Topic[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewApplicants: (topicId: number) => void;
}

export const TopicsList: React.FC<TopicsListProps> = ({
  topics,
  searchTerm,
  onSearchChange,
  onViewApplicants,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Topics Waiting for PI</CardTitle>
            <CardDescription>
              Research topics that need principal investigators
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search topics..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No topics found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">
                    {topic.title}
                  </TableCell>
                  <TableCell>{topic.department}</TableCell>
                  <TableCell>{topic.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{topic.applicants}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        topic.status === "Waiting for PI"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border-emerald-200"
                      }
                    >
                      {topic.status === "Waiting for PI" ? (
                        <Clock className="mr-1 h-3 w-3" />
                      ) : (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {topic.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplicants(topic.id)}
                      disabled={topic.applicants === 0}
                    >
                      {topic.applicants > 0
                        ? "View Applicants"
                        : "No Applicants"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
