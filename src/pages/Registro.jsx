import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from '../components/RegisterForm';

const Registro = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;