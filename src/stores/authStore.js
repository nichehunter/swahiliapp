"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  user: null,

  isAuthenticated: false,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,

      // =====================================================
      // HYDRATION
      // =====================================================

      hasHydrated: false,

      setHasHydrated: (hasHydrated) =>
        set({
          hasHydrated,
        }),

      // =====================================================
      // SET AUTHENTICATION DATA
      // =====================================================

      setAuth: ({ user = null }) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // =====================================================
      // SET USER
      // =====================================================

      setUser: (user) =>
        set({
          user,
        }),

      // =====================================================
      // LOGOUT
      // =====================================================

      logout: () =>
        set({
          ...initialState,
        }),
    }),

    {
      name: "swahiliexpi-auth-storage",

      partialize: (state) => ({
        user: state.user,

        isAuthenticated: state.isAuthenticated,
      }),

      // =====================================================
      // KNOW WHEN PERSISTED DATA HAS BEEN LOADED
      // =====================================================

      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error) {
            state?.setHasHydrated(true);
          }
        };
      },
    },
  ),
);
