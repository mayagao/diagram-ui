"use client";

import Link from "next/link";
import { useState } from "react";
import BreadcrumbHeader from "./components/BreadcrumbHeader";

export default function PlaygroundPage() {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <BreadcrumbHeader
        currentPage="Playground"
        isCompact={isCompact}
        setIsCompact={setIsCompact}
      />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Playground</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cards for each playground section */}
          <Link
            href="/playground/diagram"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Diagram workflow</h2>
            <p className="text-gray-600">Visual workflow builder interface</p>
          </Link>

          <Link
            href="/playground/workbench"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Notebook workflow</h2>
            <p className="text-gray-600">
              Interactive workflow testing environment
            </p>
          </Link>

          <Link
            href="/playground/blocks"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Diagram block</h2>
            <p className="text-gray-600">
              Explore and interact with different types of workflow blocks
            </p>
          </Link>

          <Link
            href="/playground/notebook"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Notebook block</h2>
            <p className="text-gray-600">
              Interactive notebook with blocks in notebook mode
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
