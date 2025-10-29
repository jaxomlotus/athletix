/**
 * Widget bitfield utilities for entity display
 *
 * Bit positions:
 * 0 (1)   - Custom
 * 1 (2)   - Meta
 * 2 (4)   - Schools
 * 3 (8)   - Leagues
 * 4 (16)  - Teams
 * 5 (32)  - Players
 * 6 (64)  - Clips
 * 7 (128) - Filters
 * 8 (256) - TopClips
 */

export enum WidgetType {
  Custom = 0,
  Meta = 1,
  Schools = 2,
  Leagues = 3,
  Teams = 4,
  Players = 5,
  Clips = 6,
  Filters = 7,
  TopClips = 8,
}

/**
 * Check if a specific widget is enabled for an entity
 * @param widgets - The bitfield value from the entity
 * @param widgetType - The widget type to check
 * @returns true if the widget is enabled, false otherwise
 */
export function hasWidget(widgets: number, widgetType: WidgetType): boolean {
  return (widgets & (1 << widgetType)) !== 0;
}

/**
 * Enable a widget in a bitfield
 * @param widgets - The current bitfield value
 * @param widgetType - The widget type to enable
 * @returns The updated bitfield value
 */
export function enableWidget(widgets: number, widgetType: WidgetType): number {
  return widgets | (1 << widgetType);
}

/**
 * Disable a widget in a bitfield
 * @param widgets - The current bitfield value
 * @param widgetType - The widget type to disable
 * @returns The updated bitfield value
 */
export function disableWidget(widgets: number, widgetType: WidgetType): number {
  return widgets & ~(1 << widgetType);
}

/**
 * Toggle a widget in a bitfield
 * @param widgets - The current bitfield value
 * @param widgetType - The widget type to toggle
 * @returns The updated bitfield value
 */
export function toggleWidget(widgets: number, widgetType: WidgetType): number {
  return widgets ^ (1 << widgetType);
}

/**
 * Get all enabled widgets for an entity
 * @param widgets - The bitfield value from the entity
 * @returns Array of enabled widget types
 */
export function getEnabledWidgets(widgets: number): WidgetType[] {
  const enabled: WidgetType[] = [];
  for (let i = 0; i <= 8; i++) {
    if (hasWidget(widgets, i as WidgetType)) {
      enabled.push(i as WidgetType);
    }
  }
  return enabled;
}
