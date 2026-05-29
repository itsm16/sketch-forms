import { create } from "zustand";

type ToolStore = {
    tool: string;
    setTool: (tool: string) => void;
}

const useToolStore = create<ToolStore>((set) => ({
    tool : "cursor",
    setTool : (tool: string) => set({ tool })
}))

export default useToolStore