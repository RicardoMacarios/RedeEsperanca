import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: '#f9fafb',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '48px 56px',
    textAlign: 'center',
    maxWidth: '480px',
    width: '100%',
  },
  ponto: {
    width: '48px',
    height: '48px',
    background: '#1D9E75',
    borderRadius: '50%',
    margin: '0 auto 24px',
  },
  titulo: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '28px',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  subtitulo: {
    fontSize: '15px',
    color: '#6b7280',
    marginBottom: '32px',
  },
  badge: {
    display: 'inline-block',
    background: '#E1F5EE',
    color: '#0F6E56',
    borderRadius: '100px',
    padding: '4px 14px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '32px',
  },
  botao: {
    background: 'transparent',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    padding: '11px 24px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
};

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!usuario) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.ponto} />
        <span style={styles.badge}>
          {usuario.tipo === 'ong' ? '🏢 ONG' : '🙋 Voluntário'}
        </span>
        <h1 style={styles.titulo}>Olá, {usuario.nome}!</h1>
        <p style={styles.subtitulo}>
          Bem-vindo à RedeEsperança. Em breve haverá muito mais aqui.
        </p>
        <button
          style={styles.botao}
          onMouseEnter={(e) => { e.target.style.borderColor = '#dc2626'; e.target.style.color = '#dc2626'; }}
          onMouseLeave={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#6b7280'; }}
          onClick={handleLogout}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
