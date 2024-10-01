import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { initializeOpenAI, testConnection, listAssistants, createAssistant } from '../utils/openai';
import { toast } from "sonner";

const APIStore = () => {
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);

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

  const apiList = [
    {
      name: "OpenAI GPT-4",
      description: "Integrate advanced AI language models into your application.",
      category: "Artificial Intelligence",
      price: "$0.03 per 1K tokens",
      route: "/api-integration/openai"
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
    },
    {
      name: "Mercado Livre",
      description: "Integrate with Latin America's leading e-commerce platform.",
      category: "E-commerce",
      price: "Free API access, transaction fees apply"
    },
    {
      name: "Shopee",
      description: "Connect with one of Southeast Asia's largest online shopping platforms.",
      category: "E-commerce",
      price: "Free API access, commission on sales"
    },
    {
      name: "Amazon Marketplace Web Service",
      description: "Access Amazon's vast e-commerce ecosystem and services.",
      category: "E-commerce",
      price: "Varies based on services used"
    },
    {
      name: "Shopify",
      description: "Build and integrate with online stores powered by Shopify.",
      category: "E-commerce",
      price: "From $9/month for Shopify app developers"
    }
  ];

  const handleIntegrate = (api) => {
    if (api.route) {
      navigate(api.route);
    } else {
      console.log(`Integration for ${api.name} is not implemented yet.`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Marketplace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiList.map((api, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{api.name}</CardTitle>
              <CardDescription>{api.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{api.description}</p>
              {api.name === "OpenAI GPT-4" && (
                <div className="mt-4 space-y-4">
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
                  {bots.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Your Bots:</h4>
                      <ul className="list-disc pl-5">
                        {bots.map((bot) => (
                          <li key={bot.id}>{bot.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm font-semibold">{api.price}</span>
              <Button onClick={() => handleIntegrate(api)}>Integrate</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default APIStore;