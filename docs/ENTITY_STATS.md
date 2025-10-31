# Entity Stats System

**Feature Status:** ✅ Implemented (Schema & Seed Complete)

This document describes the entity stats system for tracking statistics across any entity type (players, teams, leagues, etc.).

---

## Overview

The entity stats system provides a flexible, hierarchical approach to tracking statistics for any entity in the platform. Unlike storing stats in the metadata JSON field, this system uses dedicated database tables that enable:

- **Time-based filtering** - Stats by season, year, or career
- **Hierarchical context** - Player stats within teams, team stats within leagues
- **Normalized comparisons** - Standardized templates for fair comparisons
- **Custom stats** - Non-normalized stats for display purposes
- **Leaderboards** - Query and rank across entities efficiently

---

## Use Cases

### Players
- Track batting/pitching stats by season
- View career aggregates across all teams
- Compare stats across different teams/leagues
- Show normalized stats for rankings vs custom stats for display

### Teams
- Track win/loss records by season
- View team performance within leagues
- Compare team stats across seasons
- Show aggregate stats across different time periods

### Leagues
- Track aggregate league statistics
- Compare league performance over time
- Show participation and engagement metrics

---

## Database Schema

### StatsTemplate

Defines the structure and validation rules for different stat types.

```prisma
model StatsTemplate {
  id           Int      @id @default(autoincrement())
  name         String   @db.VarChar(256) // "Baseball Player - Batting"
  entityType   String   @db.VarChar(50)  // "player", "team", "league"
  sportId      Int      // Links to sport entity
  leagueId     Int?     // Optional - for league-specific customizations
  schema       Json     // Defines fields, types, labels, validation
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  sport        Entity       @relation("SportTemplates")
  league       Entity?      @relation("LeagueTemplates")
  entityStats  EntityStats[]
}
```

**Key Fields:**
- `entityType` - What type of entity this template is for (player, team, etc.)
- `sportId` - The sport this template belongs to
- `leagueId` - Optional league-specific customization
- `schema` - JSON structure defining the stats fields (see Schema Format below)
- `isActive` - Whether this template is currently available for use

### EntityStats

Stores the actual statistics for entities.

```prisma
model EntityStats {
  id          Int      @id @default(autoincrement())
  entityId    Int      // The entity these stats belong to
  parentId    Int?     // Optional parent entity (team for player, league for team)
  season      String   @db.VarChar(50) // "2024", "2024-2025", "career"
  statsType   String   @db.VarChar(50) // "normalized", "custom"
  templateId  Int?     // Links to StatsTemplate if normalized
  stats       Json     // The actual stats data
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  entity      Entity          @relation("EntityStats")
  parent      Entity?         @relation("StatsParent")
  template    StatsTemplate?
}
```

**Key Fields:**
- `entityId` - The entity these stats belong to (player, team, etc.)
- `parentId` - Optional parent entity for hierarchical context
- `season` - Time period identifier ("2024", "2023-2024", "career")
- `statsType` - "normalized" (uses template) or "custom" (freeform)
- `templateId` - Required if statsType is "normalized"
- `stats` - JSON object containing the actual stat values

**Unique Constraint:**
```prisma
@@unique([entityId, season, parentId, statsType, templateId])
```
This ensures no duplicate stat records for the same entity/season/context combination.

---

## Template Schema Format

Templates define the structure of stats using a JSON schema:

```json
{
  "category": "batting",
  "fields": [
    {
      "key": "battingAverage",
      "label": "Batting Average",
      "type": "decimal",
      "format": ".XXX",
      "required": true,
      "calculated": false,
      "rankable": true,
      "sortOrder": "desc"
    },
    {
      "key": "homeRuns",
      "label": "Home Runs",
      "type": "integer",
      "required": true,
      "rankable": true,
      "sortOrder": "desc"
    },
    {
      "key": "winPercentage",
      "label": "Win %",
      "type": "decimal",
      "format": ".XXX",
      "required": false,
      "calculated": true,
      "formula": "wins / (wins + losses)",
      "rankable": true,
      "sortOrder": "desc"
    }
  ]
}
```

**Field Properties:**
- `key` - Unique identifier for the stat field
- `label` - Display name shown in UI
- `type` - Data type: "integer", "decimal", "string", "percentage"
- `format` - Display format (e.g., ".XXX" for batting average)
- `required` - Whether this field must have a value
- `calculated` - Whether this is computed from other fields
- `formula` - Optional formula for calculated fields (for documentation)
- `rankable` - Whether this field can be used for rankings/leaderboards
- `sortOrder` - "asc" or "desc" for ranking (lower ERA is better, higher HR is better)

---

## Data Examples

### Player Stats (with team context)

Marcus Rodriguez's batting stats at Stanford (2024):

```typescript
{
  entityId: marcusId,           // The player
  parentId: stanfordId,         // The team context
  season: "2024",
  statsType: "normalized",
  templateId: baseballBattingTemplate.id,
  stats: {
    gamesPlayed: 52,
    atBats: 198,
    hits: 62,
    battingAverage: ".313",
    homeRuns: 14,
    rbi: 48,
    stolenBases: 8
  }
}
```

### Player Career Stats (no parent)

Marcus Rodriguez's career aggregates:

```typescript
{
  entityId: marcusId,
  parentId: null,               // No specific team context
  season: "career",             // Special season value for aggregates
  statsType: "normalized",
  templateId: baseballBattingTemplate.id,
  stats: {
    gamesPlayed: 145,
    atBats: 560,
    hits: 171,
    battingAverage: ".305",
    homeRuns: 28,
    rbi: 87,
    stolenBases: 24
  }
}
```

### Team Stats (with league context)

Stanford Cardinals' season record (2024):

```typescript
{
  entityId: stanfordId,         // The team
  parentId: pac12Id,            // The league context
  season: "2024",
  statsType: "normalized",
  templateId: baseballTeamTemplate.id,
  stats: {
    wins: 42,
    losses: 18,
    winPercentage: ".700",
    runsScored: 428,
    runsAllowed: 312
  }
}
```

### Custom Stats

Player with custom stats (not using template):

```typescript
{
  entityId: playerId,
  parentId: teamId,
  season: "2024",
  statsType: "custom",
  templateId: null,             // No template for custom stats
  stats: {
    // Freeform structure - not normalized
    customMetric1: 123,
    customMetric2: "value",
    notes: "Custom tracked stats"
  }
}
```

---

## Normalized vs Custom Stats

### Normalized Stats
- **Use templates** - Follow standardized structure
- **Rankable** - Can be used in leaderboards and comparisons
- **Validated** - Structure enforced by template schema
- **Comparable** - Fair comparisons across entities

**When to use:**
- League-wide player rankings
- Team standings
- Official statistics
- Cross-entity comparisons

### Custom Stats
- **No templates** - Freeform JSON structure
- **Display only** - Cannot be used in rankings
- **Unvalidated** - Player/admin defines structure
- **Non-comparable** - Personal tracking only

**When to use:**
- Personal metrics not tracked by league
- Experimental statistics
- Training data
- Notes and annotations

---

## Querying Stats

### Get Player Stats for a Season

```typescript
const playerStats = await prisma.entityStats.findMany({
  where: {
    entityId: playerId,
    season: "2024",
    statsType: "normalized"
  },
  include: {
    template: true,
    parent: true  // Include team context
  }
})
```

### Get Team Rankings by Wins

```typescript
const teamRankings = await prisma.entityStats.findMany({
  where: {
    template: {
      entityType: "team",
      sportId: baseballId
    },
    season: "2024",
    statsType: "normalized"
  },
  orderBy: {
    stats: {
      path: ["wins"],
      order: "desc"
    }
  },
  include: {
    entity: true,
    template: true
  }
})
```

### Get Player Career Stats

```typescript
const careerStats = await prisma.entityStats.findFirst({
  where: {
    entityId: playerId,
    season: "career",
    statsType: "normalized",
    parentId: null  // Career stats have no parent context
  },
  include: {
    template: true
  }
})
```

### Get All Stats for an Entity (All Seasons)

```typescript
const allStats = await prisma.entityStats.findMany({
  where: {
    entityId: playerId,
    statsType: "normalized"
  },
  orderBy: {
    season: "desc"
  },
  include: {
    template: true,
    parent: true
  }
})
```

---

## Season Values

### Standard Seasons
- `"2024"` - Single year season
- `"2024-2025"` - Multi-year season (academic year, etc.)
- `"Fall 2024"` - Semester-based season
- `"Spring 2024"` - Semester-based season

### Special Seasons
- `"career"` - Aggregate stats across all seasons
- `"all-time"` - Historical aggregates

**Season Date Ranges:**

Academic/sports seasons run from **September 1 - June 1**:

| Season | Start Date  | End Date    |
|--------|-------------|-------------|
| 2024   | 2024-09-01  | 2025-06-01  |
| 2023   | 2023-09-01  | 2024-06-01  |
| 2022   | 2022-09-01  | 2023-06-01  |

This aligns with the existing TeamMembership season filtering.

---

## Hierarchy and Context

The `parentId` field creates hierarchical relationships:

### Player Stats Hierarchy
```
Player
└── Team (parentId: teamId)
    ├── Season 2024 Stats
    ├── Season 2023 Stats
    └── Season 2022 Stats
```

### Team Stats Hierarchy
```
Team
└── League (parentId: leagueId)
    ├── Season 2024 Stats
    ├── Season 2023 Stats
    └── Season 2022 Stats
```

### Career Stats (No Parent)
```
Player
└── No Parent (parentId: null)
    └── Career Stats (season: "career")
```

This allows querying like:
- "Show me player X's stats on team Y"
- "Show me team A's stats in league B"
- "Show me player X's overall career stats"

---

## Integration with Time Period Filtering

The entity stats system **aligns perfectly** with the existing time period filtering:

### Existing Time Filtering (See TIME_PERIOD_FILTERING.md)
- Team memberships by season
- Clips by recorded date
- Positions/jerseys by season

### Stats Filtering (New)
- Stats by season
- Stats by parent context (team/league)
- Career aggregates

**UI Integration:**
The existing season filter UI can be extended to also filter stats:

```typescript
// URL: /players/marcus-rodriguez?season=2024

// Already filters:
- Team memberships for 2024
- Clips recorded in 2024
- Positions played in 2024

// Will also filter:
- Stats from 2024 season ✨ NEW
```

---

## Templates by Sport

### Baseball Templates (Seed Data)

**Baseball Player - Batting**
- Games Played, At Bats, Hits
- Batting Average (calculated)
- Home Runs, RBI, Stolen Bases

**Baseball Player - Pitching**
- Games Played, Wins, Losses
- ERA, Strikeouts, Saves

**Baseball Team - Season**
- Wins, Losses, Win % (calculated)
- Runs Scored, Runs Allowed

### Basketball Templates (Seed Data)

**Basketball Player - Season**
- Games Played
- Points Per Game, Assists Per Game
- Rebounds Per Game, Steals Per Game
- Field Goal Percentage

**Basketball Team - Season**
- Wins, Losses, Win % (calculated)
- Points Per Game

### Adding New Templates

To add templates for other sports:

1. Create sport-specific templates in seed data
2. Define appropriate fields for that sport
3. Mark fields as rankable/calculated as needed
4. Create corresponding UI forms for data entry

---

## Admin/User Workflows

### League Admin Workflow
1. League automatically has access to sport's default templates
2. Optional: League can customize templates (future feature)
3. Players on teams in that league see normalized stat forms
4. League can view rankings/leaderboards for all players

### Player Admin Workflow
1. View available templates (from teams' leagues)
2. Select season and team context
3. Fill out normalized stat form (auto-generated from template)
4. Optional: Add custom stats for personal tracking
5. Normalized stats appear in rankings
6. Custom stats appear in profile but not rankings

### Team Admin Workflow
1. Enter team stats by season
2. Select parent league context
3. Fill out normalized stat form
4. Team stats appear in league standings

---

## Future Enhancements

### League Template Customization
- Allow leagues to create custom templates based on sport defaults
- Add/remove fields specific to league rules
- Version templates when updated

### Calculated Fields
- Auto-calculate derived stats (batting average, win percentage)
- Validate calculated values match formula
- Show formulas in UI tooltips

### Stat Validation
- Min/max ranges for fields
- Cross-field validation (e.g., hits <= at bats)
- Required field enforcement in forms

### Advanced Querying
- Filter players by stat thresholds
- Multi-stat sorting (e.g., sort by HR then RBI)
- Percentile rankings
- Stat trends over time

### Import/Export
- Bulk import stats from CSV
- Export stats for analysis
- API endpoints for stat submission

---

## Key Files

### Schema
- `prisma/schema.prisma` - StatsTemplate and EntityStats models

### Migrations
- `prisma/migrations/20251031120000_add_entity_stats_system/` - Initial migration

### Seed Data
- `prisma/seed.ts` - Sample templates and stats (lines 1383-1876)

### Future Implementation
- `lib/data-access.ts` - Add getEntityStats(), getEntityRankings()
- `components/StatsTable.tsx` - Display stats in table format
- `components/StatsForm.tsx` - Admin form for entering stats
- `app/[type]/[slug]/page.tsx` - Integrate stats display into entity pages

---

## Best Practices

### Template Design
- Keep templates focused (batting vs pitching, not combined)
- Mark only truly rankable fields as rankable
- Use calculated fields for derived stats
- Include format hints for proper display

### Data Entry
- Require season and parent context for all stats
- Use normalized stats for official league data
- Use custom stats only for personal tracking
- Validate data before saving

### Querying
- Always include template for context
- Filter by season and parent for specific views
- Use career/all-time seasons for aggregates
- Index on entityId, season, and parentId for performance

### Display
- Show template name/category with stats
- Indicate calculated vs entered fields
- Show parent context (e.g., "Stats with Stanford")
- Link to leaderboards for rankable fields

---

**Last Updated:** 2025-10-31
**Version:** 1.0 (MVP)
**Related Docs:** TIME_PERIOD_FILTERING.md, ENTITIES.md
