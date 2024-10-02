import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ProductCard = ({ product, onDelete, onViewDetails }) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <img 
          src={product.image || "/placeholder.svg"}
          alt={product.name} 
          className="w-full h-48 object-cover mb-4 rounded-md"
        />
        <div className="space-y-2">
          <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onViewDetails}>Detalhes</Button>
        <Button variant="destructive" onClick={onDelete}>Excluir</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;