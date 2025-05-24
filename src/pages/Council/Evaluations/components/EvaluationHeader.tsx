import React from "react";

interface EvaluationHeaderProps {
  title: string;
  description: string;
}

export const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
