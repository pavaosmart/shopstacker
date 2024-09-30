import React, { useState, useEffect } from 'react';
import { fetchBots } from '../utils/supabaseHelpers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ApiConnectionTest = () => {
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBots = await fetchBots();
      setBots(fetchedBots);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Teste de Conexão da API</h2>
      <Button onClick={testConnection} disabled={isLoading}>
        {isLoading ? 'Testando...' : 'Testar Conexão e Importar Bots'}
      </Button>
      {error && <p className="text-red-500 mt-2">Erro: {error}</p>}
      {bots.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Bots Importados:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <CardTitle>{bot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{bot.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;