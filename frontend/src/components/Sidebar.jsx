import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categorias } from '../data/mock';
import s from './Sidebar.module.css';

export default function Sidebar({ categoriaAtiva, onCategoria }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const naOngs = location.pathname.startsWith('/ongs');
  const dashboardPath = usuario?.tipo === 'ong' ? '/dashboard/ong' : '/dashboard';
  const [aberta, setAberta] = useState(false);

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '??';

  function ir(path) {
    navigate(path);
    setAberta(false);
  }

  function handleCategoria(id) {
    onCategoria(id);
    setAberta(false);
  }

  return (
    <>
      <button className={s.hamburger} onClick={() => setAberta(true)}>☰</button>

      {aberta && <div className={s.overlay} onClick={() => setAberta(false)} />}

      <aside className={aberta ? `${s.sidebar} ${s.sidebarAberta}` : s.sidebar}>
        <div className={s.logo}>
          <div className={s.logoPonto} />
          <span className={s.logoTexto}>RedeEsperança</span>
        </div>

        <nav className={s.nav}>
          <span className={s.navLabel}>Explorar</span>
          <button
            className={s.navBtn}
            style={!naOngs ? { background: '#E1F5EE', color: '#1D9E75' } : {}}
            onClick={() => ir(dashboardPath)}
          >
            <span className={s.navIcone}>📋</span>
            <span>Campanhas</span>
          </button>
          <button
            className={s.navBtn}
            style={naOngs ? { background: '#E1F5EE', color: '#1D9E75' } : {}}
            onClick={() => ir('/ongs')}
          >
            <span className={s.navIcone}>🏢</span>
            <span>ONGs</span>
          </button>

          {!naOngs && (
            <>
              <span className={s.navLabel} style={{ marginTop: '12px' }}>Causas</span>
              {categorias.map((cat) => {
                const ativo = categoriaAtiva === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={s.navBtn}
                    style={ativo ? { background: cat.corClara, color: cat.cor } : {}}
                    onClick={() => handleCategoria(cat.id)}
                  >
                    <span className={s.navIcone}>{cat.icone}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </nav>

        <div className={s.rodape}>
          <div className={s.avatar}>{iniciais}</div>
          <div className={s.rodapeInfo}>
            <span className={s.rodapeNome}>{usuario?.nome}</span>
            <span className={s.rodapeTipo}>
              {usuario?.tipo === 'ong' ? 'ONG' : 'Voluntário'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
