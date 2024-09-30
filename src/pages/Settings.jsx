import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from '../components/Navigation';

const Settings = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchApiKey();
    }
  }, [session]);

  const fetchApiKey = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('openai_api_key')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
    } else if (data) {
      setOpenaiApiKey(data.openai_api_key || '');
    }
  };

  const handleSaveApiKey = async () => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: session.user.id, openai_api_key: openaiApiKey })
        .single();

      if (error) throw error;

      initializeOpenAI(openaiApiKey);
      toast.success('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="mb-4">
          <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-700">
            OpenAI API Key
          </label>
          <Input
            id="openai-api-key"
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={handleSaveApiKey}>Save API Key</Button>
      </div>
    </div>
  );
};

export default Settings;