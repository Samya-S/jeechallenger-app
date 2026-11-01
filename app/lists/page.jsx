import ListsIndexClient from "@/components/playlists/ListsIndexClient";
import StructuredData from "@/components/common/StructuredData";
import { ogImageMeta } from "@/utils/og-metadata";

const pageOg = ogImageMeta({
  title: "My Question Lists & Revision Vaults",
  subtitle: "Organize, bookmark & practice custom JEE question lists",
  theme: "pyqs",
  badge: "JEE Challenger",
  alt: "JEE Question Lists - Personal Revision Vault",
});

export const metadata = {
  title: "My Question Lists & Revision Vaults | JEE Challenger",
  description: "Create, organize, and practice your personalized JEE question lists. Save challenging problems to Favourites, track your Mistake Vault, and build custom revision lists for JEE Main & Advanced.",
  keywords: [
    "JEE Question Lists",
    "JEE Playlists",
    "JEE Revision Lists",
    "Mistake Vault",
    "JEE Bookmarks",
    "JEE Practice Lists",
    "JEE Main Questions",
    "JEE Advanced Questions",
  ],
  alternates: {
    canonical: "/lists",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "My Question Lists & Revision Vaults | JEE Challenger",
    description: "Create, organize, and practice your personalized JEE question lists. Save challenging problems to Favourites, track your Mistake Vault, and build custom revision lists for JEE Main & Advanced.",
    url: "/lists",
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Question Lists & Revision Vaults | JEE Challenger",
    description: "Create, organize, and practice your personalized JEE question lists. Save challenging problems to Favourites, track your Mistake Vault, and build custom revision lists for JEE Main & Advanced.",
    images: pageOg.twitterImages,
  },
};

export default function ListsPage() {
  return (
    <>
      <StructuredData
        type="breadcrumb"
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Lists", path: "/lists" },
          ],
        }}
      />
      <ListsIndexClient />
    </>
  );
}
