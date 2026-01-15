import { AppError } from '@/helpers/AppError';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    function (config) {

        if (!config.headers.Authorization) {
            config.headers.Authorization = ``;
            config.headers.Authorization = `Bearer `;
        }

        return config;
    },
    function (error) {
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
