import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Perfil = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta é a página de Perfil. Aqui você pode visualizar e editar suas informações pessoais.</p>
          {/* Adicione mais conteúdo do perfil aqui */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;