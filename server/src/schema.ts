
import { z } from 'zod';

// Campus Activity schema
export const campusActivitySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  image_url: z.string().nullable(),
  activity_date: z.coerce.date(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CampusActivity = z.infer<typeof campusActivitySchema>;

// Page Content schema for static pages
export const pageContentSchema = z.object({
  id: z.number(),
  page_slug: z.string(),
  title: z.string(),
  content: z.string(),
  meta_description: z.string().nullable(),
  is_published: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type PageContent = z.infer<typeof pageContentSchema>;

// Administrator schema
export const administratorSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  password_hash: z.string(),
  full_name: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  last_login: z.coerce.date().nullable()
});

export type Administrator = z.infer<typeof administratorSchema>;

// Input schemas for creating campus activities
export const createCampusActivityInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  image_url: z.string().url().nullable(),
  activity_date: z.coerce.date(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true)
});

export type CreateCampusActivityInput = z.infer<typeof createCampusActivityInputSchema>;

// Input schema for updating campus activities
export const updateCampusActivityInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  image_url: z.string().url().nullable().optional(),
  activity_date: z.coerce.date().optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional()
});

export type UpdateCampusActivityInput = z.infer<typeof updateCampusActivityInputSchema>;

// Input schemas for page content
export const createPageContentInputSchema = z.object({
  page_slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  meta_description: z.string().nullable(),
  is_published: z.boolean().default(true)
});

export type CreatePageContentInput = z.infer<typeof createPageContentInputSchema>;

export const updatePageContentInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  meta_description: z.string().nullable().optional(),
  is_published: z.boolean().optional()
});

export type UpdatePageContentInput = z.infer<typeof updatePageContentInputSchema>;

// Input schemas for administrator authentication
export const adminLoginInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export type AdminLoginInput = z.infer<typeof adminLoginInputSchema>;

export const createAdministratorInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  is_active: z.boolean().default(true)
});

export type CreateAdministratorInput = z.infer<typeof createAdministratorInputSchema>;

// Query input schemas
export const getPageBySlugInputSchema = z.object({
  slug: z.string().min(1)
});

export type GetPageBySlugInput = z.infer<typeof getPageBySlugInputSchema>;

export const deleteActivityInputSchema = z.object({
  id: z.number()
});

export type DeleteActivityInput = z.infer<typeof deleteActivityInputSchema>;
