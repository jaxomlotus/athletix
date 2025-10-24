import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Sports
  const baseball = await prisma.sport.create({
    data: {
      name: 'Baseball',
      description: 'America\'s favorite pastime',
    },
  })

  const basketball = await prisma.sport.create({
    data: {
      name: 'Basketball',
      description: 'Fast-paced court sport',
    },
  })

  const football = await prisma.sport.create({
    data: {
      name: 'Football',
      description: 'American football',
    },
  })

  console.log('✓ Created sports')

  // Create Leagues
  const mlb = await prisma.league.create({
    data: {
      name: 'College Baseball League',
      sportId: baseball.id,
      description: 'Competitive college baseball league',
    },
  })

  const nba = await prisma.league.create({
    data: {
      name: 'National Basketball Association',
      sportId: basketball.id,
      description: 'Professional basketball league',
    },
  })

  const nfl = await prisma.league.create({
    data: {
      name: 'National Football League',
      sportId: football.id,
      description: 'Professional American football league',
    },
  })

  console.log('✓ Created leagues')

  // Create Teams
  const blueJays = await prisma.team.create({
    data: {
      title: 'Stanford Cardinals',
      sportId: baseball.id,
      leagueId: mlb.id,
      description: 'Elite college baseball program from Stanford University',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stanford_Cardinal_logo.svg/200px-Stanford_Cardinal_logo.svg.png',
    },
  })

  const yankees = await prisma.team.create({
    data: {
      title: 'UCLA Bruins',
      sportId: baseball.id,
      leagueId: mlb.id,
      description: 'Prestigious college baseball team from UCLA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/UCLA_Bruins_logo.svg/200px-UCLA_Bruins_logo.svg.png',
    },
  })

  const lakers = await prisma.team.create({
    data: {
      title: 'Los Angeles Lakers',
      sportId: basketball.id,
      leagueId: nba.id,
      description: 'NBA team based in Los Angeles',
      logo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    },
  })

  const chiefs = await prisma.team.create({
    data: {
      title: 'Kansas City Chiefs',
      sportId: football.id,
      leagueId: nfl.id,
      description: 'NFL team based in Kansas City',
      logo: 'https://static.www.nfl.com/image/private/f_auto/league/ujshjqvmnxce8m4obmvs',
    },
  })

  console.log('✓ Created teams')

  // Create Users (Players)
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
    },
  })

  // Toronto Blue Jays Players
  const blueJay2 = await prisma.user.create({
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
    },
  })

  const blueJay3 = await prisma.user.create({
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
    },
  })

  const blueJay4 = await prisma.user.create({
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
    },
  })

  const blueJay5 = await prisma.user.create({
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
    },
  })

  const blueJay6 = await prisma.user.create({
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
    },
  })

  const blueJay7 = await prisma.user.create({
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
    },
  })

  const blueJay8 = await prisma.user.create({
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
    },
  })

  const blueJay9 = await prisma.user.create({
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
    },
  })

  const blueJay10 = await prisma.user.create({
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
    },
  })

  // New York Yankees Players
  const yankee2 = await prisma.user.create({
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
    },
  })

  const yankee3 = await prisma.user.create({
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
    },
  })

  const yankee4 = await prisma.user.create({
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
    },
  })

  const yankee5 = await prisma.user.create({
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
    },
  })

  const yankee6 = await prisma.user.create({
    data: {
      name: 'Anthony Romano',
      email: 'anthony.romano@example.com',
      displayName: 'Tony R',
      avatar: 'https://i.pravatar.cc/300?img=62',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Veteran catcher and team leader. 15 years in the majors.',
      socialLinks: { twitter: '@tonyr_yankees', instagram: '@anthonyromano' },
      followerCount: 28300,
      followingCount: 234,
    },
  })

  const yankee7 = await prisma.user.create({
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
    },
  })

  const yankee8 = await prisma.user.create({
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
    },
  })

  const yankee9 = await prisma.user.create({
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
    },
  })

  const yankee10 = await prisma.user.create({
    data: {
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      displayName: 'Bobby T',
      avatar: 'https://i.pravatar.cc/300?img=66',
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      bio: 'Solid second baseman with excellent bat-to-ball skills.',
      socialLinks: { twitter: '@bobbyt_yankees', instagram: '@roberttaylor' },
      followerCount: 13800,
      followingCount: 167,
    },
  })

  console.log('✓ Created players')

  // Connect Players to Teams
  await prisma.teamUser.create({
    data: {
      userId: player1.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Outfielder',
      jerseyNumber: 24,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: player2.id,
      teamId: yankees.id,
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

  // Connect Blue Jays players
  await prisma.teamUser.create({
    data: {
      userId: blueJay2.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Catcher',
      jerseyNumber: 7,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay3.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Relief Pitcher',
      jerseyNumber: 31,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay4.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Shortstop',
      jerseyNumber: 2,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay5.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Third Base',
      jerseyNumber: 15,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay6.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Center Field',
      jerseyNumber: 11,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay7.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'First Base',
      jerseyNumber: 28,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay8.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Starting Pitcher',
      jerseyNumber: 42,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay9.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Utility',
      jerseyNumber: 19,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: blueJay10.id,
      teamId: blueJays.id,
      role: 'Player',
      position: 'Second Base',
      jerseyNumber: 4,
    },
  })

  // Connect Yankees players
  await prisma.teamUser.create({
    data: {
      userId: yankee2.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Designated Hitter',
      jerseyNumber: 44,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee3.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Shortstop',
      jerseyNumber: 2,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee4.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Closer',
      jerseyNumber: 57,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee5.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Center Field',
      jerseyNumber: 99,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee6.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Catcher',
      jerseyNumber: 24,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee7.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Third Base',
      jerseyNumber: 13,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee8.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Starting Pitcher',
      jerseyNumber: 22,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee9.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Left Field',
      jerseyNumber: 8,
    },
  })

  await prisma.teamUser.create({
    data: {
      userId: yankee10.id,
      teamId: yankees.id,
      role: 'Player',
      position: 'Second Base',
      jerseyNumber: 18,
    },
  })

  console.log('✓ Connected players to teams')

  // Create Clips
  const clip1 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Game-Winning Home Run - World Series 2024',
      description: 'Marcus Rodriguez hits a walk-off home run in Game 7',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip2 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      title: 'Perfect Curveball Strikeout',
      description: 'Sarah Chen strikes out the side with nasty curves',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip3 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      title: 'Behind-the-Back Assist',
      description: 'Jamal Williams with an incredible no-look pass',
      thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip4 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      title: '60-Yard Touchdown Pass',
      description: 'Tommy O\'Brien launches a bomb for the winning TD',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip5 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=V-_O7nl0Ii0',
      title: 'Diving Catch in Center Field',
      description: 'Marcus makes an incredible diving catch to save the game',
      thumbnail: 'https://img.youtube.com/vi/V-_O7nl0Ii0/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  console.log('✓ Created clips')

  // Create more clips for new players
  const clip6 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=hHW1oY26kxQ',
      title: 'Laser Throw from Catcher to Second Base',
      description: 'K-Park guns down base stealer with perfect throw',
      thumbnail: 'https://img.youtube.com/vi/hHW1oY26kxQ/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip7 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
      title: '98 MPH Fastball for the Strikeout',
      description: 'El Fuego blows it past the batter for strike three',
      thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip8 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=RBumgq5yVrA',
      title: 'Gold Glove Diving Stop at Short',
      description: 'The Glove makes an incredible diving stop',
      thumbnail: 'https://img.youtube.com/vi/RBumgq5yVrA/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip9 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
      title: 'Monster Home Run to Right Field',
      description: 'Jakey crushes a 450-foot bomb',
      thumbnail: 'https://img.youtube.com/vi/ZZ5LpwO-An4/maxresdefault.jpg',
      platform: 'youtube',
    },
  })

  const clip10 = await prisma.clip.create({
    data: {
      url: 'https://www.youtube.com/watch?v=GaoLU6zKaws',
      title: 'Walk-Off Single in the 9th',
      description: 'El Capitan delivers the game-winning hit',
      thumbnail: 'https://img.youtube.com/vi/GaoLU6zKaws/maxresdefault.jpg',
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
      { userId: blueJay2.id, clipId: clip6.id, order: 1 },
      { userId: blueJay3.id, clipId: clip7.id, order: 1 },
      { userId: blueJay4.id, clipId: clip8.id, order: 1 },
      { userId: yankee2.id, clipId: clip9.id, order: 1 },
      { userId: yankee3.id, clipId: clip10.id, order: 1 },
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
