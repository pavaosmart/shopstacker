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
        {product.image ? (
          <img 
            src={product.image}
            alt={product.name} 
            className="w-full h-48 object-cover mb-4 rounded-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-size%3D%2214%22%20fill%3D%22%23999%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 rounded-md">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
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