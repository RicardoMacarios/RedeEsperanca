const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

function gerarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function cadastrarVoluntario(req, res) {
  const { nome, email, senha, telefone, cidade, estado } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
  }

  const { data: existente } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single();

  if (existente) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .insert({ nome, email, senha: senhaHash, telefone, cidade, estado, tipo: 'voluntario' })
    .select('id, nome, email, tipo, telefone, cidade, estado, criado_em')
    .single();

  if (error) {
    console.error('[cadastrarVoluntario] Supabase error:', error);
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }

  const token = gerarToken({ id: usuario.id, email: usuario.email, tipo: usuario.tipo });
  return res.status(201).json({ token, usuario });
}

async function cadastrarOng(req, res) {
  const { nome, email, senha, cnpj, descricao, cidade, estado, causa } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
  }

  const { data: existente } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single();

  if (existente) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const { data: usuario, error: erroUsuario } = await supabase
    .from('usuarios')
    .insert({ nome, email, senha: senhaHash, cidade, estado, tipo: 'ong' })
    .select('id, nome, email, tipo, cidade, estado, criado_em')
    .single();

  if (erroUsuario) {
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }

  const { error: erroOng } = await supabase
    .from('ongs')
    .insert({ usuario_id: usuario.id, cnpj, descricao, cidade, estado, causa });

  if (erroOng) {
    await supabase.from('usuarios').delete().eq('id', usuario.id);
    return res.status(500).json({ erro: 'Erro ao cadastrar ONG' });
  }

  const token = gerarToken({ id: usuario.id, email: usuario.email, tipo: usuario.tipo });
  return res.status(201).json({ token, usuario });
}

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (!usuario) {
    return res.status(401).json({ erro: 'Email ou senha inválidos' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Email ou senha inválidos' });
  }

  const { senha: _, ...dadosSemSenha } = usuario;
  const token = gerarToken({ id: usuario.id, email: usuario.email, tipo: usuario.tipo });
  return res.json({ token, usuario: dadosSemSenha });
}

async function me(req, res) {
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id, nome, email, tipo, telefone, cidade, estado, criado_em')
    .eq('id', req.user.id)
    .single();

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  return res.json({ usuario });
}

module.exports = { cadastrarVoluntario, cadastrarOng, login, me };
