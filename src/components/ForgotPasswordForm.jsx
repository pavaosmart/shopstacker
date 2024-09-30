import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ForgotPasswordForm = ({ onBackToLoginClick }) => {
  const [email, setEmail] = useState('');
  const { resetPassword } = useSupabaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      toast.success('Email de redefinição de senha enviado. Por favor, verifique sua caixa de entrada.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">Redefinir Senha</Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLoginClick}
          className="text-blue-500 hover:underline"
        >
          Voltar para o Login
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;