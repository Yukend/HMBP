import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expense } from "@/pages/Index";
import { categoryLimits, expenses as expensesStorage, auth } from "@/lib/storage";
import { ExpenseLimitCheck } from "./ExpenseLimitCheck";

const CATEGORIES = [
  "Grocery",
  "Clothes",
  "Medical",
  "Home Appliances",
  "Study Materials",
  "Electronics",
  "Other Expenses",
];

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expense: any) => void;
  expense?: Expense | null;
}

export const ExpenseForm = ({ open, onOpenChange, onSubmit, expense }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [limitCheckData, setLimitCheckData] = useState<{
    currentSpent: number;
    limit: number;
    newAmount: number;
  } | null>(null);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
      setDate(expense.date);
    } else {
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [expense]);

  const checkCategoryLimit = (cat: string, amt: number): boolean => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return true;

    const limit = categoryLimits.getByCategory(currentUser.id, cat);
    if (!limit) return true; // No limit set, allow

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentSpent = expensesStorage.getTotalByCategory(
      currentUser.id, 
      cat, 
      currentMonth, 
      currentYear
    );

    const totalAfter = currentSpent + amt;
    
    if (totalAfter > limit.limit) {
      setLimitCheckData({
        currentSpent,
        limit: limit.limit,
        newAmount: amt,
      });
      setShowLimitWarning(true);
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) return;

    const amountValue = parseFloat(amount);

    // Check if we need to warn about limit
    if (!expense && !checkCategoryLimit(category, amountValue)) {
      return; // Will show warning dialog
    }

    submitExpense();
  };

  const submitExpense = () => {
    onSubmit({
      ...(expense && { id: expense.id }),
      amount: parseFloat(amount),
      category,
      description,
      date,
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setShowLimitWarning(false);
    setLimitCheckData(null);
  };

  const handleLimitConfirm = () => {
    setShowLimitWarning(false);
    submitExpense();
  };

  const handleLimitCancel = () => {
    setShowLimitWarning(false);
    setLimitCheckData(null);
  };

  return (
    <>
      {showLimitWarning && limitCheckData && (
        <ExpenseLimitCheck
          category={category}
          currentSpent={limitCheckData.currentSpent}
          limit={limitCheckData.limit}
          newAmount={limitCheckData.newAmount}
          onConfirm={handleLimitConfirm}
          onCancel={handleLimitCancel}
        />
      )}
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{expense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
            <DialogDescription>
              {expense ? "Update expense details below" : "Enter your expense details below"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What did you buy?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {expense ? "Update" : "Add"} Expense
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
