import { ReactNode } from "react";
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
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: Wallet },
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
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/category-limits", label: "Category Limits", icon: Settings },
  { path: "/reminders", label: "Reminders", icon: Bell },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

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
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
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
                  </li>
                );
              })}
            </ul>
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
