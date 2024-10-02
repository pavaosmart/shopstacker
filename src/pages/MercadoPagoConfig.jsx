import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import MercadoPagoTransactions from '../components/MercadoPagoTransactions';
import MercadoPagoCheckout from '../components/MercadoPagoCheckout';

const MercadoPagoConfig = () => {
  const { session } = useSupabaseAuth();
  const [settings, setSettings] = useState({
    access_token: '',
    public_key: '',
    client_id: '',
    client_secret: '',
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('mercado_pago_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { data, error } = await supabase
      .from('mercado_pago_settings')
      .upsert({ ...settings, user_id: session.user.id })
      .select();

    if (error) {
      toast.error('Erro ao salvar configurações');
    } else {
      toast.success('Configurações salvas com sucesso');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configuração do Mercado Pago</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Credenciais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              name="access_token"
              value={settings.access_token}
              onChange={handleChange}
              placeholder="Access Token"
            />
            <Input
              name="public_key"
              value={settings.public_key}
              onChange={handleChange}
              placeholder="Public Key"
            />
            <Input
              name="client_id"
              value={settings.client_id}
              onChange={handleChange}
              placeholder="Client ID"
            />
            <Input
              name="client_secret"
              value={settings.client_secret}
              onChange={handleChange}
              placeholder="Client Secret"
            />
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </div>
        </CardContent>
      </Card>
      <MercadoPagoTransactions />
      <MercadoPagoCheckout />
    </div>
  );
};

export default MercadoPagoConfig;