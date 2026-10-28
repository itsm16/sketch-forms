import type { CookieOptions, Request, Response } from "express";
import type { TRPCContext } from "../context";

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;

const defaultCookieOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: ONE_YEAR,
};

const createCookieFactory = (res: Response) => {
  return function createCookie(
    name: string,
    value: string,
    opts: CookieOptions = defaultCookieOptions,
  ) {
    res.cookie(name, value, opts);
  };
};

const getCookieFactory = (req: Request) => {
  return function getCookie(name: string) {
    return req?.cookies?.[name] as string | undefined;
  };
};

const clearCookieFactory = (res: Response) => {
  return function clearCookie(name: string) {
    res.clearCookie(name, { path: "/" });
  };
};

export function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {};

  return header.split(";").reduce<Record<string, string>>((cookies, part) => {
    const separator = part.indexOf("=");
    if (separator === -1) return cookies;

    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (!name) return cookies;

    try {
      cookies[name] = decodeURIComponent(value);
    } catch {
      cookies[name] = value;
    }

    return cookies;
  }, {});
}

export function serializeCookie(
  name: string,
  value: string,
  opts: CookieOptions = defaultCookieOptions,
): string {
  const segments = [`${name}=${encodeURIComponent(value)}`];

  if (opts.maxAge !== undefined) {
    segments.push(`Max-Age=${Math.floor(opts.maxAge / 1000)}`);
  }
  if (opts.domain) segments.push(`Domain=${opts.domain}`);
  segments.push(`Path=${opts.path ?? "/"}`);
  if (opts.expires) segments.push(`Expires=${opts.expires.toUTCString()}`);
  if (opts.httpOnly) segments.push("HttpOnly");
  if (opts.secure) segments.push("Secure");
  if (opts.sameSite) {
    const sameSite =
      typeof opts.sameSite === "string" ? opts.sameSite : "Strict";
    segments.push(`SameSite=${sameSite}`);
  }

  return segments.join("; ");
}

export function expiredCookie(name: string): string {
  return serializeCookie(name, "", {
    ...defaultCookieOptions,
    maxAge: 0,
    expires: new Date(0),
  });
}

export const AUTHENTICATION_COOKIE_NAME = "auth-token";

const setAuthTokenCookie = (ctx: TRPCContext, token: string) => {
  ctx.createCookie(AUTHENTICATION_COOKIE_NAME, token);
};

const getAuthTokenCookie = (ctx: TRPCContext) => {
  return ctx.getCookie(AUTHENTICATION_COOKIE_NAME);
};

const clearAuthTokenCookie = (ctx: TRPCContext) => {
  ctx.clearCookie(AUTHENTICATION_COOKIE_NAME);
};

export {
  createCookieFactory,
  getCookieFactory,
  clearCookieFactory,
  setAuthTokenCookie,
  getAuthTokenCookie,
  clearAuthTokenCookie,
};
