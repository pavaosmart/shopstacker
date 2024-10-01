import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ProductCard = ({ product }) => {
  const suggestedPrice = product.price * (product.markup || 2.5);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/300x200"} 
          alt={product.name} 
          className="w-full h-48 object-cover mb-4 rounded-md"
        />
        <div className="space-y-2">
          <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
          <p className="text-sm text-gray-500">
            Preço de venda sugerido: R$ {suggestedPrice.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">Markup: {product.markup || 2.5}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Adicionar ao Carrinho</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;