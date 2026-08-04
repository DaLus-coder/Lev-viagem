/// ESTRUTURA DE PASTAS ///

LEV-VIAGENS/
│
├── .vscode/
│
├── lev_viagens_files/
│   │
│   ├── backup/
│   │   └── context-project-ai.txt
│   │
│   ├── frontend/
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.js
│   │   │   ├── index.html
│   │   │   ├── login.html
│   │   │   └── login.js
│   │   │
│   │   ├── alugueis/
│   │   │   ├── alugueis.css
│   │   │   ├── alugueis.html
│   │   │   └── alugueis.js
│   │   │
│   │   ├── img/
│   │   │
│   │   ├── maintenance/
│   │   │   └── oopppssss.html
│   │   │
│   │   ├── auth.js
│   │   ├── index.css
│   │   ├── index.html
│   │   ├── index.js
│   │   ├── login.css
│   │   ├── login.html
│   │   └── login.js
│   │
│   └── viagenslev-backend/
│       │
│       ├── database/
│       │   └── conexao.js
│       │
│       ├── node_modules/
│       │
│       ├── uploads/
│       │
│       ├── .env
│       ├── gerar-admin.js
│       ├── package-lock.json
│       ├── package.json
│       └── server.js
│
└── .gitignore


__________________________________________________________

✅ Frontend: Netlify
✅ Backend: Render
✅ Banco de dados: Supabase
✅ Imagens: Cloudinary

//database

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cards (
  id bigint NOT NULL DEFAULT nextval('cards_id_seq'::regclass),
  titulo text NOT NULL,
  descricao text,
  preco text,
  imagem text,
  destaque boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  categoria text,
  botao_texto text,
  CONSTRAINT cards_pkey PRIMARY KEY (id)
);
CREATE TABLE public.usuarios (
  id bigint NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
  nome text,
  email text UNIQUE,
  senha text,
  telefone text,
  created_at timestamp without time zone DEFAULT now(),
  cidade text,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reservas (
  id bigint NOT NULL DEFAULT nextval('reservas_id_seq'::regclass),
  cliente_id bigint,
  destino text,
  data_viagem date,
  quantidade integer,
  status text DEFAULT 'pendente'::text,
  CONSTRAINT reservas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.admins (
  id bigint NOT NULL DEFAULT nextval('admins_id_seq'::regclass),
  usuario text UNIQUE,
  senha text,
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);