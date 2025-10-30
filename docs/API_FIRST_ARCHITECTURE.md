# Advanced Entity Filtering System - API-First Architecture Reference

## Purpose

This document serves as both a **reference implementation** and **architectural guideline** for maintaining API-first, backend-first architecture throughout the Athletix project. The Advanced Entity Filtering System demonstrates the complete refactoring of client-side logic to server-side implementation.

**Use this document to:**
- ✅ Understand how to properly implement backend-first features
- ✅ Verify that new features follow the same architectural patterns
- ✅ Guide future refactoring efforts toward API-first design
- ✅ Ensure all business logic remains in the backend layer

## System Overview

The Advanced Entity Filtering System provides comprehensive **server-side** filtering capabilities for entity listing pages (players, teams, leagues, sports, etc.). All filtering logic is handled in the backend following the backend-first architecture principle.

**Key Benefits:**
- All filtering logic in backend (zero client-side filtering)
- Interdependent filter counts (filter options update based on other active filters)
- Cross-entity queries (e.g., filter sports by player locations/schools)
- Consistent across all platforms (web, mobile, desktop)
- Single source of truth for filtering logic
- API endpoints ready for mobile/desktop apps

## Architecture

### Core Components

1. **`getEntitiesWithAdvancedFilters()`** (lib/data-access.ts:270 lines)
   - Applies all filters to entity queries
   - Handles complex cross-entity filtering
   - Returns filtered entities ready for display

2. **`buildFilterOptions()`** (lib/data-access.ts:520 lines)
   - Builds filter dropdown configuration
   - Calculates counts for each filter option
   - Handles interdependent filter logic

3. **Page Component** (app/[type]/page.tsx)
   - Now only ~300 lines (previously ~860 lines)
   - Calls backend functions and renders UI
   - No business logic

### Data Flow

```
User Request (with filter params)
       ↓
Page Component (app/[type]/page.tsx)
       ↓
Backend Functions (lib/data-access.ts)
   ├── getEntitiesWithAdvancedFilters() → Filtered entities
   └── buildFilterOptions() → Filter configuration
       ↓
Render UI with filtered data
```

## Functions

### `getEntitiesWithAdvancedFilters()`

Fetches entities with all filters applied.

**Signature:**
```typescript
async function getEntitiesWithAdvancedFilters(
  entityType: string,
  filters: AdvancedEntityFilters
): Promise<Entity[]>
```

**Parameters:**
- `entityType`: The type of entity to filter (player, team, league, sport, location, school)
- `filters`: Object containing all active filters

**Filter Types:**
```typescript
interface AdvancedEntityFilters {
  search?: string;           // Name search
  sport?: string;            // Sport slug
  league?: string;           // League slug
  location?: string;         // Location slug
  school?: string;           // School slug
  position?: string;         // Player position
  age?: string;              // Player age
  grade?: string;            // Player grade
  gender?: 'mens' | 'womens' | 'coed';  // Sport gender
}
```

**How It Works:**

1. **Fetch all entities** with full relationship data (parent, children, clips, memberships)
2. **Apply filters sequentially:**
   - Name search (case-insensitive substring match)
   - Gender filter (for sports only)
   - Sport filter (traverses hierarchy for teams/leagues, checks memberships for players)
   - League filter (parent for teams, membership teams for players)
   - Location filter (metadata.locationSlug)
   - School filter (metadata.schoolSlug)
   - Position filter (checks player memberships)
   - Age filter (calculates from metadata.birthdate)
   - Grade filter (metadata.grade)
3. **Return filtered entities**

**Special Cases:**

- **Sport filtering on teams/leagues**: Traverses parent hierarchy to find sport
- **Sport filtering on players**: Checks team sports in player memberships
- **Cross-entity queries**: Sports page can be filtered by player attributes (location/school)

**Example Usage:**
```typescript
const filters: AdvancedEntityFilters = {
  sport: 'basketball',
  location: 'california',
  age: '18'
};

const players = await getEntitiesWithAdvancedFilters('player', filters);
// Returns only basketball players in California who are 18 years old
```

### `buildFilterOptions()`

Builds filter configuration with accurate counts for each option.

**Signature:**
```typescript
async function buildFilterOptions(
  entityType: string,
  currentFilters: AdvancedEntityFilters
): Promise<FilterConfig>
```

**Returns:**
```typescript
interface FilterConfig {
  showNameSearch: boolean;
  sports?: FilterOption[];
  leagues?: FilterOption[];
  locations?: FilterOption[];
  schools?: FilterOption[];
  positions?: FilterOption[];
  ages?: FilterOption[];
  grades?: FilterOption[];
  gender?: FilterOption[];
}

interface FilterOption {
  value: string;    // Slug or value
  label: string;    // Display name
  count: number;    // Number of entities matching
}
```

**How It Works:**

1. **Fetch all entities** for the entity type (unfiltered)
2. **For each filter type:**
   - Extract unique values (sports, leagues, locations, etc.)
   - **For each unique value:**
     - Count entities that would match if this filter is applied
     - **Crucial:** Count considers OTHER active filters (interdependency)
3. **Filter out options with 0 count** (except already selected option)
4. **Sort by count (descending)** then alphabetically

**Interdependent Counting Example:**

If user selects `sport=basketball`:
- League filter shows only basketball leagues (with counts)
- Location filter shows only locations where basketball players exist (with counts)
- Other filter counts update to reflect basketball-only counts

**Entity-Specific Filters:**

- **Sports page:** gender filter (mens/womens/coed)
- **Players page:** positions, ages, grades
- **Teams page:** No special filters
- **Leagues page:** No special filters
- **Locations/Schools page:** No special filters

**Example Usage:**
```typescript
const currentFilters: AdvancedEntityFilters = {
  sport: 'basketball'
};

const config = await buildFilterOptions('player', currentFilters);
// config.leagues = [
//   { value: 'nba', label: 'NBA', count: 450 },
//   { value: 'ncaa', label: 'NCAA', count: 1200 }
// ]
// config.positions = [
//   { value: 'Point Guard', label: 'Point Guard', count: 320 },
//   { value: 'Shooting Guard', label: 'Shooting Guard', count: 290 }
// ]
```

## Page Component Integration

### Before Refactoring (858 lines)
```typescript
// app/[type]/page.tsx (OLD)
export default async function EntityListPage({ params, searchParams }) {
  // Direct Prisma queries (~350 lines)
  const entities = await prisma.entity.findMany({ /* ... */ });

  // In-memory filtering (~100 lines)
  const filtered = entities.filter(/* ... */);

  // Helper function for filter matching (~120 lines)
  const entityMatchesFilters = (entity, filters) => { /* ... */ };

  // Build filter config manually (~500 lines)
  const filterConfig = { /* ... */ };

  return <div>{/* JSX */}</div>;
}
```

### After Refactoring (296 lines)
```typescript
// app/[type]/page.tsx (NEW)
import {
  getEntitiesWithAdvancedFilters,
  buildFilterOptions,
  type AdvancedEntityFilters,
} from "@/lib/data-access";

export default async function EntityListPage({ params, searchParams }) {
  // Build filters from params
  const currentFilters: AdvancedEntityFilters = {
    search: searchParams.search,
    sport: searchParams.sport,
    league: searchParams.league,
    location: searchParams.location,
    school: searchParams.school,
    position: searchParams.position,
    age: searchParams.age,
    grade: searchParams.grade,
    gender: searchParams.gender as 'mens' | 'womens' | 'coed' | undefined,
  };

  // Get filtered entities (backend function)
  const entities = await getEntitiesWithAdvancedFilters(entityType, currentFilters);

  // Build filter config (backend function)
  const filterConfig = await buildFilterOptions(entityType, currentFilters);

  // Build filter labels for pills
  const filterLabels: { [key: string]: string } = {};
  Object.values(filterConfig).forEach(options => {
    if (Array.isArray(options)) {
      options.forEach(opt => {
        filterLabels[opt.value] = opt.label;
      });
    }
  });

  return <div>{/* JSX - unchanged */}</div>;
}
```

**Key Changes:**
- ❌ Removed ~620 lines of filtering logic
- ❌ No more direct Prisma queries in page
- ❌ No more in-memory filtering
- ✅ Simple function calls to backend
- ✅ Clear separation of concerns

## Performance Considerations

### Current Implementation

The system uses **in-memory post-processing** for filter building:
1. Fetch all entities with relationships (~1-5 second query)
2. Process in Node.js memory to build filter options
3. Calculate counts by iterating through entities

**Pros:**
- Simple to implement
- Works with complex JSON metadata queries
- Handles cross-entity filtering easily

**Cons:**
- Memory intensive for large datasets
- Can be slow with 10,000+ entities
- Repeated work for each page load

### Future Optimizations

#### 1. Database-Level Filtering with Raw SQL
Replace in-memory processing with database aggregation queries:
```sql
-- Instead of fetching all entities and counting in-memory
SELECT location_slug, COUNT(*)
FROM entities
WHERE type = 'player' AND sport_slug = 'basketball'
GROUP BY location_slug;
```

**Benefits:**
- 10-100x faster for large datasets
- Lower memory usage
- Scales to millions of entities

**Challenges:**
- Complex for JSON metadata fields
- Harder to maintain
- Requires careful SQL construction

#### 2. Materialized Views
Create database views with pre-computed filter counts:
```sql
CREATE MATERIALIZED VIEW player_filter_counts AS
SELECT sport_slug, location_slug, COUNT(*) as count
FROM entities
WHERE type = 'player'
GROUP BY sport_slug, location_slug;
```

**Benefits:**
- Instant filter counts
- No repeated computation
- Supports complex aggregations

**Challenges:**
- Requires refresh strategy
- Additional database storage
- More complex database management

#### 3. Caching Layer (Redis)
Cache filter configurations for common filter combinations:
```typescript
const cacheKey = `filters:${entityType}:${JSON.stringify(currentFilters)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Build filters...
await redis.set(cacheKey, JSON.stringify(filterConfig), 'EX', 3600);
```

**Benefits:**
- Fast subsequent loads
- Reduces database load
- Easy to implement

**Challenges:**
- Cache invalidation complexity
- Memory overhead
- Stale data risk

#### 4. Pagination for Filter Building
Instead of fetching all entities, use cursor-based pagination:
```typescript
let cursor = null;
const batchSize = 1000;
const filterCounts = new Map();

do {
  const batch = await prisma.entity.findMany({
    take: batchSize,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: { type: entityType }
  });

  // Process batch...
  cursor = batch[batch.length - 1]?.id;
} while (batch.length === batchSize);
```

**Benefits:**
- Lower memory usage
- Handles unlimited dataset size
- Prevents timeout on large queries

**Challenges:**
- More complex code
- Potentially slower
- Doesn't solve core issue

### Recommended Approach

For production with 10,000+ entities:
1. **Short-term:** Implement caching (Redis) for filter configurations
2. **Medium-term:** Move to database-level aggregation queries
3. **Long-term:** Materialized views for instant performance

Current in-memory approach is acceptable for datasets under 10,000 entities.

## Cross-Entity Filtering

One of the most complex features is filtering entities by attributes of related entities.

### Example: Filter Sports by Player Locations

**User Request:** "Show me all sports that have players from California"

**Challenge:** Sports don't have location metadata directly. We need to:
1. Find all players from California
2. Get their team memberships
3. Traverse from teams → leagues → sports
4. Return unique sports

**Implementation:**
```typescript
// In buildFilterOptions for sport entity type
if (currentFilters.location) {
  // Find players with this location
  const playersInLocation = allEntities.filter(e =>
    e.metadata?.locationSlug === currentFilters.location
  );

  // Get sports from their team memberships
  const sportSlugs = new Set<string>();
  playersInLocation.forEach(player => {
    player.playerMemberships?.forEach(membership => {
      const sport = membership.team?.parent?.parent; // team → league → sport
      if (sport) sportSlugs.add(sport.slug);
    });
  });

  // Only show these sports in filter options
  // ...
}
```

**Other Cross-Entity Scenarios:**
- Filter leagues by player positions
- Filter teams by player ages/grades
- Filter locations by sport types

## Error Handling

### Invalid Entity Types
```typescript
const entityType = getEntityType(type);
if (!entityType) {
  return notFound(); // 404 page
}
```

### Invalid Filter Values
- Silently ignored (empty results if no matches)
- No validation on slugs (database handles non-existent slugs)

### Database Errors
```typescript
try {
  const entities = await getEntitiesWithAdvancedFilters(entityType, filters);
} catch (error) {
  console.error("Error fetching entities:", error);
  return null; // Handled by page component
}
```

## Testing

### Manual Testing Status - ✅ COMPLETED (2025-10-30)

All filtering functionality has been tested and verified working correctly:

- ✅ Players page with no filters
- ✅ Players page with sport filter
- ✅ Players page with multiple filters (sport + location)
- ✅ Players page with position filter
- ✅ Players page with age/grade filters
- ✅ Teams page with sport filter
- ✅ Teams page with league filter
- ✅ Leagues page with sport filter
- ✅ Sports page (no filters except gender)
- ✅ Sports page with gender filter
- ✅ Filter counts are accurate
- ✅ Filter counts update when other filters change
- ✅ Selected filter always shows in options (even if count is 0)
- ✅ Search works with filters
- ✅ Empty results handled gracefully
- ✅ Name search works across all entity types
- ✅ No vestigial client-side filtering logic
- ✅ Search entity cards display correctly (with _count.clips)

### Future Testing Checklist

When making changes to filtering or adding new filter types:

- [ ] Run all tests above
- [ ] Verify no client-side filtering introduced
- [ ] Check browser Network tab to confirm server-side filtering
- [ ] Test with large datasets (100+ entities)
- [ ] Verify filter counts remain accurate

### Build Test
```bash
node node_modules/next/dist/bin/next build
```

Should complete with:
- ✓ Compiled successfully
- ✓ Running TypeScript (no errors)
- ✓ Generating static pages

## Common Issues

### Issue: Filter counts are zero for all options
**Cause:** `entityMatchesFilters` logic is incorrect
**Solution:** Verify filter matching logic for each filter type

### Issue: Cross-entity filters not working (e.g., sports by location)
**Cause:** Missing or incorrect relationship data
**Solution:** Ensure `include` statements fetch all required relationships

### Issue: Filters not interdependent (counts don't update)
**Cause:** `excludeFilter` logic not working in `buildFilterOptions`
**Solution:** Check that filter counts exclude the current filter type being built

### Issue: Performance is slow
**Cause:** Fetching too much data or inefficient filtering
**Solution:** See "Future Optimizations" section

### Issue: TypeScript errors after changes
**Cause:** Type mismatch in `AdvancedEntityFilters` or `FilterConfig`
**Solution:** Ensure types match between lib/data-access.ts and components/Filter.tsx

## Tracking API-First Architecture

### How to Verify Backend-First Implementation

When reviewing code or implementing new features, check these indicators:

**✅ Good (Backend-First):**
```typescript
// In server component or API route
const entities = await getEntitiesWithFilters(entityType, filters);
return entities;
```

**❌ Bad (Client-Side Logic):**
```typescript
// In client component
const filtered = entities.filter(e => e.sport === selectedSport);
```

### Code Review Checklist

When adding new features or reviewing PRs:

- [ ] **No `.filter()` calls** in client components on entity data
- [ ] **No `.map()` transformations** that filter data in client components
- [ ] **All data queries** happen in `lib/data-access.ts` or API routes
- [ ] **Business logic** is in backend functions, not components
- [ ] **Computed fields** (counts, aggregations) calculated server-side
- [ ] **New features** follow the same pattern as this filtering system

### Common Violations to Watch For

1. **Client-Side Filtering:**
   ```typescript
   // ❌ BAD
   const visibleItems = allItems.filter(item => item.matches(criteria));
   ```
   **Fix:** Create backend function that applies criteria in database query

2. **Client-Side Sorting:**
   ```typescript
   // ❌ BAD
   const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
   ```
   **Fix:** Add `orderBy` to Prisma query in backend

3. **Client-Side Aggregation:**
   ```typescript
   // ❌ BAD
   const count = items.filter(i => i.active).length;
   ```
   **Fix:** Use Prisma `_count` or aggregation queries

4. **Client-Side Pagination:**
   ```typescript
   // ❌ BAD
   const page = allItems.slice(offset, offset + limit);
   ```
   **Fix:** Use `skip` and `take` in Prisma query

### Migration Strategy for Existing Features

If you find client-side logic that needs to be moved to backend:

1. **Identify the logic:** What filtering/sorting/aggregation is happening?
2. **Create backend function:** Add to `lib/data-access.ts`
3. **Update queries:** Implement logic using Prisma queries
4. **Replace frontend:** Call backend function instead
5. **Test thoroughly:** Verify identical behavior
6. **Document:** Update this file if it's a new pattern

## File Reference

### Main Files
- `lib/data-access.ts` - Core filtering functions (~800 lines added)
- `app/[type]/page.tsx` - Page component (~560 lines removed, 296 total)
- `components/Filter.tsx` - Filter UI component (vestigial loading logic removed)
- `components/ActiveFilterPills.tsx` - Active filters display (unchanged)

### Related Files
- `lib/entity-utils.ts` - Entity type utilities
- `.CLAUDE.md` - Architectural principles

## Changelog

### 2025-10-30 - Initial Implementation & Testing

**Backend Implementation:**
- ✅ Created `getEntitiesWithAdvancedFilters()` function (~270 lines)
- ✅ Created `buildFilterOptions()` function (~520 lines)
- ✅ Added `AdvancedEntityFilters`, `FilterConfig`, and `FilterOption` interfaces
- ✅ Implemented interdependent filter counts
- ✅ Added support for cross-entity filtering (e.g., sports by player locations)

**Frontend Refactoring:**
- ✅ Refactored `app/[type]/page.tsx` from 858 → 296 lines (65% reduction)
- ✅ Removed all direct Prisma queries from page component
- ✅ Removed ~620 lines of client-side filtering logic
- ✅ Removed vestigial localStorage loading flags from `Filter.tsx`
- ✅ Removed unused `FilterLoadingOverlay` component

**Bug Fixes:**
- ✅ Fixed search functionality to include missing fields (`_count.clips`, `parent`, `description`)
- ✅ Fixed dynamic route warning in `/api/sports/cached`
- ✅ Fixed Next.js turbopack workspace root warning

**Documentation:**
- ✅ Created comprehensive documentation with API-first architecture guidelines
- ✅ Added testing checklist (all tests passed)
- ✅ Added code review checklist for maintaining backend-first architecture
- ✅ Added migration strategy for future refactoring efforts

**Testing:**
- ✅ All manual tests completed and verified working
- ✅ Build passes with TypeScript validation
- ✅ No client-side filtering logic remaining

---

*Last Updated: 2025-10-30*
*This document serves as the reference implementation for API-first, backend-first architecture in Athletix.*
