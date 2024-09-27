# Testes no MyShopTools

Este documento descreve a estratégia de testes do MyShopTools, incluindo testes unitários e de integração, e como executá-los.

## Visão Geral

O MyShopTools utiliza Jest como framework de teste principal, junto com React Testing Library para testes de componentes React. Os testes são divididos em duas categorias principais: testes unitários e testes de integração.

## Estrutura de Testes

Os testes estão localizados em arquivos com o sufixo `.test.js` ou `.spec.js`, próximos aos arquivos que estão testando. Por exemplo:

```
src/
  components/
    Button.jsx
    Button.test.jsx
  hooks/
    useProducts.js
    useProducts.test.js
```

## Testes Unitários

Os testes unitários focam em testar funções e componentes isoladamente.

### Exemplo de Teste de Componente

```javascript
// Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Exemplo de Teste de Hook

```javascript
// useProducts.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useProducts } from './useProducts';

test('useProducts returns products', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useProducts());

  await waitForNextUpdate();

  expect(result.current.products).toHaveLength(2);
});
```

## Testes de Integração

Os testes de integração verificam a interação entre diferentes partes do sistema.

### Exemplo de Teste de Integração

```javascript
// Dashboard.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './Dashboard';

test('Dashboard loads and displays products', async () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Product List')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
```

## Executando os Testes

Para executar os testes, use os seguintes comandos:

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo de observação
npm run test:watch
```

## Configuração de Testes

A configuração dos testes está definida no arquivo `jest.config.js` na raiz do projeto. Ele inclui configurações para:

- Transformações de arquivos
- Mocks de módulos
- Configuração de cobertura de código
- Configurações específicas do ambiente de teste

## Mocks

Para testes que envolvem chamadas à API ou ao Supabase, usamos mocks para simular as respostas. Exemplo:

```javascript
jest.mock('../integrations/supabase/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
}));
```

## Cobertura de Código

Executamos testes de cobertura para garantir que uma porcentagem significativa do código está sendo testada. O objetivo é manter uma cobertura de pelo menos 80% em todas as partes críticas do sistema.

Para ver o relatório de cobertura:

```bash
npm run test:coverage
```

## Boas Práticas

1. Escreva testes para todas as novas funcionalidades.
2. Mantenha os testes atualizados conforme o código evolui.
3. Use mocks com moderação, preferindo testes que se aproximem do uso real quando possível.
4. Foque em testar comportamentos, não implementações.
5. Mantenha os testes rápidos para facilitar execuções frequentes.

## Integração Contínua

Os testes são executados automaticamente em cada push e pull request através do GitHub Actions. A configuração está no arquivo `.github/workflows/test.yml`.

## Expandindo os Testes

Ao adicionar novas funcionalidades:

1. Escreva testes unitários para novas funções e componentes.
2. Atualize os testes de integração existentes ou crie novos conforme necessário.
3. Verifique se a cobertura de código permanece acima do limite estabelecido.

Lembre-se de atualizar esta documentação conforme as práticas de teste evoluem.