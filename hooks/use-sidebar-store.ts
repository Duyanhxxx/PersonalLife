"use client";

import { create } from "zustand";

type SidebarState = {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (value) => set({ isCollapsed: value }),
}));
