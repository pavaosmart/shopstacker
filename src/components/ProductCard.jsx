import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddUserProduct } from '../hooks/useUserProducts';
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const addUserProductMutation = useAddUserProduct();

  const handleAddToMyProducts = async () => {
    try {
      await addUserProductMutation.mutateAsync({
        original_product_id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        markup: product.markup || 2.5,
      });
      toast.success('Produto adicionado aos seus produtos com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar produto: ' + error.message);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <img 
          src="/placeholder.svg"
          alt={product.name} 
          className="w-full h-48 object-cover mb-4 rounded-md"
        />
        <div className="space-y-2">
          <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
          <p className="text-sm text-gray-500">
            Preço de venda sugerido: R$ {(product.price * (product.markup || 2.5)).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">Markup: {product.markup || 2.5}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleAddToMyProducts}>Adicionar aos meus produtos</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;