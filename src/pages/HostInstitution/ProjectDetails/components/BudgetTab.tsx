import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, BarChart, Users, Briefcase, Calendar, ClipboardList, BookOpen } from "lucide-react";

interface BudgetAllocation {
  [key: string]: string;
}

interface BudgetTabProps {
  total: string;
  spent: string;
  allocated: BudgetAllocation;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  total,
  spent,
  allocated,
}) => {
  const getRemainingBudget = () => {
    const totalValue = parseInt(total.replace(/\$|,/g, ""));
    const spentValue = parseInt(spent.replace(/\$|,/g, ""));
    return `$${totalValue - spentValue}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "personnel":
        return <Users className="h-5 w-5 mr-3 text-primary" />;
      case "equipment":
        return <Briefcase className="h-5 w-5 mr-3 text-primary" />;
      case "travel":
        return <Calendar className="h-5 w-5 mr-3 text-primary" />;
      case "materials":
        return <ClipboardList className="h-5 w-5 mr-3 text-primary" />;
      default:
        return <BookOpen className="h-5 w-5 mr-3 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Budget</CardTitle>
        <CardDescription>Financial information and budget allocation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
            <DollarSign className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              Total Budget
            </p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">Spent</p>
            <p className="text-2xl font-bold">{spent}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
            <BarChart className="h-8 w-8 text-emerald-600 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              Remaining
            </p>
            <p className="text-2xl font-bold">{getRemainingBudget()}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Budget Allocation
          </h3>
          <div className="space-y-3">
            {Object.entries(allocated).map(([category, amount], index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center">
                  {getCategoryIcon(category)}
                  <span className="capitalize">{category}</span>
                </div>
                <span className="font-medium">{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
