import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MercadoAPI = () => {
  const apiList = [
    {
      name: "Mercado Livre",
      description: "Integrate with Latin America's leading e-commerce platform.",
      category: "E-commerce",
      price: "Free API access, transaction fees apply"
    },
    {
      name: "Mercado Pago",
      description: "Process payments securely for Mercado Livre transactions.",
      category: "Payments",
      price: "Varies based on transaction volume"
    },
    {
      name: "Mercado Envios",
      description: "Manage shipping and logistics for Mercado Livre orders.",
      category: "Logistics",
      price: "Pricing based on shipping options"
    },
    {
      name: "Mercado Ads",
      description: "Create and manage advertising campaigns on Mercado Livre.",
      category: "Marketing",
      price: "Pay-per-click model"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mercado API Integration</h1>
      <p className="mb-8">Explore and integrate with various Mercado APIs to enhance your e-commerce capabilities.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiList.map((api, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{api.name}</CardTitle>
              <CardDescription>{api.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{api.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm font-semibold">{api.price}</span>
              <Button>Integrate</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MercadoAPI;