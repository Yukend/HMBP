import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { Heart } from "lucide-react";

const Medical = () => {
  return (
    <Layout>
      <SectionManager
        title="Medical Allowances"
        description="Track your medical and healthcare expenses"
        category="medical"
        icon={<Heart className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default Medical;
