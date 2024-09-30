import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LoginForm = ({ onRegisterClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useSupabaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      toast.success('Login successful');
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
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">Login</Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-blue-500 hover:underline"
        >
          Forgot password?
        </button>
      </div>
      <div className="text-center">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onRegisterClick}
          className="text-blue-500 hover:underline"
        >
          Create one
        </button>
      </div>
    </form>
  );
};

export default LoginForm;