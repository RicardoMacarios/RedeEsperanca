import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RotaProtegida({ children, tipo }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#6b7280' }}>Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (tipo && usuario.tipo !== tipo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
