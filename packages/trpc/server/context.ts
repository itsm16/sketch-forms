import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { clearCookieFactory, createCookieFactory, getCookieFactory } from "./utils/cookie";

export type TRPCContext = {
  createCookie : ReturnType<typeof createCookieFactory>;
  getCookie : ReturnType<typeof getCookieFactory>;
  clearCookie : ReturnType<typeof clearCookieFactory>;
};

export async function createContext({res, req}: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx : TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
    };
    return ctx;
}
export type TRPCContextType = Awaited<ReturnType<typeof createContext>>;
