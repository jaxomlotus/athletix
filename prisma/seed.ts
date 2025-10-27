import { PrismaClient } from '../lib/generated/prisma-client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Sports with gender flags
  const basketball = await prisma.sport.create({
    data: {
      name: 'Basketball',
      description: 'Fast-paced court sport',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const golf = await prisma.sport.create({
    data: {
      name: 'Golf',
      description: 'Precision club and ball sport',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const hockey = await prisma.sport.create({
    data: {
      name: 'Hockey',
      description: 'Ice hockey',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const lacrosse = await prisma.sport.create({
    data: {
      name: 'Lacrosse',
      description: 'Team sport played with a lacrosse stick and ball',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const rowing = await prisma.sport.create({
    data: {
      name: 'Rowing',
      description: 'Competitive rowing and crew',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const soccer = await prisma.sport.create({
    data: {
      name: 'Soccer',
      description: 'The beautiful game',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const swimming = await prisma.sport.create({
    data: {
      name: 'Swimming',
      description: 'Competitive swimming and diving',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const tennis = await prisma.sport.create({
    data: {
      name: 'Tennis',
      description: 'Racket sport',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const trackAndField = await prisma.sport.create({
    data: {
      name: 'Track & Field',
      description: 'Athletics including running, jumping, and throwing events',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const volleyball = await prisma.sport.create({
    data: {
      name: 'Volleyball',
      description: 'Indoor volleyball',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const waterPolo = await prisma.sport.create({
    data: {
      name: 'Water Polo',
      description: 'Aquatic team sport',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const wrestling = await prisma.sport.create({
    data: {
      name: 'Wrestling',
      description: 'Combat sport',
      mens: true,
      womens: true,
      coed: false,
    },
  })

  const beachVolleyball = await prisma.sport.create({
    data: {
      name: 'Beach Volleyball',
      description: 'Sand volleyball',
      mens: false,
      womens: true,
      coed: false,
    },
  })

  const fieldHockey = await prisma.sport.create({
    data: {
      name: 'Field Hockey',
      description: 'Team sport played with sticks and a ball on grass',
      mens: false,
      womens: true,
      coed: false,
    },
  })

  const gymnastics = await prisma.sport.create({
    data: {
      name: 'Gymnastics',
      description: 'Artistic gymnastics',
      mens: false,
      womens: true,
      coed: false,
    },
  })

  const softball = await prisma.sport.create({
    data: {
      name: 'Softball',
      description: 'Variant of baseball',
      mens: false,
      womens: true,
      coed: false,
    },
  })

  const baseball = await prisma.sport.create({
    data: {
      name: 'Baseball',
      description: 'America\'s favorite pastime',
      mens: true,
      womens: false,
      coed: false,
    },
  })

  const football = await prisma.sport.create({
    data: {
      name: 'Football',
      description: 'American football',
      mens: true,
      womens: false,
      coed: false,
    },
  })

  const cheerleading = await prisma.sport.create({
    data: {
      name: 'Cheerleading',
      description: 'Competitive cheerleading and spirit',
      mens: false,
      womens: false,
      coed: true,
    },
  })

  console.log('✓ Created sports')

  // Create Leagues
  const mlb = await prisma.league.create({
    data: {
      name: 'College Baseball League',
      sportId: baseball.id,
      description: 'Competitive college baseball league',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
    },
  })

  const nba = await prisma.league.create({
    data: {
      name: 'National Basketball Association',
      sportId: basketball.id,
      description: 'Professional basketball league',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    },
  })

  const nfl = await prisma.league.create({
    data: {
      name: 'National Football League',
      sportId: football.id,
      description: 'Professional American football league',
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
    },
  })

  console.log('✓ Created leagues')

  // Create Teams
  const cardinals = await prisma.team.create({
    data: {
      title: 'Stanford Cardinals',
      sportId: baseball.id,
      leagueId: mlb.id,
      description: 'Elite college baseball program from Stanford University',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
    },
  })

  const bruins = await prisma.team.create({
    data: {
      title: 'UCLA Bruins',
      sportId: baseball.id,
      leagueId: mlb.id,
      description: 'Prestigious college baseball team from UCLA',
      logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/26.png',
    },
  })

  const lakers = await prisma.team.create({
    data: {
      title: 'Los Angeles Lakers',
      sportId: basketball.id,
      leagueId: nba.id,
      description: 'NBA team based in Los Angeles',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    },
  })

  const chiefs = await prisma.team.create({
    data: {
      title: 'Kansas City Chiefs',
      sportId: football.id,
      leagueId: nfl.id,
      description: 'NFL team based in Kansas City',
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
    },
  })

  console.log('✓ Created teams')

  // Create Users (Players) with personal information
  const player1 = await prisma.user.create({
    data: {
      name: 'Marcus Rodriguez',
      email: 'marcus.rodriguez@example.com',
      displayName: 'M-Rod',
      avatar: 'https://i.pravatar.cc/300?img=12',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Professional baseball player with 5 years in the league. Power hitter and outfielder.',
      socialLinks: {
        twitter: '@mrod_baseball',
        instagram: '@marcusrod',
      },
      followerCount: 15420,
      followingCount: 234,
      birthdate: new Date('1998-05-15'),
      city: 'Palo Alto',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const player2 = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      displayName: 'The Ace',
      avatar: 'https://i.pravatar.cc/300?img=47',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'All-star pitcher known for devastating curveball. 2x ERA champion.',
      socialLinks: {
        twitter: '@sarahace',
        instagram: '@theacesarah',
        youtube: '@SarahChenBaseball',
      },
      followerCount: 28900,
      followingCount: 189,
      birthdate: new Date('1997-08-22'),
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Female',
    },
  })

  const player3 = await prisma.user.create({
    data: {
      name: 'Jamal Williams',
      email: 'jamal.williams@example.com',
      displayName: 'J-Will',
      avatar: 'https://i.pravatar.cc/300?img=33',
      bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200',
      bio: 'Point guard with lightning-fast handles. League assist leader 2023.',
      socialLinks: {
        twitter: '@jwill_hoops',
        instagram: '@jamalwilliams',
      },
      followerCount: 42100,
      followingCount: 312,
      birthdate: new Date('1999-03-10'),
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      school: 'Loyola Marymount University',
      gender: 'Male',
    },
  })

  const player4 = await prisma.user.create({
    data: {
      name: 'Tommy O\'Brien',
      email: 'tommy.obrien@example.com',
      displayName: 'Tommy Guns',
      avatar: 'https://i.pravatar.cc/300?img=15',
      bannerImage: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200',
      bio: 'Quarterback with a cannon arm. Leading the league in passing yards.',
      socialLinks: {
        twitter: '@tommyguns_qb',
        instagram: '@tommyobrien',
      },
      followerCount: 67800,
      followingCount: 445,
      birthdate: new Date('1996-11-03'),
      city: 'Kansas City',
      state: 'Missouri',
      country: 'USA',
      school: 'University of Missouri',
      gender: 'Male',
    },
  })

  // Stanford Cardinals Players
  const cardinal2 = await prisma.user.create({
    data: {
      name: 'Kevin Park',
      email: 'kevin.park@example.com',
      displayName: 'K-Park',
      avatar: 'https://i.pravatar.cc/300?img=13',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Solid defensive catcher with a cannon for an arm.',
      socialLinks: { twitter: '@kpark_mlb', instagram: '@kevinpark' },
      followerCount: 8900,
      followingCount: 156,
      birthdate: new Date('1999-07-18'),
      city: 'San Jose',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const cardinal3 = await prisma.user.create({
    data: {
      name: 'Diego Martinez',
      email: 'diego.martinez@example.com',
      displayName: 'El Fuego',
      avatar: 'https://i.pravatar.cc/300?img=14',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Fireballer with a 98 mph fastball. Closing games since 2020.',
      socialLinks: { twitter: '@elfuego99', instagram: '@diego_martinez' },
      followerCount: 12300,
      followingCount: 98,
      birthdate: new Date('1998-02-14'),
      city: 'San Diego',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const cardinal4 = await prisma.user.create({
    data: {
      name: 'Ryan Mitchell',
      email: 'ryan.mitchell@example.com',
      displayName: 'The Glove',
      avatar: 'https://i.pravatar.cc/300?img=51',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Gold Glove shortstop with elite defensive skills.',
      socialLinks: { twitter: '@ryantheglove', instagram: '@ryanmitchell' },
      followerCount: 11500,
      followingCount: 203,
      birthdate: new Date('1999-09-25'),
      city: 'Sacramento',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const cardinal5 = await prisma.user.create({
    data: {
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      displayName: 'AT3',
      avatar: 'https://i.pravatar.cc/300?img=52',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Third baseman with power. 25+ home runs every season.',
      socialLinks: { twitter: '@at3_baseball', instagram: '@alexthompson' },
      followerCount: 14200,
      followingCount: 178,
      birthdate: new Date('1998-12-08'),
      city: 'Fresno',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const cardinal6 = await prisma.user.create({
    data: {
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      displayName: 'J-Lee',
      avatar: 'https://i.pravatar.cc/300?img=53',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Speedster on the bases. League leader in stolen bases.',
      socialLinks: { twitter: '@jlee_speed', instagram: '@jordanlee' },
      followerCount: 9800,
      followingCount: 142,
      birthdate: new Date('2000-01-30'),
      city: 'Oakland',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Non-binary',
    },
  })

  const cardinal7 = await prisma.user.create({
    data: {
      name: 'Chris Davidson',
      email: 'chris.davidson@example.com',
      displayName: 'Davo',
      avatar: 'https://i.pravatar.cc/300?img=54',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Veteran first baseman. Team leader and mentor.',
      socialLinks: { twitter: '@davo_baseball', instagram: '@chrisdavidson' },
      followerCount: 18700,
      followingCount: 267,
      birthdate: new Date('1997-06-12'),
      city: 'San Francisco',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const cardinal8 = await prisma.user.create({
    data: {
      name: 'Tyler Watson',
      email: 'tyler.watson@example.com',
      displayName: 'T-Wat',
      avatar: 'https://i.pravatar.cc/300?img=55',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Left-handed pitcher with nasty changeup.',
      socialLinks: { twitter: '@twat_pitcher', instagram: '@tylerwatson' },
      followerCount: 7200,
      followingCount: 89,
      birthdate: new Date('1999-04-05'),
      city: 'Berkeley',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const cardinal9 = await prisma.user.create({
    data: {
      name: 'Brandon Scott',
      email: 'brandon.scott@example.com',
      displayName: 'B-Scott',
      avatar: 'https://i.pravatar.cc/300?img=56',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Utility player who can play anywhere on the field.',
      socialLinks: { twitter: '@bscott_baseball', instagram: '@brandonscott' },
      followerCount: 6800,
      followingCount: 112,
      birthdate: new Date('2000-08-20'),
      city: 'Santa Clara',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  const cardinal10 = await prisma.user.create({
    data: {
      name: 'Michael Chang',
      email: 'michael.chang@example.com',
      displayName: 'M-Chang',
      avatar: 'https://i.pravatar.cc/300?img=57',
      bannerImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200',
      bio: 'Solid defensive second baseman with good bat control.',
      socialLinks: { twitter: '@mchang_mlb', instagram: '@michaelchang' },
      followerCount: 8100,
      followingCount: 134,
      birthdate: new Date('1999-10-15'),
      city: 'Palo Alto',
      state: 'California',
      country: 'USA',
      school: 'Stanford University',
      gender: 'Male',
    },
  })

  // UCLA Bruins Players
  const bruin2 = await prisma.user.create({
    data: {
      name: 'Jake Anderson',
      email: 'jake.anderson@example.com',
      displayName: 'Jakey',
      avatar: 'https://i.pravatar.cc/300?img=58',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Power-hitting designated hitter. 40+ home runs per season.',
      socialLinks: { twitter: '@jakey_bombs', instagram: '@jakeanderson' },
      followerCount: 32400,
      followingCount: 289,
      birthdate: new Date('1998-03-28'),
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin3 = await prisma.user.create({
    data: {
      name: 'Luis Hernandez',
      email: 'luis.hernandez@example.com',
      displayName: 'El Capitan',
      avatar: 'https://i.pravatar.cc/300?img=59',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Team captain and shortstop. Leader on and off the field.',
      socialLinks: { twitter: '@el_capitan', instagram: '@luishernandez' },
      followerCount: 41200,
      followingCount: 312,
      birthdate: new Date('1997-12-05'),
      city: 'Santa Monica',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin4 = await prisma.user.create({
    data: {
      name: 'Derek Stone',
      email: 'derek.stone@example.com',
      displayName: 'Stoney',
      avatar: 'https://i.pravatar.cc/300?img=60',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Elite closer. Saving games since 2019.',
      socialLinks: { twitter: '@stoney_closes', instagram: '@derekstone' },
      followerCount: 19800,
      followingCount: 156,
      birthdate: new Date('1998-07-19'),
      city: 'Pasadena',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin5 = await prisma.user.create({
    data: {
      name: 'Marcus Johnson',
      email: 'marcus.johnson@example.com',
      displayName: 'MJ',
      avatar: 'https://i.pravatar.cc/300?img=61',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Athletic center fielder with incredible range.',
      socialLinks: { twitter: '@mj_baseball', instagram: '@marcusjohnson' },
      followerCount: 16900,
      followingCount: 201,
      birthdate: new Date('1999-05-11'),
      city: 'Long Beach',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin6 = await prisma.user.create({
    data: {
      name: 'Anthony Romano',
      email: 'anthony.romano@example.com',
      displayName: 'Tony R',
      avatar: 'https://i.pravatar.cc/300?img=62',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Veteran catcher and team leader. 15 years in the majors.',
      socialLinks: { twitter: '@tonyr_ucla', instagram: '@anthonyromano' },
      followerCount: 28300,
      followingCount: 234,
      birthdate: new Date('1997-01-22'),
      city: 'Burbank',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin7 = await prisma.user.create({
    data: {
      name: 'Carlos Ramirez',
      email: 'carlos.ramirez@example.com',
      displayName: 'Los',
      avatar: 'https://i.pravatar.cc/300?img=63',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Hard-hitting third baseman. Clutch performer.',
      socialLinks: { twitter: '@los_ramirez', instagram: '@carlosramirez' },
      followerCount: 21700,
      followingCount: 178,
      birthdate: new Date('1998-09-30'),
      city: 'Glendale',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin8 = await prisma.user.create({
    data: {
      name: 'Trevor Mills',
      email: 'trevor.mills@example.com',
      displayName: 'T-Mills',
      avatar: 'https://i.pravatar.cc/300?img=64',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Starting pitcher with a devastating slider.',
      socialLinks: { twitter: '@tmills_pitcher', instagram: '@trevormills' },
      followerCount: 14500,
      followingCount: 123,
      birthdate: new Date('1999-11-08'),
      city: 'Anaheim',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin9 = await prisma.user.create({
    data: {
      name: 'James Cooper',
      email: 'james.cooper@example.com',
      displayName: 'Coop',
      avatar: 'https://i.pravatar.cc/300?img=65',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Speedy left fielder with great instincts.',
      socialLinks: { twitter: '@coop_baseball', instagram: '@jamescooper' },
      followerCount: 11200,
      followingCount: 145,
      birthdate: new Date('2000-02-17'),
      city: 'Torrance',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  const bruin10 = await prisma.user.create({
    data: {
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      displayName: 'Bobby T',
      avatar: 'https://i.pravatar.cc/300?img=66',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Solid second baseman with excellent bat-to-ball skills.',
      socialLinks: { twitter: '@bobbyt_ucla', instagram: '@roberttaylor' },
      followerCount: 13800,
      followingCount: 167,
      birthdate: new Date('1999-06-24'),
      city: 'Westwood',
      state: 'California',
      country: 'USA',
      school: 'UCLA',
      gender: 'Male',
    },
  })

  console.log('✓ Created players')

  // Connect Players to Teams
  await prisma.teamUser.create({
    data: {
      userId: player1.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Outfielder',
      jerseyNumber: 24,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: player2.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Pitcher',
      jerseyNumber: 45,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: player3.id,
      teamId: lakers.id,
      role: 'Player',
      position: 'Point Guard',
      jerseyNumber: 7,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: player4.id,
      teamId: chiefs.id,
      role: 'Player',
      position: 'Quarterback',
      jerseyNumber: 12,
    },
  })

  // Connect Cardinals players
  await prisma.teamUser.create({
    data: {
      userId: cardinal2.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Catcher',
      jerseyNumber: 7,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal3.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Relief Pitcher',
      jerseyNumber: 31,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal4.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Shortstop',
      jerseyNumber: 2,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal5.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Third Base',
      jerseyNumber: 15,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal6.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Center Field',
      jerseyNumber: 11,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal7.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'First Base',
      jerseyNumber: 28,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal8.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Starting Pitcher',
      jerseyNumber: 42,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal9.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Utility',
      jerseyNumber: 19,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: cardinal10.id,
      teamId: cardinals.id,
      role: 'Player',
      position: 'Second Base',
      jerseyNumber: 4,
    },
  })

  // Connect Bruins players
  await prisma.teamUser.create({
    data: {
      userId: bruin2.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Designated Hitter',
      jerseyNumber: 44,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin3.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Shortstop',
      jerseyNumber: 2,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin4.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Closer',
      jerseyNumber: 57,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin5.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Center Field',
      jerseyNumber: 99,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin6.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Catcher',
      jerseyNumber: 24,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin7.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Third Base',
      jerseyNumber: 13,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin8.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Starting Pitcher',
      jerseyNumber: 22,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin9.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Left Field',
      jerseyNumber: 8,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: bruin10.id,
      teamId: bruins.id,
      role: 'Player',
      position: 'Second Base',
      jerseyNumber: 18,
    },
  })

  console.log('✓ Connected players to teams')

  // Create Clips with verified sports videos
  const clip1 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Basketball Skills Training',
      description: 'Marcus Rodriguez working on his basketball fundamentals',
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
      description: 'Tommy O\'Brien working on quarterback mechanics',
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

  // Create more clips for new players
  const clip6 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'College Basketball Game',
      description: 'K-Park showing strong defensive skills',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip7 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Baseball Catching Techniques',
      description: 'El Fuego demonstrates catching fundamentals',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip8 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Basketball Dunk Highlights',
      description: 'The Glove with an impressive athletic play',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip9 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'High School Football Action',
      description: 'Jakey showing power and technique',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip10 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RddIthm9WAk',
      title: 'Football Play Breakdown',
      description: 'El Capitan analyzing game strategy',
      thumbnail: 'https://img.youtube.com/vi/RddIthm9WAk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  console.log('✓ Created additional clips')

  // Link Clips to Users
  await prisma.userClip.createMany({
    data: [
      { userId: player1.id, clipId: clip1.id, order: 1 },
      { userId: player1.id, clipId: clip5.id, order: 2 },
      { userId: player2.id, clipId: clip2.id, order: 1 },
      { userId: player3.id, clipId: clip3.id, order: 1 },
      { userId: player4.id, clipId: clip4.id, order: 1 },
      { userId: cardinal2.id, clipId: clip6.id, order: 1 },
      { userId: cardinal3.id, clipId: clip7.id, order: 1 },
      { userId: cardinal4.id, clipId: clip8.id, order: 1 },
      { userId: bruin2.id, clipId: clip9.id, order: 1 },
      { userId: bruin3.id, clipId: clip10.id, order: 1 },
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
