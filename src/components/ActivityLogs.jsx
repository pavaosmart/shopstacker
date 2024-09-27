import React, { useState } from 'react';
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

const ITEMS_PER_PAGE = 10;

const ActivityLogs = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const { data: logs, isLoading, error } = useActivityLogs({
    page,
    actionFilter,
    userFilter,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const totalPages = Math.ceil(logs.count / ITEMS_PER_PAGE);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
      
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Filter by user"
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
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date/Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.data.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.user_email}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
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