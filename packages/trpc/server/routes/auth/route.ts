import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInput,
  createUserWithEmailPassWordOutput,
  getMeOutput,
  loginUserWithEmailAndPassWordInput,
  loginUserWithEmailAndPassWordOutput,
  logoutOutput,
} from "./model";
import { userService } from "../../services";
import {
  clearAuthTokenCookie,
  getAuthTokenCookie,
  setAuthTokenCookie,
} from "../../utils/cookie";
import { setAuthUser } from "../../utils/auth-middleware";
import { toTRPCError } from "../../utils/errors";

const TAGS = ["Authentication"];
const getPath = generatePath("/auth");

export const authRouter = router({
  CreateUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInput)
    .output(createUserWithEmailPassWordOutput)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, token } =
          await userService.createUserWithEmailAndPassword(input);

        setAuthTokenCookie(ctx, token);

        return { id, token };
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  LoginUserWithEMailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/loginUserWithEmailPassword"),
        tags: TAGS,
      },
    })
    .input(loginUserWithEmailAndPassWordInput)
    .output(loginUserWithEmailAndPassWordOutput)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, token } =
          await userService.loginUserWithEmailAndPassword(input);

        setAuthTokenCookie(ctx, token);

        return { id, token };
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  GetMe: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getMe"),
        tags: TAGS,
      },
    })
    .output(getMeOutput)
    .query(async ({ ctx }) => {
      const token = getAuthTokenCookie(ctx);

      if (!token) {
        throw toTRPCError(new Error("User not found"));
      }

      try {
        const user = await userService.getMe(token);
        setAuthUser(ctx, user);
        return user;
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  Logout: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/logout"),
        tags: TAGS,
      },
    })
    .output(logoutOutput)
    .mutation(async ({ ctx }) => {
      clearAuthTokenCookie(ctx);
      return { success: true };
    }),
});
