import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import s from './Cadastro.module.css';

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export default function CadastroVoluntario() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '',
    telefone: '', estado: '', cidade: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    setCarregando(true);
    setErro('');
    try {
      await api.post('/auth/cadastro/voluntario', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        telefone: form.telefone,
        cidade: form.cidade,
        estado: form.estado,
      });
      await login(form.email, form.senha);
      navigate('/dashboard');
    } catch (err) {
      setErro(err?.response?.data?.erro || 'Erro ao cadastrar');
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
        <h1 className={s.heroTitulo}>Faça a diferença como voluntário</h1>
        <div className={s.stats}>
          <div className={s.stat}>
            <span className={s.statNumero}>87</span>
            <span className={s.statLabel}>ONGs parceiras</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNumero}>34</span>
            <span className={s.statLabel}>Campanhas ativas</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNumero}>1.2k</span>
            <span className={s.statLabel}>Voluntários</span>
          </div>
        </div>
        <div className={s.circulo1} />
        <div className={s.circulo2} />
      </div>

      {/* Lado direito */}
      <div className={s.direito}>
        <div className={s.card}>
          <span className={s.badgeTipo}>🙋 Voluntário</span>
          <h2 className={s.cardTitulo}>Criar conta</h2>

          {erro && <p className={s.erro}>{erro}</p>}

          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.grupo}>
              <label className={s.label} htmlFor="nome">Nome completo</label>
              <input id="nome" className={s.input} name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" required />
            </div>

            <div className={s.grupo}>
              <label className={s.label} htmlFor="email">Email</label>
              <input id="email" className={s.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
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

            <div className={s.row}>
              <div>
                <label className={s.label} htmlFor="telefone">Telefone</label>
                <input id="telefone" className={s.input} name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className={s.label} htmlFor="estado">Estado</label>
                <select id="estado" className={s.select} name="estado" value={form.estado} onChange={handleChange}>
                  <option value="">Selecione</option>
                  {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>

            <div className={s.grupo}>
              <label className={s.label} htmlFor="cidade">Cidade</label>
              <input id="cidade" className={s.input} name="cidade" value={form.cidade} onChange={handleChange} placeholder="Sua cidade" />
            </div>

            <button className={s.botaoPrimario} type="submit" disabled={carregando}>
              {carregando ? 'Criando conta…' : 'Criar conta'}
            </button>
          </form>

          <p className={s.rodape}>
            Já tem conta? <Link to="/login">Entrar</Link> · <Link to="/cadastro/ong">Sou uma ONG</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
