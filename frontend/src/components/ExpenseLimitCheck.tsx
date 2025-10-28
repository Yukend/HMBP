import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExpenseLimitCheckProps {
  category: string;
  currentSpent: number;
  limit: number;
  newAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExpenseLimitCheck = ({
  category,
  currentSpent,
  limit,
  newAmount,
  onConfirm,
  onCancel,
}: ExpenseLimitCheckProps) => {
  const totalAfter = currentSpent + newAmount;
  const exceededBy = totalAfter - limit;
  const percentageUsed = ((totalAfter / limit) * 100).toFixed(1);

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500 flex items-center gap-2">
            ⚠️ Exceeding Category Limit!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to exceed your monthly limit for <strong>{category}</strong>.
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Current spent:</span>
                <span className="font-semibold">${currentSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>New expense:</span>
                <span className="font-semibold">${newAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total after:</span>
                <span className="font-semibold">${totalAfter.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly limit:</span>
                <span className="font-semibold">${limit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500 font-bold border-t pt-2">
                <span>Exceeded by:</span>
                <span>${exceededBy.toFixed(2)}</span>
              </div>
              <div className="text-center pt-2 text-red-500 font-semibold">
                {percentageUsed}% of monthly limit
              </div>
            </div>
            <p className="text-foreground">
              Do you want to proceed with this expense?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Yes, Add Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
