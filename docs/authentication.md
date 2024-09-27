# Autenticação no MyShopTools

## Configuração do Supabase

1. O projeto usa o Supabase para autenticação.
2. As credenciais do Supabase estão armazenadas no arquivo `.env`:
   ```
   VITE_SUPABASE_PROJECT_URL=https://otzetvgrtxrpkxxqehgb.supabase.co
   VITE_SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90emV0dmdydHhycGt4eHFlaGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MDc3MDksImV4cCI6MjA0Mjk4MzcwOX0.cI6uRP5WGhaNN66csTebyE9D_2KxbyMCaIe9EUuJeKI
   ```

## Implementação da Autenticação

1. O componente `Login.jsx` lida com o login e registro de usuários.
2. Usamos o hook `useNavigate` do React Router para redirecionamento após o login.
3. O estado de autenticação é gerenciado pelo contexto `SupabaseAuthContext`.

## Fluxo de Autenticação

1. Login:
   - O usuário insere email e senha.
   - A função `handleLogin` é chamada ao submeter o formulário.
   - Usamos `supabase.auth.signInWithPassword` para autenticar.
   - Em caso de sucesso, o usuário é redirecionado para a página inicial.
   - Erros são tratados e exibidos ao usuário.

2. Registro:
   - O usuário insere email e senha para criar uma nova conta.
   - A função `handleSignUp` é chamada ao submeter o formulário.
   - Usamos `supabase.auth.signUp` para criar a conta.
   - O usuário é notificado para verificar o email após o registro bem-sucedido.

3. Logout:
   - Implementado na função `handleLogout` no componente `Dashboard`.
   - Usa `supabase.auth.signOut()` para fazer logout.

## Proteção de Rotas

- O componente `ProtectedRoute` é usado para proteger rotas que requerem autenticação.
- Verifica se existe uma sessão ativa antes de renderizar o componente protegido.

## Tratamento de Erros

- Erros de autenticação são capturados e exibidos ao usuário usando o componente `toast`.
- Mensagens de erro específicas são fornecidas para credenciais inválidas e outros problemas.

## Próximos Passos

1. Implementar recuperação de senha.
2. Adicionar autenticação com provedores externos (Google, Facebook, etc.).
3. Melhorar a validação de formulários no frontend.
4. Implementar um sistema de roles para controle de acesso granular.

Lembre-se de manter este documento atualizado conforme novas funcionalidades de autenticação forem adicionadas ou modificadas.