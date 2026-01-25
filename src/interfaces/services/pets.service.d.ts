import type { Pet } from "../entities/pets";

export interface PetsRequest {
    name: string;
    breed: string;
    page: number
    size?: number
}

export interface PetsResponse extends Pagination<Pet> {}
