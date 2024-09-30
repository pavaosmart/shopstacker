import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { listAssistants, createAssistant } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ChatWithBot = () => {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
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
    setMessages([...messages, newMessage]);
    setInputMessage('');

    try {
      // Aqui você deve implementar a lógica para enviar a mensagem para a API da OpenAI
      // e receber a resposta do assistente. Por enquanto, vamos simular uma resposta.
      const botResponse = { role: 'assistant', content: `Resposta simulada para: ${inputMessage}` };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Falha ao enviar mensagem');
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
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWithBot;