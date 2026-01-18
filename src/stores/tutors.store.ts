import type { Tutor } from '@/interfaces/entities/tutors'
import type { Pagination } from '@/interfaces/utils/Pagination'
import { create } from 'zustand'

export interface TutorsState {
    tutors: Tutor[]
    pagination: Pagination<Tutor> | null
    isLoading: boolean
    currentTutor: Tutor | null

    setTutors: (tutors: Tutor[], pagination: Pagination<Tutor>) => void
    setCurrentTutor: (tutor: Tutor | null) => void
    setLoading: (loading: boolean) => void
    clearTutors: () => void
}

export const useTutorsStore = create<TutorsState>()((set) => ({
    tutors: [{
        id: 1,
        nome: 'Matheus',
        email: 'matheus@example.com',
        telefone: '1234567890',
        endereco: 'Rua Exemplo, 123',
        cpf: 12345678900,
        foto: {
            id: 1,
            nome: 'foto.jpg',
            contentType: 'image/jpeg',
            url: 'https://primefaces.org/cdn/primereact/images/landing/avatar.png',
        },
    }, {
        id: 2,
        nome: 'João',
        email: 'joao@example.com',
        telefone: '9876543210',
        endereco: 'Avenida Exemplo, 456',
        cpf: 98765432100,
        foto: {
            id: 2,
            nome: 'foto2.jpg',
            contentType: 'image/jpeg',
            url: 'https://primefaces.org/cdn/primereact/images/landing/avatar.png',
        },
    }
    ],
    pagination: null,
    isLoading: false,
    currentTutor: null,

    setTutors: (tutors, pagination) =>
        set({
            tutors,
            pagination,
        }),

    setCurrentTutor: (tutor) =>
        set({
            currentTutor: tutor,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    clearTutors: () =>
        set({
            tutors: [],
            pagination: null,
            currentTutor: null,
            isLoading: false,
        }),
}))