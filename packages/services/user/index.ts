import { type CreateUserWithEmailAndPasswordInputType, CreateUserWithEmailAndPasswordInput, LoginUserWithEmailAndPasswordInputType } from "./model";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import crypto from 'node:crypto'

class UserService {

    private async getUserByEmail(email: string) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!user) {
            return null;
        }
        return user;
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const { fullName, email, password } = await CreateUserWithEmailAndPasswordInput.parseAsync(payload);

        const existingUser = await this.getUserByEmail(payload.email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const salt = crypto.randomBytes(16).toString("hex")
        const hashedPassword = crypto.createHash("sha256").update(password + salt).digest("hex")

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

        return {
            id: userInsertResult.id,
        };
    }

    public async loginUserWithEmailAndPassword(payload: LoginUserWithEmailAndPasswordInputType){
        const existingUser = await this.getUserByEmail(payload.email);

        if(!existingUser){
            throw new Error("User doesn't exist")
        }

        const passwordHash = crypto.createHash("sha256").update(payload.password + existingUser.salt).digest("hex")
        const isMatch = passwordHash === existingUser.password
        
        if(!isMatch){
            throw new Error("password doensn't match")
        }

        return {
            id: existingUser.id
        }
    }
}

export default UserService;