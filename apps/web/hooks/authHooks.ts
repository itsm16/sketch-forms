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

  return {
    createUserWithEmailAndPassword,
    loginUserWithEmailAndPassword,
  }
}