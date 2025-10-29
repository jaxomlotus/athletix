import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCachedSportsData = unstable_cache(
  async () => {
    try {
      const allSports = await prisma.entity.findMany({
        where: { type: 'sport' },
        orderBy: { name: 'asc' },
      });

      const mensSports = allSports.filter(sport =>
        (sport.metadata as { mens?: boolean })?.mens === true
      );
      const womensSports = allSports.filter(sport =>
        (sport.metadata as { womens?: boolean })?.womens === true
      );
      const coedSports = allSports.filter(sport =>
        (sport.metadata as { coed?: boolean })?.coed === true
      );

      return { mensSports, womensSports, coedSports };
    } catch (error) {
      console.error("Error fetching sports:", error);
      return { mensSports: [], womensSports: [], coedSports: [] };
    }
  },
  ['sports-data'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['sports'],
  }
);
