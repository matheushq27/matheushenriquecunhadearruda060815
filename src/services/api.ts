import { AppError } from '@/helpers/AppError';
import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';

export const VERSION_API = "v1";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    function (config) {

        const token = useAuthStore.getState().user?.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    function () {
        return Promise.reject(
            new AppError("Falha na requisição")
        );
    }
);

const getErrorMessageByStatus = (status: number) => {
    if (status === 401) {
        return "Não autorizado";
    }

    return "Falha na requisição";
}

api.interceptors.response.use(
    function (response) {
        if (response.data && response.data.access_token) {
            response.headers['Authorization'] =
                `Bearer ${response.data.access_token}`;
        }

        return response;
    },
    function (error) {
        if (error.response.data.message) {
            return Promise.reject(
                new AppError(error.response.data.message)
            );
        }

        return Promise.reject(
            new AppError(getErrorMessageByStatus(error.status))
        );
    }
);

export default api;
