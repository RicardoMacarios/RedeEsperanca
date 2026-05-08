CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  telefone VARCHAR(20),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('voluntario', 'ong')),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ongs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  descricao TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  causa VARCHAR(50) CHECK (causa IN ('animais', 'meio_ambiente', 'saude_idosos', 'educacao')),
  aprovada BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT NOW()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ongs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role tem acesso total em usuarios" ON usuarios FOR ALL USING (true);
CREATE POLICY "Service role tem acesso total em ongs" ON ongs FOR ALL USING (true);
