import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Wallet, 
  ShoppingCart, 
  Shirt, 
  Heart, 
  Home, 
  BookOpen, 
  Laptop, 
  MoreHorizontal,
  TrendingUp,
  PiggyBank,
  Package,
  LogOut,
  Users,
  ShoppingBag,
  BarChart3,
  MessageCircle,
  Settings,
  Bell,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LayoutProps {
  children: ReactNode;
}

const defaultSections = [
  { path: "/", label: "Dashboard", icon: Wallet, removable: false },
  { path: "/analytics", label: "Analytics", icon: BarChart3, removable: false },
  { path: "/category-limits", label: "Category Limits", icon: Settings, removable: false },
  { path: "/reminders", label: "Reminders", icon: Bell, removable: false },
];

const availableSections = [
  { path: "/grocery", label: "Grocery", icon: ShoppingCart },
  { path: "/clothes", label: "Clothes", icon: Shirt },
  { path: "/medical", label: "Medical", icon: Heart },
  { path: "/home-appliances", label: "Home Appliances", icon: Home },
  { path: "/study-materials", label: "Study Materials", icon: BookOpen },
  { path: "/electronics", label: "Electronics", icon: Laptop },
  { path: "/other-expenses", label: "Other Expenses", icon: MoreHorizontal },
  { path: "/funds", label: "Funds", icon: TrendingUp },
  { path: "/savings", label: "Savings", icon: PiggyBank },
  { path: "/assets", label: "Assets", icon: Package },
  { path: "/social", label: "Social", icon: Users },
  { path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { path: "/messages", label: "Messages", icon: MessageCircle },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activePaths, setActivePaths] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // All sections combined for lookup
  const allSections = [...defaultSections, ...availableSections];

  useEffect(() => {
    const stored = localStorage.getItem("activeSectionPaths");
    if (stored) {
      setActivePaths(JSON.parse(stored));
    } else {
      const defaultPaths = defaultSections.map(s => s.path);
      setActivePaths(defaultPaths);
      localStorage.setItem("activeSectionPaths", JSON.stringify(defaultPaths));
    }
  }, []);

  const activeSections = activePaths
    .map(path => allSections.find(s => s.path === path))
    .filter(Boolean);

  const handleAddSection = (section: typeof availableSections[0]) => {
    const newPaths = [...activePaths, section.path];
    setActivePaths(newPaths);
    localStorage.setItem("activeSectionPaths", JSON.stringify(newPaths));
    setShowAddDialog(false);
    toast({
      title: "Section added",
      description: `${section.label} has been added to your sidebar.`,
    });
  };

  const handleRemoveSection = (path: string) => {
    const newPaths = activePaths.filter(p => p !== path);
    setActivePaths(newPaths);
    localStorage.setItem("activeSectionPaths", JSON.stringify(newPaths));
    const section = allSections.find(s => s.path === path);
    toast({
      title: "Section removed",
      description: `${section?.label} has been removed from your sidebar.`,
    });
  };

  const handleLogout = () => {
    auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const availableToAdd = availableSections.filter(
    (section) => !activePaths.includes(section.path)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card hidden md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b p-6">
            <Link to="/" className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Home Management</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {activeSections.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isRemovable = !defaultSections.find(d => d.path === item.path);
                
                return (
                  <li key={item.path} className="group relative">
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                    {isRemovable && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveSection(item.path);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Add Section Button */}
            {availableToAdd.length > 0 && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4 justify-start gap-3">
                    <Plus className="h-5 w-5" />
                    Add Section
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Section</DialogTitle>
                    <DialogDescription>
                      Choose a section to add to your sidebar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 py-4">
                    {availableToAdd.map((section) => {
                      const Icon = section.icon;
                      return (
                        <Button
                          key={section.path}
                          variant="outline"
                          className="justify-start gap-3"
                          onClick={() => handleAddSection(section)}
                        >
                          <Icon className="h-5 w-5" />
                          {section.label}
                        </Button>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};
