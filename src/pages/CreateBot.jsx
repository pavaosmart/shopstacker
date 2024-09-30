import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from '../components/Navigation';
import { testBotCreation } from '../utils/testBotCreation';
import CreateBotModal from '../components/CreateBotModal';
import { fetchSpecificAssistant, createOpenAIAssistant } from '../utils/openai';

const CreateBot = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specificAssistant, setSpecificAssistant] = useState(null);

  useEffect(() => {
    if (!session) {
      toast.error('Você precisa estar autenticado para ver os bots.');
      navigate('/login');
    } else {
      fetchBots();
      fetchAssistant();
    }
  }, [session, navigate]);

  const fetchBots = async () => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('id, name, description')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots(data);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar os bots');
    }
  };

  const fetchAssistant = async () => {
    try {
      const assistant = await fetchSpecificAssistant('asst_0JcXnIMLesTv5DWsllx6BTSf');
      setSpecificAssistant(assistant);
      toast.success('Assistente específico carregado com sucesso');
    } catch (error) {
      console.error('Erro ao buscar assistente específico:', error);
      toast.error('Falha ao carregar o assistente específico');
    }
  };

  const handleCreateBot = async (newBot) => {
    try {
      // Criar o assistente na OpenAI
      const openAIAssistant = await createOpenAIAssistant(newBot.name, newBot.description);
      
      // Salvar o bot no Supabase com o ID do assistente da OpenAI
      const { data, error } = await supabase
        .from('bots')
        .insert([{ 
          ...newBot, 
          user_id: session.user.id,
          openai_assistant_id: openAIAssistant.id
        }])
        .select();

      if (error) throw error;

      toast.success('Bot criado com sucesso na OpenAI e no Supabase');
      setIsModalOpen(false);
      fetchBots();
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error(`Falha ao criar bot: ${error.message}`);
    }
  };

  const handleTestBotCreation = async () => {
    const result = await testBotCreation();
    if (result.success) {
      toast.success(result.message);
      fetchBots();
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
        {specificAssistant && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assistente Específico</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Nome: {specificAssistant.name}</p>
              <p>ID: {specificAssistant.id}</p>
              <p>Modelo: {specificAssistant.model}</p>
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{bot.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{bot.description}</p>
                <p className="text-xs text-gray-500">OpenAI ID: {bot.openai_assistant_id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={handleTestBotCreation} className="mt-4">Testar Criação de Bot</Button>
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