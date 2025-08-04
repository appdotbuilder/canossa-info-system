
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type CreatePageContentInput, type UpdatePageContentInput } from '../schema';
import { updatePageContent } from '../handlers/update_page_content';
import { eq } from 'drizzle-orm';

// Helper function to create a test page content
const createTestPageContent = async (): Promise<number> => {
  const testInput: CreatePageContentInput = {
    page_slug: 'test-page',
    title: 'Original Title',
    content: 'Original content for testing',
    meta_description: 'Original meta description',
    is_published: true
  };

  const result = await db.insert(pageContentsTable)
    .values(testInput)
    .returning()
    .execute();

  return result[0].id;
};

describe('updatePageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update page content with all fields', async () => {
    const pageId = await createTestPageContent();

    const updateInput: UpdatePageContentInput = {
      id: pageId,
      title: 'Updated Title',
      content: 'Updated content for testing',
      meta_description: 'Updated meta description',
      is_published: false
    };

    const result = await updatePageContent(updateInput);

    expect(result.id).toEqual(pageId);
    expect(result.title).toEqual('Updated Title');
    expect(result.content).toEqual('Updated content for testing');
    expect(result.meta_description).toEqual('Updated meta description');
    expect(result.is_published).toEqual(false);
    expect(result.page_slug).toEqual('test-page'); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update only specified fields', async () => {
    const pageId = await createTestPageContent();

    const updateInput: UpdatePageContentInput = {
      id: pageId,
      title: 'New Title Only'
    };

    const result = await updatePageContent(updateInput);

    expect(result.title).toEqual('New Title Only');
    expect(result.content).toEqual('Original content for testing'); // Should remain unchanged
    expect(result.meta_description).toEqual('Original meta description'); // Should remain unchanged
    expect(result.is_published).toEqual(true); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update meta_description to null', async () => {
    const pageId = await createTestPageContent();

    const updateInput: UpdatePageContentInput = {
      id: pageId,
      meta_description: null
    };

    const result = await updatePageContent(updateInput);

    expect(result.meta_description).toBeNull();
    expect(result.title).toEqual('Original Title'); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated page content to database', async () => {
    const pageId = await createTestPageContent();

    const updateInput: UpdatePageContentInput = {
      id: pageId,
      title: 'Database Test Title',
      is_published: false
    };

    const result = await updatePageContent(updateInput);

    // Verify changes were persisted to database
    const pages = await db.select()
      .from(pageContentsTable)
      .where(eq(pageContentsTable.id, pageId))
      .execute();

    expect(pages).toHaveLength(1);
    expect(pages[0].title).toEqual('Database Test Title');
    expect(pages[0].is_published).toEqual(false);
    expect(pages[0].content).toEqual('Original content for testing'); // Unchanged
    expect(pages[0].updated_at).toBeInstanceOf(Date);
  });

  it('should always update the updated_at timestamp', async () => {
    const pageId = await createTestPageContent();

    // Get original timestamp
    const originalPage = await db.select()
      .from(pageContentsTable)
      .where(eq(pageContentsTable.id, pageId))
      .execute();

    const originalUpdatedAt = originalPage[0].updated_at;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdatePageContentInput = {
      id: pageId,
      title: 'Timestamp Test'
    };

    const result = await updatePageContent(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > originalUpdatedAt).toBe(true);
  });

  it('should throw error for non-existent page content', async () => {
    const updateInput: UpdatePageContentInput = {
      id: 99999, // Non-existent ID
      title: 'This should fail'
    };

    expect(updatePageContent(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should handle content update with special characters', async () => {
    const pageId = await createTestPageContent();

    const updateInput: UpdatePageContentInput = {
      id: pageId,
      content: 'Content with special chars: <p>HTML</p> & "quotes" & \'apostrophes\''
    };

    const result = await updatePageContent(updateInput);

    expect(result.content).toEqual('Content with special chars: <p>HTML</p> & "quotes" & \'apostrophes\'');
  });
});
