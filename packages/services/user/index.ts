import { type CreateUserWithEmailAndPasswordInputType, CreateUserWithEmailAndPasswordInput, LoginUserWithEmailAndPasswordInputType, UserToken, UserTokenType } from "./model";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import JWT from "jsonwebtoken";
import crypto from 'node:crypto'
import { env } from "../env";

class UserService {

    private async getUserByEmail(email: string) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!user) {
            return null;
        }
        return user;
    }

    private async verifyUserToken(token: string) {
        const {id} = JWT.verify(token, env.JWT_SECRET!) as { id: string };
        if (!id) {
            return null;
        }
        return {id};
    }

    private async getUserById(id: string) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
        if (!user) {
            return null;
        }
        return user;
    }

    private hashPassword(password: string, salt: string) {
        return crypto.scryptSync(password, salt, 64).toString("hex");
    }

    private verifyPassword(password: string, salt: string, hash: string) {
        const candidate = Buffer.from(this.hashPassword(password, salt), "hex");
        const expected = Buffer.from(hash, "hex");

        return (
            candidate.length === expected.length &&
            crypto.timingSafeEqual(candidate, expected)
        );
    }

    private async generateUserToken(payload: UserTokenType){
        const {id} = await UserToken.parseAsync(payload)
        const token = JWT.sign({id}, env.JWT_SECRET!, {expiresIn: "1d"})
        return {token};
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const { fullName, email, password } = await CreateUserWithEmailAndPasswordInput.parseAsync(payload);

        const existingUser = await this.getUserByEmail(payload.email);

        if (existingUser) {
            throw new Error("An account with this email already exists");
        }

        const salt = crypto.randomBytes(16).toString("hex")
        const hashedPassword = this.hashPassword(password, salt)

        const [userInsertResult] = await db.insert(usersTable).values({
            fullName,
            email,
            salt,
            password: hashedPassword,
            emailVerified: false,
            profileImageUrl: null,
        }).returning({ id: usersTable.id });

        if (!userInsertResult) {
            throw new Error("Something went wrong while creating the user");
        }

        const {token} = await this.generateUserToken({id: userInsertResult.id})

        return {
            id: userInsertResult.id,
            token
        };
    }

    public async loginUserWithEmailAndPassword(payload: LoginUserWithEmailAndPasswordInputType){
        const existingUser = await this.getUserByEmail(payload.email);

        if(!existingUser){
            throw new Error("Incorrect email or password")
        }

        if (!existingUser.salt || !existingUser.password) {
            throw new Error("Invalid account credentials")
        }

        const isMatch = this.verifyPassword(
            payload.password,
            existingUser.salt,
            existingUser.password,
        )
        
        if(!isMatch){
            throw new Error("Incorrect email or password")
        }

        const {token} = await this.generateUserToken({id: existingUser.id})
        
        return {
            id: existingUser.id,
            token
        }
    }

    public async getMe(token: string){

        const verifiedUser = await this.verifyUserToken(token);
        if(!verifiedUser){
            throw new Error("User not found");
        }

        const user = await this.getUserById(verifiedUser.id);
        if (!user) {
            throw new Error("User not found");
        }
        const {id, fullName, email} = user;
        return {id, fullName, email};
    }
}

export default UserService;