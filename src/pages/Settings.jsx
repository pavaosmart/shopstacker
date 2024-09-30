import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, getOpenAIInstance } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from '../components/Navigation';
import LoadingIndicator from '../components/LoadingIndicator';

const Settings = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [projectName, setProjectName] = useState('');
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchApiKey();
    }
  }, [session]);

  const fetchApiKey = async () => {
    try {
      addLoadingStep('Fetching API key...');
      const { data, error } = await supabase
        .from('user_settings')
        .select('openai_api_key')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching API key:', error);
        throw error;
      }
      if (data) {
        setOpenaiApiKey(data.openai_api_key || '');
        if (data.openai_api_key) {
          await validateAndFetchProjectInfo(data.openai_api_key);
        }
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
      toast.error('Failed to load API key');
    }
  };

  const validateAndFetchProjectInfo = async (apiKey) => {
    setIsLoading(true);
    setLoadingSteps([]);
    try {
      addLoadingStep('Initializing OpenAI...');
      initializeOpenAI(apiKey);
      const openai = getOpenAIInstance();

      addLoadingStep('Verifying authentication...');
      const response = await openai.models.list();
      
      addLoadingStep('Fetching project information...');
      // Note: OpenAI API doesn't provide a direct method to get project name.
      // We're using a placeholder here. In a real scenario, you might need to
      // store this information separately or use a different API call.
      setProjectName('Your OpenAI Project');

      addLoadingStep('Loading existing bots...');
      await fetchBots();

      toast.success('API key validated successfully');
    } catch (error) {
      console.error('Error validating API key:', error);
      toast.error('Failed to authenticate with OpenAI');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBots = async () => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setBots(data || []);
    } catch (error) {
      console.error('Error fetching bots:', error);
      toast.error('Failed to load existing bots');
    }
  };

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    setLoadingSteps([]);
    try {
      addLoadingStep('Saving API key...');
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({ user_id: session.user.id, openai_api_key: openaiApiKey })
        .select()
        .single();

      if (error) throw error;

      addLoadingStep('Validating API key...');
      await validateAndFetchProjectInfo(openaiApiKey);

      toast.success('API key saved and validated successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save or validate API key');
    } finally {
      setIsLoading(false);
    }
  };

  const addLoadingStep = (step) => {
    setLoadingSteps(prev => [...prev, step]);
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
        <Button onClick={handleSaveApiKey} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save API Key'}
        </Button>

        {isLoading && <LoadingIndicator steps={loadingSteps} />}

        {projectName && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">OpenAI Project: {projectName}</h2>
          </div>
        )}

        {bots.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Existing Bots:</h2>
            <ul className="list-disc pl-5 mt-2">
              {bots.map(bot => (
                <li key={bot.id}>{bot.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;