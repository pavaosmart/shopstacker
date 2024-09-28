import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useSupabaseAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      toast.success('Login bem-sucedido');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="bg-white rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button type="submit" className="w-full mb-4">Entrar</Button>
      </form>
    </div>
  );
};

export default Login;