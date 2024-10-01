import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection, listAssistants, createAssistant, updateAssistant } from '../utils/openai';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OpenAIIntegration = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [newBot, setNewBot] = useState({
    name: '',
    instructions: '',
    model: 'gpt-4',
    temperature: 1,
    max_tokens: 150,
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
      const botsList = await listAssistants();
      setBots(botsList);
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
      fetchBots();
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
      toast.success('Bot criado com sucesso!');
      setIsModalOpen(false);
      fetchBots();
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
      instructions: bot.instructions,
      model: bot.model,
      temperature: bot.temperature || 1,
      max_tokens: bot.max_tokens || 150,
      documents: []
    });
    setIsModalOpen(true);
  };

  const handleUpdateBot = async () => {
    setIsLoading(true);
    try {
      const updatedAssistant = await updateAssistant(editingBot.id, {
        name: newBot.name,
        instructions: newBot.instructions,
        model: newBot.model,
        temperature: newBot.temperature,
      });
      toast.success('Bot atualizado com sucesso!');
      setIsModalOpen(false);
      fetchBots();
    } catch (error) {
      console.error('Erro ao atualizar bot:', error);
      toast.error('Falha ao atualizar bot');
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
                  <p>Última edição: {format(new Date(bot.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
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
              <Label htmlFor="max_tokens">Máximo de Tokens: {newBot.max_tokens}</Label>
              <Slider
                id="max_tokens"
                min={1}
                max={4000}
                step={1}
                value={[newBot.max_tokens]}
                onValueChange={(value) => setNewBot({...newBot, max_tokens: value[0]})}
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
            <Button onClick={editingBot ? handleUpdateBot : handleCreateBot} disabled={isLoading}>
              {isLoading ? 'Processando...' : (editingBot ? 'Atualizar Bot' : 'Criar Bot')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenAIIntegration;