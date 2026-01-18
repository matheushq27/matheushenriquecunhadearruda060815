import { Routes, Route } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import Login from "@/pages/Login";
import { AuthLayout } from '@/layouts/AuthLayout'
import { GuestLayout } from '@/layouts/GuestLayout'
import Tutors from '@/pages/Tutors';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route element={<PublicRoutes />}>
                <Route element={<GuestLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>
            </Route>

            {/* Rotas privadas */}
            <Route element={<PrivateRoutes />}>
                <Route element={<AuthLayout />}>
                    <Route path="/tutors" element={<Tutors />} />
                </Route>
            </Route>
        </Routes>
    );
}
