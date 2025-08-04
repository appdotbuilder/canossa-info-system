
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type CreateCampusActivityInput } from '../schema';
import { createCampusActivity } from '../handlers/create_campus_activity';
import { eq } from 'drizzle-orm';

// Test input with all required and optional fields
const testInput: CreateCampusActivityInput = {
  title: 'Test Campus Activity',
  description: 'A campus activity for testing purposes',
  content: 'This is the detailed content of the test campus activity. It includes all the information students need.',
  image_url: 'https://example.com/test-image.jpg',
  activity_date: new Date('2024-02-15T10:00:00Z'),
  is_featured: true,
  is_published: true
};

// Test input with minimal required fields and defaults
const minimalInput: CreateCampusActivityInput = {
  title: 'Minimal Activity',
  description: 'Minimal test activity',
  content: 'Basic content for minimal activity',
  image_url: null,
  activity_date: new Date('2024-03-01T14:00:00Z'),
  is_featured: false,
  is_published: true
};

describe('createCampusActivity', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a campus activity with all fields', async () => {
    const result = await createCampusActivity(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Campus Activity');
    expect(result.description).toEqual(testInput.description);
    expect(result.content).toEqual(testInput.content);
    expect(result.image_url).toEqual('https://example.com/test-image.jpg');
    expect(result.activity_date).toEqual(testInput.activity_date);
    expect(result.is_featured).toEqual(true);
    expect(result.is_published).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a campus activity with minimal fields', async () => {
    const result = await createCampusActivity(minimalInput);

    expect(result.title).toEqual('Minimal Activity');
    expect(result.description).toEqual(minimalInput.description);
    expect(result.content).toEqual(minimalInput.content);
    expect(result.image_url).toBeNull();
    expect(result.activity_date).toEqual(minimalInput.activity_date);
    expect(result.is_featured).toEqual(false);
    expect(result.is_published).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save campus activity to database', async () => {
    const result = await createCampusActivity(testInput);

    // Query database to verify persistence
    const activities = await db.select()
      .from(campusActivitiesTable)
      .where(eq(campusActivitiesTable.id, result.id))
      .execute();

    expect(activities).toHaveLength(1);
    expect(activities[0].title).toEqual('Test Campus Activity');
    expect(activities[0].description).toEqual(testInput.description);
    expect(activities[0].content).toEqual(testInput.content);
    expect(activities[0].image_url).toEqual('https://example.com/test-image.jpg');
    expect(activities[0].activity_date).toEqual(testInput.activity_date);
    expect(activities[0].is_featured).toEqual(true);
    expect(activities[0].is_published).toEqual(true);
    expect(activities[0].created_at).toBeInstanceOf(Date);
    expect(activities[0].updated_at).toBeInstanceOf(Date);
  });

  it('should set automatic timestamps correctly', async () => {
    const before = new Date();
    const result = await createCampusActivity(testInput);
    const after = new Date();

    // Verify timestamps are within expected range
    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.created_at.getTime()).toBeLessThanOrEqual(after.getTime());
    expect(result.updated_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.updated_at.getTime()).toBeLessThanOrEqual(after.getTime());

    // Verify both timestamps are equal for new records
    expect(result.created_at.getTime()).toEqual(result.updated_at.getTime());
  });

  it('should handle null image_url correctly', async () => {
    const inputWithNullImage = {
      ...testInput,
      image_url: null
    };

    const result = await createCampusActivity(inputWithNullImage);

    expect(result.image_url).toBeNull();

    // Verify in database
    const activities = await db.select()
      .from(campusActivitiesTable)
      .where(eq(campusActivitiesTable.id, result.id))
      .execute();

    expect(activities[0].image_url).toBeNull();
  });
});
