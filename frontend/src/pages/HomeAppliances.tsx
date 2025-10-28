import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { Home } from "lucide-react";

const HomeAppliances = () => {
  return (
    <Layout>
      <SectionManager
        title="Home Appliances"
        description="Manage your home appliance purchases and maintenance"
        category="home-appliances"
        icon={<Home className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default HomeAppliances;
