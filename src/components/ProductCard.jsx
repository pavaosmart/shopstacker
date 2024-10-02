import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/meus-produtos/${product.id}`);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <img 
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name} 
          className="w-full h-48 object-cover mb-4 rounded-md"
        />
        <div className="space-y-2">
          <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleViewProduct}>Ver</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;