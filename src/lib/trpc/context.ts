import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  return {
    req: opts.req,
    res: opts.res,
  };
};

export type Context = typeof createTRPCContext;