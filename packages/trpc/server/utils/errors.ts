import { TRPCError } from "@trpc/server";

export function toTRPCError(error: unknown): TRPCError {
  if (error instanceof TRPCError) return error;

  const message =
    error instanceof Error ? error.message : "Something went wrong";

  const code = /not found/i.test(message)
    ? "NOT_FOUND"
    : /already exists|doesn't exist|doesn't match|no longer accepting|invalid/i.test(
          message,
        )
      ? "BAD_REQUEST"
      : "INTERNAL_SERVER_ERROR";

  return new TRPCError({ code, message });
}
