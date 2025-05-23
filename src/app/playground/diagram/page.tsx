"use client";

import { useState } from "react";
import BreadcrumbHeader from "../components/BreadcrumbHeader";

export default function DiagramPage() {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <BreadcrumbHeader
        currentPage="Diagram workflow"
        isCompact={isCompact}
        setIsCompact={setIsCompact}
      />

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Diagram Builder</h2>
            <p className="text-lg text-gray-600 mb-8">
              This is a placeholder for the visual workflow builder interface.
              The diagram page will allow users to visually connect different
              blocks to create complete workflows.
            </p>
            <div className="border-2 border-dashed border-gray-300 p-12 rounded-lg">
              <p className="text-gray-500">
                Workflow diagram builder coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
