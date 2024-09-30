import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UserMenu from './UserMenu';
import NotificationsMenu from './NotificationsMenu';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Header = () => {
  const [selectedCompany, setSelectedCompany] = useState('ShopTools');
  const { session } = useSupabaseAuth();
  const companies = ['ShopTools', 'Company A', 'Company B', 'Company C'];

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-lg font-semibold">
                {selectedCompany} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {companies.map((company) => (
                <DropdownMenuItem key={company} onSelect={() => setSelectedCompany(company)}>
                  {company}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationsMenu />
          <UserMenu user={session?.user} />
        </div>
      </nav>
    </header>
  );
};

export default Header;