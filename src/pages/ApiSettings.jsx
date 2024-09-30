import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection } from '../utils/openai';
import CreateBotModal from '../components/CreateBotModal';

const ApiSettings = () => {
  const [openaiApiKey, setOpenaiApiKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { session } = useSupabaseAuth();

  React.useEffect(() => {
    if (session?.user?.id) {
      fetchApiKey();
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Configurações de API</h1>
      <div className="mb-4">
        <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-700 mb-2">
          Chave da API OpenAI
        </label>
        <Input
          id="openai-api-key"
          type="password"
          value={openaiApiKey}
          onChange={(e) => setOpenaiApiKey(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleSaveApiKey} disabled={isLoading}>
          {isLoading ? 'Salvando e Testando...' : 'Salvar e Testar Chave da API'}
        </Button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Gerenciamento de Bots</h2>
        <Button onClick={() => setIsModalOpen(true)}>Criar Novo Bot</Button>
      </div>
      <CreateBotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBot={handleCreateBot}
      />
    </div>
  );
};

export default ApiSettings;