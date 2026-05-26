import z from "zod";

const CreateUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().min(1).max(30).describe("User's full name"),
    email: z.email().describe("User's email address"),
    password: z.string().min(8).max(30).describe("User's password"),
});

const LoginUserWithEmailAndPasswordInput = z.object({
    email: z.email().describe("User's email address"),
    password: z.string().min(8).max(30).describe("User's password"),
});

type CreateUserWithEmailAndPasswordInputType = z.infer<typeof CreateUserWithEmailAndPasswordInput>;
type LoginUserWithEmailAndPasswordInputType = z.infer<typeof LoginUserWithEmailAndPasswordInput>;

export type { 
    CreateUserWithEmailAndPasswordInputType,
    LoginUserWithEmailAndPasswordInputType
};

export { 
    CreateUserWithEmailAndPasswordInput,
    LoginUserWithEmailAndPasswordInput 
};
