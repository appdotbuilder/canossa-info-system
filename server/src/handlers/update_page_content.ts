
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type UpdatePageContentInput, type PageContent } from '../schema';
import { eq } from 'drizzle-orm';

export const updatePageContent = async (input: UpdatePageContentInput): Promise<PageContent> => {
  try {
    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date() // Always update the timestamp
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }

    if (input.content !== undefined) {
      updateData.content = input.content;
    }

    if (input.meta_description !== undefined) {
      updateData.meta_description = input.meta_description;
    }

    if (input.is_published !== undefined) {
      updateData.is_published = input.is_published;
    }

    // Update the page content record
    const result = await db.update(pageContentsTable)
      .set(updateData)
      .where(eq(pageContentsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Page content with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Page content update failed:', error);
    throw error;
  }
};
