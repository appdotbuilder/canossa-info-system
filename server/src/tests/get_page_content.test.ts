
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type GetPageBySlugInput, type CreatePageContentInput } from '../schema';
import { getPageContent } from '../handlers/get_page_content';

const testPageInput: CreatePageContentInput = {
  page_slug: 'about-us',
  title: 'About Us',
  content: 'This is the about us page content',
  meta_description: 'Learn more about our organization',
  is_published: true
};

const unpublishedPageInput: CreatePageContentInput = {
  page_slug: 'draft-page',
  title: 'Draft Page',
  content: 'This is a draft page',
  meta_description: 'Draft page description',
  is_published: false
};

describe('getPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return page content for existing published page', async () => {
    // Create test page
    await db.insert(pageContentsTable)
      .values(testPageInput)
      .execute();

    const input: GetPageBySlugInput = { slug: 'about-us' };
    const result = await getPageContent(input);

    expect(result).not.toBeNull();
    expect(result!.page_slug).toEqual('about-us');
    expect(result!.title).toEqual('About Us');
    expect(result!.content).toEqual('This is the about us page content');
    expect(result!.meta_description).toEqual('Learn more about our organization');
    expect(result!.is_published).toBe(true);
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent page', async () => {
    const input: GetPageBySlugInput = { slug: 'non-existent-page' };
    const result = await getPageContent(input);

    expect(result).toBeNull();
  });

  it('should return null for unpublished page', async () => {
    // Create unpublished page
    await db.insert(pageContentsTable)
      .values(unpublishedPageInput)
      .execute();

    const input: GetPageBySlugInput = { slug: 'draft-page' };
    const result = await getPageContent(input);

    expect(result).toBeNull();
  });

  it('should handle pages with null meta description', async () => {
    const pageWithoutMeta: CreatePageContentInput = {
      page_slug: 'no-meta',
      title: 'No Meta Page',
      content: 'Page without meta description',
      meta_description: null,
      is_published: true
    };

    await db.insert(pageContentsTable)
      .values(pageWithoutMeta)
      .execute();

    const input: GetPageBySlugInput = { slug: 'no-meta' };
    const result = await getPageContent(input);

    expect(result).not.toBeNull();
    expect(result!.meta_description).toBeNull();
    expect(result!.title).toEqual('No Meta Page');
    expect(result!.content).toEqual('Page without meta description');
  });

  it('should handle special character slugs correctly', async () => {
    const specialSlugPage: CreatePageContentInput = {
      page_slug: 'education-student',
      title: 'Education for Students',
      content: 'Educational content for students',
      meta_description: 'Student education information',
      is_published: true
    };

    await db.insert(pageContentsTable)
      .values(specialSlugPage)
      .execute();

    const input: GetPageBySlugInput = { slug: 'education-student' };
    const result = await getPageContent(input);

    expect(result).not.toBeNull();
    expect(result!.page_slug).toEqual('education-student');
    expect(result!.title).toEqual('Education for Students');
  });
});
