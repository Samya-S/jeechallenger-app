import HomeComponent from "./HomeComponent";
import StructuredData from "@/components/common/StructuredData";
import { HOMEPAGE_FAQS } from "@/data/faq-data";
import { getAllArticles } from "@/utils/articles";

export default async function Home() {
  const latestArticles = (await getAllArticles(false)).slice(0, 3);

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="faq" data={HOMEPAGE_FAQS} />
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
