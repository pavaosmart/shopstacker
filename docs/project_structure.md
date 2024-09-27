# Estrutura do Projeto MyShopTools

Este documento fornece uma visão geral da estrutura de pastas e arquivos do projeto MyShopTools, com uma breve explicação de cada seção principal.

```
myshoptools/
├── docs/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Diretórios Principais

### `/docs`
Contém toda a documentação do projeto, incluindo este guia de estrutura do projeto.

### `/public`
Armazena arquivos estáticos que são servidos diretamente, como o favicon e imagens.

### `/src`
Contém todo o código-fonte da aplicação.

#### `/src/components`
Componentes React reutilizáveis da aplicação.

- `ActivityLogs.jsx`: Componente para exibir logs de atividade.
- `ui/`: Componentes de UI reutilizáveis (botões, inputs, etc.).

#### `/src/hooks`
Hooks personalizados do React.

- `useProducts.js`: Hook para gerenciar operações relacionadas a produtos.
- `useActivityLogs.js`: Hook para gerenciar logs de atividade.

#### `/src/integrations`
Código relacionado a integrações externas, principalmente Supabase.

- `supabase/`: Configuração e utilitários relacionados ao Supabase.

#### `/src/lib`
Bibliotecas e utilitários gerais.

- `utils.js`: Funções utilitárias gerais.

#### `/src/pages`
Componentes de página principais da aplicação.

- `Dashboard.jsx`: Página principal do dashboard.
- `Login.jsx`: Página de login.

#### `/src/utils`
Funções utilitárias específicas da aplicação.

### Arquivos Principais

- `App.jsx`: Componente raiz da aplicação React.
- `index.css`: Estilos globais da aplicação.
- `main.jsx`: Ponto de entrada da aplicação React.
- `.env`: Arquivo de configuração para variáveis de ambiente.
- `index.html`: Arquivo HTML principal.
- `package.json`: Configuração do projeto e dependências.
- `vite.config.js`: Configuração do Vite (bundler).

## Convenções de Nomenclatura

- Componentes React: PascalCase (ex: `ProductList.jsx`)
- Hooks: camelCase, prefixados com "use" (ex: `useProducts.js`)
- Utilitários e funções: camelCase (ex: `formatCurrency.js`)

## Fluxo de Dados

O fluxo de dados na aplicação geralmente segue este padrão:

1. Os componentes de página (`/src/pages`) renderizam a estrutura principal.
2. Eles utilizam componentes menores de `/src/components` para a interface do usuário.
3. Os dados são gerenciados através de hooks personalizados em `/src/hooks`.
4. As integrações externas, como Supabase, são acessadas através de `/src/integrations`.

Esta estrutura promove a separação de preocupações e facilita a manutenção e escalabilidade do projeto.