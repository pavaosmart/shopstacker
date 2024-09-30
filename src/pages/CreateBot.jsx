import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import Navigation from '../components/Navigation';

const CreateBot = () => {
  const { session } = useSupabaseAuth();
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(150);
  const [prompt, setPrompt] = useState('');

  const handleCreateBot = async () => {
    try {
      // Insert bot
      const { data: botData, error: botError } = await supabase
        .from('bots')
        .insert({ user_id: session.user.id, name: botName, description: botDescription })
        .select()
        .single();

      if (botError) throw botError;

      // Insert bot configuration
      const { error: configError } = await supabase
        .from('bot_configurations')
        .insert({
          bot_id: botData.id,
          model,
          temperature,
          max_tokens: maxTokens
        });

      if (configError) throw configError;

      // Insert bot prompt
      const { error: promptError } = await supabase
        .from('bot_prompts')
        .insert({
          bot_id: botData.id,
          prompt_text: prompt,
          prompt_order: 1
        });

      if (promptError) throw promptError;

      toast.success('Bot created successfully');
      // Reset form or redirect to bot list
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Failed to create bot');
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Create New Bot</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="bot-name" className="block text-sm font-medium text-gray-700">Bot Name</label>
            <Input
              id="bot-name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="bot-description" className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              id="bot-description"
              value={botDescription}
              onChange={(e) => setBotDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
            <Select
              id="model"
              value={model}
              onValueChange={setModel}
              className="mt-1"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
            </Select>
          </div>
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Temperature</label>
            <Input
              id="temperature"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="max-tokens" className="block text-sm font-medium text-gray-700">Max Tokens</label>
            <Input
              id="max-tokens"
              type="number"
              min="1"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Initial Prompt</label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleCreateBot}>Create Bot</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBot;