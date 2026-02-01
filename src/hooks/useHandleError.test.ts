import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useErrorHandler } from './useHandleError'
import { AppError } from '@/helpers/AppError'

const mockShowError = vi.fn()

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showError: mockShowError
  })
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar handleError function', () => {
    const { result } = renderHook(() => useErrorHandler())

    expect(result.current.handleError).toBeDefined()
    expect(typeof result.current.handleError).toBe('function')
  })

  it('deve tratar AppError com mensagem específica', () => {
    const { result } = renderHook(() => useErrorHandler())
    const appError = new AppError('Erro específico do aplicativo')

    result.current.handleError(appError)

    expect(mockShowError).toHaveBeenCalledWith('Erro específico do aplicativo')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar AppError com mensagem null usando mensagem padrão do AppError', () => {
    const { result } = renderHook(() => useErrorHandler())
    const appError = new AppError(undefined)

    result.current.handleError(appError, 'Mensagem padrão customizada')

    expect(mockShowError).toHaveBeenCalledWith('Erro na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar AppError com mensagem undefined usando mensagem padrão do AppError', () => {
    const { result } = renderHook(() => useErrorHandler())
    const appError = new AppError(undefined)

    result.current.handleError(appError, 'Mensagem padrão customizada')

    expect(mockShowError).toHaveBeenCalledWith('Erro na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar erro genérico com mensagem padrão', () => {
    const { result } = renderHook(() => useErrorHandler())
    const genericError = new Error('Erro genérico')

    result.current.handleError(genericError, 'Erro na requisição')

    expect(mockShowError).toHaveBeenCalledWith('Erro na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar erro genérico com mensagem padrão padrão quando não fornecida', () => {
    const { result } = renderHook(() => useErrorHandler())
    const genericError = new Error('Erro genérico')

    result.current.handleError(genericError)

    expect(mockShowError).toHaveBeenCalledWith('Falha na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar string como erro genérico', () => {
    const { result } = renderHook(() => useErrorHandler())

    result.current.handleError('Erro em string')

    expect(mockShowError).toHaveBeenCalledWith('Falha na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar objeto como erro genérico', () => {
    const { result } = renderHook(() => useErrorHandler())

    result.current.handleError({ code: 500, message: 'Internal Server Error' })

    expect(mockShowError).toHaveBeenCalledWith('Falha na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar null como erro genérico', () => {
    const { result } = renderHook(() => useErrorHandler())

    result.current.handleError(null)

    expect(mockShowError).toHaveBeenCalledWith('Falha na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve tratar undefined como erro genérico', () => {
    const { result } = renderHook(() => useErrorHandler())

    result.current.handleError(undefined)

    expect(mockShowError).toHaveBeenCalledWith('Falha na requisição')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve lidar com múltiplas chamadas de erro', () => {
    const { result } = renderHook(() => useErrorHandler())
    const appError1 = new AppError('Primeiro erro')
    const appError2 = new AppError('Segundo erro')

    result.current.handleError(appError1)
    result.current.handleError(appError2)

    expect(mockShowError).toHaveBeenCalledWith('Primeiro erro')
    expect(mockShowError).toHaveBeenCalledWith('Segundo erro')
    expect(mockShowError).toHaveBeenCalledTimes(2)
  })
})