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
      name: 'Major League Baseball',
      sportId: baseball.id,
      description: 'Professional baseball league in North America',
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
      title: 'Toronto Blue Jays',
      sportId: baseball.id,
      leagueId: mlb.id,
      description: 'Canadian MLB team based in Toronto',
      logo: 'https://www.mlbstatic.com/team-logos/141.svg',
    },
  })

  const yankees = await prisma.team.create({
    data: {
      title: 'New York Yankees',
      sportId: baseball.id,
      leagueId: mlb.id,
      description: 'Historic MLB team based in New York',
      logo: 'https://www.mlbstatic.com/team-logos/147.svg',
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

  // Link Clips to Users
  await prisma.userClip.createMany({
    data: [
      { userId: player1.id, clipId: clip1.id, order: 1 },
      { userId: player1.id, clipId: clip5.id, order: 2 },
      { userId: player2.id, clipId: clip2.id, order: 1 },
      { userId: player3.id, clipId: clip3.id, order: 1 },
      { userId: player4.id, clipId: clip4.id, order: 1 },
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
