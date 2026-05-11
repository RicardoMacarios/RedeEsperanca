import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import CardCampanha from '../components/CardCampanha';
import DetalheCampanha from '../components/DetalheCampanha';
import { categorias } from '../data/mock';
import { enriquecerCampanha } from '../data/causaConfig';
import s from './Dashboard.module.css';

const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const fmtNum = (v) => v.toLocaleString('pt-BR');

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [campanhaAberta, setCampanhaAberta] = useState(null);
  const [campanhas, setCampanhas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');

  useEffect(() => {
    api.get('/campanhas')
      .then(({ data }) => setCampanhas(data.campanhas.map(enriquecerCampanha)))
      .catch(() => setErro('Não foi possível carregar as campanhas.'))
      .finally(() => setCarregando(false));
  }, []);

  if (!usuario) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleCategoria(id) {
    setCategoriaAtiva(id);
    setCampanhaAberta(null);
  }

  const filtradas = campanhas
    .filter((c) => categoriaAtiva === 'todas' || c.causa === categoriaAtiva)
    .filter((c) => {
      const concluida = Number(c.arrecadado) >= Number(c.meta);
      if (filtroStatus === 'concluidas') return concluida;
      if (filtroStatus === 'urgente') return c.urgente && !concluida;
      if (filtroStatus === 'ativas') return !concluida;
      return !concluida; // 'todas' também esconde concluídas
    })
    .filter((c) => {
      if (!busca.trim()) return true;
      const q = busca.toLowerCase();
      return c.titulo?.toLowerCase().includes(q) || c.ong?.toLowerCase().includes(q);
    })
    .slice()
    .sort((a, b) => (b.urgente ? 1 : 0) - (a.urgente ? 1 : 0));

  const catInfo = categorias.find((c) => c.id === categoriaAtiva);

  const totalArrecadado = campanhas.reduce((s, c) => s + Number(c.arrecadado), 0);
  const totalDoacoes = campanhas.reduce((s, c) => s + (c.doacoes?.length ?? 0), 0);
  const ongsUnicas = new Set(campanhas.map((c) => c.ong).filter(Boolean)).size;

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
                  {carregando
                    ? 'Carregando...'
                    : `${filtradas.length} campanha${filtradas.length !== 1 ? 's' : ''} encontrada${filtradas.length !== 1 ? 's' : ''}`}
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
                <span className={s.metricaValor}>{fmt(totalArrecadado)}</span>
              </div>
              <div className={s.metricaCard}>
                <span className={s.metricaLabel}>Campanhas ativas</span>
                <span className={s.metricaValor}>{fmtNum(campanhas.length)}</span>
              </div>
              <div className={s.metricaCard}>
                <span className={s.metricaLabel}>Total de doações</span>
                <span className={s.metricaValor}>{fmtNum(totalDoacoes)}</span>
              </div>
              <div className={s.metricaCard}>
                <span className={s.metricaLabel}>ONGs parceiras</span>
                <span className={s.metricaValor}>{fmtNum(ongsUnicas)}</span>
              </div>
            </div>

            <div className={s.filtroBar}>
              <div className={s.buscaWrap}>
                <span className={s.buscaIcone}>🔍</span>
                <input
                  className={s.buscaInput}
                  type="text"
                  placeholder="Buscar campanha ou ONG..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <div className={s.filtros}>
                {[
                  { id: 'todas',     label: 'Todas' },
                  { id: 'urgente',   label: 'Urgente' },
                  { id: 'ativas',    label: 'Ativas' },
                  { id: 'concluidas',label: 'Concluídas' },
                ].map((f) => (
                  <button
                    key={f.id}
                    className={filtroStatus === f.id ? `${s.filtroPill} ${s.filtroPillAtivo}` : s.filtroPill}
                    onClick={() => setFiltroStatus(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {erro && <p className={s.erro}>{erro}</p>}

            {carregando ? (
              <div className={s.carregando}>Carregando campanhas...</div>
            ) : filtradas.length === 0 ? (
              <div className={s.vazio}>
                <p>Nenhuma campanha encontrada.</p>
              </div>
            ) : (
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
            )}
          </>
        )}
      </main>
    </div>
  );
}
