import React from 'react';
import { useUserProducts } from '../hooks/useUserProducts';
import ProductCard from '../components/ProductCard';

const MeusProdutos = () => {
  const { data: userProducts, isLoading, error } = useUserProducts();

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Produtos</h1>
      {userProducts && userProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>Você ainda não adicionou nenhum produto.</p>
      )}
    </div>
  );
};

export default MeusProdutos;