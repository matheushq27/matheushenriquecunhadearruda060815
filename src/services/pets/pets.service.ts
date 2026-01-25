import api, { VERSION_API } from "../api";
import type { PetsRequest, PetsResponse } from "@/interfaces/services/pets.service";

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