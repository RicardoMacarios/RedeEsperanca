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

module.exports = { listarPendentes, avaliarCampanha };
