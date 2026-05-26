import z, { email } from "zod";

const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string({error: "name is required"}).describe("user's name"),
    email: z.email({error: "email is required"}).describe("user's email"),
    password: z.string({error: "password is required"})
})

const createUserWithEmailPassWordOutput = z.object({
    id: z.string().describe("id of user created")
})

const loginUserWithEmailAndPassWordInput = z.object({
    email: z.email().describe("user's email"),
    password: z.string().describe("user's password")
})

const loginUserWithEmailAndPassWordOutput = z.object({
    id: z.string().describe("id of user created")
})

export{
    createUserWithEmailAndPasswordInput,
    createUserWithEmailPassWordOutput,
    loginUserWithEmailAndPassWordInput,
    loginUserWithEmailAndPassWordOutput
}