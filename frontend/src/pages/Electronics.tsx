import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { Laptop } from "lucide-react";

const Electronics = () => {
  return (
    <Layout>
      <SectionManager
        title="Electronics"
        description="Manage your electronics and gadget expenses"
        category="electronics"
        icon={<Laptop className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default Electronics;
