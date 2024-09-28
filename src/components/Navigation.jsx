import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </li>
        <li>
          <Link to="/logs">
            <Button variant="ghost">Logs de Atividade</Button>
          </Link>
        </li>
        <li>
          <Link to="/users">
            <Button variant="ghost">Usuários e Permissões</Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;