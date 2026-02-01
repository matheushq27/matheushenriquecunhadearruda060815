import { describe, it, expect, beforeEach } from 'vitest'
import { useTutorsStore } from './tutors.store'
import type { Tutor } from '@/interfaces/entities/tutors'
import type { Pagination } from '@/interfaces/utils/Pagination'

describe('tutors.store', () => {
  beforeEach(() => {
    useTutorsStore.setState({
      tutors: [],
      pagination: null,
      isLoading: false,
      currentTutor: null,
    })
  })

  describe('Estado inicial', () => {
    it('Deve ter estado inicial correto', () => {
      const state = useTutorsStore.getState()
      expect(state.tutors).toEqual([])
      expect(state.pagination).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.currentTutor).toBeNull()
    })
  })

  describe('setTutors', () => {
    it('Deve definir tutores e paginação', () => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpf: 12345678901,
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua Teste, 123',
          foto: null,
        },
        {
          id: 2,
          nome: 'Maria Santos',
          cpf: 98765432109,
          email: 'maria@example.com',
          telefone: '11987654322',
          endereco: 'Rua Exemplo, 456',
          foto: null,
        },
      ]

      const mockPagination: Pagination<Tutor> = {
        content: mockTutors,
        page: 0,
        size: 10,
        total: 2,
        pageCount: 1,
      }

      useTutorsStore.getState().setTutors(mockTutors, mockPagination)

      const state = useTutorsStore.getState()
      expect(state.tutors).toEqual(mockTutors)
      expect(state.pagination).toEqual(mockPagination)
    })
  })

  describe('setCurrentTutor', () => {
    it('Deve definir tutor atual', () => {
      const mockTutor: Tutor = {
        id: 1,
        nome: 'João Silva',
        cpf: 12345678901,
        email: 'joao@example.com',
        telefone: '11987654321',
        endereco: 'Rua Teste, 123',
        foto: null,
      }

      useTutorsStore.getState().setCurrentTutor(mockTutor)

      const state = useTutorsStore.getState()
      expect(state.currentTutor).toEqual(mockTutor)
    })

    it('Deve limpar tutor atual quando passado null', () => {
      useTutorsStore.getState().setCurrentTutor(null)

      const state = useTutorsStore.getState()
      expect(state.currentTutor).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('Deve definir estado de carregamento como true', () => {
      useTutorsStore.getState().setLoading(true)

      const state = useTutorsStore.getState()
      expect(state.isLoading).toBe(true)
    })

    it('Deve definir estado de carregamento como false', () => {
      useTutorsStore.getState().setLoading(true)
      useTutorsStore.getState().setLoading(false)

      const state = useTutorsStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('clearTutors', () => {
    it('Deve limpar todos os dados dos tutores', () => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpf: 12345678901,
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua Teste, 123',
          foto: null,
        },
      ]

      const mockPagination: Pagination<Tutor> = {
        content: mockTutors,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      const mockTutor: Tutor = {
        id: 1,
        nome: 'João Silva',
        cpf: 12345678901,
        email: 'joao@example.com',
        telefone: '11987654321',
        endereco: 'Rua Teste, 123',
        foto: null,
      }

      useTutorsStore.getState().setTutors(mockTutors, mockPagination)
      useTutorsStore.getState().setCurrentTutor(mockTutor)
      useTutorsStore.getState().setLoading(true)

      useTutorsStore.getState().clearTutors()

      const state = useTutorsStore.getState()
      expect(state.tutors).toEqual([])
      expect(state.pagination).toBeNull()
      expect(state.currentTutor).toBeNull()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('removeTutor', () => {
    it('Deve remover tutor da lista', () => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpf: 12345678901,
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua Teste, 123',
          foto: null,
        },
        {
          id: 2,
          nome: 'Maria Santos',
          cpf: 98765432109,
          email: 'maria@example.com',
          telefone: '11987654322',
          endereco: 'Rua Exemplo, 456',
          foto: null,
        },
      ]

      const mockPagination: Pagination<Tutor> = {
        content: mockTutors,
        page: 0,
        size: 10,
        total: 2,
        pageCount: 1,
      }

      useTutorsStore.getState().setTutors(mockTutors, mockPagination)
      useTutorsStore.getState().removeTutor(1)

      const state = useTutorsStore.getState()
      expect(state.tutors).toHaveLength(1)
      expect(state.tutors[0].id).toBe(2)
      // A paginação não é atualizada automaticamente ao remover um tutor
      expect(state.pagination?.total).toBe(2)
      expect(state.pagination?.pageCount).toBe(1)
    })

    it('Não deve alterar lista se tutor não existir', () => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpf: 12345678901,
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua Teste, 123',
          foto: null,
        },
      ]

      const mockPagination: Pagination<Tutor> = {
        content: mockTutors,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      useTutorsStore.getState().setTutors(mockTutors, mockPagination)
      useTutorsStore.getState().removeTutor(999)

      const state = useTutorsStore.getState()
      expect(state.tutors).toHaveLength(1)
      // A paginação não é atualizada automaticamente ao remover um tutor
      expect(state.pagination?.total).toBe(1)
    })
  })

  describe('updateTutorPhoto', () => {
    it('Deve atualizar foto do tutor', () => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpf: 12345678901,
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua Teste, 123',
          foto: null,
        },
        {
          id: 2,
          nome: 'Maria Santos',
          cpf: 98765432109,
          email: 'maria@example.com',
          telefone: '11987654322',
          endereco: 'Rua Exemplo, 456',
          foto: null,
        },
      ]

      const mockPagination: Pagination<Tutor> = {
        content: mockTutors,
        page: 0,
        size: 10,
        total: 2,
        pageCount: 1,
      }

      const mockPhoto = {
        id: 1,
        nome: 'foto.jpg',
        contentType: 'image/jpeg',
        url: 'base64string',
      }

      useTutorsStore.getState().setTutors(mockTutors, mockPagination)
      useTutorsStore.getState().updateTutorPhoto(1, mockPhoto)

      const state = useTutorsStore.getState()
      const updatedTutor = state.tutors.find(tutor => tutor.id === 1)
      expect(updatedTutor?.foto).toEqual(mockPhoto)
    })

    it('Deve remover foto do tutor quando passado null', () => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpf: 12345678901,
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua Teste, 123',
          foto: {
            id: 1,
            nome: 'foto.jpg',
            contentType: 'image/jpeg',
            url: 'base64string',
          },
        },
      ]

      const mockPagination: Pagination<Tutor> = {
        content: mockTutors,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      useTutorsStore.getState().setTutors(mockTutors, mockPagination)
      useTutorsStore.getState().updateTutorPhoto(1, null)

      const state = useTutorsStore.getState()
      const updatedTutor = state.tutors.find(tutor => tutor.id === 1)
      expect(updatedTutor?.foto).toBeNull()
    })

    it('Não deve alterar lista se tutor não existir', () => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpf: 12345678901,
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua Teste, 123',
          foto: null,
        },
      ]

      const mockPagination: Pagination<Tutor> = {
        content: mockTutors,
        page: 0,
        size: 10,
        total: 1,
        pageCount: 1,
      }

      useTutorsStore.getState().setTutors(mockTutors, mockPagination)
      useTutorsStore.getState().updateTutorPhoto(999, null)

      const state = useTutorsStore.getState()
      expect(state.tutors).toHaveLength(1)
      expect(state.tutors[0].foto).toBeNull()
    })
  })
})