
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type UpdateCampusActivityInput, type CampusActivity } from '../schema';
import { eq } from 'drizzle-orm';

export const updateCampusActivity = async (input: UpdateCampusActivityInput): Promise<CampusActivity> => {
  try {
    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    if (input.content !== undefined) {
      updateData.content = input.content;
    }
    if (input.image_url !== undefined) {
      updateData.image_url = input.image_url;
    }
    if (input.activity_date !== undefined) {
      updateData.activity_date = input.activity_date;
    }
    if (input.is_featured !== undefined) {
      updateData.is_featured = input.is_featured;
    }
    if (input.is_published !== undefined) {
      updateData.is_published = input.is_published;
    }

    // Update the campus activity
    const result = await db.update(campusActivitiesTable)
      .set(updateData)
      .where(eq(campusActivitiesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Campus activity with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Campus activity update failed:', error);
    throw error;
  }
};
