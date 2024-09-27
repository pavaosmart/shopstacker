# Sistema de Logs de Atividade do MyShopTools

Este documento explica como o sistema de logs de atividades funciona no MyShopTools, onde está implementado e como consultar ou expandir os logs.

## Visão Geral

O sistema de logs de atividade registra ações importantes realizadas pelos usuários na plataforma. Isso inclui operações como criação, atualização e exclusão de produtos, bem como outras ações significativas.

## Implementação

### Estrutura do Banco de Dados

Os logs de atividade são armazenados na tabela `activity_logs` no Supabase com a seguinte estrutura:

```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Registro de Logs

O registro de logs é feito principalmente através da função `logActivity` no arquivo `src/utils/logActivity.js`:

```javascript
import { supabase } from '../integrations/supabase/supabase';

export const logActivity = async (userId, action, description) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ user_id: userId, action, description }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
```

Esta função é chamada em vários pontos da aplicação onde ações significativas ocorrem.

### Consulta de Logs

A consulta de logs é gerenciada pelo hook `useActivityLogs` em `src/hooks/useActivityLogs.js`:

```javascript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useActivityLogs = ({ page = 1, actionFilter, userFilter }) => {
  return useQuery({
    queryKey: ['activityLogs', page, actionFilter, userFilter],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('*, users!inner(email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * 10, page * 10 - 1);

      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      if (userFilter) {
        query = query.ilike('users.email', `%${userFilter}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, count };
    },
  });
};
```

## Uso do Sistema de Logs

### Registrando uma Atividade

Para registrar uma nova atividade, use a função `logActivity`:

```javascript
import { logActivity } from '../utils/logActivity';

// Dentro de uma função ou componente
await logActivity(userId, 'CREATE_PRODUCT', `Produto "${productName}" criado`);
```

### Consultando Logs

Para consultar logs, use o hook `useActivityLogs`:

```javascript
import { useActivityLogs } from '../hooks/useActivityLogs';

// Dentro de um componente
const { data: logs, isLoading, error } = useActivityLogs({
  page: 1,
  actionFilter: 'CREATE_PRODUCT',
  userFilter: 'john@example.com'
});
```

## Expandindo o Sistema de Logs

Para expandir o sistema de logs:

1. **Adicionar Novos Tipos de Ação**: Defina novos tipos de ação conforme necessário (ex: 'UPDATE_SETTINGS', 'EXPORT_DATA').

2. **Expandir a Tabela de Logs**: Se necessário, adicione novas colunas à tabela `activity_logs` para capturar informações adicionais.

3. **Melhorar a Função de Registro**: Modifique `logActivity` para incluir novos parâmetros ou lógica conforme necessário.

4. **Aprimorar as Consultas**: Atualize `useActivityLogs` para suportar novos filtros ou parâmetros de consulta.

5. **Interface do Usuário**: Atualize o componente `ActivityLogs` em `src/components/ActivityLogs.jsx` para exibir novos tipos de logs ou informações adicionais.

## Boas Práticas

- Mantenha as descrições dos logs concisas e informativas.
- Use tipos de ação consistentes em toda a aplicação.
- Considere implementar um sistema de retenção de logs para gerenciar o crescimento da tabela.
- Implemente controles de acesso adequados para visualização de logs.

## Monitoramento e Alertas

Considere implementar um sistema de monitoramento e alertas baseado nos logs de atividade para detectar atividades suspeitas ou erros críticos.

Lembre-se de atualizar esta documentação conforme o sistema de logs evolui.