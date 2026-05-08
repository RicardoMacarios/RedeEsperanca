import React from 'react';
import { useAuth } from '../context/AuthContext';
import { categorias } from '../data/mock';
import s from './Sidebar.module.css';

export default function Sidebar({ categoriaAtiva, onCategoria }) {
  const { usuario } = useAuth();

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '??';

  return (
    <aside className={s.sidebar}>
      <div className={s.logo}>
        <div className={s.logoPonto} />
        <span className={s.logoTexto}>RedeEsperança</span>
      </div>

      <nav className={s.nav}>
        <span className={s.navLabel}>Causas</span>
        {categorias.map((cat) => {
          const ativo = categoriaAtiva === cat.id;
          return (
            <button
              key={cat.id}
              className={s.navBtn}
              style={ativo ? { background: cat.corClara, color: cat.cor } : {}}
              onClick={() => onCategoria(cat.id)}
            >
              <span className={s.navIcone}>{cat.icone}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
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
  );
}
