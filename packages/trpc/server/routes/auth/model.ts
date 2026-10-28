import z from "zod";

const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().min(1).max(30).describe("user's name"),
  email: z.email().describe("user's email"),
  password: z.string().min(8).max(30).describe("user's password"),
});

const createUserWithEmailPassWordOutput = z.object({
  id: z.string().describe("id of user created"),
  token: z.string().describe("user's auth token"),
});

const loginUserWithEmailAndPassWordInput = z.object({
  email: z.email().describe("user's email"),
  password: z.string().describe("user's password"),
});

const loginUserWithEmailAndPassWordOutput = z.object({
  id: z.string().describe("id of user"),
  token: z.string().describe("user's auth token"),
});

const getMeInput = z.undefined().describe("no input required");

const getMeOutput = z.object({
  id: z.string().describe("user's id"),
  fullName: z.string().describe("user's full name"),
  email: z.string().describe("user's email"),
});

const logoutOutput = z.object({
  success: z.boolean().describe("whether the user was signed out"),
});

export {
  createUserWithEmailAndPasswordInput,
  createUserWithEmailPassWordOutput,
  loginUserWithEmailAndPassWordInput,
  loginUserWithEmailAndPassWordOutput,
  getMeInput,
  getMeOutput,
  logoutOutput,
};
