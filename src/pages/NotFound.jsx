import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">404 - Página Não Encontrada</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Desculpe, a página que você está procurando não existe.</p>
          <Button asChild>
            <Link to="/">Voltar para a Página Inicial</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;