/**
 * @deprecated Use getCachedSports() from lib/data-access.ts instead
 * This file is kept for backwards compatibility but now wraps the shared function
 */
import { unstable_cache } from "next/cache";
import { getCachedSports } from "./data-access";

export const getCachedSportsData = unstable_cache(
  async () => {
    try {
      // Use shared data access function
      const result = await getCachedSports();
      return {
        mensSports: result.mensSports,
        womensSports: result.womensSports,
        coedSports: result.coedSports,
      };
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
