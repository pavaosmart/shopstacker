# Hooks Personalizados do MyShopTools

Este documento detalha os hooks personalizados criados para o MyShopTools, explicando seu propósito, uso e funcionalidades.

## useProducts

O hook `useProducts` gerencia todas as operações relacionadas aos produtos.

### Uso

```javascript
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';

// Dentro do componente
const { data: products, isLoading, error } = useProducts();
const addProductMutation = useAddProduct();
const updateProductMutation = useUpdateProduct();
const deleteProductMutation = useDeleteProduct();
```

### Funcionalidades

- `useProducts()`: Retorna uma lista de todos os produtos.
- `useAddProduct()`: Adiciona um novo produto.
- `useUpdateProduct()`: Atualiza um produto existente.
- `useDeleteProduct()`: Remove um produto.

### Exemplo

```javascript
// Adicionar um produto
addProductMutation.mutate(newProduct);

// Atualizar um produto
updateProductMutation.mutate({ id: productId, ...updatedData });

// Deletar um produto
deleteProductMutation.mutate(productId);
```

## useActivityLogs

O hook `useActivityLogs` gerencia a recuperação e adição de logs de atividade.

### Uso

```javascript
import { useActivityLogs } from '../hooks/useActivityLogs';

// Dentro do componente
const { data: logs, isLoading, error } = useActivityLogs({ page, actionFilter, userFilter });
```

### Funcionalidades

- Recupera logs de atividade com suporte a paginação e filtros.
- Integra-se com o Supabase para operações de banco de dados.

### Exemplo

```javascript
const { data: logs, isLoading, error } = useActivityLogs({
  page: 1,
  actionFilter: 'CREATE',
  userFilter: 'john@example.com'
});
```

## useSupabaseAuth

O hook `useSupabaseAuth` gerencia o estado de autenticação do usuário usando Supabase.

### Uso

```javascript
import { useSupabaseAuth } from '../integrations/supabase/auth';

// Dentro do componente
const { session, loading, logout } = useSupabaseAuth();
```

### Funcionalidades

- Gerencia o estado da sessão do usuário.
- Fornece função de logout.
- Indica quando o estado de autenticação está carregando.

### Exemplo

```javascript
if (loading) return <div>Loading...</div>;
if (session) {
  return (
    <div>
      <p>Logged in as: {session.user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Considerações de Desempenho

- Todos os hooks utilizam React Query para gerenciamento eficiente de estado e cache.
- As operações de mutação (adicionar, atualizar, deletar) invalidam automaticamente as queries relevantes para manter a consistência dos dados.

## Extensibilidade

Para adicionar novos hooks ou expandir os existentes:

1. Crie um novo arquivo na pasta `/src/hooks` ou modifique os existentes.
2. Siga o padrão de uso do React Query para consultas e mutações.
3. Exporte os novos hooks do arquivo `index.js` na pasta hooks para fácil importação.

Lembre-se de atualizar esta documentação ao adicionar ou modificar hooks significativamente.