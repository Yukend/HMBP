import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { Shirt } from "lucide-react";

const Clothes = () => {
  return (
    <Layout>
      <SectionManager
        title="Clothes"
        description="Manage your clothing expenses"
        category="clothes"
        icon={<Shirt className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default Clothes;
