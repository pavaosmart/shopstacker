import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from '../components/Navigation';
import { testConnection, createAssistant, saveBotToDatabase, verifyBotData } from '../utils/openai';
import CreateBotModal from '../components/CreateBotModal';
import { supabase } from '../integrations/supabase/supabase';

const CreateBot = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      toast.error('Você precisa estar autenticado para ver os bots.');
      navigate('/login');
    } else {
      fetchBots();
    }
  }, [session, navigate]);

  const fetchBots = async () => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*, bot_configurations(*), bot_prompts(*)');
      
      if (error) throw error;
      setBots(data);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar os bots');
    }
  };

  const handleCreateBot = async (newBot) => {
    try {
      console.log('Iniciando criação do bot:', newBot);
      const assistant = await createAssistant(newBot.name, newBot.description);
      console.log('Assistente criado:', assistant);
      
      const botData = {
        name: newBot.name,
        description: newBot.description,
        user_id: session.user.id,
        openai_assistant_id: assistant.id,
        model: newBot.model,
        temperature: newBot.temperature,
        max_tokens: newBot.maxTokens,
        prompts: [newBot.prompt],
        document: newBot.document
      };

      console.log('Salvando bot no banco de dados:', botData);
      const savedBot = await saveBotToDatabase(botData);
      console.log('Bot salvo no banco de dados:', savedBot);

      const isVerified = await verifyBotData(savedBot.id);
      if (!isVerified) {
        throw new Error('Failed to verify bot data in the database');
      }

      toast.success('Bot criado e salvo com sucesso');
      setIsModalOpen(false);
      fetchBots();
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error(`Falha ao criar bot: ${error.message}`);
    }
  };

  const handleTestConnection = async () => {
    const isConnected = await testConnection();
    if (isConnected) {
      toast.success('Conexão com a OpenAI testada com sucesso');
    } else {
      toast.error('Falha na conexão com a OpenAI');
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Seus Bots</h1>
          <Button onClick={() => setIsModalOpen(true)}>Criar Novo Bot</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{bot.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{bot.description}</p>
                <p className="text-xs text-gray-500">OpenAI ID: {bot.openai_assistant_id}</p>
                <p className="text-xs text-gray-500">Model: {bot.bot_configurations?.[0]?.model}</p>
                <p className="text-xs text-gray-500">Prompts: {bot.bot_prompts?.length || 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={handleTestConnection}>Testar Conexão com OpenAI</Button>
        </div>
      </div>
      <CreateBotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBot={handleCreateBot}
      />
    </div>
  );
};

export default CreateBot;