import type { Pet } from "../entities/pets";
import type { Pagination } from "../utils/Pagination";

export interface PetsRequest {
    name: string;
    breed: string;
    page: number
    size?: number
}

export interface CreatePetProps {
    nome: string
    raca: string
    idade: number
}

export interface PetsResponse extends Pagination<Pet> {}

