
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type DeleteActivityInput } from '../schema';
import { eq } from 'drizzle-orm';

export const deleteCampusActivity = async (input: DeleteActivityInput): Promise<{ success: boolean }> => {
  try {
    // Delete the campus activity by ID
    const result = await db.delete(campusActivitiesTable)
      .where(eq(campusActivitiesTable.id, input.id))
      .returning()
      .execute();

    // Return success status based on whether a record was deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Campus activity deletion failed:', error);
    throw error;
  }
};
