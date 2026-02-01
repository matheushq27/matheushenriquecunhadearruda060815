import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

describe('NotFound', () => {
    it('deve renderizar o componente corretamente', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
    });

    it('deve renderizar o link para voltar', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        
        const link = screen.getByRole('link', { name: /voltar/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/tutors');
    });

    it('deve ter o estilo correto', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        
        const container = screen.getByText('404').parentElement;
        expect(container).toHaveClass('min-h-full', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center');
    });

    it('deve ter o título 404 com o estilo correto', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        
        const title = screen.getByText('404');
        expect(title).toHaveClass('text-6xl', 'font-bold');
    });

    it('deve ter o texto da mensagem com o estilo correto', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        
        const message = screen.getByText('Página não encontrada');
        expect(message).toHaveClass('mt-4', 'text-xl');
    });

    it('deve ter o link com o estilo correto', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        
        const link = screen.getByRole('link', { name: /voltar/i });
        expect(link).toHaveClass('mt-6', 'text-blue-500', 'underline');
    });
});