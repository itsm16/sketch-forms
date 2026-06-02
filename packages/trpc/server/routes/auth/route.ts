import {publicProcedure, router} from '../../trpc'
import { generatePath } from '../../utils/path-generator'
import { createUserWithEmailAndPasswordInput, createUserWithEmailPassWordOutput, getMeInput, getMeOutput, loginUserWithEmailAndPassWordInput, loginUserWithEmailAndPassWordOutput } from './model';
import { userService } from '../../services';
import { getAuthTokenCookie, setAuthTokenCookie } from '../../utils/cookie';
import z from 'zod';
import { setAuthUser } from '../../utils/auth-middleware';

const TAGS = ["Authentication"];
const getPath = generatePath("/auth");

export const authRouter = router({
  CreateUserWithEmailAndPassword: publicProcedure
  .meta({
    openapi: {
      method: "POST",
      path: getPath("/createUserWithEmailPassword"),
      tags: TAGS,
    }
  })
  .input(createUserWithEmailAndPasswordInput).output(createUserWithEmailPassWordOutput)
  .mutation(async ({input, ctx}) => {
    const {fullName, email, password} = input;

    const {id, token} = await userService.createUserWithEmailAndPassword({
      fullName,
      email,
      password
    })

    setAuthTokenCookie(ctx, token)

    return {
      id,
      token
    }

  }),
  LoginUserWithEMailAndPassword: publicProcedure
  .meta({
    openapi:{
      method: "POST",
      path: getPath("/loginUserWithEmailPassword"),
      tags: TAGS
    }
  })
  .input(loginUserWithEmailAndPassWordInput).output(loginUserWithEmailAndPassWordOutput)
  .mutation(async({input, ctx}) => {
    const {email, password} = input;

    const {id, token} = await userService.loginUserWithEmailAndPassword({
      email,
      password
    })

    setAuthTokenCookie(ctx, token)

    return{
      id,
      token
    }
  }),
  GetMe: publicProcedure
  .meta({
    openapi:{
      method: "GET",
      path: getPath("/getMe"),
      tags: TAGS
    }
  })
  .output(getMeOutput)
  .query(async({ctx}) => {
    const token = getAuthTokenCookie(ctx);
    const user = await userService.getMe(token);
    
    setAuthUser(ctx, user);
    
    return user;
  })
})