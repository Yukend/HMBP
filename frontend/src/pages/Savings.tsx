import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { PiggyBank } from "lucide-react";

const Savings = () => {
  return (
    <Layout>
      <SectionManager
        title="Savings"
        description="Track your savings and deposits"
        category="savings"
        icon={<PiggyBank className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default Savings;
