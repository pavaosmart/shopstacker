import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const OpenAISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        .single();

      if (error) throw error;
      if (data?.openai_api_key) {
        setApiKey(data.openai_api_key);
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
        .upsert({ user_id: session.user.id, openai_api_key: apiKey })
        .select();

      if (error) throw error;
      toast.success('Chave da API salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar chave da API:', error);
      toast.error('Falha ao salvar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Configurações da API OpenAI</h1>
      <div className="mb-4">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Chave da API OpenAI"
          className="mb-2"
        />
        <Button onClick={handleSaveApiKey} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Chave da API'}
        </Button>
      </div>
    </div>
  );
};

export default OpenAISettings;