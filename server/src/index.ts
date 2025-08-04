
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import {
  createCampusActivityInputSchema,
  updateCampusActivityInputSchema,
  createPageContentInputSchema,
  updatePageContentInputSchema,
  adminLoginInputSchema,
  createAdministratorInputSchema,
  getPageBySlugInputSchema,
  deleteActivityInputSchema
} from './schema';
import { getCampusActivities } from './handlers/get_campus_activities';
import { getFeaturedActivities } from './handlers/get_featured_activities';
import { createCampusActivity } from './handlers/create_campus_activity';
import { updateCampusActivity } from './handlers/update_campus_activity';
import { deleteCampusActivity } from './handlers/delete_campus_activity';
import { getPageContent } from './handlers/get_page_content';
import { getAllPages } from './handlers/get_all_pages';
import { createPageContent } from './handlers/create_page_content';
import { updatePageContent } from './handlers/update_page_content';
import { adminLogin } from './handlers/admin_login';
import { createAdministrator } from './handlers/create_administrator';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Public routes for website visitors
  getCampusActivities: publicProcedure
    .query(() => getCampusActivities()),

  getFeaturedActivities: publicProcedure
    .query(() => getFeaturedActivities()),

  getPageContent: publicProcedure
    .input(getPageBySlugInputSchema)
    .query(({ input }) => getPageContent(input)),

  // Admin authentication
  adminLogin: publicProcedure
    .input(adminLoginInputSchema)
    .mutation(({ input }) => adminLogin(input)),

  // Admin routes for content management
  createCampusActivity: publicProcedure
    .input(createCampusActivityInputSchema)
    .mutation(({ input }) => createCampusActivity(input)),

  updateCampusActivity: publicProcedure
    .input(updateCampusActivityInputSchema)
    .mutation(({ input }) => updateCampusActivity(input)),

  deleteCampusActivity: publicProcedure
    .input(deleteActivityInputSchema)
    .mutation(({ input }) => deleteCampusActivity(input)),

  getAllPages: publicProcedure
    .query(() => getAllPages()),

  createPageContent: publicProcedure
    .input(createPageContentInputSchema)
    .mutation(({ input }) => createPageContent(input)),

  updatePageContent: publicProcedure
    .input(updatePageContentInputSchema)
    .mutation(({ input }) => updatePageContent(input)),

  createAdministrator: publicProcedure
    .input(createAdministratorInputSchema)
    .mutation(({ input }) => createAdministrator(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
