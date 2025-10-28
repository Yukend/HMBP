import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { BudgetOverview } from "@/components/BudgetOverview";
import { SpendingChart } from "@/components/SpendingChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { toast } from "sonner";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", amount: 450, category: "Groceries", description: "Weekly shopping", date: "2025-10-20" },
    { id: "2", amount: 80, category: "Transport", description: "Fuel", date: "2025-10-22" },
    { id: "3", amount: 1200, category: "Electronics", description: "New phone", date: "2025-10-18" },
    { id: "4", amount: 350, category: "Dining", description: "Restaurant", date: "2025-10-15" },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthExpenses = expenses.filter(
    (exp) => new Date(exp.date).getMonth() === new Date().getMonth()
  );
  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses([newExpense, ...expenses]);
    setIsFormOpen(false);
    toast.success("Expense added successfully");
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)));
    setEditingExpense(null);
    setIsFormOpen(false);
    toast.success("Expense updated successfully");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast.success("Expense deleted");
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">Track, analyze, and optimize your finances</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Expense
          </Button>
        </div>
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-3xl">${totalExpenses.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-accent" />
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">${thisMonthTotal.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <PieChart className="h-4 w-4 text-primary" />
                {thisMonthExpenses.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="pb-3">
              <CardDescription>Average Per Day</CardDescription>
              <CardTitle className="text-3xl">
                ${(thisMonthTotal / new Date().getDate()).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-warning" />
                Current month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget & Charts */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <SpendingChart expenses={expenses} />
          </div>
          <div>
            <BudgetOverview expenses={thisMonthExpenses} />
          </div>
        </div>

        {/* Category Breakdown & Expense List */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <CategoryBreakdown expenses={expenses} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>

      {/* Expense Form Dialog */}
      <ExpenseForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        expense={editingExpense}
      />
    </Layout>
  );
};

export default Index;
