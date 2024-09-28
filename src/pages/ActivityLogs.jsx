import React, { useState } from 'react';
import { useActivityLogs } from '../hooks/useActivityLogs';
import Navigation from '../components/Navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BarChart from '../components/BarChart';

const ActivityLogs = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const { data: logsData, isLoading, error } = useActivityLogs({ page, actionFilter, userFilter });

  if (isLoading) return <div>Carregando logs de atividade...</div>;
  if (error) return <div>Erro ao carregar logs de atividade: {error.message}</div>;

  const { data: logs, count } = logsData || { data: [], count: 0 };
  const totalPages = Math.ceil(count / 10);

  // Prepare data for the chart
  const actionCounts = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(actionCounts).map(([action, count]) => ({
    name: action,
    value: count
  }));

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Logs de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex space-x-2">
              <Input
                placeholder="Filtrar por ação"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="max-w-xs"
              />
              <Select
                value={userFilter}
                onValueChange={setUserFilter}
                className="max-w-xs"
              >
                <option value="">Todos os Usuários</option>
                {/* Add user options here if needed */}
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>ID do Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                    <TableCell>{log.user_id}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-between items-center">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span>
                Página {page} de {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={chartData} dataKey="value" nameKey="name" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityLogs;