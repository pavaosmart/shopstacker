# Guia de Instalação do MyShopTools

Este guia fornecerá instruções detalhadas sobre como instalar e configurar o projeto MyShopTools.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (normalmente vem com Node.js)
- Conta no Supabase

## Passos de Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/myshoptools.git
   cd myshoptools
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
   ```
   VITE_SUPABASE_PROJECT_URL=sua_url_do_projeto_supabase
   VITE_SUPABASE_API_KEY=sua_chave_api_do_supabase
   ```

4. Configure o Supabase:
   - Crie um novo projeto no Supabase
   - No painel do Supabase, vá para "Settings" > "API"
   - Copie a "URL" e a "anon public" key para as variáveis de ambiente acima

5. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

6. Acesse o aplicativo em `http://localhost:5173` (ou a porta indicada no console)

## Configuração do Banco de Dados

O MyShopTools utiliza as seguintes tabelas no Supabase:

- `products`: Armazena informações sobre os produtos
- `activity_logs`: Registra as atividades dos usuários
- `users`: Gerencia informações dos usuários (criada automaticamente pelo Supabase Auth)

Certifique-se de que essas tabelas estejam criadas no seu projeto Supabase com as colunas apropriadas.

## Solução de Problemas

Se encontrar problemas durante a instalação, verifique:

1. Se todas as dependências foram instaladas corretamente
2. Se as variáveis de ambiente estão configuradas corretamente
3. Se o projeto Supabase está configurado corretamente e acessível

Para mais ajuda, consulte a documentação do Supabase ou abra uma issue no repositório do projeto.