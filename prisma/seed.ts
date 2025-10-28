import { PrismaClient } from '../lib/generated/prisma-client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Sports as Entities with verified Iconify logos
  const basketball = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'basketball',
      name: 'Basketball',
      description: 'Fast-paced court sport',
      logo: '/icons/sports/basketball.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const golf = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'golf',
      name: 'Golf',
      description: 'Precision club and ball sport',
      logo: '/icons/sports/golf.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const hockey = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'hockey',
      name: 'Hockey',
      description: 'Ice hockey',
      logo: '/icons/sports/hockey-sticks.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const lacrosse = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'lacrosse',
      name: 'Lacrosse',
      description: 'Team sport played with a lacrosse stick and ball',
      logo: '/icons/sports/hockey-sticks.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const rowing = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'rowing',
      name: 'Rowing',
      description: 'Competitive rowing and crew',
      logo: '/icons/sports/rowing.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const soccer = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'soccer',
      name: 'Soccer',
      description: 'The beautiful game',
      logo: '/icons/sports/soccer.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const swimming = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'swimming',
      name: 'Swimming',
      description: 'Competitive swimming and diving',
      logo: '/icons/sports/swim.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const tennis = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'tennis',
      name: 'Tennis',
      description: 'Racket sport',
      logo: '/icons/sports/tennis.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const trackAndField = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'track-and-field',
      name: 'Track & Field',
      description: 'Athletics including running, jumping, and throwing events',
      logo: '/icons/sports/run.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const volleyball = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'volleyball',
      name: 'Volleyball',
      description: 'Indoor volleyball',
      logo: '/icons/sports/volleyball.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const waterPolo = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'water-polo',
      name: 'Water Polo',
      description: 'Aquatic team sport',
      logo: '/icons/sports/water.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const wrestling = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'wrestling',
      name: 'Wrestling',
      description: 'Combat sport',
      logo: '/icons/sports/karate.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: true,
        coed: false,
      },
    },
  })

  const beachVolleyball = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'beach-volleyball',
      name: 'Beach Volleyball',
      description: 'Sand volleyball',
      logo: '/icons/sports/volleyball.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: false,
        womens: true,
        coed: false,
      },
    },
  })

  const fieldHockey = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'field-hockey',
      name: 'Field Hockey',
      description: 'Team sport played with sticks and a ball on grass',
      logo: '/icons/sports/hockey-sticks.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: false,
        womens: true,
        coed: false,
      },
    },
  })

  const gymnastics = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'gymnastics',
      name: 'Gymnastics',
      description: 'Artistic gymnastics',
      logo: '/icons/sports/gymnastics.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: false,
        womens: true,
        coed: false,
      },
    },
  })

  const softball = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'softball',
      name: 'Softball',
      description: 'Variant of baseball',
      logo: '/icons/sports/baseball.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: false,
        womens: true,
        coed: false,
      },
    },
  })

  const baseball = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'baseball',
      name: 'Baseball',
      description: "America's favorite pastime",
      logo: '/icons/sports/baseball.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: false,
        coed: false,
      },
    },
  })

  const football = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'football',
      name: 'Football',
      description: 'American football',
      logo: '/icons/sports/football.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: true,
        womens: false,
        coed: false,
      },
    },
  })

  const cheerleading = await prisma.entity.create({
    data: {
      type: 'sport',
      slug: 'cheerleading',
      name: 'Cheerleading',
      description: 'Competitive cheerleading and spirit',
      logo: '/icons/sports/bullhorn.svg',
      childEntities: 'Leagues',
      metadata: {
        mens: false,
        womens: false,
        coed: true,
      },
    },
  })

  console.log('✓ Created sports')

  // Create Leagues as Entities
  const mlb = await prisma.entity.create({
    data: {
      type: 'league',
      slug: 'college-baseball-league',
      name: 'College Baseball League',
      description: 'Competitive college baseball league',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
      parentId: baseball.id,
      childEntities: 'Teams',
    },
  })

  const nba = await prisma.entity.create({
    data: {
      type: 'league',
      slug: 'nba',
      name: 'National Basketball Association',
      description: 'Professional basketball league',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      parentId: basketball.id,
      childEntities: 'Teams',
    },
  })

  const nfl = await prisma.entity.create({
    data: {
      type: 'league',
      slug: 'nfl',
      name: 'National Football League',
      description: 'Professional American football league',
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
      parentId: football.id,
      childEntities: 'Teams',
    },
  })

  console.log('✓ Created leagues')

  // Create Teams as Entities
  const cardinals = await prisma.entity.create({
    data: {
      type: 'team',
      slug: 'stanford-cardinals',
      name: 'Stanford Cardinals',
      description: 'Elite college baseball program from Stanford University',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
      parentId: mlb.id,
      childEntities: 'Players',
    },
  })

  const bruins = await prisma.entity.create({
    data: {
      type: 'team',
      slug: 'ucla-bruins',
      name: 'UCLA Bruins',
      description: 'Prestigious college baseball team from UCLA',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/26.png',
      parentId: mlb.id,
      childEntities: 'Players',
    },
  })

  const lakers = await prisma.entity.create({
    data: {
      type: 'team',
      slug: 'los-angeles-lakers',
      name: 'Los Angeles Lakers',
      description: 'NBA team based in Los Angeles',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      parentId: nba.id,
      childEntities: 'Players',
    },
  })

  const chiefs = await prisma.entity.create({
    data: {
      type: 'team',
      slug: 'kansas-city-chiefs',
      name: 'Kansas City Chiefs',
      description: 'NFL team based in Kansas City',
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
      parentId: nfl.id,
      childEntities: 'Players',
    },
  })

  console.log('✓ Created teams')

  // Create Players as Entities (not Users)
  const player1 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'marcus-rodriguez',
      name: 'Marcus Rodriguez',
      description: 'Professional baseball player with 5 years in the league. Power hitter and outfielder.',
      logo: 'https://i.pravatar.cc/300?img=12',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'M-Rod',
        position: 'Outfielder',
        jerseyNumber: 24,
        socialLinks: {
          twitter: '@mrod_baseball',
          instagram: '@marcusrod',
        },
        stats: {
          battingAverage: '.305',
          homeRuns: 28,
          rbi: 87,
        },
      },
    },
  })

  const player2 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'sarah-chen',
      name: 'Sarah Chen',
      description: 'All-star pitcher known for devastating curveball. 2x ERA champion.',
      logo: 'https://i.pravatar.cc/300?img=47',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'The Ace',
        position: 'Pitcher',
        jerseyNumber: 45,
        socialLinks: {
          twitter: '@sarahace',
          instagram: '@theacesarah',
          youtube: '@SarahChenBaseball',
        },
        stats: {
          era: '2.15',
          wins: 18,
          strikeouts: 245,
        },
      },
    },
  })

  const player3 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'jamal-williams',
      name: 'Jamal Williams',
      description: 'Point guard with lightning-fast handles. League assist leader 2023.',
      logo: 'https://i.pravatar.cc/300?img=33',
      banner: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200',
      parentId: lakers.id,
      metadata: {
        displayName: 'J-Will',
        position: 'Point Guard',
        jerseyNumber: 7,
        socialLinks: {
          twitter: '@jwill_hoops',
          instagram: '@jamalwilliams',
        },
        stats: {
          pointsPerGame: 18.5,
          assistsPerGame: 9.2,
          stealsPerGame: 2.1,
        },
      },
    },
  })

  const player4 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'tommy-obrien',
      name: "Tommy O'Brien",
      description: 'Quarterback with a cannon arm. Leading the league in passing yards.',
      logo: 'https://i.pravatar.cc/300?img=15',
      banner: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200',
      parentId: chiefs.id,
      metadata: {
        displayName: 'Tommy Guns',
        position: 'Quarterback',
        jerseyNumber: 12,
        socialLinks: {
          twitter: '@tommyguns_qb',
          instagram: '@tommyobrien',
        },
        stats: {
          passingYards: 4235,
          touchdowns: 38,
          completionPercentage: '68.5%',
        },
      },
    },
  })

  // Stanford Cardinals Players
  const cardinal2 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'kevin-park',
      name: 'Kevin Park',
      description: 'Solid defensive catcher with a cannon for an arm.',
      logo: 'https://i.pravatar.cc/300?img=13',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'K-Park',
        position: 'Catcher',
        jerseyNumber: 7,
        socialLinks: { twitter: '@kpark_mlb', instagram: '@kevinpark' },
      },
    },
  })

  const cardinal3 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'diego-martinez',
      name: 'Diego Martinez',
      description: 'Fireballer with a 98 mph fastball. Closing games since 2020.',
      logo: 'https://i.pravatar.cc/300?img=14',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'El Fuego',
        position: 'Relief Pitcher',
        jerseyNumber: 31,
        socialLinks: { twitter: '@elfuego99', instagram: '@diego_martinez' },
      },
    },
  })

  const cardinal4 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'ryan-mitchell',
      name: 'Ryan Mitchell',
      description: 'Gold Glove shortstop with elite defensive skills.',
      logo: 'https://i.pravatar.cc/300?img=51',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'The Glove',
        position: 'Shortstop',
        jerseyNumber: 2,
        socialLinks: { twitter: '@ryantheglove', instagram: '@ryanmitchell' },
      },
    },
  })

  const cardinal5 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'alex-thompson',
      name: 'Alex Thompson',
      description: 'Third baseman with power. 25+ home runs every season.',
      logo: 'https://i.pravatar.cc/300?img=52',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'AT3',
        position: 'Third Base',
        jerseyNumber: 15,
        socialLinks: { twitter: '@at3_baseball', instagram: '@alexthompson' },
      },
    },
  })

  const cardinal6 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'jordan-lee',
      name: 'Jordan Lee',
      description: 'Speedster on the bases. League leader in stolen bases.',
      logo: 'https://i.pravatar.cc/300?img=53',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'J-Lee',
        position: 'Center Field',
        jerseyNumber: 11,
        socialLinks: { twitter: '@jlee_speed', instagram: '@jordanlee' },
      },
    },
  })

  const cardinal7 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'chris-davidson',
      name: 'Chris Davidson',
      description: 'Veteran first baseman. Team leader and mentor.',
      logo: 'https://i.pravatar.cc/300?img=54',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'Davo',
        position: 'First Base',
        jerseyNumber: 28,
        socialLinks: { twitter: '@davo_baseball', instagram: '@chrisdavidson' },
      },
    },
  })

  const cardinal8 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'tyler-watson',
      name: 'Tyler Watson',
      description: 'Left-handed pitcher with nasty changeup.',
      logo: 'https://i.pravatar.cc/300?img=55',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'T-Wat',
        position: 'Starting Pitcher',
        jerseyNumber: 42,
        socialLinks: { twitter: '@twat_pitcher', instagram: '@tylerwatson' },
      },
    },
  })

  const cardinal9 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'brandon-scott',
      name: 'Brandon Scott',
      description: 'Utility player who can play anywhere on the field.',
      logo: 'https://i.pravatar.cc/300?img=56',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'B-Scott',
        position: 'Utility',
        jerseyNumber: 19,
        socialLinks: { twitter: '@bscott_baseball', instagram: '@brandonscott' },
      },
    },
  })

  const cardinal10 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'michael-chang',
      name: 'Michael Chang',
      description: 'Solid defensive second baseman with good bat control.',
      logo: 'https://i.pravatar.cc/300?img=57',
      banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      parentId: cardinals.id,
      metadata: {
        displayName: 'M-Chang',
        position: 'Second Base',
        jerseyNumber: 4,
        socialLinks: { twitter: '@mchang_mlb', instagram: '@michaelchang' },
      },
    },
  })

  // UCLA Bruins Players
  const bruin2 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'jake-anderson',
      name: 'Jake Anderson',
      description: 'Power-hitting designated hitter. 40+ home runs per season.',
      logo: 'https://i.pravatar.cc/300?img=58',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'Jakey',
        position: 'Designated Hitter',
        jerseyNumber: 44,
        socialLinks: { twitter: '@jakey_bombs', instagram: '@jakeanderson' },
      },
    },
  })

  const bruin3 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'luis-hernandez',
      name: 'Luis Hernandez',
      description: 'Team captain and shortstop. Leader on and off the field.',
      logo: 'https://i.pravatar.cc/300?img=59',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'El Capitan',
        position: 'Shortstop',
        jerseyNumber: 2,
        socialLinks: { twitter: '@el_capitan', instagram: '@luishernandez' },
      },
    },
  })

  const bruin4 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'derek-stone',
      name: 'Derek Stone',
      description: 'Elite closer. Saving games since 2019.',
      logo: 'https://i.pravatar.cc/300?img=60',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'Stoney',
        position: 'Closer',
        jerseyNumber: 57,
        socialLinks: { twitter: '@stoney_closes', instagram: '@derekstone' },
      },
    },
  })

  const bruin5 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'marcus-johnson',
      name: 'Marcus Johnson',
      description: 'Athletic center fielder with incredible range.',
      logo: 'https://i.pravatar.cc/300?img=61',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'MJ',
        position: 'Center Field',
        jerseyNumber: 99,
        socialLinks: { twitter: '@mj_baseball', instagram: '@marcusjohnson' },
      },
    },
  })

  const bruin6 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'anthony-romano',
      name: 'Anthony Romano',
      description: 'Veteran catcher and team leader. 15 years in the majors.',
      logo: 'https://i.pravatar.cc/300?img=62',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'Tony R',
        position: 'Catcher',
        jerseyNumber: 24,
        socialLinks: { twitter: '@tonyr_ucla', instagram: '@anthonyromano' },
      },
    },
  })

  const bruin7 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'carlos-ramirez',
      name: 'Carlos Ramirez',
      description: 'Hard-hitting third baseman. Clutch performer.',
      logo: 'https://i.pravatar.cc/300?img=63',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'Los',
        position: 'Third Base',
        jerseyNumber: 13,
        socialLinks: { twitter: '@los_ramirez', instagram: '@carlosramirez' },
      },
    },
  })

  const bruin8 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'trevor-mills',
      name: 'Trevor Mills',
      description: 'Starting pitcher with a devastating slider.',
      logo: 'https://i.pravatar.cc/300?img=64',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'T-Mills',
        position: 'Starting Pitcher',
        jerseyNumber: 22,
        socialLinks: { twitter: '@tmills_pitcher', instagram: '@trevormills' },
      },
    },
  })

  const bruin9 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'james-cooper',
      name: 'James Cooper',
      description: 'Speedy left fielder with great instincts.',
      logo: 'https://i.pravatar.cc/300?img=65',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'Coop',
        position: 'Left Field',
        jerseyNumber: 8,
        socialLinks: { twitter: '@coop_baseball', instagram: '@jamescooper' },
      },
    },
  })

  const bruin10 = await prisma.entity.create({
    data: {
      type: 'player',
      slug: 'robert-taylor',
      name: 'Robert Taylor',
      description: 'Solid second baseman with excellent bat-to-ball skills.',
      logo: 'https://i.pravatar.cc/300?img=66',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      parentId: bruins.id,
      metadata: {
        displayName: 'Bobby T',
        position: 'Second Base',
        jerseyNumber: 18,
        socialLinks: { twitter: '@bobbyt_ucla', instagram: '@roberttaylor' },
      },
    },
  })

  console.log('✓ Created players')

  // Create Clips
  const clip1 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Baseball Skills Training',
      description: 'Marcus Rodriguez working on his baseball fundamentals',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip2 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Baseball Pitching Tutorial',
      description: 'Sarah Chen demonstrates proper pitching mechanics',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip3 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Basketball Game Highlights',
      description: 'Jamal Williams with great court vision and assists',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip4 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Football Training Session',
      description: "Tommy O'Brien working on quarterback mechanics",
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip5 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Baseball Fielding Drills',
      description: 'Marcus practices defensive techniques',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  console.log('✓ Created clips')

  // Link Clips to Player Entities
  await prisma.entityClip.createMany({
    data: [
      { entityId: player1.id, clipId: clip1.id, order: 1 },
      { entityId: player1.id, clipId: clip5.id, order: 2 },
      { entityId: player2.id, clipId: clip2.id, order: 1 },
      { entityId: player3.id, clipId: clip3.id, order: 1 },
      { entityId: player4.id, clipId: clip4.id, order: 1 },
    ],
  })

  console.log('✓ Linked clips to players')

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
