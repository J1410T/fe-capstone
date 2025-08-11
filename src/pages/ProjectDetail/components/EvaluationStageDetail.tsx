import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EvaluationStageDetail: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const handleCreateIndividualEvaluation = () => {
    console.log("Navigate to create individual evaluation");
  };

  const handleViewIndividualEvaluation = (individualEvaluationId: string) => {
    navigate(`/project/${projectId}/evaluation/individual/${individualEvaluationId}`);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Evaluation Stage Detail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full border-dashed mb-4"
            onClick={handleCreateIndividualEvaluation}
          >
            Create New Individual Evaluation
          </Button>

          <Accordion type="single" collapsible className="space-y-2">
            {/* Replace with dynamic data */}
            {["Evaluation 1", "Evaluation 2"].map((evaluation, index) => (
              <AccordionItem key={index} value={evaluation} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{evaluation}</h3>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Status
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewIndividualEvaluation(`individual-${index}`)}
                  >
                    View Details
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationStageDetail;
