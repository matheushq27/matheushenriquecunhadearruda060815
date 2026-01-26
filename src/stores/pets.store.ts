import type { Pet } from '@/interfaces/entities/pets'
import type { Photo } from '@/interfaces/entities/tutors'
import type { Pagination } from '@/interfaces/utils/Pagination'
import { create } from 'zustand'

export interface PetsState {
    pets: Pet[]
    pagination: Pagination<Pet> | null
    isLoading: boolean
    currentPet: Pet | null

    setPets: (pets: Pet[], pagination: Pagination<Pet>) => void
    setCurrentPet: (pet: Pet | null) => void
    setLoading: (loading: boolean) => void
    clearPets: () => void
    removePet: (petId: number) => void
    updatePetPhoto: (petId: number, foto: Photo | null) => void
}

export const usePetsStore = create<PetsState>()((set) => ({
    pets: [],
    pagination: null,
    isLoading: false,
    currentPet: null,

    setPets: (pets, pagination) =>
        set({
            pets,
            pagination,
        }),

    setCurrentPet: (pet) =>
        set({
            currentPet: pet,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    clearPets: () =>
        set({
            pets: [],
            pagination: null,
            currentPet: null,
            isLoading: false,
        }),

    removePet: (petId) =>
        set((state) => ({
            pets: state.pets.filter(pet => pet.id !== petId),
            currentPet: state.currentPet?.id === petId ? null : state.currentPet,
        })),

    updatePetPhoto: (petId, foto) =>
        set((state) => ({
            pets: state.pets.map(pet =>
                pet.id === petId ? { ...pet, foto } : pet
            ),
            currentPet: state.currentPet?.id === petId 
                ? { ...state.currentPet, foto } 
                : state.currentPet,
        })),
}))