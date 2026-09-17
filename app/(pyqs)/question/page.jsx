import { notFound } from "next/navigation";

export default function QuestionIndexPage() {
  // Visiting /question directly without a slug triggers the Question Not Found page.
  notFound();
}
