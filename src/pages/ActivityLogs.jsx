import React, { useState } from 'react';
import { useActivityLogs } from '../hooks/useActivityLogs';
import Navigation from '../components/Navigation';
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

const ActivityLogs = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const { data: logsData, isLoading, error } = useActivityLogs({ page, actionFilter, userFilter });

  if (isLoading) return <div>Loading activity logs...</div>;
  if (error) return <div>Error loading activity logs: {error.message}</div>;

  const { data: logs, count } = logsData || { data: [], count: 0 };
  const totalPages = Math.ceil(count / 10);

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
        
        <div className="mb-4 flex space-x-2">
          <Input
            placeholder="Filter by action"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={userFilter}
            onValueChange={setUserFilter}
            className="max-w-xs"
          >
            <option value="">All Users</option>
            {/* Add user options here if needed */}
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
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
    </div>
  );
};

export default ActivityLogs;