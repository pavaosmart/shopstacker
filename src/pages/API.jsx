import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection, listAssistants, createAssistant } from '../utils/openai';

const API = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [newBotName, setNewBotName] = useState('');
  const [newBotDescription, setNewBotDescription] = useState('');
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchApiKey();
      fetchBots();
    }
  }, [session]);

  const fetchApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('openai_api_key')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      
      if (data?.openai_api_key) {
        setOpenaiApiKey(data.openai_api_key);
        initializeOpenAI(data.openai_api_key);
      }
    } catch (error) {
      console.error('Erro ao buscar chave da API:', error);
      toast.error('Falha ao carregar a chave da API');
    }
  };

  const fetchBots = async () => {
    try {
      const botsList = await listAssistants();
      setBots(botsList);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar a lista de bots');
    }
  };

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: session.user.id, openai_api_key: openaiApiKey })
        .select();

      if (error) throw error;

      initializeOpenAI(openaiApiKey);
      await testConnection();
      toast.success('Chave da API salva e testada com sucesso');
      fetchBots();
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = async () => {
    if (!newBotName.trim()) {
      toast.error('Nome do bot é obrigatório');
      return;
    }
    setIsLoading(true);
    try {
      const assistant = await createAssistant(newBotName, newBotDescription);
      toast.success('Bot criado com sucesso!');
      setNewBotName('');
      setNewBotDescription('');
      fetchBots();
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error('Falha ao criar bot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Configurações de API</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* OpenAI Card */}
        <Card>
          <CardHeader>
            <CardTitle>OpenAI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="Chave da API OpenAI"
                  className="mb-2"
                />
                <Button onClick={handleSaveApiKey} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar e Testar Chave'}
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Criar Novo Bot</h3>
                <Input
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="Nome do Bot"
                  className="mb-2"
                />
                <Input
                  value={newBotDescription}
                  onChange={(e) => setNewBotDescription(e.target.value)}
                  placeholder="Descrição do Bot"
                  className="mb-2"
                />
                <Button onClick={handleCreateBot} disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Bot'}
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Bots Existentes</h3>
                {bots.length > 0 ? (
                  <ul className="space-y-2">
                    {bots.map((bot) => (
                      <li key={bot.id} className="bg-gray-100 p-2 rounded">
                        <strong>{bot.name}</strong>: {bot.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhum bot criado ainda.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mercado Livre Card */}
        <Card>
          <CardHeader>
            <CardTitle>Mercado Livre</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configuração da API do Mercado Livre (em desenvolvimento)</p>
          </CardContent>
        </Card>

        {/* Shopee Card */}
        <Card>
          <CardHeader>
            <CardTitle>Shopee</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configuração da API da Shopee (em desenvolvimento)</p>
          </CardContent>
        </Card>

        {/* Shopify Card */}
        <Card>
          <CardHeader>
            <CardTitle>Shopify</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configuração da API do Shopify (em desenvolvimento)</p>
          </CardContent>
        </Card>

        {/* Amazon Card */}
        <Card>
          <CardHeader>
            <CardTitle>Amazon</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configuração da API da Amazon (em desenvolvimento)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default API;