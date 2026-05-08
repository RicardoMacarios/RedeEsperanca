import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import s from './Cadastro.module.css';

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

const CAUSAS = [
  { value: 'animais', label: '🐾 Animais' },
  { value: 'meio_ambiente', label: '🌿 Meio Ambiente' },
  { value: 'saude_idosos', label: '❤️ Saúde & Idosos' },
  { value: 'educacao', label: '📚 Educação' },
];

function formatarCnpj(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

export default function CadastroOng() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', email: '', cnpj: '', senha: '', confirmarSenha: '',
    causa: '', descricao: '', cidade: '', estado: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'cnpj' ? formatarCnpj(value) : value });
    setErro('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.senha !== form.confirmarSenha) {
      return setErro('As senhas não coincidem');
    }
    if (form.senha.length < 6) {
      return setErro('A senha deve ter ao menos 6 caracteres');
    }
    if (!form.causa) {
      return setErro('Selecione a causa da ONG');
    }
    setCarregando(true);
    setErro('');
    try {
      await api.post('/auth/cadastro/ong', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cnpj: form.cnpj,
        descricao: form.descricao,
        cidade: form.cidade,
        estado: form.estado,
        causa: form.causa,
      });
      await login(form.email, form.senha);
      navigate('/dashboard/ong');
    } catch (err) {
      setErro(err?.response?.data?.erro || 'Erro ao cadastrar ONG');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={s.container}>
      {/* Lado esquerdo */}
      <div className={s.hero}>
        <div className={s.logo}>
          <div className={s.logoPonto} />
          <span className={s.logoTexto}>RedeEsperança</span>
        </div>
        <h1 className={s.heroTitulo}>Conecte sua ONG a voluntários incríveis</h1>
        <div className={s.causas}>
          {CAUSAS.map((c) => (
            <div key={c.value} className={s.causa}>{c.label}</div>
          ))}
        </div>
        <div className={s.circulo1} />
        <div className={s.circulo2} />
      </div>

      {/* Lado direito */}
      <div className={s.direito}>
        <div className={s.card}>
          <span className={s.badgeTipo}>🏢 ONG</span>
          <h2 className={s.cardTitulo}>Cadastrar ONG</h2>

          {erro && <p className={s.erro}>{erro}</p>}

          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.grupo}>
              <label className={s.label} htmlFor="nome">Nome da ONG</label>
              <input id="nome" className={s.input} name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da sua organização" required />
            </div>

            <div className={s.row}>
              <div>
                <label className={s.label} htmlFor="email">Email</label>
                <input id="email" className={s.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="contato@ong.org" required />
              </div>
              <div>
                <label className={s.label} htmlFor="cnpj">CNPJ</label>
                <input id="cnpj" className={s.input} name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" required />
              </div>
            </div>

            <div className={s.row}>
              <div>
                <label className={s.label} htmlFor="senha">Senha</label>
                <input id="senha" className={s.input} type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="••••••••" required />
              </div>
              <div>
                <label className={s.label} htmlFor="confirmarSenha">Confirmar senha</label>
                <input id="confirmarSenha" className={s.input} type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} placeholder="••••••••" required />
              </div>
            </div>

            <div className={s.grupo}>
              <label className={s.label} htmlFor="causa">Causa principal</label>
              <select id="causa" className={s.select} name="causa" value={form.causa} onChange={handleChange} required>
                <option value="">Selecione a causa</option>
                {CAUSAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div className={s.grupo}>
              <label className={s.label} htmlFor="descricao">Descrição <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
              <textarea
                id="descricao"
                className={s.textarea}
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Conte um pouco sobre a missão da sua ONG…"
                rows={3}
              />
            </div>

            <div className={s.row}>
              <div>
                <label className={s.label} htmlFor="cidade">Cidade</label>
                <input id="cidade" className={s.input} name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade sede" />
              </div>
              <div>
                <label className={s.label} htmlFor="estado">Estado</label>
                <select id="estado" className={s.select} name="estado" value={form.estado} onChange={handleChange}>
                  <option value="">Selecione</option>
                  {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>

            <button className={s.botaoPrimario} type="submit" disabled={carregando}>
              {carregando ? 'Cadastrando…' : 'Cadastrar ONG'}
            </button>
          </form>

          <p className={s.rodape}>
            Já tem conta? <Link to="/login">Entrar</Link> · <Link to="/cadastro/voluntario">Sou Voluntário</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
