
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type CreatePageContentInput, type PageContent } from '../schema';

export const createPageContent = async (input: CreatePageContentInput): Promise<PageContent> => {
  try {
    // Insert page content record
    const result = await db.insert(pageContentsTable)
      .values({
        page_slug: input.page_slug,
        title: input.title,
        content: input.content,
        meta_description: input.meta_description,
        is_published: input.is_published
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Page content creation failed:', error);
    throw error;
  }
};
