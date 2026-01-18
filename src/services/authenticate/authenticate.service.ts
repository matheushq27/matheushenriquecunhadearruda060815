import type { AuthenticateRequest, AuthenticateResponse, RefreshTokenResponse } from "@/interfaces/services/authenticate.service";
import api from "../api";
import axios from "axios";

export async function authenticate({ username, password }: AuthenticateRequest) {
    const response = await api.post("/autenticacao/login", {
        username,
        password,
    });
    return response.data as AuthenticateResponse;
}

export async function refreshToken({ refreshToken }: { refreshToken: string }) {
    const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/autenticacao/refresh`,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );

    return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        refreshExpiresIn: response.data.refresh_expires_in,
    }
}