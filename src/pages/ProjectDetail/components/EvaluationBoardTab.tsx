import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui";
import { useNavigate, useParams } from "react-router-dom";
import { EvaluationStage } from "@/types/task";

interface EvaluationBoardTabProps {
  evaluationStages: EvaluationStage[];
}

const EvaluationBoardTab: React.FC<EvaluationBoardTabProps> = ({
  evaluationStages,
}) => {
  const evaluations = evaluationStages.map((stage) => ({
    id: stage.id,
    code: stage.name, // Adjust as needed
    title: stage.name, // Adjust as needed
    createDate: "", // Adjust as needed
    status: stage.status,
    evaluationStages: [stage],
  }));

  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  const handleStageClick = (stageId: string) => {
    navigate(`/project/${projectId}/evaluation/stage/${stageId}`);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
          Evaluation Board
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Overview of evaluation progress across all stages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="mt-4">
          {evaluations.map((evaluation) => (
            <AccordionItem
              key={evaluation.id}
              value={evaluation.id}
              className="border rounded-lg mb-3 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline px-5 py-4 bg-gray-50 hover:bg-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {evaluation.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <span>Code: {evaluation.code}</span>
                      <span className="flex items-center gap-1">
                        Created: {evaluation.createDate}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(evaluation.status)}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 bg-gray-50">
                <div className="space-y-4">
                  {evaluation.evaluationStages
                    .sort((a, b) => a.stageOrder - b.stageOrder)
                    .map((stage, index) => (
                      <div
                        key={stage.id}
                        className="flex items-center justify-between border border-gray-200 rounded-lg bg-white px-6 py-4 hover:bg-gray-50"
                      >
                        {/* Left */}
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-base font-medium text-gray-900">
                              {stage.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {stage.type} • {stage.phrase}
                            </p>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-3">
                          {getStatusBadge(stage.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-4 text-sm border-gray-300"
                            onClick={() => handleStageClick(stage.id)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EvaluationBoardTab;
