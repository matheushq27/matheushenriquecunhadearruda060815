export interface AuthUser {
  username: string
  accessToken: string
  refreshToken: string
  expireIn: number
  refreshExpireIn: number
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null

  setUser: (user: AuthUser) => void
  setTokens: (
    accessToken: string,
    refreshToken: string,
    expireIn?: number,
    refreshExpireIn?: number
  ) => void
  logout: () => void
}
