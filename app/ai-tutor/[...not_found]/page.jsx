import { notFound } from "next/navigation";

export default function AITutorCatchAll() {
  // This explicitly triggers the app/ai-tutor/not-found.jsx file 
  // whenever a user visits a URL under /ai-tutor/ that doesn't exist.
  notFound();
}