import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
          <div className="flex items-center justify-between mb-6">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-800">
              Esqueceu a senha?
            </Link>
          </div>
          <Button type="submit" className="w-full mb-4">Entrar</Button>
          <p className="text-center text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-800">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;