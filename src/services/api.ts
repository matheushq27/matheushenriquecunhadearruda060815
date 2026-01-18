import axios from 'axios'
import { AppError } from '@/helpers/AppError'
import { useAuthStore } from '@/stores/auth.store'
import { refreshToken } from './authenticate/authenticate.service'

export const VERSION_API = 'v1'

let isRefreshing = false
let failedQueue: {
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}[] = []

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  () =>
    Promise.reject(
      new AppError('Falha na requisição')
    )
)

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const {
        user,
        setTokens,
        logout,
      } = useAuthStore.getState()

      if (!user?.refreshToken) {
        logout()
        return Promise.reject(
          new AppError('Sessão expirada')
        )
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch(Promise.reject)
      }

      try {
        const resp = await refreshToken({ refreshToken: user.refreshToken })
        setTokens(
          resp.accessToken,
          resp.refreshToken,
          resp.expiresIn,
          resp.refreshExpiresIn,
        )

        failedQueue.forEach((p) => p.resolve())
        failedQueue = []

        return api(originalRequest)
      } catch (err) {
        console.log(err)
        failedQueue.forEach((p) => p.reject(err))
        failedQueue = []

        logout()

        return Promise.reject(
          new AppError('Sessão expirada')
        )
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.data?.message) {
      return Promise.reject(
        new AppError(error.response.data.message)
      )
    }

    return Promise.reject(
      new AppError('Falha na requisição')
    )
  }
)

export default api
