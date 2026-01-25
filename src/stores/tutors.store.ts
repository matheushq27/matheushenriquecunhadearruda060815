import type { Tutor, Photo } from '@/interfaces/entities/tutors'
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
    removeTutor: (tutorId: number) => void
    updateTutorPhoto: (tutorId: number, foto: Photo | null) => void
}

export const useTutorsStore = create<TutorsState>()((set) => ({
    tutors: [],
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

    removeTutor: (tutorId) =>
        set((state) => ({
            tutors: state.tutors.filter(tutor => tutor.id !== tutorId),
            currentTutor: state.currentTutor?.id === tutorId ? null : state.currentTutor,
        })),

    updateTutorPhoto: (tutorId, foto) =>
        set((state) => ({
            tutors: state.tutors.map(tutor =>
                tutor.id === tutorId ? { ...tutor, foto } : tutor
            ),
        })),
}))