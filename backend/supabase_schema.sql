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

CREATE TABLE campanhas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  causa VARCHAR(50) NOT NULL CHECK (causa IN ('animais', 'meio_ambiente', 'saude_idosos', 'educacao')),
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  icone VARCHAR(10),
  meta NUMERIC(12,2) NOT NULL CHECK (meta > 0),
  arrecadado NUMERIC(12,2) NOT NULL DEFAULT 0,
  ong VARCHAR(150),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  urgente BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nome VARCHAR(150) NOT NULL,
  valor NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  criado_em TIMESTAMP DEFAULT NOW()
);

ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE doacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role tem acesso total em campanhas" ON campanhas FOR ALL USING (true);
CREATE POLICY "Service role tem acesso total em doacoes" ON doacoes FOR ALL USING (true);
