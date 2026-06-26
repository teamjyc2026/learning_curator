import { create } from "zustand";

interface FusionQuizState {
  answers: Record<string, number>;
  setAnswer: (id: string, value: number) => void;
  reset: () => void;
}

/** 융합형 사고 자가진단 답안 상태(클라이언트). */
export const useFusionQuizStore = create<FusionQuizState>((set) => ({
  answers: {},
  setAnswer: (id, value) =>
    set((s) => ({ answers: { ...s.answers, [id]: value } })),
  reset: () => set({ answers: {} }),
}));
