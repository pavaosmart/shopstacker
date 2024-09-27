# Guia de API do MyShopTools

Este guia fornece informações sobre as principais rotas e operações de API do MyShopTools, incluindo interações com o Supabase.

## Autenticação

Todas as operações de API requerem autenticação. O MyShopTools utiliza o Supabase para autenticação.

## Produtos

### Listar Produtos

- **Método**: GET
- **Endpoint**: `/rest/v1/products`
- **Descrição**: Retorna uma lista de todos os produtos.

Exemplo de uso com Supabase:
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*');
```

### Adicionar Produto

- **Método**: POST
- **Endpoint**: `/rest/v1/products`
- **Descrição**: Adiciona um novo produto.

Exemplo de uso com Supabase:
```javascript
const { data, error } = await supabase
  .from('products')
  .insert([{ name, price, description }]);
```

### Atualizar Produto

- **Método**: PATCH
- **Endpoint**: `/rest/v1/products?id=eq.{id}`
- **Descrição**: Atualiza um produto existente.

Exemplo de uso com Supabase:
```javascript
const { data, error } = await supabase
  .from('products')
  .update({ name, price, description })
  .eq('id', productId);
```

### Deletar Produto

- **Método**: DELETE
- **Endpoint**: `/rest/v1/products?id=eq.{id}`
- **Descrição**: Remove um produto.

Exemplo de uso com Supabase:
```javascript
const { data, error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);
```

## Logs de Atividade

### Listar Logs de Atividade

- **Método**: GET
- **Endpoint**: `/rest/v1/activity_logs`
- **Descrição**: Retorna uma lista de logs de atividade.

Exemplo de uso com Supabase:
```javascript
const { data, error } = await supabase
  .from('activity_logs')
  .select('*')
  .order('created_at', { ascending: false });
```

### Adicionar Log de Atividade

- **Método**: POST
- **Endpoint**: `/rest/v1/activity_logs`
- **Descrição**: Adiciona um novo log de atividade.

Exemplo de uso com Supabase:
```javascript
const { data, error } = await supabase
  .from('activity_logs')
  .insert([{ user_id, action, description }]);
```

## Usuários

As operações de usuário são gerenciadas principalmente pelo Supabase Auth. Consulte a [documentação do Supabase Auth](https://supabase.io/docs/guides/auth) para mais detalhes sobre operações como registro, login e gerenciamento de perfil.

Para operações personalizadas relacionadas a usuários, você pode interagir diretamente com a tabela `users` no Supabase, seguindo padrões similares aos exemplos acima.

## Tratamento de Erros

Todas as operações de API podem retornar erros. Certifique-se de verificar o objeto `error` retornado pelo Supabase e tratar adequadamente em sua aplicação.

## Paginação e Filtros

Para operações de listagem, você pode usar os métodos de paginação e filtro do Supabase. Por exemplo:

```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .range(0, 9)  // Primeiros 10 resultados
  .order('name', { ascending: true });
```

Consulte a [documentação do Supabase](https://supabase.io/docs) para mais detalhes sobre operações avançadas de consulta.