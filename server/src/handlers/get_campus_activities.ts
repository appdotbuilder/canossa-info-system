
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type CampusActivity } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getCampusActivities = async (): Promise<CampusActivity[]> => {
  try {
    // Fetch all published campus activities, ordered by activity_date descending
    const results = await db.select()
      .from(campusActivitiesTable)
      .where(eq(campusActivitiesTable.is_published, true))
      .orderBy(desc(campusActivitiesTable.activity_date))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch campus activities:', error);
    throw error;
  }
};
