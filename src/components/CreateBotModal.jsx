import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreateBotModal = ({ isOpen, onClose, onCreateBot }) => {
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [temperature, setTemperature] = useState(0.7);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBot({
      name: botName,
      description: botDescription,
      temperature
    });
    resetForm();
  };

  const resetForm = () => {
    setBotName('');
    setBotDescription('');
    setTemperature(0.7);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Bot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bot-name" className="block text-sm font-medium text-gray-700">Nome do Bot</label>
            <Input
              id="bot-name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="bot-description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <Textarea
              id="bot-description"
              value={botDescription}
              onChange={(e) => setBotDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Temperatura</label>
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
          <DialogFooter>
            <Button type="submit">Criar Bot</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBotModal;