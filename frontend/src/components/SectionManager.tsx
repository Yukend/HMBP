import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import { ItemForm } from "@/components/ItemForm";
import { ItemList } from "@/components/ItemList";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface Item {
  id: string;
  description: string;
  originalPrice: number;
  buyingPrice: number;
  offerName?: string;
  model?: string;
  brand?: string;
  quantity: number;
  date: string;
  category: string;
  notes?: string;
}

interface SectionManagerProps {
  title: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

export const SectionManager = ({ title, description, category, icon }: SectionManagerProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique brands for filter
  const uniqueBrands = useMemo(() => {
    const brands = items.map(item => item.brand).filter(Boolean);
    return Array.from(new Set(brands));
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.offerName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Brand filter
      const matchesBrand = filterBrand === "all" || item.brand === filterBrand;

      // Price filter
      const matchesMinPrice = minPrice === "" || item.buyingPrice >= parseFloat(minPrice);
      const matchesMaxPrice = maxPrice === "" || item.buyingPrice <= parseFloat(maxPrice);

      return matchesSearch && matchesBrand && matchesMinPrice && matchesMaxPrice;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "price-desc":
          return b.buyingPrice - a.buyingPrice;
        case "price-asc":
          return a.buyingPrice - b.buyingPrice;
        case "savings-desc":
          return ((b.originalPrice - b.buyingPrice) * b.quantity) - ((a.originalPrice - a.buyingPrice) * a.quantity);
        case "name-asc":
          return a.description.localeCompare(b.description);
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchQuery, sortBy, filterBrand, minPrice, maxPrice]);

  const totalAmount = filteredItems.reduce((sum, item) => sum + item.buyingPrice * item.quantity, 0);
  const totalSavings = filteredItems.reduce((sum, item) => sum + (item.originalPrice - item.buyingPrice) * item.quantity, 0);

  const handleAddItem = (item: Omit<Item, "id" | "category">) => {
    const newItem = { ...item, id: Date.now().toString(), category };
    setItems([newItem, ...items]);
    setIsFormOpen(false);
    toast.success(`${title} item added successfully`);
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setEditingItem(null);
    setIsFormOpen(false);
    toast.success(`${title} item updated successfully`);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success(`${title} item deleted`);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-3xl">${totalAmount.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total buying price
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardDescription>Total Savings</CardDescription>
            <CardTitle className="text-3xl text-success">${totalSavings.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Money saved
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-3">
            <CardDescription>Total Items</CardDescription>
            <CardTitle className="text-3xl">{filteredItems.length} / {items.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Showing / Total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardDescription>Avg. Discount</CardDescription>
            <CardTitle className="text-3xl">
              {filteredItems.length > 0 ? 
                ((totalSavings / filteredItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)) * 100).toFixed(1) + "%"
                : "0%"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Average savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="mb-6">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <span className="text-lg font-semibold">Filters & Search</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {isFilterOpen ? "Hide" : "Show"}
                </span>
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, brand, model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                      <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                      <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                      <SelectItem value="savings-desc">Savings (High to Low)</SelectItem>
                      <SelectItem value="name-asc">Name (A to Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                {uniqueBrands.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select value={filterBrand} onValueChange={setFilterBrand}>
                      <SelectTrigger id="brand">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {uniqueBrands.map((brand) => (
                          <SelectItem key={brand} value={brand!}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Min Price */}
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Min Price</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>

                {/* Max Price */}
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Price</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || sortBy !== "date-desc" || filterBrand !== "all" || minPrice || maxPrice) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSortBy("date-desc");
                    setFilterBrand("all");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Items List */}
      <ItemList
        items={filteredItems}
        onDelete={handleDeleteItem}
        onEdit={handleEdit}
        category={category}
      />

      {/* Item Form Dialog */}
      <ItemForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdateItem : handleAddItem}
        item={editingItem}
        category={category}
      />
    </div>
  );
};
