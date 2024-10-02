import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Email de redefinição de senha enviado. Verifique sua caixa de entrada.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Recuperar Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar Email de Recuperação
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuperarSenha;