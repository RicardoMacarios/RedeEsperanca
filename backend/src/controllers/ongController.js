const supabase = require('../config/supabase');

async function listarOngs(req, res) {
  const { data: ongs, error } = await supabase
    .from('ongs')
    .select('*, usuarios(id, nome)')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('[listarOngs]', error);
    return res.status(500).json({ erro: 'Erro ao buscar ONGs' });
  }
  return res.json({ ongs });
}

async function campanhasDaOng(req, res) {
  const { id } = req.params;

  const { data: ong, error: erroOng } = await supabase
    .from('ongs')
    .select('usuario_id')
    .eq('id', id)
    .single();

  if (erroOng || !ong) {
    return res.status(404).json({ erro: 'ONG não encontrada' });
  }

  const { data: campanhas, error } = await supabase
    .from('campanhas')
    .select('*, doacoes(id, nome, valor, criado_em)')
    .eq('usuario_id', ong.usuario_id)
    .eq('status', 'aprovada')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('[campanhasDaOng]', error);
    return res.status(500).json({ erro: 'Erro ao buscar campanhas da ONG' });
  }
  return res.json({ campanhas });
}

module.exports = { listarOngs, campanhasDaOng };
