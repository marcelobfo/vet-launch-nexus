
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

interface StatusDisplayProps {
  isConnected: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ isConnected }) => {
  return (
    <div className={`p-3 rounded-md flex items-center gap-3 ${
      isConnected ? 'bg-green-900/20 border border-green-700/30 text-green-400' :
      'bg-amber-900/20 border border-amber-700/30 text-amber-400'
    }`}>
      {isConnected ? (
        <Check className="h-5 w-5 flex-shrink-0" />
      ) : (
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      )}
      <div className="text-sm">
        {isConnected ? (
          <p><strong>Conectado:</strong> API do Facebook configurada com sucesso.</p>
        ) : (
          <p><strong>Desconectado:</strong> Configure suas credenciais para integrar com a API do Facebook.</p>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;
