
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type CreatePageContentInput } from '../schema';
import { getAllPages } from '../handlers/get_all_pages';

// Test page inputs
const testPage1: CreatePageContentInput = {
  page_slug: 'about-us',
  title: 'About Us',
  content: 'This is the about us page content.',
  meta_description: 'Learn more about our organization',
  is_published: true
};

const testPage2: CreatePageContentInput = {
  page_slug: 'contact',
  title: 'Contact Us',
  content: 'Contact information and form.',
  meta_description: null,
  is_published: false
};

const testPage3: CreatePageContentInput = {
  page_slug: 'services',
  title: 'Our Services',
  content: 'List of services we provide.',
  meta_description: 'Services offered by our organization',
  is_published: true
};

describe('getAllPages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no pages exist', async () => {
    const result = await getAllPages();
    
    expect(result).toEqual([]);
  });

  it('should return all pages regardless of published status', async () => {
    // Create test pages
    await db.insert(pageContentsTable).values([
      testPage1,
      testPage2,
      testPage3
    ]).execute();

    const result = await getAllPages();

    expect(result).toHaveLength(3);
    
    // Check that both published and unpublished pages are included
    const publishedPages = result.filter(page => page.is_published);
    const unpublishedPages = result.filter(page => !page.is_published);
    
    expect(publishedPages).toHaveLength(2);
    expect(unpublishedPages).toHaveLength(1);
  });

  it('should return pages with all required fields', async () => {
    await db.insert(pageContentsTable).values(testPage1).execute();

    const result = await getAllPages();

    expect(result).toHaveLength(1);
    const page = result[0];
    
    expect(page.id).toBeDefined();
    expect(page.page_slug).toEqual('about-us');
    expect(page.title).toEqual('About Us');
    expect(page.content).toEqual('This is the about us page content.');
    expect(page.meta_description).toEqual('Learn more about our organization');
    expect(page.is_published).toBe(true);
    expect(page.created_at).toBeInstanceOf(Date);
    expect(page.updated_at).toBeInstanceOf(Date);
  });

  it('should order pages by most recently updated first', async () => {
    // Insert pages with slight delay to ensure different timestamps
    await db.insert(pageContentsTable).values(testPage1).execute();
    
    // Small delay to ensure different updated_at timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(pageContentsTable).values(testPage2).execute();
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(pageContentsTable).values(testPage3).execute();

    const result = await getAllPages();

    expect(result).toHaveLength(3);
    
    // Verify ordering - most recently created should be first
    expect(result[0].page_slug).toEqual('services'); // Last inserted
    expect(result[1].page_slug).toEqual('contact');  // Second inserted
    expect(result[2].page_slug).toEqual('about-us'); // First inserted
    
    // Verify timestamps are in descending order
    expect(result[0].updated_at >= result[1].updated_at).toBe(true);
    expect(result[1].updated_at >= result[2].updated_at).toBe(true);
  });

  it('should handle pages with null meta_description', async () => {
    await db.insert(pageContentsTable).values(testPage2).execute();

    const result = await getAllPages();

    expect(result).toHaveLength(1);
    expect(result[0].meta_description).toBeNull();
    expect(result[0].page_slug).toEqual('contact');
    expect(result[0].is_published).toBe(false);
  });
});
