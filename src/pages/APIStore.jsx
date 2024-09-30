import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const apiList = [
  {
    name: "OpenAI GPT-3",
    description: "Integrate advanced AI language models into your application.",
    category: "Artificial Intelligence",
    price: "$0.02 per 1K tokens"
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
  },
  {
    name: "Cloudinary",
    description: "Manage and optimize images and videos in the cloud.",
    category: "Media",
    price: "Free tier available, then $0.05 per GB"
  },
  {
    name: "Mailchimp",
    description: "Automate email marketing campaigns.",
    category: "Marketing",
    price: "Free up to 2,000 contacts, then from $9.99/month"
  }
];

const APIStore = () => {
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
              <Button>Integrate</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default APIStore;