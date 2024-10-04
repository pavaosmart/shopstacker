import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateUserProduct } from '../hooks/useUserProducts';
import { toast } from "sonner";

const EditProductModal = ({ isOpen, onClose, product }) => {
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    price: '',
    description: '',
    images: []
  });
  const updateProductMutation = useUpdateUserProduct();

  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
        price: product.price || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditedProduct(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProductMutation.mutateAsync(editedProduct);
      toast.success('Produto atualizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar produto: ' + error.message);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                value={editedProduct.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={editedProduct.price}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">
                Imagens
              </Label>
              <Input
                id="images"
                name="images"
                type="file"
                multiple
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;