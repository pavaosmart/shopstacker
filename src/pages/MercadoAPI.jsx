import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const MercadoAPI = () => {
  const navigate = useNavigate();

  const apiList = [
    {
      name: "OpenAI GPT-4",
      description: "Integrate advanced AI language models into your application.",
      category: "Artificial Intelligence",
      price: "$0.03 per 1K tokens",
      route: "/api-integration/openai"
    },
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
    },
    {
      name: "Stripe Payments",
      description: "Process payments securely and easily in your app.",
      category: "Finance",
      price: "2.9% + $0.30 per transaction"
    },
    {
      name: "Twilio SMS",
      description: "Send and receive SMS messages programmatically.",
      category: "Communication",
      price: "$0.0075 per message"
    },
    {
      name: "Google Maps",
      description: "Embed interactive maps and location services.",
      category: "Geolocation",
      price: "$0.007 per request (first 100K free)"
    }
  ];

  const handleIntegrate = (api) => {
    if (api.route) {
      navigate(api.route);
    } else {
      console.log(`Integration for ${api.name} is not implemented yet.`);
      // You might want to show a "coming soon" message or implement their integration pages
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiList.map((api, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{api.name}</CardTitle>
              <CardDescription>{api.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{api.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm font-semibold">{api.price}</span>
              <Button onClick={() => handleIntegrate(api)}>Integrate</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MercadoAPI;