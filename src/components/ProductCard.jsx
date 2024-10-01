import React from 'react';
import { Button } from "@/components/ui/button";

const ProductCard = ({ product }) => {
  const suggestedPrice = product.price * 2.5; // Markup de 2.5

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={product.image_url || "https://via.placeholder.com/300x200"} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">Estoque: {product.stock_quantity}</p>
        <p className="text-xl font-bold mb-2">R$ {product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mb-4">Preço sugerido: R$ {suggestedPrice.toFixed(2)}</p>
        <Button className="w-full">Adicionar</Button>
      </div>
    </div>
  );
};

export default ProductCard;