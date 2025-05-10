
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface SuperAdminHeaderProps {
  onLogout: () => void;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({ onLogout }) => {
  const [currentDate] = useState(new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }));
  
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link to="/super-admin" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            <div className="flex flex-col">
              <span className="font-bold text-lg">Super Admin</span>
              <span className="text-xs text-gray-400">Painel de Administração</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">{currentDate}</div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
