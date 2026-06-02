import { create } from "zustand";

type User = {
    id: string | null,
    email: string | null,
    name: string | null,
} | null

type UserStore = {
    user: User;
    setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user: User) => set({user})
}))

