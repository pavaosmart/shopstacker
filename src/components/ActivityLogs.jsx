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
  const [userEmails, setUserEmails] = useState({});
  const navigate = useNavigate();

  const { data: logsData, isLoading, error } = useActivityLogs({
    page,
    actionFilter,
    userFilter,
  });

  useEffect(() => {
    const fetchUserEmails = async () => {
      if (logsData && logsData.data) {
        const userIds = [...new Set(logsData.data.map(log => log.user_id))];
        const emails = {};
        for (const userId of userIds) {
          const { data, error } = await supabase.auth.admin.getUserById(userId);
          if (!error && data) {
            emails[userId] = data.user.email;
          }
        }
        setUserEmails(emails);
      }
    };
    fetchUserEmails();
  }, [logsData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { data: logs, count } = logsData || { data: [], count: 0 };
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <Button onClick={handleGoBack}>Voltar</Button>
      </div>
      
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Filter by user ID"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
          className="max-w-xs"
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Date/Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{userEmails[log.user_id] || 'Unknown'}</TableCell>
              <TableCell>{log.action}</TableCell>
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
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ActivityLogs;