import HomeComponent from "@/components/home/HomeComponent";
import StructuredData from "@/components/common/StructuredData";
import { homepageFAQs } from "@/data/faq-data";
import { getAllArticles } from "@/lib/articles";

export default async function Home() {
  const latestArticles = (await getAllArticles(false)).slice(0, 3);

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
      
      <HomeComponent latestArticles={latestArticles} />
    </>
  );
}
