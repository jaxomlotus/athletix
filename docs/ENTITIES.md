# Entity Display Information

This document explains how different entity types display information panels in the application using the JSON-based layout system.

## Layout System Overview

Each entity can customize its page layout using the `layout` JSON field, which defines:
- Which widgets are displayed
- Where widgets appear (left, center, or right column)
- The order of widgets within each column
- Custom content panels and their positions

## Default Layouts by Entity Type

The following table shows the default layout configuration for each entity type when `layout` is null:

| Entity Type | Left Column | Center Column | Right Column |
|-------------|-------------|---------------|--------------|
| Schools     | [] | ["Teams", "Players", "Clips"] | ["TopClips"] |
| Locations   | [] | ["Schools", "Teams", "Players", "Clips"] | ["TopClips"] |
| Sports      | [] | ["Leagues", "Clips"] | ["TopClips"] |
| Leagues     | [] | ["Teams", "Clips"] | ["TopClips"] |
| Teams       | [] | ["Schools", "Players", "Clips"] | ["TopClips"] |
| Players     | [] | ["Meta", "Teams", "Clips"] | ["TopClips"] |

## Widget Types

### Standard Widgets

- **Meta**: Basic entity information and stats (primarily for players)
- **Schools**: List of associated schools
- **Leagues**: List of associated leagues
- **Teams**: List of associated teams
- **Players**: List of associated players
- **Clips**: Video clips related to the entity
- **Filters**: Filtering options for entity content
- **TopClips**: Featured or top-performing video clips in sidebar

### Custom Widgets

Custom widgets are referenced using `x0`, `x1`, `x2`, etc., where the number corresponds to the index in the `x` array.

## Layout JSON Structure

```typescript
{
  "l": string[],      // Left column widgets
  "c": string[],      // Center column widgets
  "r": string[],      // Right column widgets
  "x": Array<{        // Custom widget content
    title: string,
    content: string   // Markdown content
  }>
}
```

### Examples

**Basic Player Layout:**
```json
{
  "l": [],
  "c": ["Meta", "Teams", "Clips"],
  "r": ["TopClips"]
}
```

**Player with Custom Widgets:**
```json
{
  "l": [],
  "c": ["x0", "Meta", "Teams", "Clips"],
  "r": ["TopClips", "x1"],
  "x": [
    {
      "title": "My Links",
      "content": "[Google](https://google.com)\n[Twitter](https://twitter.com)"
    },
    {
      "title": "My Schedule",
      "content": "Coming soon!"
    }
  ]
}
```

**School with Sidebar Custom Content:**
```json
{
  "l": ["x0"],
  "c": ["Teams", "Players", "Clips"],
  "r": ["TopClips"],
  "x": [
    {
      "title": "Admissions",
      "content": "Apply now at [admissions.school.edu](https://...)"
    }
  ]
}
```

## Custom Widget References

Custom widgets use the format `xN` where `N` is the zero-based index into the `x` array:

- `x0` → First custom widget (`x[0]`)
- `x1` → Second custom widget (`x[1]`)
- `x2` → Third custom widget (`x[2]`)
- etc.

This allows maximum flexibility to position individual custom widgets anywhere on the page, interspersed with standard widgets.

## Markdown Support

Custom widget content supports full Markdown formatting including:
- **Links**: `[Text](https://url.com)`
- **Bold/Italic**: `**bold**` and `*italic*`
- **Lists**: Bullet and numbered lists
- **Tables**: GitHub-style markdown tables
- **Code blocks**: Inline and fenced code blocks
- **Headings**: `# H1`, `## H2`, etc.
- **Task lists**: `- [ ] Todo item`

## Important Notes

### Override Flexibility

Each entity type has default panel configurations as shown in the table above. However, **these defaults can be overridden at the individual entity level** by moderators or owners of that entity.

This flexibility ensures that edge cases can be accommodated. For example:
- A School entity normally does not display a Schools panel (showing other schools)
- However, a university with many affiliated sub-schools may choose to override this and display a Schools panel listing all affiliated schools in its program

This override capability applies to all panel types, allowing entity owners to customize the display to best serve their specific needs.
