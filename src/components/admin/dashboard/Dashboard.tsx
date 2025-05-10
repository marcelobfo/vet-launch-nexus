
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { company } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Bem-vindo!</CardTitle>
          <CardDescription>{company?.name || 'Sua empresa'}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use o menu acima para acessar as funcionalidades do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
