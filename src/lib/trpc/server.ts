import { initTRPC, TRPCError } from '@trpc/server';
import { createTRPCContext } from './context';
import { auth } from '@clerk/nextjs/server';
import { db, dbHelpers } from '../db';
import { z } from 'zod';

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const { userId } = auth();
  
  if (!userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      userId,
    },
  });
});

// App router
export const appRouter = router({
  // User routes
  user: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      return await dbHelpers.findUserByClerkId(ctx.userId);
    }),
  }),

  // Project routes
  project: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await dbHelpers.getUserProjects(ctx.userId);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        repoUrl: z.string().url().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await dbHelpers.findUserByClerkId(ctx.userId);
        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }

        return await dbHelpers.createProject({
          userId: user.id,
          name: input.name,
          description: input.description,
          repoUrl: input.repoUrl,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        repoUrl: z.string().url().optional(),
        deployUrl: z.string().url().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Add proper project ownership validation
        const { id, ...updates } = input;
        // Implementation would update the project
        return { success: true };
      }),
  }),

  // Component routes
  component: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await dbHelpers.getUserComponents(ctx.userId);
    }),

    public: publicProcedure.query(async () => {
      return await dbHelpers.getPublicComponents();
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        category: z.string().optional(),
        description: z.string().optional(),
        code: z.string().min(1),
        props: z.record(z.any()).optional(),
        tags: z.array(z.string()).optional(),
        isPublic: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await dbHelpers.findUserByClerkId(ctx.userId);
        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }

        return await dbHelpers.saveComponent({
          userId: user.id,
          ...input,
        });
      }),
  }),

  // BMAD routes
  bmad: router({
    traces: protectedProcedure
      .input(z.object({
        projectId: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (input.projectId) {
          return await dbHelpers.getProjectTraces(input.projectId);
        }
        // Return user's traces across all projects
        return await db.select()
          .from(db.schema.bmadTraces)
          .where(eq(db.schema.bmadTraces.userId, ctx.userId));
      }),

    saveTrace: protectedProcedure
      .input(z.object({
        traceId: z.string(),
        projectId: z.string().optional(),
        target: z.string(),
        duration: z.number(),
        exitCode: z.number(),
        metadata: z.record(z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await dbHelpers.findUserByClerkId(ctx.userId);
        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }

        return await dbHelpers.saveBmadTrace({
          userId: user.id,
          ...input,
        });
      }),
  }),
});

// Import eq function
import { eq } from 'drizzle-orm';

export type AppRouter = typeof appRouter;