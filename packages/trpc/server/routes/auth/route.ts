import {publicProcedure, router} from '../../trpc'
import { generatePath } from '../../utils/path-generator'
import { createUserWithEmailAndPasswordInput, createUserWithEmailPassWordOutput, loginUserWithEmailAndPassWordInput, loginUserWithEmailAndPassWordOutput } from './model';
import { userService } from '../../services';

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
  .mutation(async ({input}) => {
    const {fullName, email, password} = input;

    const {id} = await userService.createUserWithEmailAndPassword({
      fullName,
      email,
      password
    })

    return {
      id
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
  .mutation(async({input}) => {
    const {email, password} = input;

    const {id} = await userService.loginUserWithEmailAndPassword({
      email,
      password
    })

    return{
      id
    }
  })
})