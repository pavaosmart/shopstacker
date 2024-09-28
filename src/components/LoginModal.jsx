import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simples validação para demonstração
    if (email === 'demo@example.com' && password === 'password') {
      onLogin();
      toast.success('Login successful');
    } else {
      toast.error('Invalid credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-center">Welcome to UI Elements Kit</h1>
      <h2 className="text-xl mb-6 text-center">MyShopTools UI Components</h2>
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
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-500 hover:underline"
        >
          Create one
        </button>
      </p>
    </div>
  );
};

export default LoginModal;