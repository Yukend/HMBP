import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Expense } from "@/pages/Index";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseList = ({ expenses, onDelete, onEdit }: ExpenseListProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Groceries: "bg-chart-2/10 text-chart-2 border-chart-2/20",
      Transport: "bg-chart-1/10 text-chart-1 border-chart-1/20",
      Electronics: "bg-chart-4/10 text-chart-4 border-chart-4/20",
      Dining: "bg-chart-3/10 text-chart-3 border-chart-3/20",
      Utilities: "bg-chart-5/10 text-chart-5 border-chart-5/20",
      Healthcare: "bg-destructive/10 text-destructive border-destructive/20",
      Entertainment: "bg-primary/10 text-primary border-primary/20",
      Shopping: "bg-accent/10 text-accent border-accent/20",
      Education: "bg-info/10 text-info border-info/20",
      Others: "bg-muted text-muted-foreground border-border",
    };
    return colors[category] || colors.Others;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No expenses yet. Add your first one!</p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium text-foreground">{expense.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-foreground">${expense.amount.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(expense)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(expense.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
