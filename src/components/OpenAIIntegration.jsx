import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection, listAssistants, createAssistant, updateAssistant } from '../utils/openai';
import { format } from 'date-fns';

const OpenAIIntegration = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [newBot, setNewBot] = useState({
    name: '',
    prompt: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150,
    document: null
  });
  const [connectionStatus, setConnectionStatus] = useState(null); // null, true, or false
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
        .single();

      if (error) throw error;
      
      if (data?.openai_api_key) {
        setOpenaiApiKey(data.openai_api_key);
        initializeOpenAI(data.openai_api_key);
        await checkConnection(data.openai_api_key);
      }
    } catch (error) {
      console.error('Erro ao buscar chave da API:', error);
      toast.error('Falha ao carregar a chave da API');
      setConnectionStatus(false);
    }
  };

  const fetchBots = async () => {
    try {
      const botsList = await listAssistants();
      setBots(botsList);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar a lista de bots');
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

      initializeOpenAI(openaiApiKey);
      await checkConnection(openaiApiKey);
      if (connectionStatus) {
        toast.success('Chave da API salva e testada com sucesso');
        fetchBots();
      } else {
        toast.error('Falha na conexão com a API OpenAI');
      }
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
      setConnectionStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = async () => {
    setIsLoading(true);
    try {
      const assistant = await createAssistant(newBot.name, newBot.prompt, newBot.model, newBot.temperature, newBot.maxTokens);
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

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewBot(prev => ({
      ...prev,
      [name]: type === 'file' ? e.target.files[0] : value
    }));
  };

  const handleEditBot = (bot) => {
    setEditingBot(bot);
    setNewBot({
      name: bot.name,
      prompt: bot.prompt || '',
      model: bot.model,
      temperature: bot.temperature,
      maxTokens: bot.max_tokens,
    });
    setIsModalOpen(true);
  };

  const handleUpdateBot = async () => {
    setIsLoading(true);
    try {
      await updateAssistant(editingBot.id, newBot.name, newBot.prompt, newBot.model, newBot.temperature, newBot.maxTokens);
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

  const handleCloneBot = async (bot) => {
    try {
      const clonedAssistant = await createAssistant(`${bot.name} (Clone)`, bot.prompt, bot.model, bot.temperature, bot.max_tokens);
      toast.success('Bot clonado com sucesso!');
      fetchBots();
    } catch (error) {
      console.error('Erro ao clonar bot:', error);
      toast.error('Falha ao clonar bot');
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => {setEditingBot(null); setIsModalOpen(true)}}>Create New Bot</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <Card key={bot.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <CardHeader>
                  <CardTitle>{bot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">GPT Version: {bot.model}</p>
                  <p className="text-sm text-gray-600 mb-4">Created: {format(new Date(bot.created_at), 'dd/MM/yyyy HH:mm')}</p>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEditBot(bot)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCloneBot(bot)}>
                      Clone
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBot ? 'Edit Bot' : 'Create New Bot'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Bot Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={newBot.name} 
                onChange={handleInputChange}
                placeholder="e.g., Customer Support Assistant"
              />
            </div>
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea 
                id="prompt" 
                name="prompt" 
                value={newBot.prompt} 
                onChange={handleInputChange}
                placeholder="You are a helpful assistant..."
              />
            </div>
            <div>
              <Label htmlFor="model">GPT Version</Label>
              <Select name="model" value={newBot.model} onValueChange={(value) => setNewBot(prev => ({ ...prev, model: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select GPT model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <Input 
                type="number" 
                id="temperature" 
                name="temperature" 
                value={newBot.temperature} 
                onChange={handleInputChange} 
                min="0" 
                max="1" 
                step="0.1"
                placeholder="0.7"
              />
            </div>
            <div>
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input 
                type="number" 
                id="maxTokens" 
                name="maxTokens" 
                value={newBot.maxTokens} 
                onChange={handleInputChange} 
                min="1"
                placeholder="150"
              />
            </div>
            {!editingBot && (
              <div>
                <Label htmlFor="document">Knowledge Base (PDF, DOCX, TXT)</Label>
                <Input type="file" id="document" name="document" onChange={handleInputChange} accept=".pdf,.docx,.txt" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={editingBot ? handleUpdateBot : handleCreateBot} disabled={isLoading}>
              {isLoading ? 'Processing...' : (editingBot ? 'Update Bot' : 'Create Bot')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenAIIntegration;