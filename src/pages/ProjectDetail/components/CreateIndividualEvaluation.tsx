import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";

const CreateIndividualEvaluation: React.FC = () => {
  const [evaluator, setEvaluator] = useState("");
  const [score, setScore] = useState(0);
  const [comments, setComments] = useState("");

  const handleEditorChange = (content: string) => {
    setComments(content);
  };

  const handleSubmit = () => {
    const evaluationData = {
      evaluator,
      score,
      comments,
    };

    console.log("Submitting evaluation:", evaluationData);
    // Add API call logic here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Individual Evaluation</h1>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Evaluator Name
        </label>
        <input
          type="text"
          value={evaluator}
          onChange={(e) => setEvaluator(e.target.value)}
          className="block w-full border rounded-md p-2"
        />

        <label className="block text-sm font-medium text-gray-700">
          Score
        </label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="block w-full border rounded-md p-2"
        />

        <label className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <Editor
          apiKey="your-tinymce-api-key"
          value={comments}
          init={{
            height: 300,
            menubar: false,
            plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table paste code help wordcount"],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          }}
          onEditorChange={handleEditorChange}
        />

        <Button onClick={handleSubmit} className="mt-4">
          Submit Evaluation
        </Button>
      </div>
    </div>
  );
};

export default CreateIndividualEvaluation;
