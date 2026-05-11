const supabase = require('../config/supabase');

async function criarCampanha(req, res) {
  const { causa, titulo, descricao, icone, meta, ong, cidade, estado, urgente } = req.body;

  if (!causa || !titulo || !meta) {
    return res.status(400).json({ erro: 'Causa, título e meta são obrigatórios' });
  }

  // Upload das fotos para o Supabase Storage
  const urlsFotos = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const nomeArquivo = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.mimetype.split('/')[1]}`;
      const { error: erroUpload } = await supabase.storage
        .from('campanhas-fotos')
        .upload(nomeArquivo, file.buffer, { contentType: file.mimetype });

      if (!erroUpload) {
        const { data: urlData } = supabase.storage
          .from('campanhas-fotos')
          .getPublicUrl(nomeArquivo);
        urlsFotos.push(urlData.publicUrl);
      }
    }
  }

  const { data: campanha, error } = await supabase
    .from('campanhas')
    .insert({
      usuario_id: req.user.id,
      causa,
      titulo,
      descricao,
      icone,
      meta,
      ong,
      cidade,
      estado,
      urgente: urgente === 'true' || urgente === true,
      status: 'pendente',
      fotos: urlsFotos,
    })
    .select()
    .single();

  if (error) {
    console.error('[criarCampanha] Supabase error:', error);
    return res.status(500).json({ erro: 'Erro ao criar campanha' });
  }

  return res.status(201).json({ campanha });
}

async function listarCampanhas(req, res) {
  const { causa } = req.query;

  let query = supabase
    .from('campanhas')
    .select('*, doacoes(id, nome, valor, criado_em)')
    .eq('status', 'aprovada')
    .order('criado_em', { ascending: false });

  if (causa && causa !== 'todas') {
    query = query.eq('causa', causa);
  }

  const { data: campanhas, error } = await query;

  if (error) {
    console.error('[listarCampanhas] Supabase error:', error);
    return res.status(500).json({ erro: 'Erro ao buscar campanhas' });
  }

  return res.json({ campanhas });
}

async function detalharCampanha(req, res) {
  const { id } = req.params;

  const { data: campanha, error } = await supabase
    .from('campanhas')
    .select('*, doacoes(id, nome, valor, criado_em)')
    .eq('id', id)
    .eq('status', 'aprovada')
    .single();

  if (error || !campanha) {
    return res.status(404).json({ erro: 'Campanha não encontrada' });
  }

  return res.json({ campanha });
}

async function registrarDoacao(req, res) {
  const { id: campanha_id } = req.params;
  const { nome, valor } = req.body;

  if (!nome || !valor || valor <= 0) {
    return res.status(400).json({ erro: 'Nome e valor válido são obrigatórios' });
  }

  const { data: campanha, error: erroCampanha } = await supabase
    .from('campanhas')
    .select('id, arrecadado, meta')
    .eq('id', campanha_id)
    .eq('status', 'aprovada')
    .single();

  if (erroCampanha || !campanha) {
    return res.status(404).json({ erro: 'Campanha não encontrada' });
  }

  const { data: doacao, error: erroDoacao } = await supabase
    .from('doacoes')
    .insert({
      campanha_id,
      usuario_id: req.user.id,
      nome,
      valor,
    })
    .select()
    .single();

  if (erroDoacao) {
    console.error('[registrarDoacao] Supabase error:', erroDoacao);
    return res.status(500).json({ erro: 'Erro ao registrar doação' });
  }

  await supabase
    .from('campanhas')
    .update({ arrecadado: Number(campanha.arrecadado) + Number(valor) })
    .eq('id', campanha_id);

  return res.status(201).json({ doacao });
}

module.exports = { criarCampanha, listarCampanhas, detalharCampanha, registrarDoacao };
