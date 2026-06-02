import type { Request } from "express";
import { TRPCContext } from "../context";

const saveAuthUserFactory = (req: Request & {user?: null | {id: string, fullName: string, email: string}}) => {
    return function saveAuthUser(user: {id: string, fullName: string, email: string}) {
        req.user = user;
    }
};

const setAuthUser = (ctx : TRPCContext, user: {id: string, fullName: string, email: string}) => {
    return ctx.saveAuthUser(user);
}

export { saveAuthUserFactory, setAuthUser };
