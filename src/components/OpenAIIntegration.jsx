import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection } from '../utils/openai';

const OpenAIIntegration = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const { session } = useSupabaseAuth();

  useEffect(() => {
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
        .limit(1)
        .single();

      if (error) throw error;
      
      if (data?.openai_api_key) {
        setOpenaiApiKey(data.openai_api_key);
        const initialized = initializeOpenAI(data.openai_api_key);
        if (initialized) {
          await checkConnection(data.openai_api_key);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar chave da API:', error);
      toast.error('Falha ao carregar a chave da API');
      setConnectionStatus(false);
    }
  };

  const checkConnection = async (apiKey) => {
    try {
      const isConnected = await testConnection(apiKey);
      setConnectionStatus(isConnected);
    } catch (error) {
      setConnectionStatus(false);
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

      const initialized = initializeOpenAI(openaiApiKey);
      if (initialized) {
        await checkConnection(openaiApiKey);
        if (connectionStatus) {
          toast.success('Chave da API salva e testada com sucesso');
        } else {
          toast.error('Falha na conexão com a API OpenAI');
        }
      } else {
        toast.error('Falha ao inicializar a API OpenAI');
      }
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
      setConnectionStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OpenAI GPT-4 Integration</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Key Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="Enter your OpenAI API Key"
              className="flex-grow"
            />
            <div className={`w-4 h-4 rounded-full ${
              connectionStatus === null ? 'bg-gray-300' :
              connectionStatus ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
          <Button onClick={handleSaveApiKey} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save and Test Key'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenAIIntegration;