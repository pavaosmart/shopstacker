import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
    instructions: '',
    model: 'gpt-4',
    temperature: 1,
    topP: 1,
    responseFormat: 'text',
    fileSearch: false,
    codeInterpreter: false,
    functions: false,
    files: []
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
      const assistant = await createAssistant(newBot.name, newBot.instructions, newBot.model, {
        temperature: newBot.temperature,
        top_p: newBot.topP,
        response_format: { type: newBot.responseFormat },
        tools: [
          ...(newBot.fileSearch ? [{ type: "retrieval" }] : []),
          ...(newBot.codeInterpreter ? [{ type: "code_interpreter" }] : []),
          ...(newBot.functions ? [{ type: "function" }] : []),
        ],
      });
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
                  <p>{bot.instructions}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
              <Label htmlFor="instructions">System Instructions</Label>
              <Textarea 
                id="instructions" 
                value={newBot.instructions} 
                onChange={(e) => setNewBot({...newBot, instructions: e.target.value})}
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
            <div>
              <Label htmlFor="responseFormat">Response Format</Label>
              <Select 
                value={newBot.responseFormat} 
                onValueChange={(value) => setNewBot({...newBot, responseFormat: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select response format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="json_object">JSON Object</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="temperature">Temperature: {newBot.temperature}</Label>
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
              <Label htmlFor="topP">Top P: {newBot.topP}</Label>
              <Slider
                id="topP"
                min={0}
                max={1}
                step={0.1}
                value={[newBot.topP]}
                onValueChange={(value) => setNewBot({...newBot, topP: value[0]})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="fileSearch"
                checked={newBot.fileSearch}
                onCheckedChange={(checked) => setNewBot({...newBot, fileSearch: checked})}
              />
              <Label htmlFor="fileSearch">File search</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="codeInterpreter"
                checked={newBot.codeInterpreter}
                onCheckedChange={(checked) => setNewBot({...newBot, codeInterpreter: checked})}
              />
              <Label htmlFor="codeInterpreter">Code interpreter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="functions"
                checked={newBot.functions}
                onCheckedChange={(checked) => setNewBot({...newBot, functions: checked})}
              />
              <Label htmlFor="functions">Functions</Label>
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