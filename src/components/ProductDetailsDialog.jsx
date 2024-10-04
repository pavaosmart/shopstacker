import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProductDetailsDialog = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Nome:</span>
            <span className="col-span-3">{product.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">SKU:</span>
            <span className="col-span-3">{product.sku}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Preço:</span>
            <span className="col-span-3">R$ {product.price.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estoque:</span>
            <span className="col-span-3">{product.stock_quantity}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descrição:</span>
            <span className="col-span-3">{product.description}</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;