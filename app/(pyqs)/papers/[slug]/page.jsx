import React from "react";

export const metadata = {
  title: "Paper | JEE Challenger PYQs",
  description: "Previous Year Question Paper with step-by-step solutions.",
};

export default async function PaperPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <div className="min-h-screen py-12 px-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Paper: {slug}</h1>
    </div>
  );
}