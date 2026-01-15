export class AppError {
    message = "Erro na requisição";

    constructor(message?: string) {
        this.message = message ?? this.message;
    }
}
