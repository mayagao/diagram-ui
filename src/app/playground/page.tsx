"use client";

import Link from "next/link";

const pages = [
  {
    title: "Blocks",
    description:
      "Explore and interact with different types of workflow blocks including triggers, extractions, generations, conditions, and actions.",
    href: "/playground/blocks",
  },
  {
    title: "Diagram",
    description:
      "Visual workflow builder to connect and arrange blocks in a flowchart-style diagram.",
    href: "/playground/diagram",
  },
  {
    title: "Notebook",
    description:
      "Interactive notebook interface for documenting and testing workflow configurations.",
    href: "/playground/notebook",
  },
];

export default function PlaygroundHome() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-12">Playground</h1>

        <div className="grid gap-6">
          {pages.map((page) => (
            <Link
              key={page.title}
              href={page.href}
              className="block p-6 border rounded-lg hover:border-blue-500 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-2">{page.title}</h2>
              <p className="text-gray-600">{page.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
