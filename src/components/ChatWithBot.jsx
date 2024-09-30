import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { listAssistants, getOpenAIInstance } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Bot } from 'lucide-react';

const ChatWithBot = () => {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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

    const newMessage = { role: 'user', content: inputMessage, sender: 'Você' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const openai = await getOpenAIInstance();
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await openai.chat.completions.create({
        model: selectedAssistant.model || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an AI assistant named ${selectedAssistant.name}.` },
          ...messages,
          newMessage
        ],
      });

      const botResponse = { role: 'assistant', content: response.choices[0].message.content, sender: selectedAssistant.name };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Falha ao enviar mensagem: ' + error.message);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
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
        <div className="space-y-4 mb-4 h-80 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col items-${message.role === 'user' ? 'end' : 'start'} max-w-[70%]`}>
                <div className="flex items-center mb-1">
                  <Avatar className="w-6 h-6 mr-2">
                    {message.role === 'user' ? (
                      <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
                    ) : (
                      <AvatarFallback className="bg-blue-500 text-white">
                        <Bot size={16} />
                      </AvatarFallback>
                    )}
                    <AvatarFallback>{message.role === 'user' ? 'U' : 'B'}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold">{message.sender}</span>
                </div>
                <div className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[70%]">
                <span className="animate-pulse">Digitando...</span>
              </div>
            </div>
          )}
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