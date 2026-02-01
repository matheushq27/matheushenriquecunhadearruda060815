import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePets } from './usePets'
import * as petsService from '@/services/pets/pets.service'
import type { Pet } from '@/interfaces/entities/pets'

vi.mock('@/services/pets/pets.service', () => ({
  getPets: vi.fn()
}))

describe('usePets', () => {
  const mockPets: Pet[] = [
    {
      id: 1,
      nome: 'Rex',
      raca: 'Golden Retriever',
      idade: 5,
      foto: null
    },
    {
      id: 2,
      nome: 'Luna',
      raca: 'Persa',
      idade: 3,
      foto: null
    }
  ]

  const mockPaginationResponse = {
    content: mockPets,
    page: 0,
    size: 10,
    total: 2,
    pageCount: 1
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => usePets())

    expect(result.current.pets).toEqual([])
    expect(result.current.loadingPets).toBe(true)
    expect(result.current.name).toBe('')
    expect(result.current.breed).toBe('')
    expect(result.current.size).toBe(10)
    expect(result.current.nextPage).toBe(0)
  })

  it('deve buscar pets com sucesso', async () => {
    vi.mocked(petsService.getPets).mockResolvedValue(mockPaginationResponse)

    const { result } = renderHook(() => usePets())

    await act(async () => {
      await result.current.getPets()
    })

    expect(result.current.pets).toEqual(mockPets)
    expect(result.current.loadingPets).toBe(false)
    expect(petsService.getPets).toHaveBeenCalledWith({
      name: '',
      breed: '',
      page: 0,
      size: 10
    })
  })

  it('deve buscar pets com filtros', async () => {
    vi.mocked(petsService.getPets).mockResolvedValue(mockPaginationResponse)

    const { result } = renderHook(() => usePets())

    act(() => {
      result.current.setName('Rex')
      result.current.setBreed('Golden')
    })

    await act(async () => {
      await result.current.getPets()
    })

    expect(petsService.getPets).toHaveBeenCalledWith({
      name: 'Rex',
      breed: 'Golden',
      page: 0,
      size: 10
    })
  })

  it('deve definir array vazio quando houver erro', async () => {
    vi.mocked(petsService.getPets).mockRejectedValue(new Error('Erro'))

    const { result } = renderHook(() => usePets())

    await act(async () => {
      await result.current.getPets()
    })

    expect(result.current.pets).toEqual([])
    expect(result.current.loadingPets).toBe(false)
  })

  it('deve atualizar paginação corretamente', async () => {
    vi.mocked(petsService.getPets).mockResolvedValue(mockPaginationResponse)

    const { result } = renderHook(() => usePets())

    await act(async () => {
      await result.current.getPets()
    })

    expect(result.current.total).toBe(2)
    expect(result.current.nextPage).toBe(0)
  })

  it('deve mudar tamanho da página', () => {
    const { result } = renderHook(() => usePets())

    act(() => {
      result.current.setSize(20)
    })

    expect(result.current.size).toBe(20)
  })

  it('deve mudar próxima página', () => {
    const { result } = renderHook(() => usePets())

    act(() => {
      result.current.setNextPage(2)
    })

    expect(result.current.nextPage).toBe(2)
  })

  it('deve definir estado de loading', () => {
    const { result } = renderHook(() => usePets())

    act(() => {
      result.current.setLoadingPets(false)
    })

    expect(result.current.loadingPets).toBe(false)
  })

  it('deve retornar opções de por página', () => {
    const { result } = renderHook(() => usePets())

    expect(result.current.perPageOptions).toEqual([10, 20, 30])
  })

  it('deve calcular first corretamente', () => {
    const { result } = renderHook(() => usePets())

    expect(result.current.first).toBe(0)
  })
})