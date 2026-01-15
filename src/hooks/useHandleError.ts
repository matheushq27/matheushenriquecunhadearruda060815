import { AppError } from "@/helpers/AppError";
import { useToast } from "@/contexts/ToastContext";

export const useErrorHandler = () => {
    const { showError } = useToast();
    const handleError = (error: any, defaultMessage = "Falha na requisição") => {

        if (error instanceof AppError) {
            showError(error.message ?? defaultMessage,);
            return
        }

        showError(defaultMessage);
    };

    return {
        handleError,
    };
};
