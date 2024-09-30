import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ceoAssistantPrompt } from '../prompts/ceoAssistantPrompt';

const CreateBotModal = ({ isOpen, onClose, onCreateBot }) => {
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(150);
  const [prompts, setPrompts] = useState([ceoAssistantPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBot({
      name: botName,
      description: botDescription,
      model,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(maxTokens),
      prompts: prompts.filter(prompt => prompt.trim() !== '')
    });
    resetForm();
  };

  const resetForm = () => {
    setBotName('');
    setBotDescription('');
    setModel('gpt-3.5-turbo');
    setTemperature(0.7);
    setMaxTokens(150);
    setPrompts([ceoAssistantPrompt]);
  };

  const handlePromptChange = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Bot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bot-name">Nome do Bot</Label>
            <Input
              id="bot-name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="bot-description">Descrição</Label>
            <Textarea
              id="bot-description"
              value={botDescription}
              onChange={(e) => setBotDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bot-model">Modelo</Label>
            <Input
              id="bot-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bot-temperature">Temperatura</Label>
            <Input
              id="bot-temperature"
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bot-max-tokens">Máximo de Tokens</Label>
            <Input
              id="bot-max-tokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
            />
          </div>
          <div>
            <Label>Prompts</Label>
            {prompts.map((prompt, index) => (
              <Textarea
                key={index}
                value={prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
                placeholder={`Prompt ${index + 1}`}
                className="mt-2"
              />
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Criar Bot</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBotModal;