const supabase = require('../config/supabase');

async function listarPendentes(req, res) {
  const { data: campanhas, error } = await supabase
    .from('campanhas')
    .select('*, usuarios(nome, email)')
    .eq('status', 'pendente')
    .order('criado_em', { ascending: true });

  if (error) {
    console.error('[listarPendentes] Supabase error:', error);
    return res.status(500).json({ erro: 'Erro ao buscar campanhas pendentes' });
  }

  return res.json({ campanhas });
}

async function avaliarCampanha(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['aprovada', 'rejeitada'].includes(status)) {
    return res.status(400).json({ erro: 'Status deve ser "aprovada" ou "rejeitada"' });
  }

  const { data: campanha, error } = await supabase
    .from('campanhas')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error || !campanha) {
    console.error('[avaliarCampanha] Supabase error:', error);
    return res.status(404).json({ erro: 'Campanha não encontrada' });
  }

  return res.json({ campanha });
}

async function listarTodas(req, res) {
  const { data: campanhas, error } = await supabase
    .from('campanhas')
    .select('*, usuarios(nome, email)')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('[listarTodas] Supabase error:', error);
    return res.status(500).json({ erro: 'Erro ao buscar campanhas' });
  }
  return res.json({ campanhas });
}

async function excluirCampanha(req, res) {
  const { id } = req.params;

  const { error } = await supabase
    .from('campanhas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[excluirCampanha] Supabase error:', error);
    return res.status(500).json({ erro: 'Erro ao excluir campanha' });
  }
  return res.json({ mensagem: 'Campanha excluída com sucesso' });
}

async function listarOngs(req, res) {
  const { data: ongs, error } = await supabase
    .from('ongs')
    .select('*, usuarios(id, nome, email)')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('[listarOngs admin]', error);
    return res.status(500).json({ erro: 'Erro ao buscar ONGs' });
  }
  return res.json({ ongs });
}

async function excluirOng(req, res) {
  const { id } = req.params;

  const { error } = await supabase
    .from('ongs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[excluirOng]', error);
    return res.status(500).json({ erro: 'Erro ao excluir ONG' });
  }
  return res.json({ mensagem: 'ONG excluída com sucesso' });
}

module.exports = { listarPendentes, avaliarCampanha, listarTodas, excluirCampanha, listarOngs, excluirOng };
