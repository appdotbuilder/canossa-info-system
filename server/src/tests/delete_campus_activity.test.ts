
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type DeleteActivityInput, type CreateCampusActivityInput } from '../schema';
import { deleteCampusActivity } from '../handlers/delete_campus_activity';
import { eq } from 'drizzle-orm';

// Test input for deleting activity
const testDeleteInput: DeleteActivityInput = {
  id: 1
};

// Test input for creating activity
const testCreateInput: CreateCampusActivityInput = {
  title: 'Test Activity',
  description: 'A test campus activity',
  content: 'This is test content for the activity',
  image_url: 'https://example.com/image.jpg',
  activity_date: new Date('2024-01-15'),
  is_featured: false,
  is_published: true
};

describe('deleteCampusActivity', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing campus activity', async () => {
    // Create a test activity first
    const createResult = await db.insert(campusActivitiesTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        content: testCreateInput.content,
        image_url: testCreateInput.image_url,
        activity_date: testCreateInput.activity_date,
        is_featured: testCreateInput.is_featured,
        is_published: testCreateInput.is_published
      })
      .returning()
      .execute();

    const activityId = createResult[0].id;

    // Delete the activity
    const result = await deleteCampusActivity({ id: activityId });

    // Verify deletion was successful
    expect(result.success).toBe(true);

    // Verify activity no longer exists in database
    const activities = await db.select()
      .from(campusActivitiesTable)
      .where(eq(campusActivitiesTable.id, activityId))
      .execute();

    expect(activities).toHaveLength(0);
  });

  it('should return false when deleting non-existent activity', async () => {
    // Try to delete an activity that doesn't exist
    const result = await deleteCampusActivity({ id: 9999 });

    // Verify deletion was unsuccessful
    expect(result.success).toBe(false);
  });

  it('should not affect other activities when deleting one', async () => {
    // Create two test activities
    const activity1 = await db.insert(campusActivitiesTable)
      .values({
        title: 'Activity 1',
        description: 'First activity',
        content: 'Content for first activity',
        image_url: null,
        activity_date: new Date('2024-01-15'),
        is_featured: false,
        is_published: true
      })
      .returning()
      .execute();

    const activity2 = await db.insert(campusActivitiesTable)
      .values({
        title: 'Activity 2',
        description: 'Second activity',
        content: 'Content for second activity',
        image_url: null,
        activity_date: new Date('2024-01-16'),
        is_featured: true,
        is_published: true
      })
      .returning()
      .execute();

    // Delete the first activity
    const result = await deleteCampusActivity({ id: activity1[0].id });

    // Verify deletion was successful
    expect(result.success).toBe(true);

    // Verify second activity still exists
    const remainingActivities = await db.select()
      .from(campusActivitiesTable)
      .where(eq(campusActivitiesTable.id, activity2[0].id))
      .execute();

    expect(remainingActivities).toHaveLength(1);
    expect(remainingActivities[0].title).toEqual('Activity 2');

    // Verify first activity is gone
    const deletedActivities = await db.select()
      .from(campusActivitiesTable)
      .where(eq(campusActivitiesTable.id, activity1[0].id))
      .execute();

    expect(deletedActivities).toHaveLength(0);
  });
});
