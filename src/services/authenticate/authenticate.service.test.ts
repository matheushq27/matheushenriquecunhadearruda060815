import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticate } from './authenticate.service';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authenticate.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticate', () => {
    it('Deve fazer login com sucesso', async () => {
      const mockResponse = {
        data: {
          username: 'testuser',
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expire_in: 3600,
          refresh_expire_in: 7200,
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await authenticate({
        username: 'testuser',
        password: 'testpassword',
      });

      expect(api.post).toHaveBeenCalledWith('/autenticacao/login', {
        username: 'testuser',
        password: 'testpassword',
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('Deve lançar erro quando a API falhar', async () => {
      const mockError = new Error('Credenciais inválidas');
      vi.mocked(api.post).mockRejectedValueOnce(mockError);

      await expect(
        authenticate({
          username: 'invaliduser',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Credenciais inválidas');

      expect(api.post).toHaveBeenCalledWith('/autenticacao/login', {
        username: 'invaliduser',
        password: 'wrongpassword',
      });
    });

    it('Deve lançar erro quando username estiver vazio', async () => {
      await expect(
        authenticate({
          username: '',
          password: 'password',
        })
      ).rejects.toThrow();
    });

    it('Deve lançar erro quando password estiver vazio', async () => {
      await expect(
        authenticate({
          username: 'user',
          password: '',
        })
      ).rejects.toThrow();
    });
  });
});