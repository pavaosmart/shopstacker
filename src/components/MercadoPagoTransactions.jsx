import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MercadoPagoTransactions = () => {
  const { session } = useSupabaseAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('mercado_pago_transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setTransactions(data);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Transações Mercado Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.external_id}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.payment_method}</TableCell>
                <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoTransactions;