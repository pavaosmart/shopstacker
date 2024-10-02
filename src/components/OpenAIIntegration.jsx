import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection, createAssistant, updateAssistant, deleteAssistant, listAssistants } from '../utils/openai';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OpenAIIntegration = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    instructions: '',
    model: 'gpt-3.5-turbo',
    temperature: 1,
    documents: []
  });
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchApiKey();
      fetchBots();
    }
  }, [session]);

  const fetchApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('openai_api_key')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Nenhuma chave de API encontrada para o usuário');
          return;
        }
        throw error;
      }
      
      if (data?.openai_api_key) {
        setOpenaiApiKey(data.openai_api_key);
        initializeOpenAI(data.openai_api_key);
      }
    } catch (error) {
      console.error('Erro ao buscar chave de API:', error);
      toast.error('Falha ao carregar chave de API');
    }
  };

  const fetchBots = async () => {
    try {
      const assistants = await listAssistants();
      const { data: dbBots, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;

      const mergedBots = assistants.map(assistant => {
        const dbBot = dbBots.find(bot => bot.openai_assistant_id === assistant.id);
        return {
          ...assistant,
          ...dbBot,
          name: assistant.name,
          description: assistant.instructions,
          created_at: assistant.created_at,
          updated_at: assistant.updated_at
        };
      });

      setBots(mergedBots);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar lista de bots');
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
      toast.success('Chave de API salva e testada com sucesso');
      await fetchBots();
    } catch (error) {
      console.error('Erro ao salvar ou testar chave de API:', error);
      toast.error('Falha ao salvar ou testar chave de API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = async () => {
    setIsLoading(true);
    try {
      const assistant = await createAssistant(newBot.name, newBot.instructions);
      
      const { data, error } = await supabase
        .from('bots')
        .insert({
          name: newBot.name,
          description: newBot.instructions,
          openai_assistant_id: assistant.id,
          user_id: session.user.id,
          model: newBot.model,
          temperature: newBot.temperature,
        })
        .select();

      if (error) throw error;

      toast.success('Bot criado com sucesso!');
      setIsModalOpen(false);
      await fetchBots();
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error('Falha ao criar bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBot = (bot) => {
    setEditingBot(bot);
    setNewBot({
      name: bot.name,
      instructions: bot.description,
      model: bot.model,
      temperature: bot.temperature || 1,
      documents: []
    });
    setIsModalOpen(true);
  };

  const handleUpdateBot = async () => {
    setIsLoading(true);
    try {
      if (!editingBot.id) {
        throw new Error('Assistant ID is undefined');
      }

      const updatedAssistant = await updateAssistant(editingBot.id, {
        name: newBot.name,
        instructions: newBot.instructions,
        model: newBot.model,
      });

      const { data, error } = await supabase
        .from('bots')
        .update({
          name: newBot.name,
          description: newBot.instructions,
          model: newBot.model,
          temperature: newBot.temperature,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingBot.id)
        .select();

      if (error) throw error;

      toast.success('Bot atualizado com sucesso!');
      setIsModalOpen(false);
      await fetchBots();
    } catch (error) {
      console.error('Erro ao atualizar bot:', error);
      toast.error('Falha ao atualizar bot: ' + error.message);
    } finally {
      setIsLoading(false);
      setEditingBot(null);
    }
  };

  const handleDeleteBot = async () => {
    setIsLoading(true);
    try {
      if (!editingBot.id) {
        throw new Error('Assistant ID is undefined');
      }

      // Delete from OpenAI
      await deleteAssistant(editingBot.id);

      // Delete from Supabase
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', editingBot.id);

      if (error) throw error;

      toast.success('Bot excluído com sucesso!');
      setIsModalOpen(false);
      setIsDeleteDialogOpen(false);
      await fetchBots();
    } catch (error) {
      console.error('Erro ao excluir bot:', error);
      toast.error('Falha ao excluir bot: ' + error.message);
    } finally {
      setIsLoading(false);
      setEditingBot(null);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewBot(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, "dd/MM/yyyy HH:mm", { locale: ptBR }) : 'Data inválida';
  };

  // Render component JSX here (omitted for brevity)
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default OpenAIIntegration;