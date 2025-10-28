import { Layout } from "@/components/Layout";
import { SectionManager } from "@/components/SectionManager";
import { BookOpen } from "lucide-react";

const StudyMaterials = () => {
  return (
    <Layout>
      <SectionManager
        title="Study Materials"
        description="Track your educational and study material expenses"
        category="study-materials"
        icon={<BookOpen className="h-8 w-8 text-primary" />}
      />
    </Layout>
  );
};

export default StudyMaterials;
