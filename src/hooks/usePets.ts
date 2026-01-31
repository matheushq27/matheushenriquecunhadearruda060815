import * as petsService from "@/services/pets/pets.service";
import { useState } from "react";
import { usePagination } from "./usePagination";
import type { Pet } from "@/interfaces/entities/pets";

export const usePets = () => {

    const { onPageChange, perPageOptions, setPagination, nextPage, total, setNextPage, first, size, setSize } = usePagination()
    const [loadingPets, setLoadingPets] = useState(true);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [pets, setPets] = useState<Pet[]>([]);

    const getPets = async () => {
        setLoadingPets(true);
        try {
            const response = await petsService.getPets({
                name: name,
                breed: breed,
                page: nextPage,
                size: size,
            });

            setPets(response.content);

            setPagination({
                page: response.page,
                size: response.size,
                total: response.total,
                pageCount: response.pageCount,
            })
        } catch (error) {
            setPets([]);
        } finally {
            setLoadingPets(false);
        }
    }

    return {
        pets,
        setName,
        setBreed,
        loadingPets,
        getPets,
        name,
        breed,
        onPageChange, perPageOptions,
        total, setNextPage, first, nextPage, size,
        setLoadingPets,
        setSize
    }
}