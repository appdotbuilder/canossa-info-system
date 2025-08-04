
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { campusActivitiesTable } from '../db/schema';
import { getFeaturedActivities } from '../handlers/get_featured_activities';

describe('getFeaturedActivities', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no featured activities exist', async () => {
    const result = await getFeaturedActivities();
    expect(result).toEqual([]);
  });

  it('should return only featured and published activities', async () => {
    // Create test activities with different combinations of featured/published status
    await db.insert(campusActivitiesTable).values([
      {
        title: 'Featured Published Activity',
        description: 'This should be returned',
        content: 'Content for featured published activity',
        activity_date: new Date('2024-01-15'),
        is_featured: true,
        is_published: true
      },
      {
        title: 'Not Featured Activity',
        description: 'This should not be returned',
        content: 'Content for not featured activity',
        activity_date: new Date('2024-01-16'),
        is_featured: false,
        is_published: true
      },
      {
        title: 'Featured Unpublished Activity',
        description: 'This should not be returned',
        content: 'Content for featured unpublished activity',
        activity_date: new Date('2024-01-17'),
        is_featured: true,
        is_published: false
      },
      {
        title: 'Another Featured Published Activity',
        description: 'This should also be returned',
        content: 'Content for another featured published activity',
        activity_date: new Date('2024-01-18'),
        is_featured: true,
        is_published: true
      }
    ]).execute();

    const result = await getFeaturedActivities();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Another Featured Published Activity');
    expect(result[1].title).toEqual('Featured Published Activity');
    
    // Verify all returned activities are featured and published
    result.forEach(activity => {
      expect(activity.is_featured).toBe(true);
      expect(activity.is_published).toBe(true);
    });
  });

  it('should order activities by activity_date in descending order', async () => {
    await db.insert(campusActivitiesTable).values([
      {
        title: 'Oldest Activity',
        description: 'This should be last',
        content: 'Content for oldest activity',
        activity_date: new Date('2024-01-10'),
        is_featured: true,
        is_published: true
      },
      {
        title: 'Newest Activity',
        description: 'This should be first',
        content: 'Content for newest activity',
        activity_date: new Date('2024-01-20'),
        is_featured: true,
        is_published: true
      },
      {
        title: 'Middle Activity',
        description: 'This should be in the middle',
        content: 'Content for middle activity',
        activity_date: new Date('2024-01-15'),
        is_featured: true,
        is_published: true
      }
    ]).execute();

    const result = await getFeaturedActivities();

    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('Newest Activity');
    expect(result[1].title).toEqual('Middle Activity');
    expect(result[2].title).toEqual('Oldest Activity');

    // Verify dates are in descending order
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].activity_date >= result[i + 1].activity_date).toBe(true);
    }
  });

  it('should limit results to 6 activities', async () => {
    // Create 8 featured and published activities
    const activities = Array.from({ length: 8 }, (_, i) => ({
      title: `Featured Activity ${i + 1}`,
      description: `Description for activity ${i + 1}`,
      content: `Content for activity ${i + 1}`,
      activity_date: new Date(`2024-01-${10 + i}`),
      is_featured: true,
      is_published: true
    }));

    await db.insert(campusActivitiesTable).values(activities).execute();

    const result = await getFeaturedActivities();

    expect(result).toHaveLength(6);
    
    // Should return the 6 most recent activities
    expect(result[0].title).toEqual('Featured Activity 8');
    expect(result[5].title).toEqual('Featured Activity 3');
  });

  it('should return all required fields for each activity', async () => {
    await db.insert(campusActivitiesTable).values({
      title: 'Test Activity',
      description: 'Test description',
      content: 'Test content',
      image_url: 'https://example.com/image.jpg',
      activity_date: new Date('2024-01-15'),
      is_featured: true,
      is_published: true
    }).execute();

    const result = await getFeaturedActivities();

    expect(result).toHaveLength(1);
    const activity = result[0];

    expect(activity.id).toBeDefined();
    expect(activity.title).toEqual('Test Activity');
    expect(activity.description).toEqual('Test description');
    expect(activity.content).toEqual('Test content');
    expect(activity.image_url).toEqual('https://example.com/image.jpg');
    expect(activity.activity_date).toBeInstanceOf(Date);
    expect(activity.is_featured).toBe(true);
    expect(activity.is_published).toBe(true);
    expect(activity.created_at).toBeInstanceOf(Date);
    expect(activity.updated_at).toBeInstanceOf(Date);
  });
});
