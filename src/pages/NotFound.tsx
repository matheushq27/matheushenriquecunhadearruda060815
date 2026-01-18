// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
export function NotFound() {
    return (
        <div className="min-h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-xl">Página não encontrada</p>

            <Link
                to="/tutors"
                className="mt-6 text-blue-500 underline"
            >
                Voltar
            </Link>
        </div>
    );
}
