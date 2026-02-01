import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tutors from './Tutors';

import * as tutorsService from '@/services/tutors/tutors.service';
import { useTutorsStore } from '@/stores/tutors.store';
import { useToast } from '@/contexts/ToastContext';
import { useErrorHandler } from '@/hooks/useHandleError';


vi.mock('@/services/tutors/tutors.service', () => ({
    getTutors: vi.fn(),
    deleteTutor: vi.fn()
}));

vi.mock('@/stores/tutors.store', () => {
    const storeState = {
        tutors: [],
        setCurrentTutor: vi.fn()
    };

    const useTutorsStore = Object.assign(
        (selector: (state: typeof storeState) => any) => selector(storeState),
        {
            setState: (partial: Partial<typeof storeState>) => {
                Object.assign(storeState, partial);
            }
        }
    );

    return { useTutorsStore };
});

vi.mock('@/contexts/ToastContext', () => ({
    useToast: vi.fn()
}));

vi.mock('@/hooks/useHandleError', () => ({
    useErrorHandler: vi.fn()
}));

vi.mock('primereact/confirmdialog', () => ({
    confirmDialog: vi.fn()
}));


const mockTutorsResponse = {
    content: [
        {
            id: 1,
            nome: 'João Silva',
            email: 'joao@email.com',
            cpf: '12345678900',
            endereco: 'Rua A',
            telefone: '11999999999',
            foto: null
        },
        {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@email.com',
            cpf: '98765432100',
            endereco: 'Rua B',
            telefone: '11888888888',
            foto: null
        }
    ],
    page: 0,
    size: 10,
    total: 2,
    pageCount: 1
};

describe('Tutors', () => {
    const mockShowSuccess = vi.fn();
    const mockHandleError = vi.fn();
    const mockSetCurrentTutor = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useToast as any).mockReturnValue({
            showSuccess: mockShowSuccess
        });

        (useErrorHandler as any).mockReturnValue({
            handleError: mockHandleError
        });

        (useTutorsStore as any).setState({
            tutors: mockTutorsResponse.content,
            setCurrentTutor: mockSetCurrentTutor
        });

        (tutorsService.getTutors as any).mockResolvedValue(mockTutorsResponse);
    });


    it('deve renderizar o título da página', () => {
        render(<Tutors />);
        expect(screen.getByText('Tutores')).toBeInTheDocument();
    });

    it('deve buscar e exibir lista de tutores', async () => {
        render(<Tutors />);

        expect(await screen.findByText(/João Silva/i)).toBeInTheDocument();
        expect(await screen.findByText(/joao@email\.com/i)).toBeInTheDocument();

        expect(await screen.findByText(/Maria Santos/i)).toBeInTheDocument();
        expect(await screen.findByText(/maria@email\.com/i)).toBeInTheDocument();
    });

    it('deve exibir NoRecordsFound quando não houver tutores', async () => {
        (tutorsService.getTutors as any).mockResolvedValueOnce({
            ...mockTutorsResponse,
            content: [],
            total: 0
        });

        render(<Tutors />);

        expect(
            await screen.findByText(/nenhum registro encontrado/i)
        ).toBeInTheDocument();
    });

    it('deve chamar getTutors ao clicar em Filtrar', async () => {
        render(<Tutors />);

        fireEvent.click(
            await screen.findByRole('button', { name: /filtrar/i })
        );

        expect(tutorsService.getTutors).toHaveBeenCalled();
    });

    it('deve setar tutor atual ao clicar em editar', async () => {
        render(<Tutors />);

        const editButtons = await screen.findAllByLabelText(/editar/i);
        fireEvent.click(editButtons[0]);

        expect(mockSetCurrentTutor).toHaveBeenCalledWith(
            expect.objectContaining({
                nome: 'João Silva'
            })
        );
    });
});
