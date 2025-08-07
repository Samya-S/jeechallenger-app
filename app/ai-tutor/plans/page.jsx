import { notFound } from "next/navigation";
// import AITutorPlansComponent from "./AITutorPlansComponent";

export const metadata = {
  title: "Subscription Plans - AI Tutor - JEE Challenger",
  description: "View all available subscription plans for the AI Tutor on JEE Challenger, including pricing, limits, and features.",
};

export default function AITutorPlansPage() {
  // return <AITutorPlansComponent />;
  return notFound();
}