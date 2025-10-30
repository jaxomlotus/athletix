"use client";

import React from "react";
import Image from "next/image";
import { FiUserPlus } from "react-icons/fi";
import { EntityType } from "@/lib/entity-utils";

interface EntityCardProps {
  entity: {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    parent: {
      name: string;
    } | null;
    _count: {
      clips: number;
    };
    metadata?: any;
    children?: any[];
  };
  entityType: EntityType;
  pluralType: string;
}

export default function EntityCard({ entity, entityType, pluralType }: EntityCardProps) {
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement follow functionality
    console.log(`Follow ${entity.name}`);
  };

  // Build gender display for sports
  const renderGenderDisplay = () => {
    if (entityType !== 'sport' || !entity.metadata) return null;

    const genderElements = [];

    if (entity.metadata.mens) {
      genderElements.push("Men's");
    }

    if (entity.metadata.womens) {
      genderElements.push("Women's");
    }

    if (entity.metadata.coed) {
      genderElements.push("Coed");
    }

    if (genderElements.length === 0) return null;

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {genderElements.map((text, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-400">•</span>}
            <span>{text}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group">
      {/* Follow Button - Top Right */}
      <button
        onClick={handleFollow}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:text-green-600 transition-colors cursor-pointer"
        title={`Follow ${entity.name}`}
      >
        <FiUserPlus className="w-3.5 h-3.5" />
        <span>Follow</span>
      </button>

      <a href={`/${pluralType}/${entity.slug}`} className="flex flex-col gap-3">
        {entity.logo && (
          <div className={`${entityType === 'player' ? 'w-16 h-16 rounded-full bg-white' : `w-16 h-16 rounded-lg ${entityType === 'sport' ? 'bg-gradient-to-br from-green-500 to-blue-600 p-3' : 'bg-gray-100'}`} overflow-hidden flex items-center justify-center`}>
            <img
              src={entity.logo}
              alt={entity.name}
              className="w-full h-full object-cover"
              style={entityType === 'sport' ? { filter: 'brightness(0) invert(1)' } : undefined}
            />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
            {entity.name}
          </h3>
          {entity.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {entity.description}
            </p>
          )}
          {entityType === 'sport' && (
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              {renderGenderDisplay()}
              {entity.children && entity.children.length > 0 && (
                <p className="text-xs text-green-600 font-semibold">
                  {entity.children.length} {entity.children.length === 1 ? 'league' : 'leagues'}
                </p>
              )}
            </div>
          )}
          {entity.parent && (
            <p className="text-xs text-gray-500 mt-1">
              {entity.parent.name}
            </p>
          )}
          {entityType === 'player' && (
            <p className="text-xs text-green-600 font-semibold mt-2">
              {entity._count.clips} {entity._count.clips === 1 ? 'clip' : 'clips'}
            </p>
          )}
        </div>
      </a>
    </div>
  );
}
