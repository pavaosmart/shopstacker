import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from '../components/Navigation';
import LoadingIndicator from '../components/LoadingIndicator';

const Settings = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchApiKey();
    }
  }, [session]);

  const fetchApiKey = async () => {
    try {
      addLoadingStep('Buscando chave da API...');
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
    setLoadingSteps([]);
    try {
      addLoadingStep('Salvando chave da API...');
      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: session.user.id, openai_api_key: openaiApiKey })
        .select();

      if (error) throw error;

      initializeOpenAI(openaiApiKey);
      await testConnection(); // Test the connection after saving
      toast.success('Chave da API salva e testada com sucesso');
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const addLoadingStep = (step) => {
    setLoadingSteps(prev => [...prev, step]);
  };

  if (!session) {
    return null;
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Configurações</h1>
        <div className="mb-4">
          <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-700">
            Chave da API OpenAI
          </label>
          <Input
            id="openai-api-key"
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={handleSaveApiKey} disabled={isLoading}>
          {isLoading ? 'Salvando e Testando...' : 'Salvar e Testar Chave da API'}
        </Button>

        {isLoading && <LoadingIndicator steps={loadingSteps} />}
      </div>
    </div>
  );
};

export default Settings;