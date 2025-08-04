
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type PageContent } from '../schema';
import { desc } from 'drizzle-orm';

export const getAllPages = async (): Promise<PageContent[]> => {
  try {
    // Fetch all pages ordered by most recently updated first
    // Include both published and unpublished pages for admin management
    const results = await db.select()
      .from(pageContentsTable)
      .orderBy(desc(pageContentsTable.updated_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch all pages:', error);
    throw error;
  }
};
