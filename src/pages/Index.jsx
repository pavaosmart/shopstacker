import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo ao ShopTools</h1>
      <p className="text-xl mb-8">Gerencie seus produtos e monitore suas atividades com facilidade.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/dashboard">Ir para o Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/products">Ver Produtos</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;