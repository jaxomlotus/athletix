import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: {} });
    }

    const searchTerm = query.trim();

    // Search across all entity types (MySQL is case-insensitive by default for LIKE queries)
    const [sports, leagues, teams, players, locations, schools] = await Promise.all([
      prisma.entity.findMany({
        where: {
          type: "sport",
          name: {
            contains: searchTerm,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
        take: 5,
      }),
      prisma.entity.findMany({
        where: {
          type: "league",
          name: {
            contains: searchTerm,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
        take: 5,
      }),
      prisma.entity.findMany({
        where: {
          type: "team",
          name: {
            contains: searchTerm,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
        take: 5,
      }),
      prisma.entity.findMany({
        where: {
          type: "player",
          name: {
            contains: searchTerm,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
        take: 5,
      }),
      prisma.entity.findMany({
        where: {
          type: "location",
          name: {
            contains: searchTerm,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
        take: 5,
      }),
      prisma.entity.findMany({
        where: {
          type: "school",
          name: {
            contains: searchTerm,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      results: {
        sports,
        leagues,
        teams,
        players,
        locations,
        schools,
      },
    });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
