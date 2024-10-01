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
import { initializeOpenAI, testConnection, listAssistants, createAssistant } from '../utils/openai';

const OpenAIIntegration = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    prompt: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150,
    document: null
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
          console.log('No API key found for the user');
          return;
        }
        throw error;
      }
      
      if (data?.openai_api_key) {
        setOpenaiApiKey(data.openai_api_key);
        initializeOpenAI(data.openai_api_key);
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
      toast.error('Failed to load API key');
    }
  };

  const fetchBots = async () => {
    try {
      const botsList = await listAssistants();
      setBots(botsList);
    } catch (error) {
      console.error('Error fetching bots:', error);
      toast.error('Failed to load bots list');
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
      toast.success('API key saved and tested successfully');
      fetchBots();
    } catch (error) {
      console.error('Error saving or testing API key:', error);
      toast.error('Failed to save or test API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = async () => {
    setIsLoading(true);
    try {
      const assistant = await createAssistant(newBot.name, newBot.prompt, newBot.model);
      toast.success('Bot created successfully!');
      setIsModalOpen(false);
      fetchBots();
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Failed to create bot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Key Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            placeholder="Enter your OpenAI API Key"
            className="mb-2"
          />
          <Button onClick={handleSaveApiKey} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save and Test Key'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsModalOpen(true)}>Create New Bot</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <CardTitle>{bot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{bot.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Bot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Bot Name</Label>
              <Input 
                id="name" 
                value={newBot.name} 
                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea 
                id="prompt" 
                value={newBot.prompt} 
                onChange={(e) => setNewBot({...newBot, prompt: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Select 
                value={newBot.model} 
                onValueChange={(value) => setNewBot({...newBot, model: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateBot} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Bot'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenAIIntegration;