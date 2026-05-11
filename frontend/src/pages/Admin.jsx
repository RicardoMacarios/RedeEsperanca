import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { causaConfig, enriquecerCampanha } from '../data/causaConfig';
import DetalheCampanha from '../components/DetalheCampanha';
import s from './Admin.module.css';

const ADMIN_EMAIL = 'juniormacarios92@gmail.com';

const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const fmtData = (d) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

const statusConfig = {
  pendente:  { label: 'Pendente',  bg: '#FEF3C7', cor: '#92400E' },
  aprovada:  { label: 'Aprovada',  bg: '#D1FAE5', cor: '#065F46' },
  rejeitada: { label: 'Rejeitada', bg: '#FEE2E2', cor: '#DC2626' },
};

export default function Admin() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [aba, setAba] = useState('pendentes');

  const [pendentes, setPendentes] = useState([]);
  const [carregandoPendentes, setCarregandoPendentes] = useState(true);
  const [avaliando, setAvaliando] = useState(null);

  const [todas, setTodas] = useState([]);
  const [carregandoTodas, setCarregandoTodas] = useState(false);
  const [todasCarregadas, setTodasCarregadas] = useState(false);
  const [excluindo, setExcluindo] = useState(null);
  const [campanhaAberta, setCampanhaAberta] = useState(null);

  const [ongs, setOngs] = useState([]);
  const [carregandoOngs, setCarregandoOngs] = useState(false);
  const [ongsCarregadas, setOngsCarregadas] = useState(false);
  const [excluindoOng, setExcluindoOng] = useState(null);

  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/admin/campanhas')
      .then(({ data }) => setPendentes(data.campanhas))
      .catch(() => setErro('Não foi possível carregar as campanhas pendentes.'))
      .finally(() => setCarregandoPendentes(false));
  }, []);

  useEffect(() => {
    if (aba === 'ongs' && !ongsCarregadas) {
      setCarregandoOngs(true);
      api.get('/admin/ongs')
        .then(({ data }) => { setOngs(data.ongs); setOngsCarregadas(true); })
        .catch(() => setErro('Não foi possível carregar as ONGs.'))
        .finally(() => setCarregandoOngs(false));
    }
  }, [aba, ongsCarregadas]);

  useEffect(() => {
    if (aba === 'todas' && !todasCarregadas) {
      setCarregandoTodas(true);
      api.get('/admin/campanhas/todas')
        .then(({ data }) => { setTodas(data.campanhas); setTodasCarregadas(true); })
        .catch(() => setErro('Não foi possível carregar todas as campanhas.'))
        .finally(() => setCarregandoTodas(false));
    }
  }, [aba, todasCarregadas]);

  async function avaliar(id, status) {
    setAvaliando(id);
    setErro('');
    try {
      await api.patch(`/admin/campanhas/${id}`, { status });
      setPendentes((prev) => prev.filter((c) => c.id !== id));
      if (todasCarregadas) {
        setTodas((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
      }
    } catch {
      setErro('Erro ao avaliar campanha.');
    } finally {
      setAvaliando(null);
    }
  }

  async function excluirOng(id, nome) {
    if (!window.confirm(`Excluir permanentemente a ONG "${nome}"?\n\nEsta ação não pode ser desfeita.`)) return;
    setExcluindoOng(id);
    setErro('');
    try {
      await api.delete(`/admin/ongs/${id}`);
      setOngs((prev) => prev.filter((o) => o.id !== id));
    } catch {
      setErro('Erro ao excluir ONG.');
    } finally {
      setExcluindoOng(null);
    }
  }

  async function excluir(id, titulo) {
    if (!window.confirm(`Excluir permanentemente a campanha "${titulo}"?\n\nEsta ação não pode ser desfeita.`)) return;
    setExcluindo(id);
    setErro('');
    try {
      await api.delete(`/admin/campanhas/${id}`);
      setTodas((prev) => prev.filter((c) => c.id !== id));
      setPendentes((prev) => prev.filter((c) => c.id !== id));
      if (campanhaAberta?.id === id) setCampanhaAberta(null);
    } catch {
      setErro('Erro ao excluir campanha.');
    } finally {
      setExcluindo(null);
    }
  }

  if (!usuario) return null;

  if (usuario.email !== ADMIN_EMAIL) {
    return (
      <div className={s.semAcesso}>
        <h1>Acesso negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <button onClick={() => navigate('/dashboard')}>Voltar ao dashboard</button>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerLogo}>
          <div className={s.logoPonto} />
          <span className={s.logoTexto}>RedeEsperança</span>
          <span className={s.adminBadge}>Suporte</span>
        </div>
        <div className={s.headerDir}>
          <span className={s.headerUsuario}>{usuario.nome}</span>
          <button className={s.btnVoltar} onClick={() => navigate('/dashboard')}>
            Ir ao dashboard
          </button>
          <button className={s.btnSair} onClick={() => { logout(); navigate('/login'); }}>
            Sair
          </button>
        </div>
      </header>

      <main className={s.main}>
        <div className={s.cabecalho}>
          <h1 className={s.titulo}>Painel de suporte</h1>
        </div>

        <div className={s.abas}>
          <button
            className={aba === 'pendentes' ? `${s.aba} ${s.abaAtiva}` : s.aba}
            onClick={() => setAba('pendentes')}
          >
            Pendentes
            {pendentes.length > 0 && (
              <span className={s.abaBadge}>{pendentes.length}</span>
            )}
          </button>
          <button
            className={aba === 'todas' ? `${s.aba} ${s.abaAtiva}` : s.aba}
            onClick={() => setAba('todas')}
          >
            Todas as campanhas
          </button>
          <button
            className={aba === 'ongs' ? `${s.aba} ${s.abaAtiva}` : s.aba}
            onClick={() => setAba('ongs')}
          >
            ONGs
          </button>
        </div>

        {erro && <p className={s.erro}>{erro}</p>}

        {aba === 'pendentes' && (
          <>
            <p className={s.subtitulo}>
              {carregandoPendentes
                ? 'Carregando...'
                : `${pendentes.length} campanha${pendentes.length !== 1 ? 's' : ''} aguardando aprovação`}
            </p>

            {!carregandoPendentes && pendentes.length === 0 && !erro && (
              <div className={s.vazio}>
                <span className={s.vazioIcone}>✓</span>
                <p>Nenhuma campanha pendente. Tudo em dia!</p>
              </div>
            )}

            <div className={s.lista}>
              {pendentes.map((c) => (
                <CardAdmin
                  key={c.id}
                  campanha={c}
                  emAvaliacao={avaliando === c.id}
                  onAprovar={() => avaliar(c.id, 'aprovada')}
                  onRejeitar={() => avaliar(c.id, 'rejeitada')}
                />
              ))}
            </div>
          </>
        )}

        {aba === 'todas' && (
          <>
            {campanhaAberta ? (
              <>
                <button className={s.btnVoltarAba} onClick={() => setCampanhaAberta(null)}>
                  ← Voltar para a lista
                </button>
                <DetalheCampanha
                  campanha={campanhaAberta}
                  onVoltar={() => setCampanhaAberta(null)}
                />
              </>
            ) : (
              <>
                <p className={s.subtitulo}>
                  {carregandoTodas
                    ? 'Carregando...'
                    : `${todas.length} campanha${todas.length !== 1 ? 's' : ''} no total`}
                </p>
                <div className={s.lista}>
                  {todas.map((c) => (
                    <CardAdmin
                      key={c.id}
                      campanha={c}
                      mostrarStatus
                      emExcluindo={excluindo === c.id}
                      onVerDetalhe={() => setCampanhaAberta(enriquecerCampanha(c))}
                      onExcluir={() => excluir(c.id, c.titulo)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        {aba === 'ongs' && (
          <>
            <p className={s.subtitulo}>
              {carregandoOngs
                ? 'Carregando...'
                : `${ongs.length} ONG${ongs.length !== 1 ? 's' : ''} cadastrada${ongs.length !== 1 ? 's' : ''}`}
            </p>

            {!carregandoOngs && ongs.length === 0 && !erro && (
              <div className={s.vazio}>
                <span className={s.vazioIcone}>🏢</span>
                <p>Nenhuma ONG cadastrada ainda.</p>
              </div>
            )}

            <div className={s.lista}>
              {ongs.map((o) => (
                <CardOng
                  key={o.id}
                  ong={o}
                  emExcluindo={excluindoOng === o.id}
                  onExcluir={() => excluirOng(o.id, o.nome)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function CardOng({ ong: o, emExcluindo, onExcluir }) {
  const fmtDataOng = (d) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className={s.card}>
      <div className={s.cardTopo}>
        <div className={s.cardIcone} style={{ background: '#E1F5EE' }}>
          <span>🏢</span>
        </div>
        <div className={s.cardInfo}>
          <h2 className={s.cardTitulo}>{o.nome}</h2>
          <p className={s.cardOng}>{o.usuarios?.email}</p>
          {o.descricao && <p className={s.cardDescricao}>{o.descricao}</p>}
        </div>
      </div>
      <div className={s.cardRodape}>
        <span className={s.dataEnvio}>Cadastrada em {fmtDataOng(o.criado_em)}</span>
        <div className={s.cardAcoes}>
          <button
            className={s.btnExcluir}
            disabled={emExcluindo}
            onClick={onExcluir}
          >
            {emExcluindo ? '...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CardAdmin({ campanha: c, mostrarStatus, emAvaliacao, emExcluindo, onAprovar, onRejeitar, onExcluir, onVerDetalhe }) {
  const config = causaConfig[c.causa] ?? {};
  const st = statusConfig[c.status] ?? {};

  return (
    <div className={s.card}>
      <div className={s.cardTopo}>
        <div className={s.cardIcone} style={{ background: config.corClara }}>
          <span>{c.icone ?? config.icone}</span>
        </div>
        <div className={s.cardInfo}>
          <div className={s.cardBadges}>
            <span className={s.causaBadge} style={{ background: config.corClara, color: config.cor }}>
              {config.label ?? c.causa}
            </span>
            {mostrarStatus && (
              <span className={s.statusBadge} style={{ background: st.bg, color: st.cor }}>
                {st.label}
              </span>
            )}
          </div>
          <h2 className={s.cardTitulo}>{c.titulo}</h2>
          <p className={s.cardOng}>{c.ong} · {c.cidade}, {c.estado}</p>
        </div>
        <div className={s.cardMeta}>
          <span className={s.metaLabel}>Meta</span>
          <span className={s.metaValor}>{fmt(c.meta)}</span>
        </div>
      </div>

      <p className={s.cardDescricao}>{c.descricao}</p>

      {(c.fotos ?? []).length > 0 && (
        <div className={s.fotosGrid}>
          {c.fotos.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={s.fotoItem}>
              <img src={url} alt={`foto ${i + 1}`} className={s.fotoImg} />
            </a>
          ))}
        </div>
      )}

      <div className={s.cardRodape}>
        <div className={s.cardMeta2}>
          {c.urgente && <span className={s.urgenteBadge}>Urgente</span>}
          <span className={s.dataEnvio}>
            Enviada em {fmtData(c.criado_em)}
            {c.usuarios?.nome && ` por ${c.usuarios.nome}`}
          </span>
        </div>
        <div className={s.cardAcoes}>
          {onVerDetalhe && (
            <button className={s.btnVer} onClick={onVerDetalhe}>
              Ver detalhes
            </button>
          )}
          {onExcluir && (
            <button
              className={s.btnExcluir}
              disabled={emExcluindo}
              onClick={onExcluir}
            >
              {emExcluindo ? '...' : 'Excluir'}
            </button>
          )}
          {onRejeitar && (
            <button className={s.btnRejeitar} disabled={emAvaliacao} onClick={onRejeitar}>
              {emAvaliacao ? '...' : 'Rejeitar'}
            </button>
          )}
          {onAprovar && (
            <button className={s.btnAprovar} disabled={emAvaliacao} onClick={onAprovar}>
              {emAvaliacao ? '...' : 'Aprovar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
