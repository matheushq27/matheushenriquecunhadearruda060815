import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { usePagination } from './usePagination'

describe('usePagination', () => {
  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => usePagination())

    expect(result.current.page).toBe(0)
    expect(result.current.size).toBe(10)
    expect(result.current.total).toBe(0)
    expect(result.current.pageCount).toBe(0)
    expect(result.current.perPageOptions).toEqual([10, 20, 30])
    expect(result.current.nextPage).toBe(0)
    expect(result.current.first).toBe(0)
  })

  it('deve mudar página corretamente', () => {
    const { result } = renderHook(() => usePagination())

    const mockEvent = {
      rows: 20,
      page: 2,
      first: 40
    }

    act(() => {
      result.current.onPageChange(mockEvent as any)
    })

    expect(result.current.size).toBe(20)
    expect(result.current.page).toBe(2)
    expect(result.current.nextPage).toBe(2)
    expect(result.current.first).toBe(40)
  })

  it('deve definir paginação corretamente', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setPagination({
        page: 1,
        size: 15,
        total: 100,
        pageCount: 7
      })
    })

    expect(result.current.page).toBe(1)
    expect(result.current.size).toBe(15)
    expect(result.current.total).toBe(100)
    expect(result.current.pageCount).toBe(7)
  })

  it('deve definir próxima página', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setNextPage(3)
    })

    expect(result.current.nextPage).toBe(3)
  })

  it('deve definir tamanho da página', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setSize(25)
    })

    expect(result.current.size).toBe(25)
  })

  it('deve calcular first corretamente para página 0', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.onPageChange({ rows: 10, page: 0, first: 0 } as any)
    })

    expect(result.current.first).toBe(0)
  })

  it('deve calcular first corretamente para página 1', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.onPageChange({ rows: 10, page: 1, first: 10 } as any)
    })

    expect(result.current.first).toBe(10)
  })

  it('deve manter opções de por página constantes', () => {
    const { result } = renderHook(() => usePagination())

    expect(result.current.perPageOptions).toEqual([10, 20, 30])
    
    // Após mudanças, as opções devem permanecer as mesmas
    act(() => {
      result.current.setSize(50)
    })

    expect(result.current.perPageOptions).toEqual([10, 20, 30])
  })

  it('deve lidar com múltiplas mudanças de página', () => {
    const { result } = renderHook(() => usePagination())

    // Primeira mudança
    act(() => {
      result.current.onPageChange({ rows: 10, page: 1, first: 10 } as any)
    })

    expect(result.current.page).toBe(1)
    expect(result.current.first).toBe(10)

    // Segunda mudança
    act(() => {
      result.current.onPageChange({ rows: 20, page: 2, first: 40 } as any)
    })

    expect(result.current.page).toBe(2)
    expect(result.current.size).toBe(20)
    expect(result.current.first).toBe(40)
  })
})