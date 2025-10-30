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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
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
      layout: {
        l: [],
        c: ['Leagues', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        mens: false,
        womens: false,
        coed: true,
      },
    },
  })

  console.log('✓ Created sports')

  // Create Schools as Entities
  // Schools bitfield: 510 (Meta + Teams + Players + Clips + Filters + TopClips)
  const stanford = await prisma.entity.create({
    data: {
      type: 'school',
      slug: 'stanford-university',
      name: 'Stanford University',
      description: 'Private research university in Stanford, California, known for academic excellence and competitive athletics.',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
      childEntities: 'Teams',
      layout: {
        l: [],
        c: ['Teams', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        city: 'Stanford',
        state: 'CA',
        founded: 1885,
        type: 'Private',
        locationId: null, // Will be set after locations are created
        locationName: 'Stanford, CA',
        locationSlug: 'stanford-ca',
      },
    },
  })

  const ucla = await prisma.entity.create({
    data: {
      type: 'school',
      slug: 'ucla',
      name: 'UCLA',
      description: 'University of California, Los Angeles - a leading public research university with a strong athletic tradition.',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/26.png',
      childEntities: 'Teams',
      layout: {
        l: [],
        c: ['Teams', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        city: 'Los Angeles',
        state: 'CA',
        founded: 1919,
        type: 'Public',
        locationId: null, // Will be set after locations are created
        locationName: 'Los Angeles, CA',
        locationSlug: 'los-angeles-ca',
      },
    },
  })

  console.log('✓ Created schools')

  // Create Locations as Entities
  // Locations bitfield: 502 (Meta + Schools + Teams + Players + Clips + Filters + TopClips)
  const stanfordCA = await prisma.entity.create({
    data: {
      type: 'location',
      layout: {
        l: [],
        c: ['Schools', 'Teams', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      slug: 'stanford-ca',
      name: 'Stanford, CA',
      description: 'Home to Stanford University and its elite athletic programs in the heart of Silicon Valley.',
      metadata: {
        city: 'Stanford',
        state: 'CA',
        country: 'USA',
      },
    },
  })

  const losAngelesCA = await prisma.entity.create({
    data: {
      type: 'location',
      layout: {
        l: [],
        c: ['Schools', 'Teams', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      slug: 'los-angeles-ca',
      name: 'Los Angeles, CA',
      description: 'Major hub for professional and collegiate sports in Southern California.',
      metadata: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
      },
    },
  })

  const sanFranciscoCA = await prisma.entity.create({
    data: {
      type: 'location',
      layout: {
        l: [],
        c: ['Schools', 'Teams', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      slug: 'san-francisco-ca',
      name: 'San Francisco, CA',
      description: 'Bay Area sports hub with rich athletic history.',
      metadata: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
      },
    },
  })

  const woodmereNY = await prisma.entity.create({
    data: {
      type: 'location',
      layout: {
        l: [],
        c: ['Schools', 'Teams', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      slug: 'woodmere-ny',
      name: 'Woodmere, NY',
      description: 'Long Island community with strong youth sports programs.',
      metadata: {
        city: 'Woodmere',
        state: 'NY',
        country: 'USA',
      },
    },
  })

  const kansasCityMO = await prisma.entity.create({
    data: {
      type: 'location',
      layout: {
        l: [],
        c: ['Schools', 'Teams', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      slug: 'kansas-city-mo',
      name: 'Kansas City, MO',
      description: 'Home of championship sports teams in the heart of America.',
      metadata: {
        city: 'Kansas City',
        state: 'MO',
        country: 'USA',
      },
    },
  })

  console.log('✓ Created locations')

  // Create Leagues as Entities
  // Leagues bitfield: 466 (Meta + Teams + Clips + Filters + TopClips)
  const mlb = await prisma.entity.create({
    data: {
      type: 'league',
      slug: 'college-baseball-league',
      name: 'College Baseball League',
      description: 'Competitive college baseball league',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
      parentId: baseball.id,
      gender: 'MENS',
      childEntities: 'Teams',
      layout: {
        l: [],
        c: ['Teams', 'Clips'],
        r: ['TopClips'],
      },
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
      gender: 'MENS',
      childEntities: 'Teams',
      layout: {
        l: [],
        c: ['Teams', 'Clips'],
        r: ['TopClips'],
      },
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
      gender: 'MENS',
      childEntities: 'Teams',
      layout: {
        l: [],
        c: ['Teams', 'Clips'],
        r: ['TopClips'],
      },
    },
  })

  console.log('✓ Created leagues')

  // Create Teams as Entities
  // Teams bitfield: 486 (Meta + Schools + Players + Clips + Filters + TopClips)
  const cardinals = await prisma.entity.create({
    data: {
      type: 'team',
      slug: 'stanford-cardinals',
      name: 'Stanford Cardinals',
      description: 'Elite college baseball program',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
      parentId: mlb.id,
      childEntities: 'Players',
      layout: {
        l: [],
        c: ['Schools', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        schoolId: stanford.id,
        schoolName: 'Stanford University',
        schoolSlug: 'stanford-university',
        city: 'Stanford',
        state: 'CA',
        locationId: null, // Will be set after locations are created
        locationName: 'Stanford, CA',
        locationSlug: 'stanford-ca',
      },
    },
  })

  const bruins = await prisma.entity.create({
    data: {
      type: 'team',
      slug: 'ucla-bruins',
      name: 'UCLA Bruins',
      description: 'Prestigious college baseball team',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/26.png',
      parentId: mlb.id,
      childEntities: 'Players',
      layout: {
        l: [],
        c: ['Schools', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        schoolId: ucla.id,
        schoolName: 'UCLA',
        schoolSlug: 'ucla',
        city: 'Los Angeles',
        state: 'CA',
        locationId: null, // Will be set after locations are created
        locationName: 'Los Angeles, CA',
        locationSlug: 'los-angeles-ca',
      },
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
      layout: {
        l: [],
        c: ['Schools', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        locationId: null, // Will be set after locations are created
        locationName: 'Los Angeles, CA',
        locationSlug: 'los-angeles-ca',
      },
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
      layout: {
        l: [],
        c: ['Schools', 'Players', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        locationId: null, // Will be set after locations are created
        locationName: 'Kansas City, MO',
        locationSlug: 'kansas-city-mo',
      },
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
      layout: {
        l: [],
        c: ['x0', 'Meta', 'Teams', 'Clips'],
        r: ['TopClips', 'x1'],
        x: [
          {
            title: 'My Links',
            content: '[Google](https://google.com)',
          },
          {
            title: 'My Schedule',
            content: 'Coming soon!',
          },
        ],
      },
      metadata: {
        displayName: 'M-Rod',
        city: 'Los Angeles',
        state: 'CA',
        birthdate: '2001-03-15',
        grade: 'Senior',
        locationId: null, // Will be set after locations are created
        locationName: 'Los Angeles, CA',
        locationSlug: 'los-angeles-ca',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'The Ace',
        city: 'San Francisco',
        state: 'CA',
        birthdate: '2000-07-22',
        grade: 'Graduate',
        locationId: null, // Will be set after locations are created
        locationName: 'San Francisco, CA',
        locationSlug: 'san-francisco-ca',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'J-Will',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Tommy Guns',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'K-Park',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'El Fuego',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'The Glove',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'AT3',
        city: 'Woodmere',
        state: 'NY',
        birthdate: '2007-11-08',
        grade: 'Junior',
        locationId: null, // Will be set after locations are created
        locationName: 'Woodmere, NY',
        locationSlug: 'woodmere-ny',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'J-Lee',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Davo',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'T-Wat',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'B-Scott',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'M-Chang',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Jakey',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'El Capitan',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Stoney',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'MJ',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Tony R',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Los',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'T-Mills',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Coop',
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
      layout: {
        l: [],
        c: ['Meta', 'Teams', 'Clips'],
        r: ['TopClips'],
      },
      metadata: {
        displayName: 'Bobby T',
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

  // Create Team Memberships
  await prisma.teamMembership.createMany({
    data: [
      // Marcus Rodriguez - Stanford Cardinals
      { playerId: player1.id, teamId: cardinals.id, jerseyNumber: 24, positions: ['Outfielder'], season: '2024', isCurrent: true },
      // Sarah Chen - UCLA Bruins
      { playerId: player2.id, teamId: bruins.id, jerseyNumber: 45, positions: ['Pitcher'], season: '2024', isCurrent: true },
      // Jamal Williams - LA Lakers
      { playerId: player3.id, teamId: lakers.id, jerseyNumber: 7, positions: ['Point Guard'], season: '2024', isCurrent: true },
      // Tommy O'Brien - Kansas City Chiefs
      { playerId: player4.id, teamId: chiefs.id, jerseyNumber: 12, positions: ['Quarterback'], season: '2024', isCurrent: true },
      // Kevin Park - Stanford Cardinals
      { playerId: cardinal2.id, teamId: cardinals.id, jerseyNumber: 7, positions: ['Catcher'], season: '2024', isCurrent: true },
      // Diego Martinez - Stanford Cardinals
      { playerId: cardinal3.id, teamId: cardinals.id, jerseyNumber: 31, positions: ['Relief Pitcher'], season: '2024', isCurrent: true },
      // Ryan Mitchell - Stanford Cardinals
      { playerId: cardinal4.id, teamId: cardinals.id, jerseyNumber: 2, positions: ['Shortstop'], season: '2024', isCurrent: true },
      // Alex Thompson - Stanford Cardinals
      { playerId: cardinal5.id, teamId: cardinals.id, jerseyNumber: 15, positions: ['Third Base'], season: '2024', isCurrent: true },
      // Jordan Lee - Stanford Cardinals
      { playerId: cardinal6.id, teamId: cardinals.id, jerseyNumber: 11, positions: ['Center Field'], season: '2024', isCurrent: true },
      // Chris Davidson - Stanford Cardinals
      { playerId: cardinal7.id, teamId: cardinals.id, jerseyNumber: 28, positions: ['First Base'], season: '2024', isCurrent: true },
      // Tyler Watson - Stanford Cardinals
      { playerId: cardinal8.id, teamId: cardinals.id, jerseyNumber: 42, positions: ['Starting Pitcher'], season: '2024', isCurrent: true },
      // Brandon Scott - Stanford Cardinals
      { playerId: cardinal9.id, teamId: cardinals.id, jerseyNumber: 19, positions: ['Utility'], season: '2024', isCurrent: true },
      // Michael Chang - Stanford Cardinals
      { playerId: cardinal10.id, teamId: cardinals.id, jerseyNumber: 4, positions: ['Second Base'], season: '2024', isCurrent: true },
      // Jake Anderson - UCLA Bruins
      { playerId: bruin2.id, teamId: bruins.id, jerseyNumber: 44, positions: ['Designated Hitter'], season: '2024', isCurrent: true },
      // Luis Hernandez - UCLA Bruins
      { playerId: bruin3.id, teamId: bruins.id, jerseyNumber: 2, positions: ['Shortstop'], season: '2024', isCurrent: true },
      // Derek Stone - UCLA Bruins
      { playerId: bruin4.id, teamId: bruins.id, jerseyNumber: 57, positions: ['Closer'], season: '2024', isCurrent: true },
      // Marcus Johnson - UCLA Bruins
      { playerId: bruin5.id, teamId: bruins.id, jerseyNumber: 99, positions: ['Center Field'], season: '2024', isCurrent: true },
      // Anthony Romano - UCLA Bruins
      { playerId: bruin6.id, teamId: bruins.id, jerseyNumber: 24, positions: ['Catcher'], season: '2024', isCurrent: true },
      // Carlos Ramirez - UCLA Bruins
      { playerId: bruin7.id, teamId: bruins.id, jerseyNumber: 13, positions: ['Third Base'], season: '2024', isCurrent: true },
      // Trevor Mills - UCLA Bruins
      { playerId: bruin8.id, teamId: bruins.id, jerseyNumber: 22, positions: ['Starting Pitcher'], season: '2024', isCurrent: true },
      // James Cooper - UCLA Bruins
      { playerId: bruin9.id, teamId: bruins.id, jerseyNumber: 8, positions: ['Left Field'], season: '2024', isCurrent: true },
      // Robert Taylor - UCLA Bruins
      { playerId: bruin10.id, teamId: bruins.id, jerseyNumber: 18, positions: ['Second Base'], season: '2024', isCurrent: true },
    ],
  })

  console.log('✓ Created team memberships')

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
