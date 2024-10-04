import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ProductCard = ({ product, onDelete, onEdit, isSupplier }) => {
  const coverImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {coverImage ? (
          <div className="relative">
            <img 
              src={coverImage}
              alt={product.name} 
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
            <span className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs">
              Capa
            </span>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 rounded-md">
            <span className="text-gray-500">Sem Imagem</span>
          </div>
        )}
        <div className="space-y-2">
          <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
        </div>
      </CardContent>
      {isSupplier && (
        <CardFooter className="flex justify-between">
          <Button onClick={onEdit}>Editar</Button>
          <Button variant="destructive" onClick={onDelete}>Excluir</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;