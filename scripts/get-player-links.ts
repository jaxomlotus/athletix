import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function createSlug(user: { id: string; displayName: string | null; name: string | null }): string {
  const displayName = user.displayName || user.name || 'Unknown'
  const slugName = displayName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
  return `${user.id}-${slugName}`
}

async function main() {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        displayName: null,
      },
    },
    select: {
      id: true,
      name: true,
      displayName: true,
      email: true,
    },
  })

  console.log('\n🏃 Player Profile Links:\n')
  users.forEach((user) => {
    const slug = createSlug(user)
    console.log(`${user.displayName || user.name}:`)
    console.log(`  http://localhost:3000/player/${slug}`)
    console.log(`  Email: ${user.email}\n`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
