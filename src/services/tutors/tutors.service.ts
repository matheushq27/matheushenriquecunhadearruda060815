import type { CreateTutorProps, CreateTutorResponse, TutorsRequest, TutorsResponse } from "@/interfaces/services/tutors.service";
import api, { VERSION_API } from "../api";

const URL_TUTORS = `${VERSION_API}/tutores`

export async function getTutors({ name, page, size = 10 }: TutorsRequest) {
    const response = await api.get(URL_TUTORS, {
        params: {
            nome: name,
            page,
            size,
        }
    });
    return response.data as TutorsResponse;
}

export async function createTutor(tutor: CreateTutorProps) {
    const response = await api.post(URL_TUTORS, tutor);
    return response.data as CreateTutorResponse;
}