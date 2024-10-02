import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const MercadoPagoCheckout = () => {
  const { session } = useSupabaseAuth();
  const [amount, setAmount] = useState('');

  const handleCheckout = async () => {
    if (!amount || isNaN(amount)) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    // Aqui você deve implementar a lógica para iniciar o checkout do Mercado Pago
    // Isso geralmente envolve chamar uma API do seu backend que interage com o Mercado Pago
    // Por enquanto, vamos apenas simular uma transação

    const { data, error } = await supabase
      .from('mercado_pago_transactions')
      .insert({
        user_id: session.user.id,
        external_id: `SIMULATED-${Date.now()}`,
        status: 'pending',
        amount: parseFloat(amount),
        payment_method: 'simulated',
      })
      .select();

    if (error) {
      toast.error('Erro ao iniciar o checkout');
    } else {
      toast.success('Checkout iniciado com sucesso');
      // Aqui você normalmente redirecionaria o usuário para a página de checkout do Mercado Pago
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testar Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Valor (R$)"
          />
          <Button onClick={handleCheckout}>Iniciar Checkout</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoCheckout;