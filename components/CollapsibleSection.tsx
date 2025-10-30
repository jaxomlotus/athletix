"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface CollapsibleSectionProps {
  title: string;
  titleLink?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  showPreview?: boolean;
  previewHeight?: string;
}

export default function CollapsibleSection({
  title,
  titleLink,
  children,
  defaultOpen = true,
  showPreview = false,
  previewHeight = "120px",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {titleLink ? (
            <a href={titleLink} className="hover:text-green-600 hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label={isOpen ? "Collapse section" : "Expand section"}
        >
          {isOpen ? (
            <FaChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FaChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {isOpen ? (
        <div>{children}</div>
      ) : showPreview ? (
        <div className="relative">
          <div
            className="overflow-hidden"
            style={{ maxHeight: previewHeight }}
          >
            {children}
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, white)"
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer shadow-sm"
            >
              Show All
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
