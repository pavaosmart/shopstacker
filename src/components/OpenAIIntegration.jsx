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
      const assistant = await createAssistant(newBot.name, newBot.instructions, newBot.model, {
        temperature: newBot.temperature,
      });
      
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
      if (!editingBot.openai_assistant_id) {
        throw new Error('Assistant ID is undefined');
      }

      const updatedAssistant = await updateAssistant(editingBot.openai_assistant_id, {
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
      if (!editingBot.openai_assistant_id) {
        throw new Error('Assistant ID is undefined');
      }

      // Delete from OpenAI
      await deleteAssistant(editingBot.openai_assistant_id);

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração da Chave de API</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            placeholder="Digite sua Chave de API OpenAI"
            className="mb-2"
          />
          <Button onClick={handleSaveApiKey} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar e Testar Chave'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => { setEditingBot(null); setIsModalOpen(true); }}>Criar Novo Bot</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bots Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <CardTitle>{bot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Criado em: {formatDate(bot.created_at)}</p>
                  <p>Última edição: {formatDate(bot.updated_at)}</p>
                  <p>Modelo: {bot.model}</p>
                  <Button onClick={() => handleEditBot(bot)} className="mt-2">Editar</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBot ? 'Editar Bot' : 'Criar Novo Bot'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Bot</Label>
              <Input 
                id="name" 
                value={newBot.name} 
                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="instructions">Instruções do Sistema</Label>
              <Textarea 
                id="instructions" 
                value={newBot.instructions} 
                onChange={(e) => setNewBot({...newBot, instructions: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="model">Modelo</Label>
              <Select 
                value={newBot.model} 
                onValueChange={(value) => setNewBot({...newBot, model: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="temperature">Temperatura: {newBot.temperature}</Label>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[newBot.temperature]}
                onValueChange={(value) => setNewBot({...newBot, temperature: value[0]})}
              />
            </div>
            <div>
              <Label htmlFor="documents">Adicionar Documentos à Base de Conhecimento</Label>
              <Input
                id="documents"
                type="file"
                multiple
                accept=".txt,.pdf,.doc,.docx,.csv"
                onChange={handleFileUpload}
              />
              <p className="text-sm text-gray-500 mt-1">
                Formatos permitidos: .txt, .pdf, .doc, .docx, .csv
              </p>
              <div className="mt-2">
                {newBot.documents.map((doc, index) => (
                  <div key={index} className="text-sm text-gray-600">{doc.name}</div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            {editingBot && (
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                Excluir Bot
              </Button>
            )}
            <Button onClick={editingBot ? handleUpdateBot : handleCreateBot} disabled={isLoading}>
              {isLoading ? 'Processando...' : (editingBot ? 'Atualizar Bot' : 'Criar Bot')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este bot? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteBot} disabled={isLoading}>
              {isLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenAIIntegration;