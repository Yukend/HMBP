import { useState, useEffect } from "react";
import { categoryLimits as categoryLimitsStorage, expenses as expensesStorage, auth } from "@/lib/storage";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CATEGORIES = [
  'Grocery',
  'Clothes',
  'Medical',
  'Home Appliances',
  'Study Materials',
  'Electronics',
  'Other Expenses'
];

const CategoryLimits = () => {
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [spent, setSpent] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchLimits();
    calculateSpent();
  }, []);

  const fetchLimits = () => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const allLimits = categoryLimitsStorage.getAll();
    const userLimits = allLimits.filter(l => l.user_id === currentUser.id);
    
    const limitsMap: Record<string, number> = {};
    userLimits.forEach(l => {
      limitsMap[l.category] = l.limit;
    });
    setLimits(limitsMap);
  };

  const calculateSpent = () => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const spentMap: Record<string, number> = {};
    CATEGORIES.forEach(category => {
      spentMap[category] = expensesStorage.getTotalByCategory(
        currentUser.id, 
        category, 
        currentMonth, 
        currentYear
      );
    });
    setSpent(spentMap);
  };

  const handleSetLimit = (category: string, value: string) => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const limitValue = parseFloat(value);
    if (isNaN(limitValue) || limitValue < 0) {
      toast({ title: "Error", description: "Please enter a valid limit", variant: "destructive" });
      return;
    }

    const existing = categoryLimitsStorage.getByCategory(currentUser.id, category);
    
    try {
      if (existing) {
        categoryLimitsStorage.update(currentUser.id, category, limitValue);
      } else {
        categoryLimitsStorage.create({
          user_id: currentUser.id,
          category,
          limit: limitValue,
        });
      }
      
      setLimits(prev => ({ ...prev, [category]: limitValue }));
      toast({ title: "Success", description: `Limit set for ${category}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to set limit", variant: "destructive" });
    }
  };

  const getPercentage = (category: string) => {
    const limit = limits[category] || 0;
    const spentAmount = spent[category] || 0;
    if (limit === 0) return 0;
    return Math.min((spentAmount / limit) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Category Limits
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Set monthly limit"
                      defaultValue={limits[category] || ''}
                      onBlur={(e) => e.target.value && handleSetLimit(category, e.target.value)}
                    />
                    <DollarSign className="h-10 w-10 text-muted-foreground" />
                  </div>
                  
                  {limits[category] && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${(spent[category] || 0).toFixed(2)}</span>
                        <span>Limit: ${limits[category].toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={getPercentage(category)} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {getPercentage(category).toFixed(1)}% of monthly limit used
                      </p>
                      {getPercentage(category) >= 90 && (
                        <p className="text-xs text-red-500 font-semibold">
                          ⚠️ You're exceeding your limit!
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryLimits;
