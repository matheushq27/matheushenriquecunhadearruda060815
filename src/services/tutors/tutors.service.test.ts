import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTutors, createTutor, getTutor, updateTutor, updateTutorPhoto, removeTutorPhoto, deleteTutor, linkingTutorToPet, unlinkingTutorToPet } from './tutors.service';
import api from '../api';

vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api')>()
  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  }
});

describe('tutors.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTutors', () => {
    it('Deve buscar tutores com sucesso', async () => {
      const mockResponse = {
        data: {
          content: [
            { id: 1, nome: 'João Silva', email: 'joao@example.com', cpf: '12345678901' },
            { id: 2, nome: 'Maria Souza', email: 'maria@example.com', cpf: '98765432109' }
          ],
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0
        }
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await getTutors({ name: 'João', page: 0, size: 10 });

      expect(api.get).toHaveBeenCalledWith('v1/tutores', {
        params: {
          nome: 'João',
          page: 0,
          size: 10,
        }
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('Deve usar valores padrão quando size não for fornecido', async () => {
      const mockResponse = { data: { content: [], totalElements: 0 } };
      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      await getTutors({ name: 'João', page: 0 });

      expect(api.get).toHaveBeenCalledWith('v1/tutores', {
        params: {
          nome: 'João',
          page: 0,
          size: 10,
        }
      });
    });
  });

  describe('createTutor', () => {
    it('Deve criar um tutor com sucesso', async () => {
      const mockTutor = {
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
        telefone: '11999999999'
      };

      const mockResponse = {
        data: { id: 1, ...mockTutor }
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await createTutor(mockTutor);

      expect(api.post).toHaveBeenCalledWith('v1/tutores', mockTutor);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getTutor', () => {
    it('Deve buscar um tutor por ID com sucesso', async () => {
      const mockResponse = {
        data: { id: 1, nome: 'João Silva', email: 'joao@example.com', cpf: '12345678901' }
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await getTutor(1);

      expect(api.get).toHaveBeenCalledWith('v1/tutores/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateTutor', () => {
    it('Deve atualizar um tutor com sucesso', async () => {
      const mockTutor = {
        nome: 'João Silva Atualizado',
        email: 'joao.atualizado@example.com',
        cpf: '12345678901',
        telefone: '11888888888'
      };

      const mockResponse = {
        data: { id: 1, ...mockTutor }
      };

      vi.mocked(api.put).mockResolvedValueOnce(mockResponse);

      const result = await updateTutor(1, mockTutor);

      expect(api.put).toHaveBeenCalledWith('v1/tutores/1', mockTutor);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateTutorPhoto', () => {
    it('Deve atualizar a foto do tutor com sucesso', async () => {
      const mockFile = new File(['conteudo'], 'foto.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        data: { id: 1, url: 'https://example.com/foto.jpg' }
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await updateTutorPhoto(1, mockFile);

      expect(api.post).toHaveBeenCalledWith('v1/tutores/1/fotos', expect.any(FormData));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('removeTutorPhoto', () => {
    it('Deve remover a foto do tutor com sucesso', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: null });

      await removeTutorPhoto({ tutorId: 1, photoId: 1 });

      expect(api.delete).toHaveBeenCalledWith('v1/tutores/1/fotos/1');
    });
  });

  describe('deleteTutor', () => {
    it('Deve deletar um tutor com sucesso', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: null });

      await deleteTutor(1);

      expect(api.delete).toHaveBeenCalledWith('v1/tutores/1');
    });
  });

  describe('linkingTutorToPet', () => {
    it('Deve vincular um tutor a um pet com sucesso', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: null });

      await linkingTutorToPet({ tutorId: 1, petId: 1 });

      expect(api.post).toHaveBeenCalledWith('v1/tutores/1/pets/1');
    });
  });

  describe('unlinkingTutorToPet', () => {
    it('Deve desvincular um tutor de um pet com sucesso', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: null });

      await unlinkingTutorToPet({ tutorId: 1, petId: 1 });

      expect(api.delete).toHaveBeenCalledWith('v1/tutores/1/pets/1');
    });
  });
});