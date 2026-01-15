import type { AuthenticateRequest, AuthenticateResponse } from "@/interfaces/services/authenticate.service";
import api from "../api";

export async function authenticate({ username, password }: AuthenticateRequest) {
    const response = await api.post("/autenticacao/login", {
        username,
        password,
    });
    return response.data as AuthenticateResponse;
}