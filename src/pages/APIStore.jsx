import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection, listAssistants, createAssistant } from '../utils/openai';

const APIStore = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [newBotName, setNewBotName] = useState('');
  const [newBotDescription, setNewBotDescription] = useState('');
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
      }
    } catch (error) {
      console.error('Erro ao buscar chave da API:', error);
      toast.error('Falha ao carregar a chave da API');
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
      fetchBots();
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = async () => {
    if (!newBotName.trim()) {
      toast.error('Nome do bot é obrigatório');
      return;
    }
    setIsLoading(true);
    try {
      const assistant = await createAssistant(newBotName, newBotDescription);
      toast.success('Bot criado com sucesso!');
      setNewBotName('');
      setNewBotDescription('');
      fetchBots();
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error('Falha ao criar bot');
    } finally {
      setIsLoading(false);
    }
  };

  const apiList = [
    {
      name: "OpenAI GPT-4",
      description: "Integrate advanced AI language models into your application.",
      category: "Artificial Intelligence",
      price: "$0.03 per 1K tokens"
    },
    {
      name: "Stripe Payments",
      description: "Process payments securely and easily in your app.",
      category: "Finance",
      price: "2.9% + $0.30 per transaction"
    },
    {
      name: "Twilio SMS",
      description: "Send and receive SMS messages programmatically.",
      category: "Communication",
      price: "$0.0075 per message"
    },
    {
      name: "Google Maps",
      description: "Embed interactive maps and location services.",
      category: "Geolocation",
      price: "$0.007 per request (first 100K free)"
    },
    {
      name: "Cloudinary",
      description: "Manage and optimize images and videos in the cloud.",
      category: "Media",
      price: "Free tier available, then $0.05 per GB"
    },
    {
      name: "Mailchimp",
      description: "Automate email marketing campaigns.",
      category: "Marketing",
      price: "Free up to 2,000 contacts, then from $9.99/month"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>OpenAI GPT-4</CardTitle>
            <CardDescription>Artificial Intelligence</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">Integrate advanced AI language models into your application.</p>
            <Input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="Chave da API OpenAI"
              className="mb-2"
            />
            <Button onClick={handleSaveApiKey} disabled={isLoading} className="w-full mb-4">
              {isLoading ? 'Salvando...' : 'Salvar e Testar Chave'}
            </Button>
            <Input
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              placeholder="Nome do Bot"
              className="mb-2"
            />
            <Textarea
              value={newBotDescription}
              onChange={(e) => setNewBotDescription(e.target.value)}
              placeholder="Descrição do Bot"
              className="mb-2"
            />
            <Button onClick={handleCreateBot} disabled={isLoading} className="w-full mb-4">
              {isLoading ? 'Criando...' : 'Criar Bot'}
            </Button>
            <h3 className="text-lg font-semibold mb-2">Bots Existentes</h3>
            {bots.length > 0 ? (
              <ul className="space-y-2">
                {bots.map((bot) => (
                  <li key={bot.id} className="bg-gray-100 p-2 rounded">
                    <strong>{bot.name}</strong>: {bot.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum bot criado ainda.</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span className="text-sm font-semibold">$0.03 per 1K tokens</span>
          </CardFooter>
        </Card>
        {apiList.slice(1).map((api, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{api.name}</CardTitle>
              <CardDescription>{api.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{api.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm font-semibold">{api.price}</span>
              <Button>Integrate</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default APIStore;