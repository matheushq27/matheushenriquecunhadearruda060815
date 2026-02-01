import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getPets, 
  createPet, 
  getPet, 
  updatePet, 
  deletePet, 
  updatePetPhoto, 
  removePetPhoto 
} from './pets.service'
import api from '../api'

vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api')>()
  return {
    ...actual,
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  }
})

describe('pets.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPets', () => {
    it('Deve buscar pets com sucesso', async () => {
      const mockResponse = {
        data: {
          content: [
            { id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 3 },
            { id: 2, nome: 'Luna', raca: 'Persa', idade: 2 }
          ],
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0
        }
      }
      
      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)
      
      const result = await getPets({ name: 'Rex', breed: 'Golden', page: 0, size: 10 })
      
      expect(api.get).toHaveBeenCalledWith('v1/pets', {
        params: { nome: 'Rex', raca: 'Golden', page: 0, size: 10 }
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('Deve usar valores padrão quando size não for fornecido', async () => {
      const mockResponse = {
        data: { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0 }
      }
      
      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)
      
      await getPets({ name: 'Rex', page: 0 })
      
      expect(api.get).toHaveBeenCalledWith('v1/pets', {
        params: { nome: 'Rex', raca: undefined, page: 0, size: 10 }
      })
    })

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Erro na API')
      vi.mocked(api.get).mockRejectedValueOnce(mockError)
      
      await expect(getPets({ page: 0 })).rejects.toThrow('Erro na API')
    })
  })

  describe('createPet', () => {
    it('Deve criar um pet com sucesso', async () => {
      const mockPet = { name: 'Rex', breed: 'Golden Retriever', age: 3 }
      const mockResponse = {
        data: { id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 3 }
      }
      
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)
      
      const result = await createPet(mockPet)
      
      expect(api.post).toHaveBeenCalledWith('v1/pets', {
        nome: 'Rex',
        raca: 'Golden Retriever',
        idade: 3
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Erro ao criar pet')
      vi.mocked(api.post).mockRejectedValueOnce(mockError)
      
      await expect(createPet({ name: 'Rex', breed: 'Golden', age: 3 })).rejects.toThrow('Erro ao criar pet')
    })
  })

  describe('getPet', () => {
    it('Deve buscar um pet por ID com sucesso', async () => {
      const mockResponse = {
        data: { id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 3 }
      }
      
      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)
      
      const result = await getPet(1)
      
      expect(api.get).toHaveBeenCalledWith('v1/pets/1')
      expect(result).toEqual(mockResponse.data)
    })

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Pet não encontrado')
      vi.mocked(api.get).mockRejectedValueOnce(mockError)
      
      await expect(getPet(999)).rejects.toThrow('Pet não encontrado')
    })
  })

  describe('updatePet', () => {
    it('Deve atualizar um pet com sucesso', async () => {
      const mockPet = { name: 'Rex Atualizado', breed: 'Labrador', age: 4 }
      const mockResponse = {
        data: { id: 1, nome: 'Rex Atualizado', raca: 'Labrador', idade: 4 }
      }
      
      vi.mocked(api.put).mockResolvedValueOnce(mockResponse)
      
      const result = await updatePet(1, mockPet)
      
      expect(api.put).toHaveBeenCalledWith('v1/pets/1', {
        nome: 'Rex Atualizado',
        raca: 'Labrador',
        idade: 4
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Erro ao atualizar pet')
      vi.mocked(api.put).mockRejectedValueOnce(mockError)
      
      await expect(updatePet(1, { name: 'Rex', breed: 'Golden', age: 3 })).rejects.toThrow('Erro ao atualizar pet')
    })
  })

  describe('deletePet', () => {
    it('Deve deletar um pet com sucesso', async () => {
      const mockResponse = { data: null }
      
      vi.mocked(api.delete).mockResolvedValueOnce(mockResponse)
      
      const result = await deletePet(1)
      
      expect(api.delete).toHaveBeenCalledWith('v1/pets/1')
      expect(result).toEqual(mockResponse)
    })

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Erro ao deletar pet')
      vi.mocked(api.delete).mockRejectedValueOnce(mockError)
      
      await expect(deletePet(1)).rejects.toThrow('Erro ao deletar pet')
    })
  })

  describe('updatePetPhoto', () => {
    it('Deve atualizar a foto do pet com sucesso', async () => {
      const mockFile = new File(['conteudo'], 'foto.jpg', { type: 'image/jpeg' })
      const mockResponse = {
        data: { id: 1, url: 'https://example.com/foto.jpg', nome: 'foto.jpg' }
      }
      
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)
      
      const result = await updatePetPhoto(1, mockFile)
      
      expect(api.post).toHaveBeenCalledWith('v1/pets/1/fotos', expect.any(FormData))
      expect(result).toEqual(mockResponse.data)
    })

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Erro ao atualizar foto')
      vi.mocked(api.post).mockRejectedValueOnce(mockError)
      
      await expect(updatePetPhoto(1, new File([''], 'test.jpg'))).rejects.toThrow('Erro ao atualizar foto')
    })
  })

  describe('removePetPhoto', () => {
    it('Deve remover a foto do pet com sucesso', async () => {
      const mockResponse = { data: null }
      
      vi.mocked(api.delete).mockResolvedValueOnce(mockResponse)
      
      const result = await removePetPhoto({ petId: 1, photoId: 10 })
      
      expect(api.delete).toHaveBeenCalledWith('v1/pets/1/fotos/10')
      expect(result).toEqual(mockResponse)
    })

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Erro ao remover foto')
      vi.mocked(api.delete).mockRejectedValueOnce(mockError)
      
      await expect(removePetPhoto({ petId: 1, photoId: 10 })).rejects.toThrow('Erro ao remover foto')
    })
  })
})