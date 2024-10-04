import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

const ConfirmDeleteDialog = ({ isOpen, onClose, onConfirm, productName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Atenção: Exclusão de Produto
          </DialogTitle>
          <DialogDescription className="text-base">
            Você está prestes a excluir o produto "{productName}" da sua lista de produtos.
            <br /><br />
            <strong className="text-red-600">Importante:</strong> Esta ação também removerá todos os anúncios deste produto dos marketplaces conectados.
            <br /><br />
            Tem certeza que deseja prosseguir com a exclusão?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Excluir Produto e Anúncios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;