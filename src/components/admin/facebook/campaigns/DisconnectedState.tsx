
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";

const DisconnectedState: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Campanhas do Facebook/Instagram</CardTitle>
        <CardDescription>
          Visualize e gerencie suas campanhas publicitárias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-900/20 border border-amber-700/30 text-amber-400 p-4 rounded-md flex items-center gap-3">
          <AlertOctagon className="h-5 w-5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">Conexão com Facebook necessária</h4>
            <p className="text-sm">
              Para visualizar suas campanhas, configure primeiro a integração com o Facebook na aba Configurações.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisconnectedState;
