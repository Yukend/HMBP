import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { ShoppingCart } from "lucide-react";

const Grocery = () => {
  return (
    <Layout>
      <SectionManager
        title="Grocery"
        description="Track your grocery expenses"
        category="grocery"
        icon={<ShoppingCart className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default Grocery;
