import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { causaConfig } from '../data/causaConfig';
import s from './DetalheCampanha.module.css';

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const fmtData = (d) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

function iniciais(nome) {
  return (nome ?? '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

const avatarCores = ['#1D9E75', '#378ADD', '#639922', '#BA7517', '#8B5CF6', '#EC4899'];
const VALORES_RAPIDOS = [20, 50, 100, 500];

export default function DetalheCampanha({ campanha: inicial, onVoltar }) {
  const { usuario } = useAuth();
  const [campanha, setCampanha] = useState(inicial);
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [valorCustom, setValorCustom] = useState('');
  const [outroAberto, setOutroAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const pct = Math.min(Math.round((Number(campanha.arrecadado) / Number(campanha.meta)) * 100), 100);
  const concluida = Number(campanha.arrecadado) >= Number(campanha.meta);
  const falta = Number(campanha.meta) - Number(campanha.arrecadado);
  const totalDoacoes = (campanha.doacoes ?? []).length;
  const config = causaConfig[campanha.causa] ?? {};

  const valorFinal = outroAberto ? Number(valorCustom) : valorSelecionado;

  function selecionarValor(v) {
    setValorSelecionado(v);
    setOutroAberto(false);
    setValorCustom('');
    setErro('');
  }

  function selecionarOutro() {
    setValorSelecionado(null);
    setOutroAberto(true);
    setErro('');
  }

  function compartilhar() {
    if (navigator.share) {
      navigator.share({ title: campanha.titulo, text: campanha.descricao, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  }

  async function handleDoar(e) {
    e.preventDefault();
    if (!valorFinal || valorFinal <= 0) { setErro('Selecione ou informe um valor.'); return; }

    setEnviando(true);
    setErro('');
    try {
      const { data } = await api.post(`/campanhas/${campanha.id}/doacoes`, {
        nome: usuario?.nome ?? 'Anônimo',
        valor: valorFinal,
      });

      setCampanha((c) => ({
        ...c,
        arrecadado: Number(c.arrecadado) + valorFinal,
        doacoes: [data.doacao, ...(c.doacoes ?? [])],
      }));

      setSucesso(true);
      setValorSelecionado(null);
      setValorCustom('');
      setOutroAberto(false);
      setTimeout(() => setSucesso(false), 3000);
    } catch (err) {
      setErro(err?.response?.data?.erro || 'Erro ao registrar doação.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={s.container}>

      {/* Top bar */}
      <div className={s.topBar}>
        <button className={s.voltar} onClick={onVoltar}>← Voltar para campanhas</button>
        <div className={s.topAcoes}>
          <button className={s.btnCompartilhar} onClick={compartilhar}>
            🔗 Compartilhar
          </button>
          <button className={s.btnMais}>···</button>
        </div>
      </div>

      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroBanda} style={{ background: campanha.cor ?? config.cor }} />
        <div className={s.heroIcone} style={{ background: campanha.corClara ?? config.corClara }}>
          {campanha.icone ?? config.icone}
        </div>
        <div className={s.heroInfo}>
          <div className={s.heroBadges}>
            {campanha.urgente && !concluida && <span className={s.badgeUrgente}>🔴 Urgente</span>}
            {concluida && <span className={s.badgeConcluida}>✓ Meta atingida</span>}
          </div>
          <h1 className={s.titulo}>{campanha.titulo}</h1>
          <p className={s.ong}>📍 {campanha.ong} · {campanha.cidade}, {campanha.estado}</p>
        </div>
      </div>

      {/* 4 métricas */}
      <div className={s.metricasGrid}>
        <div className={s.metricaCard}>
          <span className={s.metricaLabel}>Meta total</span>
          <span className={s.metricaValor}>{fmt(campanha.meta)}</span>
        </div>
        <div className={s.metricaCard}>
          <span className={s.metricaLabel}>Arrecadado</span>
          <span className={s.metricaValor} style={{ color: campanha.cor ?? config.cor }}>
            {fmt(campanha.arrecadado)}
          </span>
        </div>
        <div className={s.metricaCard}>
          <span className={s.metricaLabel}>{concluida ? 'Situação' : 'Falta'}</span>
          {concluida
            ? <span className={s.metricaValor} style={{ color: '#1D9E75' }}>Concluída!</span>
            : <span className={s.metricaValor} style={{ color: '#DC2626' }}>{fmt(falta)}</span>
          }
        </div>
        <div className={s.metricaCard}>
          <span className={s.metricaLabel}>Doadores</span>
          <span className={s.metricaValor}>{totalDoacoes}</span>
        </div>
      </div>

      {/* Progresso */}
      <div className={s.progressoSection}>
        <div className={s.progressoHeader}>
          <span className={s.progressoLabel}>Progresso da campanha</span>
          <span className={s.progressoPct}>{pct}% da meta alcançada</span>
        </div>
        <div className={s.barraFundo}>
          <div
            className={s.barraFill}
            style={{ width: `${pct}%`, background: campanha.cor ?? config.cor }}
          />
        </div>
        {!concluida && (
          <p className={s.progressoTexto}>
            Faltam {fmt(falta)} para atingir a meta. Cada doação faz a diferença!
          </p>
        )}
      </div>

      {/* Galeria de fotos */}
      {(campanha.fotos ?? []).length > 0 && (
        <div className={s.galeriaSection}>
          <h3 className={s.secaoTitulo}>Fotos de comprovação</h3>
          <div className={s.galeriaGrid}>
            {campanha.fotos.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={s.galeriaItem}>
                <img src={url} alt={`foto ${i + 1}`} className={s.galeriaImg} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Sobre + Detalhes */}
      <div className={s.duasColunas}>
        <div className={s.sobre}>
          <h3 className={s.secaoTitulo}>Sobre a campanha</h3>
          <p className={s.descricao}>{campanha.descricao}</p>
        </div>
        <div className={s.detalhes}>
          <h3 className={s.secaoTitulo}>Detalhes</h3>
          <div className={s.detalhesList}>
            <div className={s.detalheRow}>
              <span className={s.detalheIcone}>🏷</span>
              <span className={s.detalheChave}>Categoria</span>
              <span className={s.detalheValor}>{config.label ?? campanha.causa}</span>
            </div>
            <div className={s.detalheRow}>
              <span className={s.detalheIcone}>🏢</span>
              <span className={s.detalheChave}>ONG</span>
              <span className={s.detalheValor}>{campanha.ong}</span>
            </div>
            <div className={s.detalheRow}>
              <span className={s.detalheIcone}>📅</span>
              <span className={s.detalheChave}>Criada em</span>
              <span className={s.detalheValor}>{campanha.criado_em ? fmtData(campanha.criado_em) : '—'}</span>
            </div>
            <div className={s.detalheRow}>
              <span className={s.detalheIcone}>✓</span>
              <span className={s.detalheChave}>Status</span>
              <span className={s.detalheValor} style={{ color: concluida ? '#DC2626' : '#1D9E75' }}>
                {concluida ? 'Concluída' : 'Ativa'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Doação */}
      {!concluida && (
        <div className={s.doacaoSection}>
          <h3 className={s.secaoTitulo}>Fazer uma doação</h3>

          <div className={s.valoresPills}>
            {VALORES_RAPIDOS.map((v) => {
              const ativo = !outroAberto && valorSelecionado === v;
              return (
                <button
                  key={v}
                  type="button"
                  className={ativo ? `${s.pill} ${s.pillAtivo}` : s.pill}
                  style={ativo ? { background: campanha.cor ?? config.cor, borderColor: campanha.cor ?? config.cor } : {}}
                  onClick={() => selecionarValor(v)}
                >
                  {fmt(v)}
                </button>
              );
            })}
            <button
              type="button"
              className={outroAberto ? `${s.pill} ${s.pillAtivo}` : s.pill}
              style={outroAberto ? { background: campanha.cor ?? config.cor, borderColor: campanha.cor ?? config.cor } : {}}
              onClick={selecionarOutro}
            >
              Outro
            </button>
          </div>

          {outroAberto && (
            <input
              className={s.inputOutro}
              type="number"
              min="1"
              placeholder="Digite o valor (R$)"
              value={valorCustom}
              onChange={(e) => { setValorCustom(e.target.value); setErro(''); }}
              autoFocus
            />
          )}

          {sucesso ? (
            <div className={s.doacaoSucesso}>
              <span>✓</span>
              <span>Doação registrada! Obrigado pelo apoio.</span>
            </div>
          ) : (
            <form className={s.doacaoRow} onSubmit={handleDoar}>
              <div className={s.valorDisplay}>
                {valorFinal > 0
                  ? Number(valorFinal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'R$ 0,00'}
              </div>
              <button
                type="submit"
                className={s.btnConfirmar}
                style={{ background: campanha.cor ?? config.cor }}
                disabled={enviando || !valorFinal || valorFinal <= 0}
              >
                {enviando ? 'Enviando...' : '♡ Confirmar doação'}
              </button>
            </form>
          )}

          {erro && <p className={s.erro}>{erro}</p>}
        </div>
      )}

      {/* Doadores */}
      <div className={s.doadoresSection}>
        <div className={s.doadoresHeader}>
          <h2 className={s.doadoresTitulo}>Doadores</h2>
          {totalDoacoes > 0 && (
            <span className={s.doadoresCount}>
              {totalDoacoes} doação{totalDoacoes !== 1 ? 'ões' : ''}
            </span>
          )}
        </div>
        {totalDoacoes === 0 ? (
          <p className={s.semDoadores}>Seja o primeiro a apoiar esta campanha!</p>
        ) : (
          <ul className={s.doadoresList}>
            {(campanha.doacoes ?? []).map((d, i) => (
              <li key={d.id ?? i} className={s.doadorItem}>
                <div className={s.doadorAvatar} style={{ background: avatarCores[i % avatarCores.length] }}>
                  {iniciais(d.nome)}
                </div>
                <div className={s.doadorInfo}>
                  <span className={s.doadorNome}>{d.nome}</span>
                  <span className={s.doadorData}>{fmtData(d.criado_em)}</span>
                </div>
                <span className={s.doadorValor}>{fmt(d.valor)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
