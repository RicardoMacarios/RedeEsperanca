import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import s from './CriarCampanha.module.css';

const causas = [
  { id: 'animais', label: 'Animais', icone: '🐾', cor: '#1D9E75', corClara: '#E1F5EE' },
  { id: 'meio_ambiente', label: 'Meio Ambiente', icone: '🌿', cor: '#639922', corClara: '#EAF3DE' },
  { id: 'saude_idosos', label: 'Saúde & Idosos', icone: '❤️', cor: '#378ADD', corClara: '#E6F1FB' },
  { id: 'educacao', label: 'Educação', icone: '📚', cor: '#BA7517', corClara: '#FAEEDA' },
];

const estados = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
];

const inicial = {
  causa: '',
  titulo: '',
  descricao: '',
  meta: '',
  ong: '',
  cidade: '',
  estado: '',
  urgente: false,
};

export default function CriarCampanha() {
  const navigate = useNavigate();
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErro('');
  }

  function selecionarCausa(id) {
    setForm((f) => ({ ...f, causa: id }));
    setErro('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.causa) { setErro('Selecione uma causa.'); return; }
    if (form.titulo.trim().length < 10) { setErro('O título deve ter ao menos 10 caracteres.'); return; }
    if (form.descricao.trim().length < 30) { setErro('A descrição deve ter ao menos 30 caracteres.'); return; }
    if (!form.meta || Number(form.meta) <= 0) { setErro('Informe uma meta válida.'); return; }
    if (!form.ong.trim()) { setErro('Informe o nome da ONG ou organização.'); return; }
    if (!form.cidade.trim() || !form.estado) { setErro('Informe cidade e estado.'); return; }

    const causaInfo = causas.find((c) => c.id === form.causa);

    setEnviando(true);
    try {
      await api.post('/campanhas', {
        causa: form.causa,
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        icone: causaInfo.icone,
        meta: Number(form.meta),
        ong: form.ong.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado,
        urgente: form.urgente,
      });
      setSucesso(true);
    } catch (err) {
      setErro(err?.response?.data?.erro || 'Erro ao enviar campanha. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className={s.page}>
        <div className={s.sucesso}>
          <span className={s.sucessoIcone}>✓</span>
          <h1 className={s.sucessoTitulo}>Campanha enviada!</h1>
          <p className={s.sucessoTexto}>
            Nossa equipe irá analisar sua campanha e você receberá uma resposta em breve.
            Após aprovação, ela aparecerá no dashboard para todos os voluntários.
          </p>
          <button className={s.btnPrimario} onClick={() => navigate('/dashboard')}>
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <button className={s.voltar} onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>

        <div className={s.cabecalho}>
          <h1 className={s.titulo}>Nova campanha</h1>
          <p className={s.subtitulo}>
            Preencha os dados da campanha. Após o envio, nossa equipe irá analisá-la antes de publicar.
          </p>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>

          <div className={s.grupo}>
            <label className={s.label}>Causa <span className={s.obrigatorio}>*</span></label>
            <div className={s.causasGrid}>
              {causas.map((c) => {
                const ativo = form.causa === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={s.causaBtn}
                    style={ativo ? { borderColor: c.cor, background: c.corClara, color: c.cor } : {}}
                    onClick={() => selecionarCausa(c.id)}
                  >
                    <span className={s.causaIcone}>{c.icone}</span>
                    <span className={s.causaLabel}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={s.grupo}>
            <label className={s.label} htmlFor="titulo">
              Título <span className={s.obrigatorio}>*</span>
            </label>
            <input
              id="titulo"
              className={s.input}
              name="titulo"
              type="text"
              placeholder="Ex: Lar temporário para cães resgatados"
              value={form.titulo}
              onChange={handleChange}
              maxLength={200}
            />
            <span className={s.dica}>{form.titulo.length}/200 caracteres</span>
          </div>

          <div className={s.grupo}>
            <label className={s.label} htmlFor="descricao">
              Descrição <span className={s.obrigatorio}>*</span>
            </label>
            <textarea
              id="descricao"
              className={s.textarea}
              name="descricao"
              placeholder="Descreva o objetivo da campanha, quem será beneficiado e como o dinheiro será utilizado..."
              value={form.descricao}
              onChange={handleChange}
              rows={5}
            />
            <span className={s.dica}>{form.descricao.length} caracteres (mín. 30)</span>
          </div>

          <div className={s.grupo}>
            <label className={s.label} htmlFor="meta">
              Meta de arrecadação (R$) <span className={s.obrigatorio}>*</span>
            </label>
            <input
              id="meta"
              className={s.input}
              name="meta"
              type="number"
              placeholder="Ex: 15000"
              value={form.meta}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className={s.grupo}>
            <label className={s.label} htmlFor="ong">
              Nome da ONG ou organização <span className={s.obrigatorio}>*</span>
            </label>
            <input
              id="ong"
              className={s.input}
              name="ong"
              type="text"
              placeholder="Ex: Instituto Patinhas"
              value={form.ong}
              onChange={handleChange}
              maxLength={150}
            />
          </div>

          <div className={s.duplo}>
            <div className={s.grupo}>
              <label className={s.label} htmlFor="cidade">
                Cidade <span className={s.obrigatorio}>*</span>
              </label>
              <input
                id="cidade"
                className={s.input}
                name="cidade"
                type="text"
                placeholder="Ex: São Paulo"
                value={form.cidade}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
            <div className={s.grupo}>
              <label className={s.label} htmlFor="estado">
                Estado <span className={s.obrigatorio}>*</span>
              </label>
              <select
                id="estado"
                className={s.select}
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="">UF</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          <label className={s.checkLabel}>
            <input
              className={s.checkbox}
              type="checkbox"
              name="urgente"
              checked={form.urgente}
              onChange={handleChange}
            />
            <span>Marcar como urgente</span>
          </label>

          {erro && <p className={s.erro}>{erro}</p>}

          <button className={s.btnPrimario} type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar para aprovação'}
          </button>
        </form>
      </div>
    </div>
  );
}
