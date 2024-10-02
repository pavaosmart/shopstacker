import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ProductCard = ({ product }) => {
  const suggestedPrice = product.price * (product.markup || 2.5);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"} 
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
        <Button className="w-full">Adicionar aos meus produtos</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;