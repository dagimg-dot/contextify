import { Prompt } from "@/services/db";
import { GlobalState } from "@/types/types";
import { create } from "zustand";

const initialState: GlobalState = {
  currentPrompt: null,
  updateCurrentPrompt: () => {},
};

const useGlobalStore = create<GlobalState>()((set) => ({
  ...initialState,
  updateCurrentPrompt: (prompt: Prompt) => set({ currentPrompt: prompt }),
}));

export default useGlobalStore;
