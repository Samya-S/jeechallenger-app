import { notFound } from "next/navigation";

export default function QuestionNestedCatchAll() {
  // Catches any deeply nested invalid URLs under /question/:slug/*
  // and triggers the Question Not Found page.
  notFound();
}
