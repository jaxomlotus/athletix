# Time Period Filtering

**Feature Status:** ✅ Implemented (MVP Complete)

This document describes the time period filtering feature for Player and Team pages.

---

## Overview

Users can filter historical data by season and sport to view:
- **Team memberships** (which teams a player was on)
- **Jersey numbers** (what number they wore)
- **Positions** (what positions they played)
- **Clips** (highlights recorded during that time period)

---

## How It Works

### URL Parameters

```
/players/jamal-williams?season=2023&sport=basketball
/teams/stanford-cardinals?season=2024
```

### Filter Options

**Season Filter:**
- **All Time** - Shows all historical data (no filter)
- **2024, 2023, 2022...** - Shows data from specific season

**Sport Filter** (Player pages only):
- Filters teams by sport
- Dynamically populated based on player's history

---

## Database Schema

### Team Membership
```prisma
model TeamMembership {
  id         Int      @id @default(autoincrement())
  playerId   Int
  teamId     Int
  season     String?  // e.g., "2024", "2024-2025"
  isCurrent  Boolean  @default(false)
  startDate  DateTime?
  endDate    DateTime?
  jerseyNumber Int?
  positions  String[]
  // ...
}
```

**Key Fields:**
- `season` - Text identifier for the season (e.g., "2024")
- `isCurrent` - Boolean flag for current membership
- `startDate/endDate` - Date range for membership

### Clips
```prisma
model Clip {
  id          Int       @id @default(autoincrement())
  recordedAt  DateTime? // When clip was recorded (optional)
  createdAt   DateTime  @default(now()) // When uploaded
  // ...
}
```

**Key Fields:**
- `recordedAt` - When the clip was actually recorded/filmed
- `createdAt` - Fallback if `recordedAt` is not set

---

## Implementation

### 1. Season Filtering Logic

**Team Memberships:**
```typescript
const membershipWhere = season ? { season } : {}; // Empty object = show all
```

**Clips:**
```typescript
// Filter by recordedAt within season date range (Sept 1 - June 1)
const clipWhere = season ? {
  OR: [
    { recordedAt: { gte: seasonStart, lte: seasonEnd } },
    { recordedAt: null, createdAt: { gte: seasonStart, lte: seasonEnd } }
  ]
} : {};
```

### 2. Key Files

**Data Access Layer:**
- `lib/data-access.ts` - `getEntityBySlug()` handles season filtering
- `lib/data-access.ts` - `getEntitySeasons()` fetches available seasons
- `lib/data-access.ts` - `getPlayerSports()` fetches available sports

**Validation:**
- `lib/validation.ts` - `entityFiltersSchema` includes season/sport

**UI Components:**
- `components/Filter.tsx` - Season and sport dropdown selectors
- `app/[type]/[slug]/page.tsx` - Parses URL params and applies filters

### 3. Backward Compatibility

✅ **Fully backward compatible:**
- Old URLs without `?season` continue to work
- Shows "All Time" data by default when no season is selected
- No breaking changes to existing functionality

---

## Season Date Ranges

Academic/sports seasons run from **September 1 - June 1**:

| Season | Start Date  | End Date    |
|--------|-------------|-------------|
| 2024   | 2024-09-01  | 2025-06-01  |
| 2023   | 2023-09-01  | 2024-06-01  |
| 2022   | 2022-09-01  | 2023-06-01  |

---

## User Experience

### Player Page Example

**URL:** `/players/jamal-williams`

**Filters Available:**
- Season: All Time, 2024, 2023, 2022
- Sport: Basketball, Baseball, Football

**Behavior:**
1. **All Time** - Shows all teams (Lakers 2024, UCLA 2023, Stanford 2022)
2. **2024** - Shows only Lakers team/jersey/positions + 2024 clips
3. **2023** - Shows only UCLA team/jersey/positions + 2023 clips
4. **Basketball** - Shows only basketball teams across all seasons

**Empty States:**
- If no teams match filter, shows "No teams to show" message
- Container always displays (not hidden)

---

## Future Enhancements

### Team Tagging for Clips

**Current Implementation:**
- Clips filtered by `recordedAt` date range
- Works well but not perfect (e.g., if clip recorded during off-season)

**Potential Enhancement:**
- Tag clips with team ID using existing `ClipEntity` relationship
- Filter clips by team membership directly
- More accurate than date-based filtering

**Implementation:**
```typescript
// Already supported in schema:
model ClipEntity {
  clipId   Int
  entityId Int  // Can be player, team, league, etc.
}

// Would need:
- UI to tag clips with teams when uploading
- Update seed data to include team tags
- Filter clips by team ID instead of date
```

---

## Testing

**Test Scenarios:**

1. **Player with multiple teams:**
   - `/players/jamal-williams` - Should see 3 teams
   - `/players/jamal-williams?season=2024` - Should see only Lakers

2. **Player with no teams in season:**
   - `/players/someone?season=2020` - Should see "No teams to show"

3. **Clips filtering:**
   - Select 2024 - Should only show clips with `recordedAt` in 2024-09-01 to 2025-06-01
   - Clips without `recordedAt` fall back to `createdAt`

4. **Sport filtering:**
   - `/players/jamal-williams?sport=basketball` - Should only show Lakers

---

## Database Seeds

Example seed data with historical seasons:

```typescript
// Marcus Rodriguez - Transfer student
{ playerId: player1.id, teamId: cardinals.id, jerseyNumber: 24, positions: ['Outfielder'], season: '2024', isCurrent: true },
{ playerId: player1.id, teamId: bruins.id, jerseyNumber: 18, positions: ['Right Fielder', 'Center Fielder'], season: '2023', isCurrent: false },
{ playerId: player1.id, teamId: lakers.id, jerseyNumber: 5, positions: ['Second Base', 'Utility'], season: '2022', isCurrent: false },

// Clips with recordedAt dates
{
  title: 'Baseball Skills Training',
  recordedAt: new Date('2024-10-15'), // Recorded during 2024 season
  // ...
}
```

---

## Troubleshooting

**Filters not working?**
- Check URL parameters are correct (`?season=2024`)
- Verify season data exists in database
- Check browser console for errors

**No seasons showing in dropdown?**
- Ensure players have `TeamMembership` records with `season` field populated
- Check `getEntitySeasons()` is returning data

**Clips not filtering correctly?**
- Verify clips have `recordedAt` dates set
- Check season date ranges (Sept 1 - June 1)
- Falls back to `createdAt` if `recordedAt` is null

---

**Last Updated:** 2025-10-31
**Version:** 1.0 (MVP)
