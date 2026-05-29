import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL ?? "/trpc",
    fetch(input, options) {
      return fetch(input, {
        ...options,
        credentials: "include", // comment this out if you don't want cookies to be sent with requests
        // if not commenting out , not using cookies also, this gives CORS error
      });
    },
  });
};
