import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Pets from './Pets';

import { usePets } from '@/hooks/usePets';
import { usePetsStore } from '@/stores/pets.store';
import { useToast } from '@/contexts/ToastContext';
import { useErrorHandler } from '@/hooks/useHandleError';
import { confirmDialog } from 'primereact/confirmdialog';

vi.mock('@/hooks/usePets', () => ({
    usePets: vi.fn()
}));

vi.mock('@/stores/pets.store', () => {
    const mockSetState = vi.fn();
    return {
        usePetsStore: Object.assign(
            vi.fn((selector) => selector({
                pets: [],
                setCurrentPet: vi.fn()
            })),
            { setState: mockSetState }
        )
    };
});

vi.mock('@/contexts/ToastContext', () => ({
    useToast: vi.fn()
}));

vi.mock('@/hooks/useHandleError', () => ({
    useErrorHandler: vi.fn()
}));

vi.mock('@/services/pets/pets.service', () => ({
    deletePet: vi.fn()
}));

vi.mock('primereact/confirmdialog', () => ({
    confirmDialog: vi.fn()
}));


describe('Pets', () => {
    const mockShowSuccess = vi.fn();
    const mockHandleError = vi.fn();
    const mockGetPets = vi.fn();
    const mockSetCurrentPet = vi.fn();
    const mockSetNextPage = vi.fn();
    const mockSetName = vi.fn();
    const mockSetBreed = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useToast as any).mockReturnValue({
            showSuccess: mockShowSuccess
        });

        (useErrorHandler as any).mockReturnValue({
            handleError: mockHandleError
        });

        (usePets as any).mockReturnValue({
            pets: [],
            getPets: mockGetPets,
            name: '',
            setName: mockSetName,
            breed: '',
            setBreed: mockSetBreed,
            loadingPets: false,
            onPageChange: vi.fn(),
            perPageOptions: [10, 20, 30],
            nextPage: 0,
            total: 0,
            setNextPage: mockSetNextPage,
            first: 0,
            size: 10
        });
    });

    it('deve renderizar o título da página', () => {
        render(<Pets />);
        expect(screen.getByText('Pets')).toBeInTheDocument();
    });

    it('deve renderizar botão Filtrar', () => {
        render(<Pets />);
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('deve renderizar botão Adicionar', () => {
        render(<Pets />);
        expect(screen.getByRole('button', { name: /Adicionar/i })).toBeInTheDocument();
    });

    it('deve mostrar loading quando loadingPets é true', () => {
        (usePets as any).mockReturnValue({
            pets: [],
            getPets: mockGetPets,
            name: '',
            setName: mockSetName,
            breed: '',
            setBreed: mockSetBreed,
            loadingPets: true,
            onPageChange: vi.fn(),
            perPageOptions: [10, 20, 30],
            nextPage: 0,
            total: 0,
            setNextPage: mockSetNextPage,
            first: 0,
            size: 10
        });

        render(<Pets />);

        expect(screen.getByRole('loading')).toBeInTheDocument();
    });

    it('deve mostrar mensagem de nenhum registro', () => {
        render(<Pets />);
        expect(
            screen.getByText('Nenhum registro encontrado.')
        ).toBeInTheDocument();
    });

    it('deve renderizar cards quando houver pets', () => {
        const pets = [
            {
                id: 1,
                nome: 'Rex',
                raca: 'Golden Retriever',
                idade: 3,
                foto: { url: 'http://example.com/rex.jpg' }
            },
            {
                id: 2,
                nome: 'Luna',
                raca: 'Persa',
                idade: 2,
                foto: null
            }
        ];

        (usePets as any).mockReturnValue({
            pets,
            getPets: mockGetPets,
            name: '',
            setName: mockSetName,
            breed: '',
            setBreed: mockSetBreed,
            loadingPets: false,
            onPageChange: vi.fn(),
            perPageOptions: [10, 20, 30],
            nextPage: 0,
            total: 2,
            setNextPage: mockSetNextPage,
            first: 0,
            size: 10
        });

        (usePetsStore as any).mockReturnValue({
            pets,
            setCurrentPet: mockSetCurrentPet
        });

        render(<Pets />);

        expect(screen.getByText('Rex')).toBeInTheDocument();
        expect(screen.getByText('Raça: Golden Retriever')).toBeInTheDocument();
        expect(screen.getByText('Idade: 3 ano(s)')).toBeInTheDocument();

        expect(screen.getByText('Luna')).toBeInTheDocument();
    });

    it('deve setar pet atual ao clicar em editar', async () => {
        const pets = [
            {
                id: 1,
                nome: 'Rex',
                raca: 'Golden Retriever',
                idade: 3,
                foto: null
            }
        ];

        (usePets as any).mockReturnValue({
            pets,
            getPets: mockGetPets,
            name: '',
            setName: mockSetName,
            breed: '',
            setBreed: mockSetBreed,
            loadingPets: false,
            onPageChange: vi.fn(),
            perPageOptions: [10, 20, 30],
            nextPage: 0,
            total: 1,
            setNextPage: mockSetNextPage,
            first: 0,
            size: 10
        });

        (usePetsStore as any).mockReturnValue({
            pets,
            setCurrentPet: mockSetCurrentPet
        });

        render(<Pets />);

        fireEvent.click(screen.getByRole('button', { name: /editar/i }));

        await waitFor(() => {
            expect(mockSetCurrentPet).toHaveBeenCalledWith(pets[0]);
        });
    });

    it('deve abrir confirmDialog ao clicar em excluir', async () => {
        const pets = [
            {
                id: 1,
                nome: 'Rex',
                raca: 'Golden Retriever',
                idade: 3,
                foto: null
            }
        ];

        (usePets as any).mockReturnValue({
            pets,
            getPets: mockGetPets,
            name: '',
            setName: mockSetName,
            breed: '',
            setBreed: mockSetBreed,
            loadingPets: false,
            onPageChange: vi.fn(),
            perPageOptions: [10, 20, 30],
            nextPage: 0,
            total: 1,
            setNextPage: mockSetNextPage,
            first: 0,
            size: 10
        });

        (usePetsStore as any).mockReturnValue({
            pets,
            setCurrentPet: mockSetCurrentPet
        });

        render(<Pets />);

        fireEvent.click(screen.getByRole('button', { name: /excluir/i }));

        await waitFor(() => {
            expect(confirmDialog).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Tem certeza que deseja excluir Rex?',
                    header: 'Zona de perigo',
                    icon: 'pi pi-exclamation-triangle'
                })
            );
        });
    });

    it('deve chamar setNextPage ao filtrar', async () => {
        render(<Pets />);

        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        expect(mockGetPets).toHaveBeenCalled();
    });
});
