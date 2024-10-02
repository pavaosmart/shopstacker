import React, { useState, useEffect, useRef } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { getOpenAIInstance, getZildaAssistant, textToSpeech } from '../utils/openai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Bot, Image as ImageIcon, Mic, Send } from 'lucide-react';
import ConversationHistory from './ConversationHistory';

const ChatWithBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [zildaAssistant, setZildaAssistant] = useState(null);
  const { session } = useSupabaseAuth();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const openai = await getOpenAIInstance();
        const assistant = await getZildaAssistant();
        setZildaAssistant(assistant);
        const thread = await openai.beta.threads.create();
        setThreadId(thread.id);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Failed to initialize chat');
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async (content, type = 'text') => {
    if ((!content || (type === 'text' && !content.trim())) || !threadId || !zildaAssistant) return;

    let newMessage = { role: 'user', content, type };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const openai = await getOpenAIInstance();
      
      let messageContent;
      if (type === 'text') {
        messageContent = { type: 'text', text: content };
      } else if (type === 'image') {
        messageContent = { type: 'image_url', image_url: { url: content } };
      } else if (type === 'audio') {
        const fileId = await uploadAudioFile(openai, content);
        messageContent = { type: 'file_id', file_id: fileId };
      }

      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: [messageContent]
      });

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: zildaAssistant.id
      });

      let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      while (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      const messages = await openai.beta.threads.messages.list(threadId);
      const assistantMessage = messages.data[0];

      let responseContent;
      let responseType = 'text';

      if (type === 'audio') {
        responseContent = await textToSpeech(assistantMessage.content[0].text.value);
        responseType = 'audio';
      } else {
        responseContent = assistantMessage.content[0].text.value;
      }

      setMessages(prevMessages => [...prevMessages, {
        role: 'assistant',
        content: responseContent,
        type: responseType
      }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Falha ao enviar mensagem: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAudioFile = async (openai, audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('purpose', 'assistants');

    const response = await openai.files.create({
      file: formData.get('file'),
      purpose: formData.get('purpose')
    });
    return response.id;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        await handleSendMessage(base64, file.type.startsWith('image/') ? 'image' : 'audio');
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleSendMessage(audioBlob, 'audio');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast.error('Falha ao iniciar gravação de áudio');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    // Implement logic to load selected conversation
    console.log('Selected conversation:', conversation);
  };

  return (
    <div className="flex h-full">
      <ConversationHistory 
        conversations={conversations} 
        onSelectConversation={handleSelectConversation} 
      />
      <Card className="flex-grow mx-4">
        <CardHeader>
          <CardTitle>Chat com Zilda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4 h-[calc(100vh-16rem)] overflow-y-auto p-4 bg-gray-50 rounded-lg">
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
                    {message.type === 'image' && <img src={message.content} alt="Imagem enviada" className="max-w-full h-auto rounded" />}
                    {message.type === 'audio' && <audio src={message.content} controls className="max-w-full" />}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[70%]">
                  <span className="animate-pulse">Zilda está processando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
              <Send size={20} />
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button as="span" variant="outline">
                <ImageIcon size={20} />
              </Button>
            </label>
            <Button
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic size={20} color={isRecording ? 'red' : 'currentColor'} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatWithBot;