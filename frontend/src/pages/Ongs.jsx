import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import CardCampanha from '../components/CardCampanha';
import DetalheCampanha from '../components/DetalheCampanha';
import { causaConfig, enriquecerCampanha } from '../data/causaConfig';
import s from './Ongs.module.css';

export default function Ongs() {
  const [ongs, setOngs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [ongSelecionada, setOngSelecionada] = useState(null);
  const [campanhas, setCampanhas] = useState([]);
  const [carregandoCampanhas, setCarregandoCampanhas] = useState(false);
  const [campanhaAberta, setCampanhaAberta] = useState(null);

  useEffect(() => {
    api.get('/ongs')
      .then(({ data }) => setOngs(data.ongs))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  async function selecionarOng(ong) {
    setOngSelecionada(ong);
    setCampanhaAberta(null);
    setCampanhas([]);
    setCarregandoCampanhas(true);
    try {
      const { data } = await api.get(`/ongs/${ong.id}/campanhas`);
      setCampanhas(data.campanhas.map(enriquecerCampanha));
    } catch {
      setCampanhas([]);
    } finally {
      setCarregandoCampanhas(false);
    }
  }

  function voltar() {
    if (campanhaAberta) { setCampanhaAberta(null); return; }
    setOngSelecionada(null);
    setCampanhas([]);
  }

  return (
    <div className={s.layout}>
      <Sidebar categoriaAtiva="" onCategoria={() => {}} />

      <main className={s.main}>
        {campanhaAberta ? (
          <DetalheCampanha campanha={campanhaAberta} onVoltar={voltar} />
        ) : ongSelecionada ? (
          <DetalheOng
            ong={ongSelecionada}
            campanhas={campanhas}
            carregando={carregandoCampanhas}
            onVoltar={voltar}
            onCampanha={setCampanhaAberta}
          />
        ) : (
          <ListaOngs ongs={ongs} carregando={carregando} onSelecionar={selecionarOng} />
        )}
      </main>
    </div>
  );
}

function ListaOngs({ ongs, carregando, onSelecionar }) {
  return (
    <>
      <div className={s.cabecalho}>
        <h1 className={s.titulo}>ONGs parceiras</h1>
        <p className={s.subtitulo}>
          {carregando ? 'Carregando...' : `${ongs.length} organização${ongs.length !== 1 ? 'ões' : ''} cadastrada${ongs.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {!carregando && ongs.length === 0 && (
        <div className={s.vazio}>Nenhuma ONG cadastrada ainda.</div>
      )}

      <div className={s.grid}>
        {ongs.map((ong, i) => {
          const config = causaConfig[ong.causa] ?? {};
          return (
            <div
              key={ong.id}
              className={s.card}
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => onSelecionar(ong)}
            >
              <div className={s.cardTopo}>
                <div className={s.cardIcone} style={{ background: config.corClara }}>
                  {config.icone}
                </div>
                <span
                  className={s.causaBadge}
                  style={{ background: config.corClara, color: config.cor }}
                >
                  {config.label ?? ong.causa}
                </span>
              </div>

              <h2 className={s.cardNome}>{ong.usuarios?.nome ?? 'ONG'}</h2>

              {ong.cidade && (
                <p className={s.cardLocal}>{ong.cidade}{ong.estado ? `, ${ong.estado}` : ''}</p>
              )}

              {ong.descricao && (
                <p className={s.cardDescricao}>{ong.descricao}</p>
              )}

              <span className={s.cardVer}>Ver campanhas →</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function DetalheOng({ ong, campanhas, carregando, onVoltar, onCampanha }) {
  const config = causaConfig[ong.causa] ?? {};

  return (
    <>
      <button className={s.voltar} onClick={onVoltar}>← Voltar</button>

      <div className={s.ongHero}>
        <div className={s.ongIcone} style={{ background: config.corClara }}>
          {config.icone}
        </div>
        <div className={s.ongInfo}>
          <span
            className={s.causaBadge}
            style={{ background: config.corClara, color: config.cor }}
          >
            {config.label ?? ong.causa}
          </span>
          <h1 className={s.ongNome}>{ong.usuarios?.nome ?? 'ONG'}</h1>
          {ong.cidade && (
            <p className={s.ongLocal}>{ong.cidade}{ong.estado ? `, ${ong.estado}` : ''}</p>
          )}
          {ong.descricao && (
            <p className={s.ongDescricao}>{ong.descricao}</p>
          )}
        </div>
      </div>

      <div className={s.ongCampanhasHeader}>
        <h2 className={s.ongCampanhasTitulo}>Campanhas desta ONG</h2>
        <span className={s.ongCampanhasCount}>
          {carregando ? '...' : campanhas.length}
        </span>
      </div>

      {carregando ? (
        <p className={s.carregando}>Carregando campanhas...</p>
      ) : campanhas.length === 0 ? (
        <p className={s.vazio}>Esta ONG ainda não tem campanhas aprovadas.</p>
      ) : (
        <div className={s.grid}>
          {campanhas.map((c, i) => (
            <CardCampanha
              key={c.id}
              campanha={c}
              index={i}
              onClick={() => onCampanha(c)}
            />
          ))}
        </div>
      )}
    </>
  );
}
