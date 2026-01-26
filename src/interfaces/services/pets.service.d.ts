import type { Pet } from "../entities/pets";
import type { Pagination } from "../utils/Pagination";

export interface PetsRequest {
    name: string;
    breed: string;
    page: number
    size?: number
}

export interface CreatePetProps {
    name: string
    breed: string
    age: number
}

export interface CreatePetResponse extends Pet {}

export interface PetsResponse extends Pagination<Pet> {}

