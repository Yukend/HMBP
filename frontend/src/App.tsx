import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Grocery from "./pages/Grocery";
import Clothes from "./pages/Clothes";
import Medical from "./pages/Medical";
import HomeAppliances from "./pages/HomeAppliances";
import StudyMaterials from "./pages/StudyMaterials";
import Electronics from "./pages/Electronics";
import OtherExpenses from "./pages/OtherExpenses";
import Funds from "./pages/Funds";
import Savings from "./pages/Savings";
import Assets from "./pages/Assets";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Social from "./pages/Social";
import Marketplace from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import CategoryLimits from "./pages/CategoryLimits";
import Reminders from "./pages/Reminders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/grocery" element={<ProtectedRoute><Grocery /></ProtectedRoute>} />
          <Route path="/clothes" element={<ProtectedRoute><Clothes /></ProtectedRoute>} />
          <Route path="/medical" element={<ProtectedRoute><Medical /></ProtectedRoute>} />
          <Route path="/home-appliances" element={<ProtectedRoute><HomeAppliances /></ProtectedRoute>} />
          <Route path="/study-materials" element={<ProtectedRoute><StudyMaterials /></ProtectedRoute>} />
          <Route path="/electronics" element={<ProtectedRoute><Electronics /></ProtectedRoute>} />
          <Route path="/other-expenses" element={<ProtectedRoute><OtherExpenses /></ProtectedRoute>} />
          <Route path="/funds" element={<ProtectedRoute><Funds /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
            <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/category-limits" element={<ProtectedRoute><CategoryLimits /></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
