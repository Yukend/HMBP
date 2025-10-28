import { useState, useEffect } from "react";
import { products as productsStorage, sales as salesStorage, auth } from "@/lib/storage";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Plus, Trash2, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  status: string;
  user_id: string;
  created_at: string;
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryZip, setDeliveryZip] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchMyProducts();
  }, []);

  const fetchProducts = () => {
    const allProducts = productsStorage.getAll();
    const availableProducts = allProducts.filter(p => p.status === 'available');
    setProducts(availableProducts);
  };

  const fetchMyProducts = () => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const allProducts = productsStorage.getAll();
    const userProducts = allProducts.filter(p => p.user_id === currentUser.id);
    setMyProducts(userProducts);
  };

  const handleCreateProduct = () => {
    if (!name || !price) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    try {
      productsStorage.create({
        user_id: currentUser.id,
        name,
        description,
        price: parseFloat(price),
        image_url: imageUrl || null,
        status: 'available',
      });

      toast({ title: "Success", description: "Product added successfully" });
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setIsOpen(false);
      fetchProducts();
      fetchMyProducts();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    }
  };

  const handleDeleteProduct = (id: string) => {
    try {
      productsStorage.delete(id);
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchMyProducts();
      fetchProducts();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsPurchaseOpen(true);
  };

  const handlePurchase = () => {
    if (!deliveryAddress || !deliveryCity || !deliveryZip || !deliveryPhone) {
      toast({ title: "Error", description: "Please fill in all delivery details", variant: "destructive" });
      return;
    }

    if (!selectedProduct) return;

    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    try {
      salesStorage.create({
        buyer_id: currentUser.id,
        seller_id: selectedProduct.user_id,
        product_id: selectedProduct.id,
        amount: selectedProduct.price,
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_zip: deliveryZip,
        delivery_phone: deliveryPhone,
      });

      toast({ 
        title: "Success", 
        description: `Order placed! Product will be delivered to ${deliveryAddress}, ${deliveryCity}` 
      });
      setIsPurchaseOpen(false);
      setDeliveryAddress("");
      setDeliveryCity("");
      setDeliveryZip("");
      setDeliveryPhone("");
      setSelectedProduct(null);
    } catch (error) {
      toast({ title: "Error", description: "Purchase failed", variant: "destructive" });
    }
  };

  const handleChatWithSeller = (sellerId: string) => {
    navigate(`/messages?user=${sellerId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-8 w-8" />
              Marketplace
            </h1>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <Input
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button onClick={handleCreateProduct} className="w-full">
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">My Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded" />
                      )}
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.price}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">All Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded" />
                      )}
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold">${product.price}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleBuyClick(product)} className="flex-1">
                            Buy Now
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleChatWithSeller(product.user_id)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isPurchaseOpen} onOpenChange={setIsPurchaseOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-2xl font-bold">${selectedProduct.price}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        placeholder="ZIP"
                        value={deliveryZip}
                        onChange={(e) => setDeliveryZip(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Phone number"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handlePurchase} className="w-full">
                  Confirm Purchase
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Marketplace;
