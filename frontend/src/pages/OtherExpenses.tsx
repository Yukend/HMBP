import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { MoreHorizontal } from "lucide-react";

const OtherExpenses = () => {
  return (
    <Layout>
      <SectionManager
        title="Other Expenses"
        description="Track miscellaneous expenses"
        category="other-expenses"
        icon={<MoreHorizontal className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default OtherExpenses;
