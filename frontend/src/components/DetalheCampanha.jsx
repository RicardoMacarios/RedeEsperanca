import React from 'react';
import s from './DetalheCampanha.module.css';

const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const fmtData = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const avatarCores = ['#1D9E75', '#378ADD', '#639922', '#BA7517', '#8B5CF6', '#EC4899'];

export default function DetalheCampanha({ campanha, onVoltar }) {
  const pct = Math.min(Math.round((campanha.arrecadado / campanha.meta) * 100), 100);
  const concluida = campanha.arrecadado >= campanha.meta;
  const falta = campanha.meta - campanha.arrecadado;

  return (
    <div className={s.container}>
      <button className={s.voltar} onClick={onVoltar}>← Voltar</button>

      <div className={s.hero}>
        <div className={s.heroIcone} style={{ background: campanha.corClara }}>
          <span>{campanha.icone}</span>
        </div>
        <div className={s.heroInfo}>
          <div className={s.heroBadges}>
            {campanha.urgente && !concluida && (
              <span className={s.badgeUrgente}>Urgente</span>
            )}
            {concluida && (
              <span className={s.badgeConcluida}>✓ Meta atingida</span>
            )}
          </div>
          <h1 className={s.titulo}>{campanha.titulo}</h1>
          <p className={s.ong}>{campanha.ong} · {campanha.cidade}</p>
        </div>
      </div>

      <div className={s.metricasGrid}>
        <div className={s.metricaCard}>
          <span className={s.metricaLabel}>Meta total</span>
          <span className={s.metricaValor}>{fmt(campanha.meta)}</span>
        </div>
        <div className={s.metricaCard}>
          <span className={s.metricaLabel}>Arrecadado</span>
          <span className={s.metricaValor} style={{ color: campanha.cor }}>
            {fmt(campanha.arrecadado)}
          </span>
        </div>
        <div className={s.metricaCard}>
          <span className={s.metricaLabel}>{concluida ? 'Status' : 'Falta'}</span>
          {concluida ? (
            <span className={s.metricaValor} style={{ color: '#1D9E75' }}>Concluída!</span>
          ) : (
            <span className={s.metricaValor} style={{ color: '#DC2626' }}>{fmt(falta)}</span>
          )}
        </div>
      </div>

      <div className={s.progressoSection}>
        <div className={s.barraFundo}>
          <div
            className={s.barraFill}
            style={{ width: `${pct}%`, background: campanha.cor }}
          />
        </div>
        <span className={s.pct}>{pct}% da meta alcançada</span>
      </div>

      <div className={s.descricaoSection}>
        <p className={s.descricao}>{campanha.descricao}</p>
      </div>

      <div className={s.doadoresSection}>
        <h2 className={s.doadoresTitulo}>Doadores</h2>
        {campanha.doadores.length === 0 ? (
          <p className={s.semDoadores}>Seja o primeiro a apoiar esta campanha!</p>
        ) : (
          <ul className={s.doadoresList}>
            {campanha.doadores.map((d, i) => (
              <li key={i} className={s.doadorItem}>
                <div
                  className={s.doadorAvatar}
                  style={{ background: avatarCores[i % avatarCores.length] }}
                >
                  {d.avatar}
                </div>
                <div className={s.doadorInfo}>
                  <span className={s.doadorNome}>{d.nome}</span>
                  <span className={s.doadorData}>{fmtData(d.data)}</span>
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
