import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Configuracoes = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta é a página de Configurações. Aqui você pode ajustar as configurações do sistema.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;