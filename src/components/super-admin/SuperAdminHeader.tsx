
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from 'lucide-react';

interface SuperAdminHeaderProps {
  onLogout: () => void;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="border-b border-border bg-red-950">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-white" />
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLogout}
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
