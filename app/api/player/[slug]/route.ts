import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Extract userId from slug (format: userId-Display-Name)
    const userId = slug.split('-')[0]

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamUsers: {
          include: {
            team: {
              include: {
                sport: true,
                league: true,
              },
            },
          },
        },
        userClips: {
          include: {
            clip: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player data' },
      { status: 500 }
    )
  }
}
