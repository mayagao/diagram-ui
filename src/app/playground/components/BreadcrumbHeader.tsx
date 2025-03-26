"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  description: string;
}

interface BreadcrumbHeaderProps {
  currentPage: string;
  isCompact: boolean;
  setIsCompact: (value: boolean) => void;
  // Make navItems optional since we'll provide defaults
  navItems?: NavItem[];
}

export default function BreadcrumbHeader({
  currentPage,
  isCompact,
  setIsCompact,
  // Set default navItems
  navItems = [
    {
      title: "Diagram workflow",
      href: "/playground/diagram",
      description: "Visual workflow builder interface",
    },
    {
      title: "Notebook workflow",
      href: "/playground/workbench",
      description: "Interactive workflow testing environment",
    },
    {
      title: "Diagram block",
      href: "/playground/blocks",
      description:
        "Explore and interact with different types of workflow blocks",
    },
    {
      title: "Notebook block",
      href: "/playground/notebook",
      description: "Interactive notebook with blocks in notebook mode",
    },
  ],
}: BreadcrumbHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-8 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/playground"
              className="text-gray-500 text-sm font-semibold hover:text-gray-800 transition-colors"
            >
              Playground
            </Link>

            <span className="text-gray-400 ml-2">/</span>

            {/* Current page with dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2 font-semibold"
              >
                <span>{currentPage}</span>
              </Button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`block px-4 py-2 hover:bg-gray-50 ${
                        item.title === currentPage ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start text-sm justify-between">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                        {item.title === currentPage && (
                          <span className="text-gray-500 text-xs mt-1">
                            Current
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mode Toggles Section - Only compact toggle remains */}
          <div className="flex items-center gap-4">
            {/* Compact/Regular Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  !isCompact
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-600"
                }`}
                onClick={() => setIsCompact(false)}
              >
                Regular
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  isCompact
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-600"
                }`}
                onClick={() => setIsCompact(true)}
              >
                Compact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
