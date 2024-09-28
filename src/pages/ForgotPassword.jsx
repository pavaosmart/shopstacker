import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ForgotPassword = () => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleResetPassword} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="mb-6 text-2xl font-bold text-center">Esqueceu a Senha</h1>
          <div className="mb-6">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full mb-4">Enviar Email de Redefinição</Button>
          <p className="text-center text-sm">
            Lembrou sua senha?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-800">
              Voltar para o login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;