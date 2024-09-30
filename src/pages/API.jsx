import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection, listAssistants } from '../utils/openai';
import CreateBotModal from '../components/CreateBotModal';

const API = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bots, setBots] = useState([]);
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
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = async (botData) => {
    // Implementação da criação do bot
    console.log('Criando bot:', botData);
    setIsModalOpen(false);
    toast.success('Bot criado com sucesso!');
    fetchBots(); // Atualiza a lista de bots após a criação
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

      <h2 className="text-xl font-semibold mt-8 mb-4">Bots OpenAI</h2>
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">Criar Novo Bot</Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <CreateBotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBot={handleCreateBot}
      />
    </div>
  );
};

export default API;