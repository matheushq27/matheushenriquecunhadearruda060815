import { Routes, Route } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import Login from "@/pages/Login";
import Home from '@/pages/Home';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Rotas privadas */}
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
