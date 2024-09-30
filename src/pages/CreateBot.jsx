import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from '../components/Navigation';
import { testConnection, createAssistant, listAssistants } from '../utils/openai';
import CreateBotModal from '../components/CreateBotModal';
import { testBotCreation } from '../utils/testBotCreation';

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
      const assistant = await createAssistant(newBot.name, newBot.description);
      
      const { data, error } = await supabase
        .from('bots')
        .insert([{ 
          ...newBot, 
          user_id: session.user.id,
          openai_assistant_id: assistant.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Salvar configuração do bot
      await supabase
        .from('bot_configurations')
        .insert({
          bot_id: data.id,
          model: newBot.model || 'gpt-3.5-turbo',
          temperature: newBot.temperature || 0.7,
          max_tokens: newBot.max_tokens || 150
        });

      // Salvar prompts do bot
      if (newBot.prompts && newBot.prompts.length > 0) {
        await supabase
          .from('bot_prompts')
          .insert(newBot.prompts.map((prompt, index) => ({
            bot_id: data.id,
            prompt_text: prompt,
            prompt_order: index + 1
          })));
      }

      toast.success('Bot criado com sucesso na OpenAI e no Supabase');
      setIsModalOpen(false);
      fetchBots();
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error(`Falha ao criar bot: ${error.message}`);
    }
  };

  const handleTestConnection = async () => {
    try {
      await testConnection();
      toast.success('Conexão com a OpenAI testada com sucesso');
    } catch (error) {
      toast.error(`Erro ao testar conexão: ${error.message}`);
    }
  };

  const handleTestBotCreation = async () => {
    const result = await testBotCreation();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
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
        <div className="mt-4 space-x-2">
          <Button onClick={handleTestConnection}>Testar Conexão com OpenAI</Button>
          <Button onClick={handleTestBotCreation}>Testar Criação de Bot</Button>
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