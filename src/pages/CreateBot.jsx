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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots(data);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar os bots');
    }
  };

  const handleCreateBot = async (newBot) => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .insert([newBot])
        .select()
        .single();

      if (error) throw error;

      toast.success('Bot criado com sucesso');
      setIsModalOpen(false);
      fetchBots(); // Atualiza a lista de bots
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error(`Falha ao criar bot: ${error.message}`);
    }
  };

  const handleTestBotCreation = async () => {
    const result = await testBotCreation();
    if (result.success) {
      toast.success(result.message);
      fetchBots(); // Atualiza a lista de bots após o teste
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
            <Card key={bot.id}>
              <CardHeader>
                <CardTitle>{bot.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{bot.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Criado em: {new Date(bot.created_at).toLocaleDateString()}
                </p>
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