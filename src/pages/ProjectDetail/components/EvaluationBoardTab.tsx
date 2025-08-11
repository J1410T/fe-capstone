import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { EvaluationStage, EvaluationSummary } from "@/types/task";

const mockEvaluations = [
  {
    id: "d921b763-7f62-4b1f-8368-07f7b017774a",
    code: "EVA-SRPM01082025",
    title: "Đánh Giá Đề Cương",
    createDate: "2025-08-01T18:05:19.86",
    status: "created",
    evaluationStages: [
      {
        id: "6ec036a3-b0a3-4e4c-8ac2-156a0c732d84",
        name: "Đánh giá cuối cùng",
        stageOrder: 3,
        phrase: "decision",
        type: "project",
        status: "created",
      },
      {
        id: "90e108b6-e376-4b2f-81e1-876b7c958d0d",
        name: "Đánh giá sơ bộ",
        stageOrder: 1,
        phrase: "review",
        type: "project",
        status: "created",
      },
      {
        id: "7f5641b6-9e01-4ad6-a8fe-f167a300e165",
        name: "Đánh giá hồ sơ",
        stageOrder: 2,
        phrase: "review",
        type: "milestone",
        status: "created",
      },
    ],
  },
  {
    id: "2897adef-0c43-4c35-9abf-4d53a6e13be1",
    code: "EVA-SRPM01082025",
    title: "Đánh Giá Đề Cương",
    createDate: "2025-08-01T18:05:19.86",
    status: "created",
    evaluationStages: [
      {
        id: "bef06572-aa7a-498f-a9ad-023f5987e71b",
        name: "Đánh giá cuối cùng",
        stageOrder: 3,
        phrase: "decision",
        type: "project",
        status: "created",
      },
      {
        id: "3af7f963-6d1a-4f24-bc59-d598892194dd",
        name: "Đánh giá sơ bộ",
        stageOrder: 1,
        phrase: "review",
        type: "project",
        status: "created",
      },
      {
        id: "ac266645-0a36-4810-b148-dd52038cf6a7",
        name: "Đánh giá hồ sơ",
        stageOrder: 2,
        phrase: "review",
        type: "milestone",
        status: "created",
      },
    ],
  },
];

interface EvaluationBoardTabProps {
  evaluationStages: EvaluationStage[];
  evaluationSummary: EvaluationSummary;
}

const EvaluationBoardTab: React.FC<EvaluationBoardTabProps> = ({
  evaluationStages,
  evaluationSummary,
}) => {
  const [evaluations] = useState(mockEvaluations);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const handleStageClick = (stageId: string) => {
    navigate(`/project/${projectId}/evaluation/stage/${stageId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1"
          >
            <CheckCircle2 size={14} /> Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1"
          >
            <Clock size={14} /> In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1"
          >
            <AlertCircle size={14} /> Pending
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-700 border-gray-300"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Overall Evaluation
      </h1>

      {evaluations.map((evaluation) => (
        <Card
          key={evaluation.id}
          className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {evaluation.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>Code: {evaluation.code}</span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} /> {evaluation.createDate}
                </span>
              </div>
            </div>
            {getStatusBadge(evaluation.status)}
          </CardHeader>

          <CardContent>
            <Accordion type="single" collapsible className="mt-2">
              {evaluation.evaluationStages
                .sort((a, b) => a.stageOrder - b.stageOrder)
                .map((stage) => (
                  <AccordionItem
                    key={stage.id}
                    value={stage.id}
                    className="border rounded-lg mb-2 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline px-4 py-3 bg-gray-50 hover:bg-gray-100">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {stage.name}
                          </h3>
                        </div>
                        {getStatusBadge(stage.status)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-white">
                      <p className="text-sm text-gray-600">
                        <strong>Type:</strong> {stage.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phrase:</strong> {stage.phrase}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStageClick(stage.id)}
                        className="mt-3"
                      >
                        View Details
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Evaluation Summary
        </h2>
        <p className="text-sm text-gray-600">
          Total Evaluations: {evaluationSummary.totalEvaluations}
        </p>
        <p className="text-sm text-gray-600">
          Total Stages: {evaluationSummary.totalStages}
        </p>
        <p className="text-sm text-gray-600">
          Overall Status: {evaluationSummary.overallStatus}
        </p>

        <h3 className="text-lg font-medium text-gray-900 mt-4">
          Evaluation Stages
        </h3>
        <ul className="list-disc list-inside">
          {evaluationStages.map((stage) => (
            <li key={stage.id} className="text-sm text-gray-700">
              {stage.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EvaluationBoardTab;
