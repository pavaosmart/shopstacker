import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisterForm = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useSupabaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    try {
      const { error } = await register(email, password);
      if (error) throw error;
      toast.success('Registro bem-sucedido. Por favor, verifique seu email para confirmar sua conta.');
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
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">Registrar</Button>
      <div className="text-center">
        <span>Já tem uma conta? </span>
        <button
          type="button"
          onClick={onLoginClick}
          className="text-blue-500 hover:underline"
        >
          Faça login
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;