import type { CreateTutorProps, CreateTutorResponse, TutorsRequest, TutorsResponse } from "@/interfaces/services/tutors.service";
import api, { VERSION_API } from "../api";
import type { Photo, Tutor } from "@/interfaces/entities/tutors";

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

export async function getTutor(id: number) {
    const response = await api.get(`${URL_TUTORS}/${id}`);
    return response.data as Tutor;
}

export async function updateTutor(id: number, tutor: CreateTutorProps) {
    const response = await api.put(`${URL_TUTORS}/${id}`, tutor);
    return response.data as Tutor;
}

export async function updateTutorPhoto(id: number, photo: File) {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('foto', photo);
    const { data } =  await api.post(`${URL_TUTORS}/${id}/fotos`, formData);
    return data as Photo;
}

export async function removeTutorPhoto({ photoId, tutorId }: { tutorId: number, photoId: number }) {
    return await api.delete(`${URL_TUTORS}/${tutorId}/fotos/${photoId}`);
}

export async function deleteTutor(id: number) {
    return await api.delete(`${URL_TUTORS}/${id}`);
}

export async function linkingTutorToPet({ tutorId, petId }: { tutorId: number, petId: number }) {
    return await api.post(`${URL_TUTORS}/${tutorId}/pets/${petId}`);
}
