import type { CookieOptions } from "express";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import {
  clearCookieFactory,
  createCookieFactory,
  expiredCookie,
  getCookieFactory,
  parseCookieHeader,
  serializeCookie,
} from "./utils/cookie";
import { saveAuthUserFactory } from "./utils/auth-middleware";

export type TRPCContext = {
  createCookie: (
    name: string,
    value: string,
    opts?: CookieOptions,
  ) => void;
  getCookie: (name: string) => string | undefined;
  clearCookie: (name: string) => void;
  saveAuthUser: (user: {
    id: string;
    fullName: string;
    email: string;
  }) => void;
};

export async function createContext({
  res,
  req,
}: CreateExpressContextOptions): Promise<TRPCContext> {
  const ctx: TRPCContext = {
    createCookie: createCookieFactory(res),
    getCookie: getCookieFactory(req),
    clearCookie: clearCookieFactory(res),
    saveAuthUser: saveAuthUserFactory(req),
  };
  return ctx;
}

export type FetchContextOptions = {
  req: Request;
  resHeaders: Headers;
};

export async function createFetchContext({
  req,
  resHeaders,
}: FetchContextOptions): Promise<TRPCContext> {
  resHeaders.set("Cache-Control", "no-store");

  const cookies = parseCookieHeader(req.headers.get("cookie"));

  const ctx: TRPCContext = {
    createCookie: (name, value, opts) => {
      resHeaders.append("Set-Cookie", serializeCookie(name, value, opts));
    },
    getCookie: (name) => cookies[name],
    clearCookie: (name) => {
      resHeaders.append("Set-Cookie", expiredCookie(name));
    },
    // Fetch requests are immutable, so there is no request object to attach
    // the resolved user to. Route handlers rely on the cookie instead.
    saveAuthUser: () => {},
  };

  return ctx;
}

export type TRPCContextType = Awaited<ReturnType<typeof createContext>>;
