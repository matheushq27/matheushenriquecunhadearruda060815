import type { AuthState, AuthUser } from '@/interfaces/stores/auth.store'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,

      setUser: (user: AuthUser) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      setTokens: (
        accessToken: string,
        refreshToken: string,
        expireIn?: number,
        refreshExpireIn?: number
      ) => {
        const currentUser = get().user

        if (!currentUser) return

        set({
          user: {
            ...currentUser,
            accessToken,
            refreshToken,
            expireIn: expireIn ?? currentUser.expireIn,
            refreshExpireIn:
              refreshExpireIn ?? currentUser.refreshExpireIn,
          },
        })
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage-tutor-pet',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
