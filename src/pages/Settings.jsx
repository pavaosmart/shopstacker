import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, getOpenAIInstance } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from '../components/Navigation';
import LoadingIndicator from '../components/LoadingIndicator';

const Settings = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [projectName, setProjectName] = useState('');
  const [bots, setBots] = useState([]);
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

      if (error) {
        console.error('Erro ao buscar chave da API:', error);
        throw error;
      }
      if (data) {
        setOpenaiApiKey(data.openai_api_key || '');
        if (data.openai_api_key) {
          await validateAndFetchProjectInfo(data.openai_api_key);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar chave da API:', error);
      toast.error('Falha ao carregar a chave da API');
    }
  };

  const validateAndFetchProjectInfo = async (apiKey) => {
    setIsLoading(true);
    setLoadingSteps([]);
    try {
      addLoadingStep('Inicializando OpenAI...');
      initializeOpenAI(apiKey);
      const openai = getOpenAIInstance();

      addLoadingStep('Verificando autenticação...');
      const response = await openai.models.list();
      
      addLoadingStep('Buscando informações do projeto...');
      setProjectName('Seu Projeto OpenAI');

      addLoadingStep('Carregando bots existentes...');
      await fetchBots();

      toast.success('Chave da API validada com sucesso');
    } catch (error) {
      console.error('Erro ao validar chave da API:', error);
      toast.error('Falha ao autenticar com OpenAI');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBots = async () => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setBots(data || []);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar bots existentes');
    }
  };

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    setLoadingSteps([]);
    try {
      addLoadingStep('Salvando chave da API...');
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({ user_id: session.user.id, openai_api_key: openaiApiKey })
        .select()
        .single();

      if (error) throw error;

      addLoadingStep('Validando chave da API...');
      await validateAndFetchProjectInfo(openaiApiKey);

      toast.success('Chave da API salva e validada com sucesso');
    } catch (error) {
      console.error('Erro ao salvar chave da API:', error);
      toast.error('Falha ao salvar ou validar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const addLoadingStep = (step) => {
    setLoadingSteps(prev => [...prev, step]);
  };

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
          {isLoading ? 'Salvando...' : 'Salvar Chave da API'}
        </Button>

        {isLoading && <LoadingIndicator steps={loadingSteps} />}

        {projectName && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Projeto OpenAI: {projectName}</h2>
          </div>
        )}

        {bots.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Bots Existentes:</h2>
            <ul className="list-disc pl-5 mt-2">
              {bots.map(bot => (
                <li key={bot.id}>{bot.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;