import HomeComponent from "@/components/home/HomeComponent";
import StructuredData from "@/components/common/StructuredData";
import { homepageFAQs } from "@/lib/faq-data";

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="faq" data={homepageFAQs} />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" }
          ]
        }} 
      />
      
      <HomeComponent />
    </>
  );
}
