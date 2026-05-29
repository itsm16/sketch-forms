import { create } from "zustand";

type LoaderState = {
  loading: boolean;
  message: string;
  show: (msg?: string) => void;
  hide: () => void;
  setMessage: (msg: string) => void;
}

const useLoaderStore = create<LoaderState>((set) => ({
  loading: false,
  message: 'loading...',
  show: (msg: string = 'loading...') => set({ loading: true, message: msg }),
  hide: () => set({ loading: false }),
  setMessage: (msg: string) => set({ message: msg }),
}));

export default useLoaderStore;
