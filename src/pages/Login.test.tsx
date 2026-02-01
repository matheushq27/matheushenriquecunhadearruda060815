import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import * as authenticateService from '@/services/authenticate/authenticate.service';
import { useAuthStore } from '@/stores/auth.store';

vi.mock('@/services/authenticate/authenticate.service');
vi.mock('@/stores/auth.store', () => ({
    useAuthStore: vi.fn((selector) => {
        if (selector && typeof selector === 'function') {
            const state = { setUser: vi.fn() };
            return selector(state);
        }
        return { setUser: vi.fn() };
    })
}));
const mockHandleError = vi.fn();
vi.mock('@/hooks/useHandleError', () => ({
    useErrorHandler: () => ({
        handleError: mockHandleError,
    }),
}));

describe('Login', () => {
    const mockSetUser = vi.fn();
    const mockAuthenticate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockImplementation((selector: any) => {
            if (selector && typeof selector === 'function') {
                const state = { setUser: mockSetUser };
                return selector(state);
            }
            return { setUser: mockSetUser };
        });
        (authenticateService.authenticate as any) = mockAuthenticate;
    });

    it('deve renderizar o formulário de login', () => {
        render(<Login />);
        
        expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
        expect(screen.getByLabelText('Senha')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('deve atualizar os campos ao digitar', () => {
        render(<Login />);
        
        const usernameInput = screen.getByLabelText('Usuário') as HTMLInputElement;
        const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
        
        fireEvent.change(usernameInput, { target: { value: 'novoUsuario' } });
        fireEvent.change(passwordInput, { target: { value: 'novaSenha123' } });
        
        expect(usernameInput.value).toBe('novoUsuario');
        expect(passwordInput.value).toBe('novaSenha123');
    });

    it('deve chamar authenticate ao clicar no botão entrar', async () => {
        mockAuthenticate.mockResolvedValue({
            username: 'admin',
            access_token: 'token123',
            refresh_token: 'refresh123',
            expire_in: 3600,
            refresh_expire_in: 7200,
        });

        render(<Login />);
        
        const button = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(mockAuthenticate).toHaveBeenCalledWith({
                username: 'admin',
                password: 'admin',
            });
        });
    });

    it('deve definir o usuário no store após autenticação bem-sucedida', async () => {
        const mockResponse = {
            username: 'admin',
            access_token: 'token123',
            refresh_token: 'refresh123',
            expire_in: 3600,
            refresh_expire_in: 7200,
        };
        mockAuthenticate.mockResolvedValue(mockResponse);

        render(<Login />);
        
        const button = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(mockSetUser).toHaveBeenCalledWith({
                username: mockResponse.username,
                accessToken: mockResponse.access_token,
                refreshToken: mockResponse.refresh_token,
                expireIn: mockResponse.expire_in,
                refreshExpireIn: mockResponse.refresh_expire_in,
            });
        });
    });

    it('deve mostrar loading durante autenticação', async () => {
        mockAuthenticate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        render(<Login />);
        
        const button = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(button);
        
        expect(button).toHaveClass('p-disabled');
        
        await waitFor(() => {
            expect(button).not.toHaveClass('p-disabled');
        });
    });

    it('deve tratar erro de autenticação', async () => {
        const error = new Error('Credenciais inválidas');
        mockAuthenticate.mockRejectedValue(error);

        render(<Login />);
        
        const button = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(mockHandleError).toHaveBeenCalledWith(error);
        });
    });
});