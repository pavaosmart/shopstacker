import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Vendas = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta é a página de Vendas. Aqui você poderá ver um resumo das suas vendas e gerenciar pedidos.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendas;