import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';

const MercadoPagoIntegration = () => {
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const [isIntegrated, setIsIntegrated] = useState(false);

  useEffect(() => {
    checkIntegrationStatus();
  }, [session]);

  const checkIntegrationStatus = async () => {
    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('mercado_pago_settings')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setIsIntegrated(true);
      }
    }
  };

  const handleIntegrate = () => {
    navigate('/mercado-pago-config');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração Mercado Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {isIntegrated ? 'Integrado' : 'Não integrado'}</p>
        <Button onClick={handleIntegrate}>
          {isIntegrated ? 'Configurar' : 'Integrar'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoIntegration;