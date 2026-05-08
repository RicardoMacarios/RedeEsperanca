import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import CardCampanha from '../components/CardCampanha';
import DetalheCampanha from '../components/DetalheCampanha';
import { campanhas, categorias, metricas } from '../data/mock';
import s from './Dashboard.module.css';

const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const fmtNum = (v) => v.toLocaleString('pt-BR');

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [campanhaAberta, setCampanhaAberta] = useState(null);

  if (!usuario) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleCategoria(id) {
    setCategoriaAtiva(id);
    setCampanhaAberta(null);
  }

  const filtradas =
    categoriaAtiva === 'todas'
      ? campanhas
      : campanhas.filter((c) => c.causa === categoriaAtiva);

  const catInfo = categorias.find((c) => c.id === categoriaAtiva);

  return (
    <div className={s.layout}>
      <Sidebar categoriaAtiva={categoriaAtiva} onCategoria={handleCategoria} />

      <main className={s.main}>
        {campanhaAberta ? (
          <DetalheCampanha
            campanha={campanhaAberta}
            onVoltar={() => setCampanhaAberta(null)}
          />
        ) : (
          <>
            <div className={s.header}>
              <div>
                <h1 className={s.titulo}>{catInfo?.label ?? 'Todas as causas'}</h1>
                <p className={s.subtitulo}>
                  {filtradas.length} campanha{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className={s.headerAcoes}>
                <button className={s.btnNova} onClick={() => navigate('/criar-campanha')}>
                  + Nova campanha
                </button>
                <button className={s.logout} onClick={handleLogout}>Sair</button>
              </div>
            </div>

            <div className={s.metricasGrid}>
              <div className={s.metricaCard}>
                <span className={s.metricaLabel}>Total arrecadado</span>
                <span className={s.metricaValor}>{fmt(metricas.totalArrecadado)}</span>
              </div>
              <div className={s.metricaCard}>
                <span className={s.metricaLabel}>Campanhas ativas</span>
                <span className={s.metricaValor}>{metricas.campanhasAtivas}</span>
              </div>
              <div className={s.metricaCard}>
                <span className={s.metricaLabel}>Voluntários</span>
                <span className={s.metricaValor}>{fmtNum(metricas.voluntarios)}</span>
              </div>
              <div className={s.metricaCard}>
                <span className={s.metricaLabel}>ONGs parceiras</span>
                <span className={s.metricaValor}>{metricas.ongs}</span>
              </div>
            </div>

            <div className={s.grid}>
              {filtradas.map((c, i) => (
                <CardCampanha
                  key={c.id}
                  campanha={c}
                  index={i}
                  onClick={() => setCampanhaAberta(c)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
