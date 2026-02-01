import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './auth.store'
import type { AuthUser } from '@/interfaces/stores/auth.store'

// Mock do zustand/middleware
vi.mock('zustand/middleware', () => ({
  persist: (config: any) => config,
}))

describe('auth.store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })
  })

  describe('Estado inicial', () => {
    it('Deve ter estado inicial correto', () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.user).toBeNull()
    })
  })

  describe('setUser', () => {
    it('Deve definir usuário e marcar como autenticado', () => {
      const mockUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
        expireIn: 3600,
        refreshExpireIn: 86400,
      }

      useAuthStore.getState().setUser(mockUser)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
    })

    it('Deve sobrescrever usuário existente', () => {
      const initialUser: AuthUser = {
        username: 'maria.santos',
        accessToken: 'initial-token',
        refreshToken: 'initial-refresh',
        expireIn: 1800,
        refreshExpireIn: 43200,
      }

      const newUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'new-token-123',
        refreshToken: 'new-refresh-456',
        expireIn: 3600,
        refreshExpireIn: 86400,
      }

      useAuthStore.getState().setUser(initialUser)
      useAuthStore.getState().setUser(newUser)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(newUser)
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('setTokens', () => {
    it('Deve atualizar tokens do usuário atual', () => {
      const mockUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        expireIn: 1800,
        refreshExpireIn: 43200,
      }

      useAuthStore.getState().setUser(mockUser)
      useAuthStore.getState().setTokens(
        'new-access-token',
        'new-refresh-token',
        3600,
        86400
      )

      const state = useAuthStore.getState()
      expect(state.user).toEqual({
        username: 'joao.silva',
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expireIn: 3600,
        refreshExpireIn: 86400,
      })
      expect(state.isAuthenticated).toBe(true)
    })

    it('Deve manter valores antigos se expireIn não for fornecido', () => {
      const mockUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        expireIn: 1800,
        refreshExpireIn: 43200,
      }

      useAuthStore.getState().setUser(mockUser)
      useAuthStore.getState().setTokens('new-access-token', 'new-refresh-token')

      const state = useAuthStore.getState()
      expect(state.user).toEqual({
        username: 'joao.silva',
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expireIn: 1800,
        refreshExpireIn: 43200,
      })
    })

    it('Deve manter valores antigos se refreshExpireIn não for fornecido', () => {
      const mockUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        expireIn: 1800,
        refreshExpireIn: 43200,
      }

      useAuthStore.getState().setUser(mockUser)
      useAuthStore.getState().setTokens(
        'new-access-token',
        'new-refresh-token',
        3600
      )

      const state = useAuthStore.getState()
      expect(state.user).toEqual({
        username: 'joao.silva',
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expireIn: 3600,
        refreshExpireIn: 43200,
      })
    })

    it('Não deve fazer nada se não houver usuário atual', () => {
      useAuthStore.getState().setTokens(
        'new-access-token',
        'new-refresh-token',
        3600,
        86400
      )

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('Deve fazer logout e limpar dados do usuário', () => {
      const mockUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
        expireIn: 3600,
        refreshExpireIn: 86400,
      }

      useAuthStore.getState().setUser(mockUser)

      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
    })

    it('Deve funcionar mesmo sem usuário autenticado', () => {
      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
    })
  })

  describe('Integração entre métodos', () => {
    it('Deve permitir fluxo completo de login e logout', () => {
      const mockUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'initial-token',
        refreshToken: 'initial-refresh',
        expireIn: 3600,
        refreshExpireIn: 86400,
      }

      // Login
      useAuthStore.getState().setUser(mockUser)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().user).toEqual(mockUser)

      // Atualizar tokens
      useAuthStore.getState().setTokens(
        'refreshed-token',
        'refreshed-refresh',
        7200,
        172800
      )
      expect(useAuthStore.getState().user?.accessToken).toBe('refreshed-token')
      expect(useAuthStore.getState().user?.expireIn).toBe(7200)

      // Logout
      useAuthStore.getState().logout()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('Deve manter consistência ao atualizar tokens várias vezes', () => {
      const mockUser: AuthUser = {
        username: 'joao.silva',
        accessToken: 'token1',
        refreshToken: 'refresh1',
        expireIn: 3600,
        refreshExpireIn: 86400,
      }

      useAuthStore.getState().setUser(mockUser)

      // Primeira atualização
      useAuthStore.getState().setTokens('token2', 'refresh2', 1800)
      expect(useAuthStore.getState().user?.accessToken).toBe('token2')
      expect(useAuthStore.getState().user?.expireIn).toBe(1800)
      expect(useAuthStore.getState().user?.refreshToken).toBe('refresh2')
      expect(useAuthStore.getState().user?.refreshExpireIn).toBe(86400)

      // Segunda atualização
      useAuthStore.getState().setTokens('token3', 'refresh3', 7200, 172800)
      expect(useAuthStore.getState().user?.accessToken).toBe('token3')
      expect(useAuthStore.getState().user?.expireIn).toBe(7200)
      expect(useAuthStore.getState().user?.refreshToken).toBe('refresh3')
      expect(useAuthStore.getState().user?.refreshExpireIn).toBe(172800)
    })
  })
})