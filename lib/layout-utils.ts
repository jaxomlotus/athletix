/**
 * Layout utilities for entity display
 *
 * Layout structure:
 * {
 *   l: string[],  // Left column widgets
 *   c: string[],  // Center column widgets
 *   r: string[],  // Right column widgets
 *   x: Array<{title: string, content: string}>  // Custom widgets
 * }
 */

import { EntityType } from "./entity-utils";

export interface EntityLayout {
  l: string[];
  c: string[];
  r: string[];
  x?: Array<{ title: string; content: string }>;
}

export interface CustomWidget {
  title: string;
  content: string;
}

/**
 * Default layouts for each entity type when layout field is null
 */
export const DEFAULT_LAYOUTS: Record<EntityType, EntityLayout> = {
  sport: {
    l: [],
    c: ["Leagues", "Clips"],
    r: ["TopClips", "Discussions"],
  },
  league: {
    l: [],
    c: ["Teams", "Clips"],
    r: ["TopClips", "Discussions"],
  },
  team: {
    l: [],
    c: ["Schools", "Players", "Clips"],
    r: ["TopClips", "Discussions"],
  },
  player: {
    l: [],
    c: ["Meta", "Teams", "Clips"],
    r: ["TopClips", "Discussions"],
  },
  school: {
    l: [],
    c: ["Teams", "Players", "Clips"],
    r: ["TopClips", "Discussions"],
  },
  location: {
    l: [],
    c: ["Schools", "Teams", "Players", "Clips"],
    r: ["TopClips", "Discussions"],
  },
};

/**
 * Get the layout for an entity, using defaults if layout is null
 */
export function getEntityLayout(
  entityType: EntityType,
  layoutJson: any
): EntityLayout {
  if (layoutJson && typeof layoutJson === "object") {
    return layoutJson as EntityLayout;
  }
  return DEFAULT_LAYOUTS[entityType];
}

/**
 * Check if a widget should be displayed based on layout
 */
export function hasWidget(layout: EntityLayout, widgetName: string): boolean {
  return (
    layout.l.includes(widgetName) ||
    layout.c.includes(widgetName) ||
    layout.r.includes(widgetName)
  );
}

/**
 * Get custom widget by reference (e.g., "x0" -> layout.x[0])
 */
export function getCustomWidget(
  layout: EntityLayout,
  reference: string
): CustomWidget | null {
  if (!reference.startsWith("x") || !layout.x) {
    return null;
  }

  const indexStr = reference.substring(1);
  const index = parseInt(indexStr, 10);

  if (isNaN(index) || index < 0 || index >= layout.x.length) {
    return null;
  }

  return layout.x[index];
}

/**
 * Check if a reference is a custom widget (starts with "x")
 */
export function isCustomWidget(reference: string): boolean {
  return /^x\d+$/.test(reference);
}

/**
 * Get all widgets in a column in order
 */
export function getColumnWidgets(
  layout: EntityLayout,
  column: "l" | "c" | "r"
): string[] {
  return layout[column] || [];
}
