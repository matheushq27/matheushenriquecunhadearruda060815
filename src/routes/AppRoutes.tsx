import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import Login from "@/pages/Login";
import { AuthLayout } from '@/layouts/AuthLayout'
import { GuestLayout } from '@/layouts/GuestLayout'
import { NotFound } from '@/pages/NotFound';
import { SectionLoading } from '@/components/SectionLoading';

// Lazy loading dos módulos principais
const Tutors = lazy(() => import('@/pages/Tutors'));
const Pets = lazy(() => import('@/pages/Pets'));

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route element={<PublicRoutes />}>
                <Route element={<GuestLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/health" element={<>Tutorpet Rodando</>} />
                </Route>
            </Route>

            {/* Rotas privadas */}
            <Route element={<PrivateRoutes />}>
                <Route element={<AuthLayout />}>
                    {/* Lazy loading para módulos Pets e Tutores */}
                    <Route path="/tutors" element={
                        <Suspense fallback={<SectionLoading loading={true} />}>
                            <Tutors />
                        </Suspense>
                    } />
                    <Route path="/pets" element={
                        <Suspense fallback={<SectionLoading loading={true} />}>
                            <Pets />
                        </Suspense>
                    } />
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>
        </Routes>
    );
}
