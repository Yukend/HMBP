import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Expense } from "@/pages/Index";

interface BudgetOverviewProps {
  expenses: Expense[];
}

export const BudgetOverview = ({ expenses }: BudgetOverviewProps) => {
  const budgets = {
    Groceries: 800,
    Transport: 300,
    Electronics: 1500,
    Dining: 500,
    Utilities: 400,
    Healthcare: 600,
    Entertainment: 300,
    Shopping: 700,
    Education: 500,
    Others: 400,
  };

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-accent";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
        <CardDescription>Monthly budget tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(budgets).map(([category, budget]) => {
            const spent = categoryTotals[category] || 0;
            const percentage = (spent / budget) * 100;
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{category}</span>
                  <span className="text-muted-foreground">
                    ${spent.toFixed(0)} / ${budget}
                  </span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2"
                  indicatorClassName={getProgressColor(percentage)}
                />
                <p className="text-xs text-muted-foreground">
                  {percentage >= 100
                    ? `Over budget by $${(spent - budget).toFixed(2)}`
                    : `$${(budget - spent).toFixed(2)} remaining`}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
