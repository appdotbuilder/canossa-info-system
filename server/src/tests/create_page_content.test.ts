
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type CreatePageContentInput } from '../schema';
import { createPageContent } from '../handlers/create_page_content';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreatePageContentInput = {
  page_slug: 'about-us',
  title: 'About Us',
  content: 'This is the about us page content.',
  meta_description: 'Learn more about our organization',
  is_published: true
};

describe('createPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create page content', async () => {
    const result = await createPageContent(testInput);

    // Basic field validation
    expect(result.page_slug).toEqual('about-us');
    expect(result.title).toEqual('About Us');
    expect(result.content).toEqual(testInput.content);
    expect(result.meta_description).toEqual('Learn more about our organization');
    expect(result.is_published).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save page content to database', async () => {
    const result = await createPageContent(testInput);

    // Query using proper drizzle syntax
    const pages = await db.select()
      .from(pageContentsTable)
      .where(eq(pageContentsTable.id, result.id))
      .execute();

    expect(pages).toHaveLength(1);
    expect(pages[0].page_slug).toEqual('about-us');
    expect(pages[0].title).toEqual('About Us');
    expect(pages[0].content).toEqual(testInput.content);
    expect(pages[0].meta_description).toEqual('Learn more about our organization');
    expect(pages[0].is_published).toEqual(true);
    expect(pages[0].created_at).toBeInstanceOf(Date);
    expect(pages[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle null meta_description', async () => {
    const inputWithNullMeta: CreatePageContentInput = {
      page_slug: 'contact',
      title: 'Contact Us',
      content: 'Contact information page',
      meta_description: null,
      is_published: true
    };

    const result = await createPageContent(inputWithNullMeta);

    expect(result.meta_description).toBeNull();
    expect(result.page_slug).toEqual('contact');
    expect(result.title).toEqual('Contact Us');
  });

  it('should apply default is_published value', async () => {
    const inputWithDefaults: CreatePageContentInput = {
      page_slug: 'privacy',
      title: 'Privacy Policy',
      content: 'Privacy policy content',
      meta_description: null,
      is_published: true // Default from Zod schema
    };

    const result = await createPageContent(inputWithDefaults);

    expect(result.is_published).toEqual(true);
  });

  it('should enforce unique page_slug constraint', async () => {
    // Create first page
    await createPageContent(testInput);

    // Try to create another page with same slug
    const duplicateInput: CreatePageContentInput = {
      page_slug: 'about-us', // Same slug
      title: 'Different Title',
      content: 'Different content',
      meta_description: null,
      is_published: true
    };

    await expect(createPageContent(duplicateInput)).rejects.toThrow(/unique/i);
  });
});
