import { describe, it, expect, beforeEach } from 'vitest'
import { usePetsStore } from './pets.store'
import type { Pet } from '@/interfaces/entities/pets'
import type { Photo } from '@/interfaces/entities/tutors'
import type { Pagination } from '@/interfaces/utils/Pagination'

describe('pets.store', () => {
  beforeEach(() => {
    usePetsStore.setState({
      pets: [],
      pagination: null,
      isLoading: false,
      currentPet: null,
    })
  })

  describe('Estado inicial', () => {
    it('Deve ter estado inicial correto', () => {
      const state = usePetsStore.getState()
      expect(state.pets).toEqual([])
      expect(state.pagination).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.currentPet).toBeNull()
    })
  })

  describe('setPets', () => {
    it('Deve definir pets e paginação', () => {
      const mockPets: Pet[] = [
        {
          id: 1,
          nome: 'Rex',
          raca: 'Golden Retriever',
          idade: 3,
          foto: null,
        },
        {
          id: 2,
          nome: 'Mimi',
          raca: 'Persa',
          idade: 2,
          foto: null,
        },
      ]

      const mockPagination: Pagination<Pet> = {
        content: mockPets,
        page: 0,
        size: 10,
        total: 2,
        pageCount: 1,
      }

      usePetsStore.getState().setPets(mockPets, mockPagination)

      const state = usePetsStore.getState()
      expect(state.pets).toEqual(mockPets)
      expect(state.pagination).toEqual(mockPagination)
    })
  })

  describe('setCurrentPet', () => {
    it('Deve definir pet atual', () => {
      const mockPet: Pet = {
        id: 1,
        nome: 'Rex',
        raca: 'Golden Retriever',
        idade: 3,
        foto: null,
      }

      usePetsStore.getState().setCurrentPet(mockPet)

      const state = usePetsStore.getState()
      expect(state.currentPet).toEqual(mockPet)
    })

    it('Deve limpar pet atual quando passado null', () => {
      usePetsStore.getState().setCurrentPet(null)

      const state = usePetsStore.getState()
      expect(state.currentPet).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('Deve definir estado de carregamento como true', () => {
      usePetsStore.getState().setLoading(true)

      const state = usePetsStore.getState()
      expect(state.isLoading).toBe(true)
    })

    it('Deve definir estado de carregamento como false', () => {
      usePetsStore.getState().setLoading(true)
      usePetsStore.getState().setLoading(false)

      const state = usePetsStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('clearPets', () => {
    it('Deve limpar todos os dados dos pets', () => {
      const mockPets: Pet[] = [
        {
          id: 1,
          nome: 'Rex',
          raca: 'Golden Retriever',
          idade: 3,
          foto: null,
        },
      ]

      const mockPagination: Pagination<Pet> = {
        content: mockPets,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      usePetsStore.getState().setPets(mockPets, mockPagination)
      usePetsStore.getState().setCurrentPet(mockPets[0])
      usePetsStore.getState().setLoading(true)

      usePetsStore.getState().clearPets()

      const state = usePetsStore.getState()
      expect(state.pets).toEqual([])
      expect(state.pagination).toBeNull()
      expect(state.currentPet).toBeNull()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('removePet', () => {
    it('Deve remover pet da lista', () => {
      const mockPets: Pet[] = [
        {
          id: 1,
          nome: 'Rex',
          raca: 'Golden Retriever',
          idade: 3,
          foto: null,
        },
        {
          id: 2,
          nome: 'Mimi',
          raca: 'Persa',
          idade: 2,
          foto: null,
        },
      ]

      const mockPagination: Pagination<Pet> = {
        content: mockPets,
        page: 0,
        size: 10,
        total: 2,
        pageCount: 1,
      }

      usePetsStore.getState().setPets(mockPets, mockPagination)
      usePetsStore.getState().removePet(1)

      const state = usePetsStore.getState()
      expect(state.pets).toHaveLength(1)
      expect(state.pets[0].id).toBe(2)

      expect(state.pagination?.total).toBe(2)
      expect(state.pagination?.pageCount).toBe(1)
    })

    it('Não deve alterar lista se pet não existir', () => {
      const mockPets: Pet[] = [
        {
          id: 1,
          nome: 'Rex',
          raca: 'Golden Retriever',
          idade: 3,
          foto: null,
        },
      ]

      const mockPagination: Pagination<Pet> = {
        content: mockPets,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      usePetsStore.getState().setPets(mockPets, mockPagination)
      usePetsStore.getState().removePet(999)

      const state = usePetsStore.getState()
      expect(state.pets).toHaveLength(1)
      // A paginação não é atualizada automaticamente ao remover um pet
      expect(state.pagination?.total).toBe(1)
    })
  })

  describe('updatePetPhoto', () => {
    it('Deve atualizar foto do pet', () => {
      const mockPets: Pet[] = [
        {
          id: 1,
          nome: 'Rex',
          raca: 'Golden Retriever',
          idade: 3,
          foto: null,
        },
        {
          id: 2,
          nome: 'Mimi',
          raca: 'Persa',
          idade: 2,
          foto: null,
        },
      ]

      const mockPagination: Pagination<Pet> = {
        content: mockPets,
        page: 0,
        size: 10,
        total: 2,
        pageCount: 1,
      }

      const mockPhoto: Photo = {
        id: 1,
        nome: 'foto.jpg',
        contentType: 'image/jpeg',
        url: 'base64string',
      }

      usePetsStore.getState().setPets(mockPets, mockPagination)
      usePetsStore.getState().updatePetPhoto(1, mockPhoto)

      const state = usePetsStore.getState()
      const updatedPet = state.pets.find(pet => pet.id === 1)
      expect(updatedPet?.foto).toEqual(mockPhoto)
    })

    it('Deve remover foto do pet quando passado null', () => {
      const mockPets: Pet[] = [
        {
          id: 1,
          nome: 'Rex',
          raca: 'Golden Retriever',
          idade: 3,
          foto: {
            id: 1,
            nome: 'foto.jpg',
            contentType: 'image/jpeg',
            url: 'base64string',
          },
        },
      ]

      const mockPagination: Pagination<Pet> = {
        content: mockPets,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      usePetsStore.getState().setPets(mockPets, mockPagination)
      usePetsStore.getState().updatePetPhoto(1, null)

      const state = usePetsStore.getState()
      const updatedPet = state.pets.find(pet => pet.id === 1)
      expect(updatedPet?.foto).toBeNull()
    })

    it('Não deve alterar lista se pet não existir', () => {
      const mockPets: Pet[] = [
        {
          id: 1,
          nome: 'Rex',
          raca: 'Golden Retriever',
          idade: 3,
          foto: null,
        },
      ]

      const mockPagination: Pagination<Pet> = {
        content: mockPets,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      usePetsStore.getState().setPets(mockPets, mockPagination)
      usePetsStore.getState().updatePetPhoto(999, null)

      const state = usePetsStore.getState()
      expect(state.pets).toHaveLength(1)
      expect(state.pets[0].foto).toBeNull()
    })
  })
})