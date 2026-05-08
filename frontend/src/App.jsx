import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './components/RotaProtegida';
import Login from './pages/Login';
import CadastroVoluntario from './pages/CadastroVoluntario';
import CadastroOng from './pages/CadastroOng';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/voluntario" element={<CadastroVoluntario />} />
          <Route path="/cadastro/ong" element={<CadastroOng />} />
          <Route
            path="/dashboard"
            element={
              <RotaProtegida tipo="voluntario">
                <Dashboard />
              </RotaProtegida>
            }
          />
          <Route
            path="/dashboard/ong"
            element={
              <RotaProtegida tipo="ong">
                <Dashboard />
              </RotaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
