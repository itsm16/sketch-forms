import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createFetchContext, serverRouter } from "@repo/trpc/server";

export const runtime = "nodejs";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: serverRouter,
    createContext: ({ req: request, resHeaders }) =>
      createFetchContext({ req: request, resHeaders }),
  });

export { handler as GET, handler as POST };
