import React from 'react';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from 'lucide-react';

const ActivityLogs = () => {
  const { data: logsData, isLoading, error } = useActivityLogs();

  if (isLoading) return <div>Carregando logs de atividade...</div>;
  if (error) return <div>Erro ao carregar logs de atividade: {error.message}</div>;

  // Ensure logs is an array
  const logs = Array.isArray(logsData) ? logsData : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Activity className="mr-2" />
            Logs de Atividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;