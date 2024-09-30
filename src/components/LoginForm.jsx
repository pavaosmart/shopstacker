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
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loginWithGoogle, loginWithFacebook } = useSupabaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      toast.success('Login successful');
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = provider === 'google' ? await loginWithGoogle() : await loginWithFacebook();
      if (error) throw error;
      toast.success(`Login com ${provider} bem-sucedido`);
    } catch (error) {
      toast.error(`Erro no login com ${provider}: ${error.message}`);
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
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <Button type="submit" className="w-full">Login</Button>
      <div className="flex flex-col space-y-2">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Login com Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Login com Facebook
        </button>
      </div>
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