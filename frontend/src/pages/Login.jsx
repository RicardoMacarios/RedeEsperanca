import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import s from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const usuario = await login(form.email, form.senha);
      navigate(usuario.tipo === 'ong' ? '/dashboard/ong' : '/dashboard');
    } catch (err) {
      setErro(err?.response?.data?.erro || 'Erro ao fazer login');
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
        <h1 className={s.heroTitulo}>Conectando quem quer ajudar</h1>
        <p className={s.heroSubtitulo}>
          Junte-se a milhares de voluntários e ONGs que transformam vidas todos os dias.
        </p>
        <div className={s.badges}>
          <span className={s.badge}>🐾 Animais</span>
          <span className={s.badge}>🌿 Meio Ambiente</span>
          <span className={s.badge}>❤️ Saúde & Idosos</span>
        </div>
        <div className={s.circulo1} />
        <div className={s.circulo2} />
      </div>

      {/* Lado direito */}
      <div className={s.direito}>
        <div className={s.card}>
          <h2 className={s.cardTitulo}>Entrar</h2>

          {erro && <p className={s.erro}>{erro}</p>}

          <form onSubmit={handleSubmit}>
            <div className={s.grupo}>
              <label className={s.label} htmlFor="email">Email</label>
              <input
                id="email"
                className={s.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={s.grupo}>
              <label className={s.label} htmlFor="senha">Senha</label>
              <input
                id="senha"
                className={s.input}
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button className={s.botaoPrimario} type="submit" disabled={carregando}>
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <div className={s.divisor}>Não tem conta?</div>

          <div className={s.botoesSecundarios}>
            <Link to="/cadastro/voluntario" className={s.botaoSecundario}>
              Sou Voluntário
            </Link>
            <Link to="/cadastro/ong" className={s.botaoSecundario}>
              Sou uma ONG
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
