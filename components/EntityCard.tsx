"use client";

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

  return (
    <div className="relative flex flex-col gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group">
      {/* Follow Button - Top Right */}
      <button
        onClick={handleFollow}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:text-green-600 transition-colors"
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
