import { api } from "~/trpc/server"

export const useAuth = () => {

  const createUserWithEmailAndPassword = async (fullName: string, email: string, password: string) => {
    const {id} = await api.auth.CreateUserWithEmailAndPassword.mutate({ fullName, email, password });
    return id;
  }

  const loginUserWithEmailAndPassword = async (email: string, password: string) => {
    const {id} = await api.auth.LoginUserWithEMailAndPassword.mutate({ email, password });
    return id;
  }

  // const getMe = async (token: string)=>{
  //   const {id, fullName, email} = await api.auth.GetMe.query({ token });
  //   return {id, fullName, email};
  // }

  return {
    createUserWithEmailAndPassword,
    loginUserWithEmailAndPassword,
    // getMe
  }
}