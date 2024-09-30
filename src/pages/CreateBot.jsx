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
      const assistants = await listAssistants();
      setBots(assistants);
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

  const handleTestConnection = async () => {
    try {
      await testConnection();
      toast.success('Conexão com a OpenAI testada com sucesso');
    } catch (error) {
      toast.error(`Erro ao testar conexão: ${error.message}`);
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
                <p className="text-xs text-gray-500">OpenAI ID: {bot.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={handleTestConnection} className="mt-4">Testar Conexão com OpenAI</Button>
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