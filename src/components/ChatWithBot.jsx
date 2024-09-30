import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { listAssistants, getOpenAIInstance } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ChatWithBot = () => {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const fetchedAssistants = await listAssistants();
      setAssistants(fetchedAssistants);
      if (fetchedAssistants.length > 0) {
        setSelectedAssistant(fetchedAssistants[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar assistentes:', error);
      toast.error('Falha ao carregar assistentes');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAssistant) return;

    const newMessage = { role: 'user', content: inputMessage };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const openai = await getOpenAIInstance();
      const response = await openai.chat.completions.create({
        model: selectedAssistant.model || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an AI assistant named ${selectedAssistant.name}.` },
          ...messages,
          newMessage
        ],
      });

      const botResponse = { role: 'assistant', content: response.choices[0].message.content };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Falha ao enviar mensagem: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Chat com Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <select
            value={selectedAssistant?.id || ''}
            onChange={(e) => setSelectedAssistant(assistants.find(a => a.id === e.target.value))}
            className="w-full p-2 border rounded"
          >
            {assistants.map((assistant) => (
              <option key={assistant.id} value={assistant.id}>{assistant.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-4 mb-4 h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`p-2 rounded ${message.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
              {message.content}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-grow"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWithBot;