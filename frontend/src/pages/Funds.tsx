import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { TrendingUp } from "lucide-react";

const Funds = () => {
  return (
    <Layout>
      <SectionManager
        title="Funds"
        description="Manage your investment funds and allocations"
        category="funds"
        icon={<TrendingUp className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default Funds;
