import { notFound } from "next/navigation";

export default function PaperNestedCatchAll() {
  // Catches any deeply nested invalid URLs under /paper/:slug/*
  // and triggers the Paper Not Found page.
  notFound();
}
