import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { userService } from "./services";
import type { TRPCContext } from "./context";
import { AUTHENTICATION_COOKIE_NAME } from "./utils/cookie";
import { setAuthUser } from "./utils/auth-middleware";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<TRPCContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const protectedProcedure = tRPCContext.procedure.use(
  async ({ ctx, next }) => {
    const token = ctx.getCookie(AUTHENTICATION_COOKIE_NAME);

    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to sign in to continue",
      });
    }

    try {
      const user = await userService.getMe(token);
      setAuthUser(ctx, user);

      return next({ ctx: { ...ctx, user } });
    } catch {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Your session has expired. Please sign in again.",
      });
    }
  },
);
