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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
      },
      metadata: {
        displayName: 'J-Will',
        socialLinks: {
          twitter: '@jwill_hoops',
          instagram: '@jamalwilliams',
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
        r: ['TopClips', 'Discussions'],
      },
      metadata: {
        displayName: 'Tommy Guns',
        socialLinks: {
          twitter: '@tommyguns_qb',
          instagram: '@tommyobrien',
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
        r: ['TopClips', 'Discussions'],
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
      recordedAt: new Date('2024-10-15'), // Recorded during 2024 season at Stanford
    },
  })

  const clip2 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Baseball Pitching Tutorial',
      description: 'Sarah Chen demonstrates proper pitching mechanics',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
      recordedAt: new Date('2024-03-20'), // Recorded during 2024 season at UCLA
    },
  })

  const clip3 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Basketball Game Highlights',
      description: 'Jamal Williams with great court vision and assists',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
      recordedAt: new Date('2024-11-05'), // Recorded during 2024 season at Lakers
    },
  })

  const clip4 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Football Training Session',
      description: "Tommy O'Brien working on quarterback mechanics",
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
      recordedAt: new Date('2024-09-10'), // Recorded during 2024 season
    },
  })

  const clip5 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Baseball Fielding Drills',
      description: 'Marcus practices defensive techniques',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
      recordedAt: new Date('2023-02-18'), // Recorded during 2023 season at UCLA
    },
  })

  console.log('✓ Created clips')

  // Link Clips to Player and Team Entities
  await prisma.entityClip.createMany({
    data: [
      // clip1: Marcus Rodriguez at Stanford Cardinals (recorded Oct 2024)
      { entityId: player1.id, clipId: clip1.id, order: 1 },
      { entityId: cardinals.id, clipId: clip1.id, order: 1 },

      // clip5: Marcus Rodriguez at UCLA Bruins (recorded Feb 2023)
      { entityId: player1.id, clipId: clip5.id, order: 2 },
      { entityId: bruins.id, clipId: clip5.id, order: 2 },

      // clip2: Sarah Chen at UCLA Bruins (recorded Mar 2024)
      { entityId: player2.id, clipId: clip2.id, order: 1 },
      { entityId: bruins.id, clipId: clip2.id, order: 3 },

      // clip3: Jamal Williams at LA Lakers (recorded Nov 2024)
      { entityId: player3.id, clipId: clip3.id, order: 1 },
      { entityId: lakers.id, clipId: clip3.id, order: 1 },

      // clip4: Tommy O'Brien at Kansas City Chiefs (recorded Sep 2024)
      { entityId: player4.id, clipId: clip4.id, order: 1 },
      { entityId: chiefs.id, clipId: clip4.id, order: 1 },
    ],
  })

  console.log('✓ Linked clips to players and teams')

  // Create Team Memberships
  await prisma.teamMembership.createMany({
    data: [
      // Marcus Rodriguez - Current: Stanford Cardinals (2024)
      { playerId: player1.id, teamId: cardinals.id, jerseyNumber: 24, positions: ['Outfielder'], season: '2024', isCurrent: true },
      // Marcus Rodriguez - Historical: UCLA Bruins (2023) - Position change from infield to outfield
      { playerId: player1.id, teamId: bruins.id, jerseyNumber: 18, positions: ['Right Fielder', 'Center Fielder'], season: '2023', isCurrent: false, startDate: new Date('2023-09-01'), endDate: new Date('2024-06-01') },
      // Marcus Rodriguez - Historical: LA Lakers (2022) - Started as infielder
      { playerId: player1.id, teamId: lakers.id, jerseyNumber: 5, positions: ['Second Base', 'Utility'], season: '2022', isCurrent: false, startDate: new Date('2022-09-01'), endDate: new Date('2023-06-01') },

      // Sarah Chen - Current: UCLA Bruins (2024)
      { playerId: player2.id, teamId: bruins.id, jerseyNumber: 45, positions: ['Pitcher'], season: '2024', isCurrent: true },
      // Sarah Chen - Historical: UCLA Bruins (2023) - Transitioning to pitcher
      { playerId: player2.id, teamId: bruins.id, jerseyNumber: 21, positions: ['Starting Pitcher', 'Relief Pitcher'], season: '2023', isCurrent: false, startDate: new Date('2023-09-01'), endDate: new Date('2024-06-01') },
      // Sarah Chen - Historical: UCLA Bruins (2022) - Started as position player
      { playerId: player2.id, teamId: bruins.id, jerseyNumber: 12, positions: ['Left Fielder', 'Designated Hitter'], season: '2022', isCurrent: false, startDate: new Date('2022-09-01'), endDate: new Date('2023-06-01') },

      // Jamal Williams - Current: LA Lakers (2024)
      { playerId: player3.id, teamId: lakers.id, jerseyNumber: 7, positions: ['Point Guard'], season: '2024', isCurrent: true },
      // Jamal Williams - Historical: UCLA Bruins (2023) - Transfer #1
      { playerId: player3.id, teamId: bruins.id, jerseyNumber: 33, positions: ['Shooting Guard'], season: '2023', isCurrent: false, startDate: new Date('2023-09-01'), endDate: new Date('2024-06-01') },
      // Jamal Williams - Historical: Stanford Cardinals (2022) - Transfer #2, different position
      { playerId: player3.id, teamId: cardinals.id, jerseyNumber: 15, positions: ['Small Forward', 'Power Forward'], season: '2022', isCurrent: false, startDate: new Date('2022-09-01'), endDate: new Date('2023-06-01') },
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

  // Create Stats Templates
  const baseballPlayerBattingTemplate = await prisma.statsTemplate.create({
    data: {
      name: 'Baseball Player - Batting',
      entityType: 'player',
      sportId: baseball.id,
      schema: {
        category: 'batting',
        fields: [
          {
            key: 'gamesPlayed',
            label: 'Games Played',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'atBats',
            label: 'At Bats',
            type: 'integer',
            required: true,
            rankable: false,
          },
          {
            key: 'hits',
            label: 'Hits',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'battingAverage',
            label: 'Batting Average',
            type: 'decimal',
            format: '.XXX',
            required: false,
            calculated: true,
            formula: 'hits / atBats',
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'homeRuns',
            label: 'Home Runs',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'rbi',
            label: 'RBI',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'stolenBases',
            label: 'Stolen Bases',
            type: 'integer',
            required: false,
            rankable: true,
            sortOrder: 'desc',
          },
        ],
      },
    },
  })

  const baseballPlayerPitchingTemplate = await prisma.statsTemplate.create({
    data: {
      name: 'Baseball Player - Pitching',
      entityType: 'player',
      sportId: baseball.id,
      schema: {
        category: 'pitching',
        fields: [
          {
            key: 'gamesPlayed',
            label: 'Games Played',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'wins',
            label: 'Wins',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'losses',
            label: 'Losses',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'asc',
          },
          {
            key: 'era',
            label: 'ERA',
            type: 'decimal',
            format: 'X.XX',
            required: true,
            rankable: true,
            sortOrder: 'asc',
          },
          {
            key: 'strikeouts',
            label: 'Strikeouts',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'saves',
            label: 'Saves',
            type: 'integer',
            required: false,
            rankable: true,
            sortOrder: 'desc',
          },
        ],
      },
    },
  })

  const baseballTeamTemplate = await prisma.statsTemplate.create({
    data: {
      name: 'Baseball Team - Season',
      entityType: 'team',
      sportId: baseball.id,
      schema: {
        category: 'season',
        fields: [
          {
            key: 'wins',
            label: 'Wins',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'losses',
            label: 'Losses',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'asc',
          },
          {
            key: 'winPercentage',
            label: 'Win %',
            type: 'decimal',
            format: '.XXX',
            required: false,
            calculated: true,
            formula: 'wins / (wins + losses)',
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'runsScored',
            label: 'Runs Scored',
            type: 'integer',
            required: false,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'runsAllowed',
            label: 'Runs Allowed',
            type: 'integer',
            required: false,
            rankable: true,
            sortOrder: 'asc',
          },
        ],
      },
    },
  })

  const basketballPlayerTemplate = await prisma.statsTemplate.create({
    data: {
      name: 'Basketball Player - Season',
      entityType: 'player',
      sportId: basketball.id,
      schema: {
        category: 'season',
        fields: [
          {
            key: 'gamesPlayed',
            label: 'Games Played',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'pointsPerGame',
            label: 'Points Per Game',
            type: 'decimal',
            format: 'XX.X',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'assistsPerGame',
            label: 'Assists Per Game',
            type: 'decimal',
            format: 'XX.X',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'reboundsPerGame',
            label: 'Rebounds Per Game',
            type: 'decimal',
            format: 'XX.X',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'stealsPerGame',
            label: 'Steals Per Game',
            type: 'decimal',
            format: 'X.X',
            required: false,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'fieldGoalPercentage',
            label: 'FG%',
            type: 'decimal',
            format: '.XXX',
            required: false,
            rankable: true,
            sortOrder: 'desc',
          },
        ],
      },
    },
  })

  const basketballTeamTemplate = await prisma.statsTemplate.create({
    data: {
      name: 'Basketball Team - Season',
      entityType: 'team',
      sportId: basketball.id,
      schema: {
        category: 'season',
        fields: [
          {
            key: 'wins',
            label: 'Wins',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'losses',
            label: 'Losses',
            type: 'integer',
            required: true,
            rankable: true,
            sortOrder: 'asc',
          },
          {
            key: 'winPercentage',
            label: 'Win %',
            type: 'decimal',
            format: '.XXX',
            required: false,
            calculated: true,
            formula: 'wins / (wins + losses)',
            rankable: true,
            sortOrder: 'desc',
          },
          {
            key: 'pointsPerGame',
            label: 'Points Per Game',
            type: 'decimal',
            format: 'XXX.X',
            required: false,
            rankable: true,
            sortOrder: 'desc',
          },
        ],
      },
    },
  })

  console.log('✓ Created stats templates')

  // Create Entity Stats for Players
  await prisma.entityStats.createMany({
    data: [
      // Marcus Rodriguez - 2024 Season at Stanford (Batting)
      {
        entityId: player1.id,
        parentId: cardinals.id,
        season: '2024',
        statsType: 'normalized',
        templateId: baseballPlayerBattingTemplate.id,
        stats: {
          gamesPlayed: 52,
          atBats: 198,
          hits: 62,
          battingAverage: '.313',
          homeRuns: 14,
          rbi: 48,
          stolenBases: 8,
        },
      },
      // Marcus Rodriguez - 2023 Season at UCLA (Batting)
      {
        entityId: player1.id,
        parentId: bruins.id,
        season: '2023',
        statsType: 'normalized',
        templateId: baseballPlayerBattingTemplate.id,
        stats: {
          gamesPlayed: 48,
          atBats: 185,
          hits: 55,
          battingAverage: '.297',
          homeRuns: 9,
          rbi: 32,
          stolenBases: 12,
        },
      },
      // Marcus Rodriguez - Career Stats (aggregate)
      {
        entityId: player1.id,
        parentId: null,
        season: 'career',
        statsType: 'normalized',
        templateId: baseballPlayerBattingTemplate.id,
        stats: {
          gamesPlayed: 145,
          atBats: 560,
          hits: 171,
          battingAverage: '.305',
          homeRuns: 28,
          rbi: 87,
          stolenBases: 24,
        },
      },
      // Sarah Chen - 2024 Season at UCLA (Pitching)
      {
        entityId: player2.id,
        parentId: bruins.id,
        season: '2024',
        statsType: 'normalized',
        templateId: baseballPlayerPitchingTemplate.id,
        stats: {
          gamesPlayed: 18,
          wins: 12,
          losses: 3,
          era: '2.15',
          strikeouts: 156,
          saves: 0,
        },
      },
      // Sarah Chen - 2023 Season at UCLA (Pitching)
      {
        entityId: player2.id,
        parentId: bruins.id,
        season: '2023',
        statsType: 'normalized',
        templateId: baseballPlayerPitchingTemplate.id,
        stats: {
          gamesPlayed: 15,
          wins: 9,
          losses: 4,
          era: '2.68',
          strikeouts: 132,
          saves: 2,
        },
      },
      // Jamal Williams - 2024 Season at Lakers (Basketball)
      {
        entityId: player3.id,
        parentId: lakers.id,
        season: '2024',
        statsType: 'normalized',
        templateId: basketballPlayerTemplate.id,
        stats: {
          gamesPlayed: 72,
          pointsPerGame: 18.5,
          assistsPerGame: 9.2,
          reboundsPerGame: 4.1,
          stealsPerGame: 2.1,
          fieldGoalPercentage: '.445',
        },
      },
      // Jamal Williams - 2023 Season at UCLA (Basketball)
      {
        entityId: player3.id,
        parentId: bruins.id,
        season: '2023',
        statsType: 'normalized',
        templateId: basketballPlayerTemplate.id,
        stats: {
          gamesPlayed: 32,
          pointsPerGame: 15.8,
          assistsPerGame: 6.5,
          reboundsPerGame: 3.8,
          stealsPerGame: 1.8,
          fieldGoalPercentage: '.418',
        },
      },
    ],
  })

  // Create Entity Stats for Teams
  await prisma.entityStats.createMany({
    data: [
      // Stanford Cardinals - 2024 Season
      {
        entityId: cardinals.id,
        parentId: mlb.id,
        season: '2024',
        statsType: 'normalized',
        templateId: baseballTeamTemplate.id,
        stats: {
          wins: 42,
          losses: 18,
          winPercentage: '.700',
          runsScored: 428,
          runsAllowed: 312,
        },
      },
      // Stanford Cardinals - 2023 Season
      {
        entityId: cardinals.id,
        parentId: mlb.id,
        season: '2023',
        statsType: 'normalized',
        templateId: baseballTeamTemplate.id,
        stats: {
          wins: 38,
          losses: 22,
          winPercentage: '.633',
          runsScored: 385,
          runsAllowed: 340,
        },
      },
      // UCLA Bruins - 2024 Season
      {
        entityId: bruins.id,
        parentId: mlb.id,
        season: '2024',
        statsType: 'normalized',
        templateId: baseballTeamTemplate.id,
        stats: {
          wins: 35,
          losses: 25,
          winPercentage: '.583',
          runsScored: 372,
          runsAllowed: 358,
        },
      },
      // LA Lakers - 2024 Season
      {
        entityId: lakers.id,
        parentId: nba.id,
        season: '2024',
        statsType: 'normalized',
        templateId: basketballTeamTemplate.id,
        stats: {
          wins: 47,
          losses: 35,
          winPercentage: '.573',
          pointsPerGame: 112.4,
        },
      },
    ],
  })

  console.log('✓ Created entity stats')

  // Create Users for discussions
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      displayName: 'JohnnyD',
      emailVerified: true,
      image: 'https://i.pravatar.cc/300?img=1',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      displayName: 'JaneS',
      emailVerified: true,
      image: 'https://i.pravatar.cc/300?img=2',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      displayName: 'MikeJ',
      emailVerified: true,
      image: 'https://i.pravatar.cc/300?img=3',
    },
  })

  const user4 = await prisma.user.create({
    data: {
      email: 'sarah.williams@example.com',
      name: 'Sarah Williams',
      displayName: 'SarahW',
      emailVerified: true,
      image: 'https://i.pravatar.cc/300?img=4',
    },
  })

  console.log('✓ Created users')

  // Create Discussion Categories
  const generalCategory = await prisma.discussionCategory.create({
    data: {
      name: 'General',
      slug: 'general',
      description: 'General discussion',
      color: '#3b82f6',
      order: 1,
    },
  })

  const newsCategory = await prisma.discussionCategory.create({
    data: {
      name: 'News',
      slug: 'news',
      description: 'Latest news and updates',
      color: '#ef4444',
      order: 2,
    },
  })

  const recruitingCategory = await prisma.discussionCategory.create({
    data: {
      name: 'Recruiting',
      slug: 'recruiting',
      description: 'Recruiting news and discussions',
      color: '#f59e0b',
      order: 3,
    },
  })

  const gameThreadCategory = await prisma.discussionCategory.create({
    data: {
      name: 'Game Thread',
      slug: 'game-thread',
      description: 'Live game discussions',
      color: '#10b981',
      order: 4,
    },
  })

  console.log('✓ Created discussion categories')

  // Create Discussion Topics
  const topic1 = await prisma.discussionTopic.create({
    data: {
      title: 'Kevin Park named Player of the Week!',
      content: 'Huge congratulations to Kevin Park for being named Player of the Week! His performance this season has been absolutely stellar. What do you think about his chances for MVP?',
      authorId: user1.id,
      categoryId: newsCategory.id,
      subjectType: 'entity',
      subjectId: cardinal2.id,
      isPinned: true,
      viewCount: 245,
      commentCount: 12,
      lastCommentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  })

  const topic2 = await prisma.discussionTopic.create({
    data: {
      title: 'Stanford Cardinals vs UCLA Bruins - Game Thread',
      content: 'Game starts at 7pm ET. Let\'s go Cardinals! Drop your predictions below.',
      authorId: user2.id,
      categoryId: gameThreadCategory.id,
      subjectType: 'entity',
      subjectId: cardinals.id,
      viewCount: 543,
      commentCount: 87,
      lastCommentAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  })

  const topic3 = await prisma.discussionTopic.create({
    data: {
      title: 'Who should be the starting pitcher for next game?',
      content: 'With Tyler Watson coming off an injury, should we start him or give him another week to recover? What do you all think?',
      authorId: user3.id,
      categoryId: generalCategory.id,
      subjectType: 'entity',
      subjectId: cardinals.id,
      viewCount: 178,
      commentCount: 23,
      lastCommentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  })

  const topic4 = await prisma.discussionTopic.create({
    data: {
      title: 'New recruit visiting campus this weekend',
      content: 'Heard from sources that a 5-star recruit is visiting Stanford this weekend. Anyone have more info?',
      authorId: user4.id,
      categoryId: recruitingCategory.id,
      subjectType: 'entity',
      subjectId: stanford.id,
      viewCount: 312,
      commentCount: 45,
      lastCommentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
  })

  const topic5 = await prisma.discussionTopic.create({
    data: {
      title: 'Lakers playoff chances?',
      content: 'With the current record, what do you think the Lakers\' playoff chances are? Can they make a deep run this year?',
      authorId: user1.id,
      categoryId: generalCategory.id,
      subjectType: 'entity',
      subjectId: lakers.id,
      viewCount: 892,
      commentCount: 156,
      lastCommentAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
  })

  const topic6 = await prisma.discussionTopic.create({
    data: {
      title: 'Thoughts on MLB season so far?',
      content: 'We\'re halfway through the season. What are everyone\'s thoughts on how MLB has been this year? Any surprises?',
      authorId: user2.id,
      categoryId: generalCategory.id,
      subjectType: 'entity',
      subjectId: mlb.id,
      isPinned: true,
      viewCount: 1243,
      commentCount: 203,
      lastCommentAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
  })

  console.log('✓ Created discussion topics')

  // Helper function to create DiscussionTopicEntity entries (bubbling up)
  async function linkTopicToEntities(topicId: number, originEntityId: number, bubbleUp: boolean) {
    // Always link to the origin entity
    await prisma.discussionTopicEntity.create({
      data: {
        topicId,
        entityId: originEntityId,
      },
    })

    if (bubbleUp) {
      // Get the origin entity with its parent chain
      const entity = await prisma.entity.findUnique({
        where: { id: originEntityId },
        include: {
          parent: {
            include: {
              parent: {
                include: {
                  parent: true, // Up to 3 levels (player -> team -> league -> sport)
                },
              },
            },
          },
        },
      })

      // Create entries for all parent entities
      let currentParent = entity?.parent
      while (currentParent) {
        await prisma.discussionTopicEntity.create({
          data: {
            topicId,
            entityId: currentParent.id,
          },
        })
        currentParent = currentParent.parent as typeof currentParent | null
      }
    }
  }

  // Link topics to entities (with bubbling)
  await linkTopicToEntities(topic1.id, cardinal2.id, true) // Player topic bubbles up
  await linkTopicToEntities(topic2.id, cardinals.id, true) // Team topic bubbles up
  await linkTopicToEntities(topic3.id, cardinals.id, true) // Team topic bubbles up
  await linkTopicToEntities(topic4.id, stanford.id, true) // School topic (no parents to bubble to)
  await linkTopicToEntities(topic5.id, lakers.id, true) // Team topic bubbles up
  await linkTopicToEntities(topic6.id, mlb.id, true) // League topic bubbles up

  console.log('✓ Created discussion topic entity links')

  // Create Comments
  const comment1 = await prisma.discussionComment.create({
    data: {
      content: 'He absolutely deserves it! That walk-off homer was incredible.',
      authorId: user2.id,
      parentType: 'topic',
      parentId: topic1.id,
    },
  })

  const comment2 = await prisma.discussionComment.create({
    data: {
      content: 'Agreed! His batting average this season is off the charts.',
      authorId: user3.id,
      parentType: 'topic',
      parentId: topic1.id,
    },
  })

  // Reply to comment1
  const reply1 = await prisma.discussionComment.create({
    data: {
      content: 'That homer gave me chills! Best moment of the season so far.',
      authorId: user4.id,
      parentType: 'topic',
      parentId: topic1.id,
      replyToCommentId: comment1.id,
      replyToUserId: user2.id,
    },
  })

  const comment3 = await prisma.discussionComment.create({
    data: {
      content: 'Cardinals are looking strong! I think they take this one 6-3.',
      authorId: user1.id,
      parentType: 'topic',
      parentId: topic2.id,
    },
  })

  const comment4 = await prisma.discussionComment.create({
    data: {
      content: 'Don\'t sleep on the Bruins! Their pitcher has been dealing lately.',
      authorId: user3.id,
      parentType: 'topic',
      parentId: topic2.id,
    },
  })

  const comment5 = await prisma.discussionComment.create({
    data: {
      content: 'I say give Tyler another week. No need to rush him back and risk re-injury.',
      authorId: user4.id,
      parentType: 'topic',
      parentId: topic3.id,
    },
  })

  const comment6 = await prisma.discussionComment.create({
    data: {
      content: 'I heard it\'s a pitcher from Texas! Could be a game changer for the program.',
      authorId: user1.id,
      parentType: 'topic',
      parentId: topic4.id,
    },
  })

  const comment7 = await prisma.discussionComment.create({
    data: {
      content: 'If they can stay healthy, I think they have a real shot at the championship.',
      authorId: user2.id,
      parentType: 'topic',
      parentId: topic5.id,
    },
  })

  const comment8 = await prisma.discussionComment.create({
    data: {
      content: 'The level of competition this year has been insane. So many close games!',
      authorId: user3.id,
      parentType: 'topic',
      parentId: topic6.id,
    },
  })

  // Update comment counts and reply counts
  await prisma.discussionComment.update({
    where: { id: comment1.id },
    data: { replyCount: 1 },
  })

  console.log('✓ Created discussion comments')

  // Create some likes
  await prisma.discussionLike.createMany({
    data: [
      { userId: user1.id, likeableType: 'topic', likeableId: topic1.id, topicId: topic1.id },
      { userId: user2.id, likeableType: 'topic', likeableId: topic1.id, topicId: topic1.id },
      { userId: user3.id, likeableType: 'topic', likeableId: topic1.id, topicId: topic1.id },
      { userId: user4.id, likeableType: 'topic', likeableId: topic2.id, topicId: topic2.id },
      { userId: user1.id, likeableType: 'topic', likeableId: topic5.id, topicId: topic5.id },
      { userId: user2.id, likeableType: 'comment', likeableId: comment1.id, commentId: comment1.id },
      { userId: user3.id, likeableType: 'comment', likeableId: comment1.id, commentId: comment1.id },
      { userId: user4.id, likeableType: 'comment', likeableId: comment3.id, commentId: comment3.id },
    ],
  })

  // Update like counts on topics
  await prisma.discussionTopic.update({
    where: { id: topic1.id },
    data: { likeCount: 3 },
  })

  await prisma.discussionTopic.update({
    where: { id: topic2.id },
    data: { likeCount: 1 },
  })

  await prisma.discussionTopic.update({
    where: { id: topic5.id },
    data: { likeCount: 1 },
  })

  // Update like counts on comments
  await prisma.discussionComment.update({
    where: { id: comment1.id },
    data: { likeCount: 2 },
  })

  await prisma.discussionComment.update({
    where: { id: comment3.id },
    data: { likeCount: 1 },
  })

  console.log('✓ Created discussion likes')

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
