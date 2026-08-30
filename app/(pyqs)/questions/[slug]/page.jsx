import React from "react";

export const metadata = {
  title: "Question | JEE Challenger PYQs",
  description: "Previous Year Question with step-by-step KaTeX solution.",
};

export default async function QuestionPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <div className="min-h-screen py-12 px-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Question: {slug}</h1>
    </div>
  );
}