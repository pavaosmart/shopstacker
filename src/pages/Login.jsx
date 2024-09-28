import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, insira email e senha");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user) {
        toast.success("Login realizado com sucesso");
        navigate('/');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      toast.error(error.message || "Ocorreu um erro durante o login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, insira email e senha");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user) {
        toast.success("Cadastro realizado com sucesso. Por favor, verifique seu email.");
        setIsSignUp(false);
      }
    } catch (error) {
      console.error('Erro de cadastro:', error);
      toast.error(error.message || "Ocorreu um erro durante o cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Cadastro no MyShopTools" : "Login no MyShopTools"}</CardTitle>
          <CardDescription>{isSignUp ? "Crie uma nova conta" : "Entre com seu email e senha"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <div className="space-y-4">
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={isSignUp ? handleSignUp : handleLogin} disabled={loading}>
            {loading ? (isSignUp ? 'Cadastrando...' : 'Entrando...') : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </Button>
          <Button className="w-full" onClick={() => setIsSignUp(!isSignUp)} variant="outline">
            {isSignUp ? "Já tem uma conta? Entre" : "Não tem uma conta? Cadastre-se"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;