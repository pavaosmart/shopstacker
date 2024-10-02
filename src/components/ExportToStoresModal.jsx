import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const stores = [
  { id: 'mercadolivre', name: 'Mercado Livre' },
  { id: 'shopee', name: 'Shopee' },
  { id: 'amazon', name: 'Amazon' },
  { id: 'shopify', name: 'Shopify' },
];

const ExportToStoresModal = ({ isOpen, onClose, productId }) => {
  const [selectedStores, setSelectedStores] = useState([]);

  const handleStoreSelection = (storeId) => {
    setSelectedStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleExport = () => {
    // Aqui você implementaria a lógica de exportação
    console.log(`Exportando produto ${productId} para as lojas:`, selectedStores);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar para as lojas</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">Selecione as lojas para exportar o produto:</p>
          {stores.map(store => (
            <div key={store.id} className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id={store.id} 
                checked={selectedStores.includes(store.id)}
                onCheckedChange={() => handleStoreSelection(store.id)}
              />
              <Label htmlFor={store.id}>{store.name}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancelar</Button>
          <Button onClick={handleExport} disabled={selectedStores.length === 0}>Exportar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportToStoresModal;