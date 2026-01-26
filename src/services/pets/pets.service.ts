import type { Pet } from "@/interfaces/entities/pets";
import api, { VERSION_API } from "../api";
import type { PetsRequest, PetsResponse, CreatePetProps, CreatePetResponse } from "@/interfaces/services/pets.service";
import type { Photo } from "@/interfaces/entities/tutors";

const URL_PETS = `${VERSION_API}/pets`

export async function getPets({ name, breed, page, size = 10 }: PetsRequest) {
    const response = await api.get(URL_PETS, {
        params: {
            nome: name,
            raca: breed,
            page,
            size,
        }
    });
    return response.data as PetsResponse;
}

export async function createPet(pet: CreatePetProps) {
    const response = await api.post(URL_PETS, {
        nome: pet.name,
        raca: pet.breed,
        idade: pet.age,
    });
    return response.data as CreatePetResponse;
}

export async function getPet(id: number) {
    const response = await api.get(`${URL_PETS}/${id}`);
    return response.data as Pet;
}

export async function updatePet(id: number, pet: CreatePetProps) {
    const response = await api.put(`${URL_PETS}/${id}`, {
        nome: pet.name,
        raca: pet.breed,
        idade: pet.age,
    });
    return response.data as Pet;
}

export async function deletePet(id: number) {
    return await api.delete(`${URL_PETS}/${id}`);
}

export async function updatePetPhoto(id: number, photo: File) {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('foto', photo);
    const { data } =  await api.post(`${URL_PETS}/${id}/fotos`, formData);
    return data as Photo;
}

export async function removePetPhoto({ photoId, petId }: { petId: number, photoId: number }) {
    return await api.delete(`${URL_PETS}/${petId}/fotos/${photoId}`);
}