import { PrismaClient } from '../lib/generated/prisma-client'

const prisma = new PrismaClient()

async function main() {
  const players = await prisma.entity.findMany({
    where: {
      type: 'player',
    },
    include: {
      parent: true,
    },
  })

  console.log('\n🏃 Player Profile Links:\n')
  players.forEach((player) => {
    const metadata = (player.metadata || {}) as any
    const displayName = metadata.displayName || player.name
    console.log(`${displayName}:`)
    console.log(`  http://localhost:3000/players/${player.slug}`)
    if (player.parent) {
      console.log(`  Team: ${player.parent.name}`)
    }
    console.log('')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
