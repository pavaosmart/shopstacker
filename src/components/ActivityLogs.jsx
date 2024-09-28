import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from '../integrations/supabase/supabase';

const ITEMS_PER_PAGE = 10;

const ActivityLogs = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();

  const { data: logsData, isLoading, error } = useActivityLogs({
    page,
    actionFilter,
    userFilter,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  const { data: logs, count } = logsData || { data: [], count: 0 };
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Logs de Atividade</h1>
        <Button onClick={handleGoBack}>Voltar</Button>
      </div>
      
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
          <option value={currentUserId}>Usuário Atual</option>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário ID</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data/Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.user_id}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
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
    </div>
  );
};

export default ActivityLogs;