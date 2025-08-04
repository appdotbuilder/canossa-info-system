
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type CampusActivity } from '../schema';
import { eq, and, desc } from 'drizzle-orm';

export const getFeaturedActivities = async (): Promise<CampusActivity[]> => {
  try {
    const results = await db.select()
      .from(campusActivitiesTable)
      .where(
        and(
          eq(campusActivitiesTable.is_featured, true),
          eq(campusActivitiesTable.is_published, true)
        )
      )
      .orderBy(desc(campusActivitiesTable.activity_date))
      .limit(6)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch featured activities:', error);
    throw error;
  }
};
