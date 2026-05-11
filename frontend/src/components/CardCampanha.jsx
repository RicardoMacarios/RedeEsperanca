import React from 'react';
import s from './CardCampanha.module.css';

const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

export default function CardCampanha({ campanha, onClick, index = 0 }) {
  const pct = Math.min(Math.round((campanha.arrecadado / campanha.meta) * 100), 100);
  const concluida = campanha.arrecadado >= campanha.meta;
  const falta = campanha.meta - campanha.arrecadado;

  return (
    <div
      className={s.card}
      onClick={onClick}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={s.topo}>
        <div className={s.icone} style={{ background: campanha.corClara }}>
          <span>{campanha.icone}</span>
        </div>
        <div className={s.badges}>
          {campanha.urgente && !concluida && (
            <span className={s.badgeUrgente}>Urgente</span>
          )}
          {concluida && (
            <span className={s.badgeConcluida}>✓ Meta atingida</span>
          )}
        </div>
      </div>

      <h3 className={s.titulo}>{campanha.titulo}</h3>
      <p className={s.ong}>{campanha.ong} · {campanha.cidade}</p>
      <p className={s.descricao}>{campanha.descricao}</p>

      <div className={s.barraFundo}>
        <div
          className={s.barraFill}
          style={{ width: `${pct}%`, background: campanha.cor }}
        />
      </div>
      <div className={s.barraInfo}>
        <span style={{ color: campanha.cor, fontWeight: 600 }}>{fmt(campanha.arrecadado)}</span>
        <span className={s.pct}>{pct}%</span>
      </div>

      <div className={s.rodape}>
        <div className={s.stat}>
          <span className={s.statLabel}>Meta</span>
          <span className={s.statValor}>{fmt(campanha.meta)}</span>
        </div>
        {!concluida && (
          <div className={s.stat}>
            <span className={s.statLabel}>Falta</span>
            <span className={`${s.statValor} ${s.falta}`}>{fmt(falta)}</span>
          </div>
        )}
        <div className={s.stat}>
          <span className={s.statLabel}>Doadores</span>
          <span className={s.statValor}>{(campanha.doacoes ?? campanha.doadores ?? []).length}</span>
        </div>
      </div>
    </div>
  );
}
