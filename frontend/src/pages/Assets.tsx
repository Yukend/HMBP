import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { Package } from "lucide-react";

const Assets = () => {
  return (
    <Layout>
      <SectionManager
        title="Assets"
        description="Manage your assets and valuables"
        category="assets"
        icon={<Package className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default Assets;
