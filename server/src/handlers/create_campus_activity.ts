
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type CreateCampusActivityInput, type CampusActivity } from '../schema';

export const createCampusActivity = async (input: CreateCampusActivityInput): Promise<CampusActivity> => {
  try {
    // Insert campus activity record
    const result = await db.insert(campusActivitiesTable)
      .values({
        title: input.title,
        description: input.description,
        content: input.content,
        image_url: input.image_url,
        activity_date: input.activity_date,
        is_featured: input.is_featured,
        is_published: input.is_published
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Campus activity creation failed:', error);
    throw error;
  }
};
