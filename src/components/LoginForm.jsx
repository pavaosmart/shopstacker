import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ onRegisterClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
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