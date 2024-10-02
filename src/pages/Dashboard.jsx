import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for your dashboard content. You can add various widgets, charts, and important information here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;