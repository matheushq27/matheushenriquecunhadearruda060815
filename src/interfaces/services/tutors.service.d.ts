import type { Tutor } from "../entities/tutors";
import type { Pagination } from "../utils/Pagination";

export interface TutorsRequest {
    name: string;
    page: number
    size?: number
}

export interface TutorsResponse extends Pagination<Tutor> {}

export interface CreateTutorProps extends Omit<Tutor, "id" | "pets" | "foto"> {}


