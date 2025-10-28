import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    address: "",
    dob: "",
    goal: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // passed from signup page

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, mobile, address } = formData;
    if (!username || !mobile || !address) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill all required fields.",
      });
      return;
    }

    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No authenticated user found. Please sign up again.",
      });
      navigate("/signup");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/profile/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          mobile: formData.mobile,
          address: formData.address,
          date_of_birth: formData.dob || null,
          goal: formData.goal || null,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to save user profile");
      }

      toast({
        title: "Profile saved!",
        description: "Welcome to Home Management App 🎉",
      });

      navigate("/dashboard"); // redirect after success
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save user details",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Complete Your Profile</CardTitle>
          <CardDescription>We need a few more details to personalize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input name="username" value={formData.username} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                name="mobile"
                type="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth (Optional)</Label>
              <Input name="dob" type="date" value={formData.dob} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="goal">Goal to use the app (Optional)</Label>
              <Input
                name="goal"
                placeholder="E.g. Track my expenses, plan monthly budget..."
                value={formData.goal}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Save & Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsForm;
