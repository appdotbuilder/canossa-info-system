
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type GetPageBySlugInput, type PageContent } from '../schema';
import { eq, and } from 'drizzle-orm';

export const getPageContent = async (input: GetPageBySlugInput): Promise<PageContent | null> => {
  try {
    const results = await db.select()
      .from(pageContentsTable)
      .where(
        and(
          eq(pageContentsTable.page_slug, input.slug),
          eq(pageContentsTable.is_published, true)
        )
      )
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Failed to get page content:', error);
    throw error;
  }
};
