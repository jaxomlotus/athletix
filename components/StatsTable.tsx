import React from 'react';
import Link from 'next/link';

type StatField = {
  key: string;
  label: string;
  type: 'integer' | 'decimal' | 'string' | 'percentage';
  format?: string;
  rankable?: boolean;
  calculated?: boolean;
};

type Template = {
  id: number;
  name: string;
  entityType: string;
  schema: {
    category?: string;
    fields: StatField[];
  };
  sport: {
    id: number;
    name: string;
    slug: string;
  };
  league?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

type Parent = {
  id: number;
  name: string;
  slug: string;
  type: string;
} | null;

type EntityStat = {
  id: number;
  entityId: number;
  parentId: number | null;
  season: string;
  statsType: string;
  templateId: number | null;
  stats: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  template: Template | null;
  parent: Parent;
};

type StatsTableProps = {
  stats: EntityStat[];
  title?: string;
};

export default function StatsTable({ stats, title = 'Stats' }: StatsTableProps) {
  if (stats.length === 0) {
    return null;
  }

  // Group stats by template (category)
  const statsByTemplate = stats.reduce((acc, stat) => {
    if (!stat.template) return acc;

    const templateKey = stat.template.id.toString();
    if (!acc[templateKey]) {
      acc[templateKey] = {
        template: stat.template,
        stats: [],
      };
    }
    acc[templateKey].stats.push(stat);
    return acc;
  }, {} as Record<string, { template: Template; stats: EntityStat[] }>);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h2>

      {Object.values(statsByTemplate).map(({ template, stats: templateStats }) => {
        const fields = template.schema.fields;
        const categoryName = template.schema.category || template.name;

        return (
          <div key={template.id} className="mb-8 last:mb-0">
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {categoryName}
              </h3>
              <span className="text-xs text-gray-500">
                ({template.sport.name})
              </span>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Season
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    {fields.map((field) => (
                      <th
                        key={field.key}
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex flex-col items-center">
                          <span>{field.label}</span>
                          {field.calculated && (
                            <span className="text-[10px] text-gray-400 normal-case">
                              (calc)
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templateStats.map((stat) => {
                    const isCareer = stat.season === 'career';
                    return (
                      <tr
                        key={stat.id}
                        className={isCareer ? 'bg-green-50 font-semibold' : 'hover:bg-gray-50'}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {isCareer ? 'Career' : stat.season}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {stat.parent ? (
                            <Link
                              href={`/${stat.parent.type}s/${stat.parent.slug}`}
                              className="hover:text-green-600 underline"
                            >
                              {stat.parent.name}
                            </Link>
                          ) : (
                            <span className="text-gray-400 italic">Overall</span>
                          )}
                        </td>
                        {fields.map((field) => {
                          const value = stat.stats[field.key];
                          const displayValue = value ?? '-';
                          return (
                            <td
                              key={field.key}
                              className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900"
                            >
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {templateStats.map((stat) => {
                const isCareer = stat.season === 'career';
                return (
                  <div
                    key={stat.id}
                    className={`border rounded-lg p-4 ${
                      isCareer ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {isCareer ? 'Career Stats' : `${stat.season} Season`}
                        </div>
                        {stat.parent && (
                          <Link
                            href={`/${stat.parent.type}s/${stat.parent.slug}`}
                            className="text-sm text-gray-600 hover:text-green-600 underline"
                          >
                            {stat.parent.name}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {fields.map((field) => {
                        const value = stat.stats[field.key];
                        const displayValue = value ?? '-';
                        return (
                          <div key={field.key} className="text-center p-2 bg-white rounded">
                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                              {field.label}
                              {field.calculated && <span className="text-gray-400"> *</span>}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {displayValue}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend for mobile */}
      <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          * Calculated field
        </p>
      </div>
    </div>
  );
}
