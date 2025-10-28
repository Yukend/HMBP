import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Item } from "@/components/SectionManager";

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: any) => void;
  item?: Item | null;
  category: string;
}

export const ItemForm = ({ open, onOpenChange, onSubmit, item, category }: ItemFormProps) => {
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [offerName, setOfferName] = useState("");
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setDescription(item.description);
      setOriginalPrice(item.originalPrice.toString());
      setBuyingPrice(item.buyingPrice.toString());
      setOfferName(item.offerName || "");
      setModel(item.model || "");
      setBrand(item.brand || "");
      setQuantity(item.quantity.toString());
      setDate(item.date);
      setNotes(item.notes || "");
    } else {
      setDescription("");
      setOriginalPrice("");
      setBuyingPrice("");
      setOfferName("");
      setModel("");
      setBrand("");
      setQuantity("1");
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !originalPrice || !buyingPrice || !quantity || !date) return;

    onSubmit({
      ...(item && { id: item.id }),
      description,
      originalPrice: parseFloat(originalPrice),
      buyingPrice: parseFloat(buyingPrice),
      offerName: offerName || undefined,
      model: model || undefined,
      brand: brand || undefined,
      quantity: parseInt(quantity),
      date,
      notes: notes || undefined,
    });

    // Reset form
    setDescription("");
    setOriginalPrice("");
    setBuyingPrice("");
    setOfferName("");
    setModel("");
    setBrand("");
    setQuantity("1");
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
          <DialogDescription>
            {item ? "Update item details below" : "Enter item details below"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Item name/description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g. Samsung, Nike"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="Model number/name"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price ($) *</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyingPrice">Buying Price ($) *</Label>
              <Input
                id="buyingPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="offerName">Offer Name</Label>
              <Input
                id="offerName"
                placeholder="e.g. Black Friday, Clearance Sale"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or details"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {originalPrice && buyingPrice && parseFloat(originalPrice) > parseFloat(buyingPrice) && (
            <div className="rounded-lg bg-success/10 p-3 border border-success/20">
              <p className="text-sm font-medium text-success">
                💰 You're saving ${(parseFloat(originalPrice) - parseFloat(buyingPrice)).toFixed(2)} 
                ({(((parseFloat(originalPrice) - parseFloat(buyingPrice)) / parseFloat(originalPrice)) * 100).toFixed(1)}% off)
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {item ? "Update" : "Add"} Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
