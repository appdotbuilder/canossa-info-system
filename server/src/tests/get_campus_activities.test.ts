
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { type CreateCampusActivityInput } from '../schema';
import { getCampusActivities } from '../handlers/get_campus_activities';

describe('getCampusActivities', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no activities exist', async () => {
    const result = await getCampusActivities();
    expect(result).toEqual([]);
  });

  it('should return only published activities', async () => {
    // Create published activity
    await db.insert(campusActivitiesTable).values({
      title: 'Published Activity',
      description: 'This is published',
      content: 'Published content',
      activity_date: new Date('2024-01-15'),
      is_published: true,
      is_featured: false
    });

    // Create unpublished activity
    await db.insert(campusActivitiesTable).values({
      title: 'Unpublished Activity',
      description: 'This is unpublished',
      content: 'Unpublished content',
      activity_date: new Date('2024-01-16'),
      is_published: false,
      is_featured: false
    });

    const result = await getCampusActivities();
    
    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Published Activity');
    expect(result[0].is_published).toBe(true);
  });

  it('should return activities ordered by activity_date descending', async () => {
    // Create activities with different dates
    await db.insert(campusActivitiesTable).values({
      title: 'Older Activity',
      description: 'Earlier activity',
      content: 'Older content',
      activity_date: new Date('2024-01-10'),
      is_published: true,
      is_featured: false
    });

    await db.insert(campusActivitiesTable).values({
      title: 'Newer Activity',
      description: 'Later activity',
      content: 'Newer content',
      activity_date: new Date('2024-01-20'),
      is_published: true,
      is_featured: false
    });

    await db.insert(campusActivitiesTable).values({
      title: 'Middle Activity',
      description: 'Middle activity',
      content: 'Middle content',
      activity_date: new Date('2024-01-15'),
      is_published: true,
      is_featured: false
    });

    const result = await getCampusActivities();
    
    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('Newer Activity');
    expect(result[1].title).toEqual('Middle Activity');
    expect(result[2].title).toEqual('Older Activity');
    
    // Verify date ordering
    expect(result[0].activity_date >= result[1].activity_date).toBe(true);
    expect(result[1].activity_date >= result[2].activity_date).toBe(true);
  });

  it('should return complete activity objects with all fields', async () => {
    await db.insert(campusActivitiesTable).values({
      title: 'Complete Activity',
      description: 'Full description',
      content: 'Complete content',
      image_url: 'https://example.com/image.jpg',
      activity_date: new Date('2024-01-15'),
      is_published: true,
      is_featured: true
    });

    const result = await getCampusActivities();
    
    expect(result).toHaveLength(1);
    const activity = result[0];
    
    expect(activity.id).toBeDefined();
    expect(activity.title).toEqual('Complete Activity');
    expect(activity.description).toEqual('Full description');
    expect(activity.content).toEqual('Complete content');
    expect(activity.image_url).toEqual('https://example.com/image.jpg');
    expect(activity.activity_date).toBeInstanceOf(Date);
    expect(activity.is_published).toBe(true);
    expect(activity.is_featured).toBe(true);
    expect(activity.created_at).toBeInstanceOf(Date);
    expect(activity.updated_at).toBeInstanceOf(Date);
  });

  it('should handle activities with null image_url', async () => {
    await db.insert(campusActivitiesTable).values({
      title: 'Activity Without Image',
      description: 'No image activity',
      content: 'Content without image',
      image_url: null,
      activity_date: new Date('2024-01-15'),
      is_published: true,
      is_featured: false
    });

    const result = await getCampusActivities();
    
    expect(result).toHaveLength(1);
    expect(result[0].image_url).toBeNull();
  });
});
