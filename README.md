# RedeEsperança

Plataforma que conecta voluntários a ONGs engajadas em causas sociais e ambientais.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 18, React Router v6, CSS Modules, Vite |
| Backend | Node.js, Express, JWT (jsonwebtoken), bcryptjs |
| Banco de dados | Supabase (PostgreSQL via @supabase/supabase-js) |

## Estrutura de pastas

```
redeesperanca/
├── backend/
│   ├── src/
│   │   ├── config/supabase.js        # cliente Supabase
│   │   ├── controllers/authController.js
│   │   ├── middleware/auth.js        # validação JWT
│   │   ├── routes/auth.js
│   │   └── server.js
│   ├── supabase_schema.sql
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/RotaProtegida.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/Login.jsx + Login.module.css
    │   ├── pages/CadastroVoluntario.jsx
    │   ├── pages/CadastroOng.jsx
    │   ├── pages/Cadastro.module.css
    │   ├── pages/Dashboard.jsx
    │   ├── services/api.js           # axios com interceptor
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Como rodar

### 1. Banco de dados — Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Acesse **SQL Editor** e execute o conteúdo de `backend/supabase_schema.sql`
3. Anote a **Project URL** e a **service_role key** (em Settings → API)

### 2. Backend

```bash
cd backend
cp .env.example .env
# edite .env com suas credenciais do Supabase e um JWT_SECRET forte
npm install
npm run dev
```

O servidor sobe em `http://localhost:3001`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Rotas da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/auth/cadastro/voluntario` | Registra novo voluntário | — |
| `POST` | `/api/auth/cadastro/ong` | Registra ONG + registro na tabela ongs | — |
| `POST` | `/api/auth/login` | Autentica e retorna token JWT | — |
| `GET`  | `/api/auth/me` | Retorna dados do usuário autenticado | Bearer token |

Todas as respostas são JSON. Em caso de erro a chave `erro` contém a mensagem.
