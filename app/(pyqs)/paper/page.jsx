import { notFound } from "next/navigation";

export default function PaperIndexPage() {
  // Visiting /paper directly without a slug triggers the Paper Not Found page.
  notFound();
}
