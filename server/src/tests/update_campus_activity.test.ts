
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type UpdateCampusActivityInput, type CreateCampusActivityInput } from '../schema';
import { updateCampusActivity } from '../handlers/update_campus_activity';
import { eq } from 'drizzle-orm';

// Helper function to create a campus activity directly in database
const createTestActivity = async (input: CreateCampusActivityInput) => {
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
};

// Test inputs
const testCreateInput: CreateCampusActivityInput = {
  title: 'Original Title',
  description: 'Original description',
  content: 'Original content',
  image_url: 'https://example.com/image.jpg',
  activity_date: new Date('2024-01-15'),
  is_featured: false,
  is_published: true
};

describe('updateCampusActivity', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a campus activity with all fields', async () => {
    // Create initial activity
    const created = await createTestActivity(testCreateInput);
    
    const updateInput: UpdateCampusActivityInput = {
      id: created.id,
      title: 'Updated Title',
      description: 'Updated description',
      content: 'Updated content',
      image_url: 'https://example.com/new-image.jpg',
      activity_date: new Date('2024-02-20'),
      is_featured: true,
      is_published: false
    };

    const result = await updateCampusActivity(updateInput);

    expect(result.id).toEqual(created.id);
    expect(result.title).toEqual('Updated Title');
    expect(result.description).toEqual('Updated description');
    expect(result.content).toEqual('Updated content');
    expect(result.image_url).toEqual('https://example.com/new-image.jpg');
    expect(result.activity_date).toEqual(new Date('2024-02-20'));
    expect(result.is_featured).toEqual(true);
    expect(result.is_published).toEqual(false);
    expect(result.created_at).toEqual(created.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
  });

  it('should update only provided fields', async () => {
    // Create initial activity
    const created = await createTestActivity(testCreateInput);
    
    const updateInput: UpdateCampusActivityInput = {
      id: created.id,
      title: 'Partially Updated Title',
      is_featured: true
    };

    const result = await updateCampusActivity(updateInput);

    // Updated fields
    expect(result.title).toEqual('Partially Updated Title');
    expect(result.is_featured).toEqual(true);
    
    // Unchanged fields
    expect(result.description).toEqual(created.description);
    expect(result.content).toEqual(created.content);
    expect(result.image_url).toEqual(created.image_url);
    expect(result.activity_date).toEqual(created.activity_date);
    expect(result.is_published).toEqual(created.is_published);
    expect(result.created_at).toEqual(created.created_at);
    
    // Updated timestamp
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
  });

  it('should save updated activity to database', async () => {
    // Create initial activity
    const created = await createTestActivity(testCreateInput);
    
    const updateInput: UpdateCampusActivityInput = {
      id: created.id,
      title: 'Database Updated Title',
      description: 'Database updated description'
    };

    const result = await updateCampusActivity(updateInput);

    // Verify in database
    const activities = await db.select()
      .from(campusActivitiesTable)
      .where(eq(campusActivitiesTable.id, result.id))
      .execute();

    expect(activities).toHaveLength(1);
    const activity = activities[0];
    expect(activity.title).toEqual('Database Updated Title');
    expect(activity.description).toEqual('Database updated description');
    expect(activity.content).toEqual(created.content); // Unchanged
    expect(activity.updated_at).toBeInstanceOf(Date);
    expect(activity.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
  });

  it('should handle null image_url update', async () => {
    // Create initial activity with image
    const created = await createTestActivity(testCreateInput);
    
    const updateInput: UpdateCampusActivityInput = {
      id: created.id,
      image_url: null
    };

    const result = await updateCampusActivity(updateInput);

    expect(result.image_url).toBeNull();
    expect(result.title).toEqual(created.title); // Unchanged
  });

  it('should throw error when activity not found', async () => {
    const updateInput: UpdateCampusActivityInput = {
      id: 999,
      title: 'Non-existent Activity'
    };

    await expect(updateCampusActivity(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update timestamp even with no other changes', async () => {
    // Create initial activity
    const created = await createTestActivity(testCreateInput);
    
    // Wait a small amount to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1));
    
    const updateInput: UpdateCampusActivityInput = {
      id: created.id
    };

    const result = await updateCampusActivity(updateInput);

    // All fields should be unchanged except updated_at
    expect(result.title).toEqual(created.title);
    expect(result.description).toEqual(created.description);
    expect(result.content).toEqual(created.content);
    expect(result.image_url).toEqual(created.image_url);
    expect(result.activity_date).toEqual(created.activity_date);
    expect(result.is_featured).toEqual(created.is_featured);
    expect(result.is_published).toEqual(created.is_published);
    expect(result.created_at).toEqual(created.created_at);
    
    // Only updated_at should change
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
  });
});
