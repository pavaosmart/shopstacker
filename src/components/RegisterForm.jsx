import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = ({ onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loginWithGoogle, loginWithFacebook } = useSupabaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    try {
      const { error } = await register(email, password, { name, phone });
      if (error) throw error;
      toast.success('Registro bem-sucedido. Por favor, verifique seu email para confirmar sua conta.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
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
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <PhoneInput
        country={'br'}
        value={phone}
        onChange={setPhone}
        inputClass="w-full p-2 border rounded"
        buttonClass="border rounded"
        dropdownClass="bg-white"
      />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('password')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('confirmPassword')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <Button type="submit" className="w-full">Registrar</Button>
      <div className="flex flex-col space-y-2">
        <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialLogin('google')}>
          Registrar com Google
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialLogin('facebook')}>
          Registrar com Facebook
        </Button>
      </div>
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