import type { Photo } from "./tutors";

export interface Pet {
    id: number;
    nome: string;
    raca: string;
    idade: number;
    foto: Photo | null;
}

