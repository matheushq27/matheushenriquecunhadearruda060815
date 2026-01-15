import { Routes, Route } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import Login from "@/pages/Login";
import Home from '@/pages/Home';
import { AuthLayout } from '@/layouts/AuthLayout'
import { GuestLayout } from '@/layouts/GuestLayout'

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
                    <Route path="/" element={<Home />} />
                </Route>
            </Route>
        </Routes>
    );
}
