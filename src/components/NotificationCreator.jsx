import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from 'lucide-react';

const NotificationCreator = ({ isOpen, onClose, onSubmit, editingNotification }) => {
  const [notification, setNotification] = useState({
    version: 'beta',
    updateItems: [{ title: '', description: '' }],
  });

  useEffect(() => {
    if (editingNotification) {
      setNotification(editingNotification);
    } else {
      setNotification({
        version: 'beta',
        updateItems: [{ title: '', description: '' }],
      });
    }
  }, [editingNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateItemChange = (index, field, value) => {
    const newUpdateItems = [...notification.updateItems];
    newUpdateItems[index][field] = value;
    setNotification(prev => ({ ...prev, updateItems: newUpdateItems }));
  };

  const addUpdateItem = () => {
    setNotification(prev => ({
      ...prev,
      updateItems: [...prev.updateItems, { title: '', description: '' }],
    }));
  };

  const removeUpdateItem = (index) => {
    setNotification(prev => ({
      ...prev,
      updateItems: prev.updateItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSubmit(notification);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingNotification ? 'Editar' : 'Criar'} Notificação de Atualização do Sistema</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="version">Versão</Label>
            <Input
              id="version"
              name="version"
              value={notification.version}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Itens da Atualização</Label>
            {notification.updateItems.map((item, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="Título"
                  value={item.title}
                  onChange={(e) => handleUpdateItemChange(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Descrição"
                  value={item.description}
                  onChange={(e) => handleUpdateItemChange(index, 'description', e.target.value)}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeUpdateItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addUpdateItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Item
            </Button>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={handleSubmit}>{editingNotification ? 'Atualizar' : 'Criar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCreator;