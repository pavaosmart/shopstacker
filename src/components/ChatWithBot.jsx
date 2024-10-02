import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { getOpenAIInstance, getZildaAssistant } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Bot, Image as ImageIcon, Mic } from 'lucide-react';

const ChatWithBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [zildaAssistant, setZildaAssistant] = useState(null);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    createThread();
    fetchZildaAssistant();
  }, []);

  const createThread = async () => {
    try {
      const openai = await getOpenAIInstance();
      const thread = await openai.beta.threads.create();
      setThreadId(thread.id);
    } catch (error) {
      console.error('Erro ao criar thread:', error);
      toast.error('Falha ao iniciar o chat');
    }
  };

  const fetchZildaAssistant = async () => {
    try {
      const assistant = await getZildaAssistant();
      setZildaAssistant(assistant);
    } catch (error) {
      console.error('Erro ao buscar assistente Zilda:', error);
      toast.error('Falha ao conectar com o assistente Zilda');
    }
  };

  const handleSendMessage = async (content, type = 'text') => {
    if ((!content.trim() && type === 'text') || !threadId || !zildaAssistant) return;

    let newMessage;
    if (type === 'text') {
      newMessage = { role: 'user', content: content, type };
    } else if (type === 'image') {
      newMessage = { role: 'user', content: 'Imagem enviada', type, url: content };
    } else if (type === 'audio') {
      newMessage = { role: 'user', content: 'Áudio enviado', type, url: content };
    }

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const openai = await getOpenAIInstance();
      
      // Adicionar a mensagem do usuário à thread
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: type === 'text' ? content : [
          {
            type: type,
            [type === 'image' ? 'image_url' : 'audio_url']: content
          }
        ]
      });

      // Executar o assistente
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: zildaAssistant.id
      });

      // Aguardar a conclusão da execução
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      while (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      // Recuperar as mensagens após a execução
      const messages = await openai.beta.threads.messages.list(threadId);

      // Adicionar a resposta do assistente ao estado de mensagens
      const assistantMessage = messages.data[0];
      setMessages(prevMessages => [...prevMessages, {
        role: 'assistant',
        content: assistantMessage.content[0].text.value,
        type: 'text'
      }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Falha ao enviar mensagem: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        await handleSendMessage(base64, type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Chat com Zilda</CardTitle>
      </CardHeader>
      <CardContent>
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
                    <AvatarFallback>{message.role === 'user' ? 'U' : 'Z'}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold">{message.role === 'user' ? 'Você' : 'Zilda'}</span>
                </div>
                <div className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {message.type === 'text' && message.content}
                  {message.type === 'image' && <img src={message.url} alt="Imagem enviada" className="max-w-full h-auto rounded" />}
                  {message.type === 'audio' && <audio src={message.url} controls className="max-w-full" />}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[70%]">
                <span className="animate-pulse">Zilda está digitando...</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            placeholder="Digite sua mensagem..."
            className="flex-grow"
          />
          <Button onClick={() => handleSendMessage(inputMessage)} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'image')}
            />
            <Button as="span" variant="outline">
              <ImageIcon size={20} />
            </Button>
          </label>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'audio')}
            />
            <Button as="span" variant="outline">
              <Mic size={20} />
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWithBot;