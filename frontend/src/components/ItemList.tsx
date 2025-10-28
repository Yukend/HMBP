import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { Item } from "@/components/SectionManager";

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
  category: string;
}

export const ItemList = ({ items, onDelete, onEdit }: ItemListProps) => {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>No items found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No items match your filters. Try adjusting them or add your first item!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
        <CardDescription>Showing {items.length} item{items.length !== 1 ? 's' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Item Details</TableHead>
                <TableHead className="font-semibold">Brand & Model</TableHead>
                <TableHead className="font-semibold">Offer</TableHead>
                <TableHead className="text-right font-semibold">Original Price</TableHead>
                <TableHead className="text-right font-semibold">Buying Price</TableHead>
                <TableHead className="text-center font-semibold">Qty</TableHead>
                <TableHead className="text-right font-semibold">Total</TableHead>
                <TableHead className="text-right font-semibold">Savings</TableHead>
                <TableHead className="text-center font-semibold">Date</TableHead>
                <TableHead className="text-center font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const savings = (item.originalPrice - item.buyingPrice) * item.quantity;
                const discountPercent = ((item.originalPrice - item.buyingPrice) / item.originalPrice) * 100;
                const totalSpent = item.buyingPrice * item.quantity;

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.description}</div>
                        {item.notes && (
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.brand && <div className="font-medium">{item.brand}</div>}
                        {item.model && <div className="text-muted-foreground">{item.model}</div>}
                        {!item.brand && !item.model && <span className="text-muted-foreground">-</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.offerName ? (
                        <Badge variant="secondary" className="text-xs">
                          {item.offerName}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="line-through text-muted-foreground">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-primary">
                        ${item.buyingPrice.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.quantity}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">${totalSpent.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {savings > 0 ? (
                        <div>
                          <div className="font-semibold text-success">
                            ${savings.toFixed(2)}
                          </div>
                          <div className="text-xs text-success">
                            {discountPercent.toFixed(1)}% off
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
